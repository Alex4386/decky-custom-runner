import {
  definePlugin,
  Patch,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { FaTerminal } from "react-icons/fa";

import { registerRoutes, unregisterRoutes } from "./routes";
import SidePanel from "./panel";
import TerminalGlobal from "./common/global";
import { registerPatches, unregisterPatches } from "./patches";

export default definePlugin((serverApi: ServerAPI) => {
  TerminalGlobal.setServer(serverApi);
  registerRoutes(serverApi.routerHook);
  registerPatches(serverApi);

  return {
    title: <div className={staticClasses.Title}>Decky Terminal</div>,
    content: <SidePanel serverAPI={serverApi} />,
    icon: <FaTerminal />,
    onDismount() {
      unregisterRoutes(serverApi.routerHook);
      unregisterPatches(serverApi);
    },
  };
});
