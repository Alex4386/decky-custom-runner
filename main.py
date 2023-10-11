import sys
import asyncio
import random
import os
from typing import List, Optional

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
        dirs = [ await Plugin.get_home_steam_dir(self) ]

        sd_dir = os.path.join("/run/medai", "mmcblk0p1")
        if os.path.exists(sd_dir):
            dirs.append(sd_dir)

        return dirs
    
    async def get_base_dir(self, id: int, target_dirs: List[str] = None) -> Optional[str]:
        if target_dirs is None:
            target_dirs = [await Plugin.get_home_steam_dir(self)]

        for target_dir in target_dirs:
            path = os.path.join(target_dir, "steamapps", "appmanifest_"+str(id)+".acf")
            if os.path.exists(path):
                return target_dir
            elif os.path.exists(os.path.join(target_dir, "steamapps", "compatdata", str(id))):
                return target_dir

        return None

    async def get_game_dir(self, id: int, target_dirs: List[str] = None) -> Optional[str]:
        base_dir = await Plugin.get_base_dir(self, id, target_dirs)
        if base_dir is None:
            return None
        
        path = os.path.join(base_dir, "steamapps", "appmanifest_"+str(id)+".acf")
        if os.path.exists(path):
            f = open(path)
            install_dir = None
            for o in f.readlines():
                if '"installdir"' in o:
                    install_dir = o.strip().replace('"installdir"', "").strip()[1:-1]
            f.close()

            if install_dir is not None:
                if os.path.exists(base_dir, "common", install_dir):
                    return os.path.join(base_dir, "common", install_dir)

        return None

    async def get_proton_compat_dir(self, id: int, target_dirs: List[str] = None) -> Optional[str]:
        base_dir = await Plugin.get_base_dir(self, id, target_dirs)
        if base_dir is None:
            return None
        
        return os.path.join(base_dir, "steamapps", "compatdata", str(id), "pfx")

    async def has_proton(self, id: int, target_dirs: List[str] = None) -> bool:
        compat_dir = await Plugin.get_proton_compat_dir(self, id, target_dirs)
        return os.path.exists(compat_dir)


    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        pass

#plugin = Plugin()
#loop = asyncio.get_event_loop()
#asyncio.ensure_future(plugin._internal_test(), loop=loop)
#loop.run_forever()
