from decky_plugin import DECKY_PLUGIN_SETTINGS_DIR
import random
import asyncio
from typing import Any, List, Dict, Optional, TypeVar, Callable
import platform
import json
from .common import Common
import os

class DeckyTerminal:
    _event_loop = None
    _server_future: asyncio.Future = None

    def __init__(self) -> None:
        self._event_loop = asyncio.get_event_loop()
