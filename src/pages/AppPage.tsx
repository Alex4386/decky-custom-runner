import { VFC, useEffect, useState } from "react";
import ProtonRunnerGlobal from "../common/global";
import { DialogButton, Focusable, SidebarNavigation, useParams } from "decky-frontend-lib";

const AppPage: VFC = () => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  // I can't find RouteComponentParams :skull:
  const { appId } = useParams() as any;
  
  const [gamePath, setGamePath] = useState<string | null | undefined>(undefined);
  const [protonPath, setProtonPath] = useState<string | null | undefined>(undefined);

  const [targetPath, setTargetPath] = useState<string | undefined>(undefined);

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

  const startPicker = async (startPath: string) => {
    const res = await serverAPI.openFilePicker(startPath, true);
    if (res) {
      //setTargetPath(res.realpath);
      //(filePathRef.current as TextFieldProps).value = res.realpath;
    }
  }

  return <SidebarNavigation
    title={"App: "+appId}
    showTitle={true}
    pages={[
      {
        title: 'Game Files',
        content: <Focusable>
          {gamePath && <DialogButton onClick={() => startPicker(gamePath)}>Open GamePath</DialogButton>}
        </Focusable>
      },
      {
        title: 'Proton Files',
        content: <Focusable>
          {protonPath && <DialogButton onClick={() => startPicker(protonPath as string)}>Open ProtonPath</DialogButton>}          
        </Focusable>
      },
    ]} />
};

export default AppPage;
