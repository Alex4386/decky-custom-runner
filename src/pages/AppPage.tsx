import { VFC, useEffect, useState } from "react";
import ProtonRunnerGlobal from "../common/global";
import { DialogButton, Focusable, SidebarNavigation, useParams } from "decky-frontend-lib";
import ProtonFiles from "./app/ProtonFilesPage";
import GameFiles from "./app/GameFilesPage";

const AppPage: VFC = () => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  // I can't find RouteComponentParams :skull:
  const { appId } = useParams() as any;

  const [gameLabel, setGameLabel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!gameLabel) {
      fetchContent();
    }
  })

  const fetchContent = async () => {
    const options = await SteamClient.Apps.GetLaunchOptionsForApp(parseInt(appId))
    console.log('options', options);

    if (options && options.length > 0) setGameLabel(options[0].strGameName);
  }

  return <SidebarNavigation
    title={gameLabel ?? "App: "+appId}
    showTitle={true}
    pages={[
      {
        title: 'Game Files',
        content: <GameFiles appId={appId} />
      },
      {
        title: 'Proton Files',
        content: <ProtonFiles appId={appId} />
      },
    ]} />
};

export default AppPage;
