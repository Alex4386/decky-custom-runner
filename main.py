import sys
import asyncio
import random
import os
from typing import List, Optional
import re

try:
    import decky_plugin
except ImportError:
    pass

class Plugin:
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")

    async def get_home_steam_dir(self) -> str:
        return os.path.join(os.path.expanduser("~"), ".local", "share", "Steam")
    
    async def get_target_dirs(self) -> str:
        library_file = os.path.join(await Plugin.get_home_steam_dir(self), "steamapps", "libraryfolders.vdf")
        
        dirs = [await Plugin.get_home_steam_dir(self) ]
        if os.path.exists(library_file):
            f = open(library_file)
            for o in f.readlines():
                if '"path"' in o:
                    path = o.strip().replace('"path"', "").strip().replace("\n","")[1:-1]
                    if not path in dirs:
                        dirs.append(path)

        return dirs
    
    async def get_base_dir(self, id: int) -> Optional[str]:
        target_dirs = await Plugin.get_target_dirs(self)

        for target_dir in target_dirs:
            path = os.path.join(target_dir, "steamapps", "appmanifest_"+str(id)+".acf")
            if os.path.exists(path):
                return target_dir
            elif os.path.exists(os.path.join(target_dir, "steamapps", "compatdata", str(id))):
                return target_dir

        return None

    async def get_game_dir(self, id: int) -> Optional[str]:
        base_dirs = await Plugin.get_target_dirs(self)
        for base_dir in base_dirs:
            
            path = os.path.join(base_dir, "steamapps", "appmanifest_"+str(id)+".acf")
            if os.path.exists(path):
                f = open(path)
                install_dir = None
                for o in f.readlines():
                    if '"installdir"' in o:
                        install_dir = o.strip().replace('"installdir"', "").strip().replace("\n","")[1:-1]
                f.close()

                if install_dir is not None:
                    target_install_dir = os.path.join(base_dir, "steamapps", "common", install_dir)
                    if os.path.exists(target_install_dir):
                        return target_install_dir

        return None

    async def get_proton_compat_dir(self, id: int) -> Optional[str]:
        base_dir = await Plugin.get_base_dir(self, id)
        if base_dir is None:
            return None
        
        return os.path.join(base_dir, "steamapps", "compatdata", str(id), "pfx")

    async def has_proton(self, id: int) -> bool:
        compat_dir = await Plugin.get_proton_compat_dir(self, id)
        return os.path.exists(compat_dir)
    
    # ===== Terminal env generator =====
    def _get_terminal_env(self):
        result = dict(**os.environ)
        result["TERM"] = "xterm-256color"
        result["XDG_RUNTIME_DIR"] = "/run/user/"+str(os.getuid())
        result["DISPLAY"] = ":1"

        return result
    
    # ===== Terminal env generator =====
    async def _get_steam_binaries_path(self):
        # TODO: Implement multi-platform support later on.

        steam_home = await Plugin.get_home_steam_dir(self)
        return os.path.join(steam_home, "ubuntu12_32")
 
    async def _get_reaper_binary(self):
        steam_binaries = await Plugin._get_steam_binaries_path(self)
        return os.path.join(steam_binaries, "reaper")
    
    async def _get_steam_launch_wrapper_binary(self):
        steam_binaries = await Plugin._get_steam_binaries_path(self)
        return os.path.join(steam_binaries, "steam-launch-wrapper")
    
    async def build_reaper_args(self, id: int, cmdline: str) -> str:
        reaper_args = [
            '"'+await Plugin._get_reaper_binary(self)+'"',
            "SteamLaunch",
            "AppId="+str(id),
            "--",
            cmdline,
        ]

        return " ".join(reaper_args)
    
    async def build_steam_launch_wrapper_args(self, cmdline: str) -> str:
        wrapper_args = [
            '"'+await Plugin._get_steam_launch_wrapper_binary(self)+'"',
            "--",
            cmdline,
        ]

        return " ".join(wrapper_args)
    
    async def build_proton_args(self, id: int, cmdline: str) -> str:
        proton_path = await Plugin._get_proton_dir(self, id)
        proton_args = [
            '"'+os.path.join(proton_path, "proton")+'"',
            "waitforexitandrun",
            cmdline,
        ]

        return " ".join(proton_args)
    
    async def _get_proton_dir(self, id: int) -> Optional[str]:
        # COMPAT_DATA/config_info (Line seperated data): L2 = 
        #   ~/.local/share/Steam/steamapps/common/Proton 8.0/dist/share/fonts/

        compat_data = await Plugin.get_proton_compat_dir(self, id)
        config_info = os.path.join(compat_data, "..", "config_info")

        if os.path.exists(config_info):
            f = open(config_info)
            data = f.readlines()
            if len(data) >= 2:
                proton_fonts_path = os.path.join(data[1].replace("\n", ""), "..", "..", "..")
                f.close()   

                return proton_fonts_path

            f.close()
        
        return None

    async def launch_command(self, id: int, cmdline: str) -> bool:
        cmdline_parsed = [word.strip('"') for word in re.findall(r'[^"\s]+|"[^"]*"', cmdline)]
        
        cwd = None
        if os.path.exists(cmdline_parsed[0]):
            cwd = os.path.dirname(cmdline_parsed[0])

        process = await asyncio.create_subprocess_shell(
            await Plugin.build_reaper_args(
                self, id,
                await Plugin.build_steam_launch_wrapper_args(
                    self,
                    cmdline,
                )
            ),
            shell="/bin/bash",
            env=Plugin._get_terminal_env(self),
            cwd=cwd if cwd is not None else await Plugin.get_game_dir(self, id),
        )

        return True
  
    async def _get_proton_env(self, id: int):
        result = Plugin._get_terminal_env(self)

        result["STEAM_COMPAT_CLIENT_INSTALL_PATH"] = await Plugin.get_home_steam_dir(self)
        result["STEAM_COMPAT_DATA_PATH"] = os.path.join(await Plugin.get_proton_compat_dir(self, id), "..")
        
        return result

    async def launch_proton_command(self, id: int, cmdline: str) -> bool:
        cmdline_parsed = [word.strip('"') for word in re.findall(r'[^"\s]+|"[^"]*"', cmdline)]
        
        cwd = None
        if os.path.exists(cmdline_parsed[0]):
            cwd = os.path.dirname(cmdline_parsed[0])
        
        process = await asyncio.create_subprocess_shell(
            await Plugin.build_reaper_args(
                self, id,
                await Plugin.build_steam_launch_wrapper_args(
                    self,
                    await Plugin.build_proton_args(
                        self,
                        id,
                        cmdline
                    )
                )
            ),
            shell="/bin/bash",
            env=await Plugin._get_proton_env(self, id),
            cwd=cwd if cwd is not None else os.path.join(await Plugin.get_proton_compat_dir(self, id), "drive_c"),
        )

        return True
    
    async def launch_proton_commandi(self, id: int, cmdline: str) -> str:
        return await Plugin._get_proton_env(self, id),
    
    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        pass

#plugin = Plugin()
#loop = asyncio.get_event_loop()
#asyncio.ensure_future(plugin._internal_test(), loop=loop)
#loop.run_forever()
