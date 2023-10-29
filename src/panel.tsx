import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  Field,
  Focusable,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  staticClasses,
  Button,
  TextField,
  TextFieldProps,
} from "decky-frontend-lib";
import { useEffect, useRef, useState, VFC } from "react";
import { FaCog, FaPlus, FaTimesCircle } from "react-icons/fa";
import ProtonRunnerGlobal from "./common/global";

const SidePanel: VFC<{
  serverAPI: ServerAPI
}> = ({ serverAPI }) => {
  const appId = ProtonRunnerGlobal.getAppId();
  const [gameLabel, setGameLabel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!gameLabel) {
      (async () => {
        const options = await SteamClient.Apps.GetLaunchOptionsForApp(appId)
        if (options && options.length > 0) setGameLabel(options[0].strGameName);
      })();
    }
  })

  return <div style={{ boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {
      appId ? <PanelSection title={gameLabel ? gameLabel : 'App ID: '+appId}>
        <p>App ID: <b>{appId}</b></p>
        <Focusable style={{ marginRight: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <DialogButton onClick={() => Router.Navigate('/decky-custom-runner/app/'+appId)}>Start Custom Runner</DialogButton>
        </Focusable>
      </PanelSection> : <PanelSection title="App Not Selected" />
    }
  </div>;
};

export default SidePanel;