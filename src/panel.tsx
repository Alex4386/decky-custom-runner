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
} from "decky-frontend-lib";
import { useEffect, useRef, useState, VFC } from "react";
import { FaCog, FaPlus, FaTimesCircle } from "react-icons/fa";
import ProtonRunnerGlobal from "./common/global";

const SidePanel: VFC<{
  serverAPI: ServerAPI
}> = ({ serverAPI }) => {

  const appId = ProtonRunnerGlobal.getAppId();

  const [gamePath, setGamePath] = useState<string | null | undefined>(undefined);
  const [protonPath, setProtonPath] = useState<string | null | undefined>(undefined);

  const [targetPath, setTargetPath] = useState<string | undefined>(undefined);
  const filePathRef = useRef<typeof TextField | undefined>();

  useEffect(() => {
    if (appId && (gamePath === undefined && protonPath === undefined)) {
      fetchContent();
    }
  })

  const fetchContent = async () => {
    const target_dirs = (await SteamClient.InstallFolder.GetInstallFolders()).map((n: any) => n.strFolderPath);
    const [gamedirData, protonData] = await Promise.all([
      serverAPI.callPluginMethod<{}, string>("get_game_dir", {
        id: appId,
        target_dirs,
      }), 
      serverAPI.callPluginMethod<{}, string>("get_proton_compat_dir", {
        id: appId,
        target_dirs,
      }), 
    ]);

    console.log('fetchContent', appId, gamedirData, protonData);

    if (gamedirData.success) setGamePath(gamedirData.result);
    if (protonData.success) setProtonPath(protonData.result);
  }

  const ModTextField = TextField as any;

  return <div style={{ boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {
      appId ? <PanelSection title={'App ID: '+appId}>
        <ModTextField ref={filePathRef} onChange={(e: any) => setTargetPath(e.target.value)} />
        <Focusable style={{ marginRight: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          {gamePath && <Button onClick={() => serverAPI.openFilePicker(gamePath)}>Open GamePath</Button>}
          {protonPath && <Button onClick={() => serverAPI.openFilePicker(protonPath as string)}>Open ProtonPath</Button>}
        </Focusable>
      </PanelSection> : <div style={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div className={staticClasses.Title}>Not Selected</div>
          <div>Application was not selected</div>
        </div>
      </div>
    }
  </div>;
};

export default SidePanel;