import { DialogButton, Focusable, SteamSpinner, TextField, staticClasses } from "decky-frontend-lib";
import { MutableRefObject, VFC, useEffect, useRef, useState } from "react";
import ProtonRunnerGlobal from "../../common/global";

const GameFiles: VFC<{appId: string}> = ({appId}) => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  const [gamePath, setGamePath] = useState<string | null | undefined>(undefined);
  const [targetPath, setTargetPath] = useState<string | undefined>(undefined);
  const pathInputRef: MutableRefObject<any> = useRef();
  
  const fetchContent = async () => {
    const targetDirs = (await SteamClient.InstallFolder.GetInstallFolders()).map(
      (n: any) => n.strFolderPath
    );

    const gameDirData = await serverAPI.callPluginMethod<{}, string>("get_game_dir", {
      id: appId,
      target_dirs: targetDirs,
    });

    if (gameDirData.success) setGamePath(gameDirData.result);
    else setGamePath(null);
  }

  const updatePath = (path: string) => {
    setTargetPath(path);
    console.log('updatePath', path, pathInputRef.current)
    if (pathInputRef.current) pathInputRef.current.m_elInput.value = path;
  }

  const startPicker = async (startPath: string) => {
    const res = await serverAPI.openFilePicker(startPath, true);
    if (res) updatePath(res.realpath);
  }

  useEffect(() => {
    if (appId && gamePath === undefined) {
      fetchContent();
    }
  });

  if (gamePath === undefined) return <SteamSpinner />
  else if (gamePath === null) return <Focusable><p>This app does not have valid steam app directory. (non-Steam app?)</p></Focusable>
  return <Focusable>
    <Focusable>
      <p><b>Game Path</b>: {gamePath}</p>
    </Focusable>
    <Focusable>
      <div className={staticClasses.Title}>Launch Executable</div>
      <TextField
        onChange={e => setTargetPath(e.target.value)} 
        // @ts-ignore
        ref={pathInputRef} 
      />
      <DialogButton onClick={() => startPicker(gamePath)}>Open Picker</DialogButton>
    </Focusable>
  </Focusable>
}

export default GameFiles;
