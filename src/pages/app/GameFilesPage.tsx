import { DialogButton, Focusable, SteamSpinner, TextField, staticClasses } from "decky-frontend-lib";
import { MutableRefObject, VFC, useEffect, useRef, useState } from "react";
import ProtonRunnerGlobal from "../../common/global";

const GameFiles: VFC<{appId: string}> = ({appId}) => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  const [gamePath, setGamePath] = useState<string | null | undefined>(undefined);
  const [cmdline, setCmdline] = useState<string | undefined>(undefined);
  const pathInputRef: MutableRefObject<any> = useRef();
  
  const fetchContent = async () => {
    const gameDirData = await serverAPI.callPluginMethod<{
      id: string,
    }, string>("get_game_dir", {
      id: appId,
    });

    console.log('get_game_dir', gameDirData);

    if (gameDirData.success) setGamePath(gameDirData.result);
    else setGamePath(null);
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

    const requestLaunch = await serverAPI.callPluginMethod<{
      id: string,
      cmdline: string,
    }, string>("launch_command", {
      id: appId,
      cmdline,
    });

    if (requestLaunch.success) {
      SteamClient.UI.NotifyAppInitialized();
    }
  };

  useEffect(() => {
    if (appId && gamePath === undefined) {
      fetchContent();
    }
  });

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
      <DialogButton onClick={() => startPicker(gamePath)}>Open Picker</DialogButton>
      <DialogButton onClick={() => launch(cmdline)}>Launch File</DialogButton>
    </div>
  </Focusable>
}

export default GameFiles;
