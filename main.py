import sys
import asyncio
import random
from typing import List, Optional

try:
    import decky_plugin
except ImportError:
    pass

try:
    from decky_terminal import DeckyTerminal
except Exception as e:
    print('[DeckyTerminal] Import Failed:', type(e), e)
    raise e

class Plugin:
    decky_terminal = DeckyTerminal()

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        pass

#plugin = Plugin()
#loop = asyncio.get_event_loop()
#asyncio.ensure_future(plugin._internal_test(), loop=loop)
#loop.run_forever()
