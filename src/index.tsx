import {
  definePlugin,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { FaTerminal } from "react-icons/fa";

import { registerRoutes, unregisterRoutes } from "./routes";
import SidePanel from "./panel";
import ProtonRunnerGlobal from "./common/global";
import { registerPatches, unregisterPatches } from "./patches";

export default definePlugin((serverApi: ServerAPI) => {
  ProtonRunnerGlobal.setServer(serverApi);
  registerRoutes(serverApi.routerHook);
  registerPatches(serverApi);

  return {
    title: <div className={staticClasses.Title}>Custom Runner</div>,
    content: <SidePanel serverAPI={serverApi} />,
    icon: <FaTerminal />,
    onDismount() {
      unregisterRoutes(serverApi.routerHook);
      unregisterPatches(serverApi);
    },
  };
});
