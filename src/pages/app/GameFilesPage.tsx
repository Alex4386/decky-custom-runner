import { DialogButton, Focusable, SteamSpinner, TextField, ToggleField, staticClasses } from "decky-frontend-lib";
import { MutableRefObject, VFC, useEffect, useRef, useState } from "react";
import ProtonRunnerGlobal from "../../common/global";

const GameFiles: VFC<{appId: string}> = ({appId}) => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  const [gamePath, setGamePath] = useState<string | null | undefined>(undefined);
  const [cmdline, setCmdline] = useState<string | undefined>(undefined);

  const [appLaunched, setAppLaunched] = useState<boolean>(false);
  const [useProton, setUseProton] = useState<boolean>(false);

  const pathInputRef: MutableRefObject<any> = useRef();
  
  const fetchContent = async () => {
    const gameDirData = await serverAPI.callPluginMethod<{
      id: string,
    }, string>("get_game_dir", {
      id: appId,
    });

    console.log('get_game_dir', gameDirData);

    if (gameDirData.success && gameDirData.result) {
      setGamePath(gameDirData.result);
    } else {
      // In case if it is non-Steam app (a.k.a. Shortcut);
      try {
        const [data] = await SteamClient.Apps.GetShortcutData([parseInt(appId)]);
        const path = data.data.strShortcutPath as string;
        const folderPath = path.lastIndexOf('/') >= 0 ? path.substring(0, path.lastIndexOf('/')) : path;

        if (path && folderPath) setGamePath(folderPath);
        else setGamePath(null);
      } catch(e) {
        console.error('Shortcut Fetch', e);
        setGamePath(null);
      }
    }
  }

  const startPicker = async (startPath: string) => {
    const res = await serverAPI.openFilePicker(startPath, true);
    if (res) {
      if (res.realpath.includes(' ')) {
        updatePath(`"${res.realpath}"`)
      } else {
        updatePath(res.realpath);
      }
    } 
  }

  const updatePath = (path: string) => {
    setCmdline(path);
    console.log('updatePath', path, pathInputRef.current)
    if (pathInputRef.current) pathInputRef.current.m_elInput.value = path;
  }

  const launch = async (cmdline?: string) => {
    if (!cmdline?.trim()) return;

    let requestLaunch;
    if (useProton) {
      requestLaunch = await serverAPI.callPluginMethod<{
        id: string,
        cmdline: string,
      }, string>("launch_proton_command", {
        id: appId,
        cmdline,
      });
    } else {
      requestLaunch = await serverAPI.callPluginMethod<{
        id: string,
        cmdline: string,
      }, string>("launch_command", {
        id: appId,
        cmdline,
      });
    }
    
    console.log(requestLaunch, useProton);

    if (requestLaunch.success) {
      setAppLaunched(true);
      SteamClient.UI.NotifyAppInitialized();
    }
  };

  useEffect(() => {
    if (appId && gamePath === undefined) {
      fetchContent();
    }
  });

  if (appLaunched) return <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem'}}>
    <SteamSpinner />
    <p>Application Launching... Please check STEAM menu for application launch status</p>
  </div>
  if (gamePath === undefined) return <SteamSpinner />
  else if (gamePath === null) return <Focusable><p>This app does not have valid steam app directory. (non-Steam app?)</p></Focusable>

  return <Focusable style={{ marginRight: '.5rem', flexDirection: 'column', display: 'flex', gap: '1rem' }}>
    <p><b>Game Path</b>: {gamePath}</p>
    <div style={{ marginRight: '.5rem', flexDirection: 'column', display: 'flex', gap: '.5rem' }}>
      <p style={{ fontWeight: 'bold', fontSize: '1.25em' }}>Launch Executable</p>

      <TextField
        label="Command Line"
        onChange={e => setCmdline(e.target.value)} 
        // @ts-ignore
        ref={pathInputRef} 
      />

      
      <Focusable
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
            <div className={staticClasses.Text}>Use Proton</div>
            <div className={staticClasses.Label}>Use this application's proton compatibility layer to launch this program</div>
        </div>
        <div style={{ minWidth: '200px' }}>
            <ToggleField
                disabled={false}
                checked={useProton}
                onChange={(e) => {setUseProton(e)}}
                bottomSeparator={"none"} />
        </div>
      </Focusable>
      
      <DialogButton onClick={() => startPicker(gamePath)}>Open Picker</DialogButton>
      <DialogButton onClick={() => launch(cmdline)}>Launch File</DialogButton>
    </div>
  </Focusable>
}

export default GameFiles;
