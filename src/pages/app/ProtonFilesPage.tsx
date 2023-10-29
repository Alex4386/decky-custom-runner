import { DialogButton, Focusable, SteamSpinner, TextField, staticClasses } from "decky-frontend-lib";
import { MutableRefObject, VFC, useEffect, useRef, useState } from "react";
import ProtonRunnerGlobal from "../../common/global";

const ProtonFiles: VFC<{appId: string}> = ({appId}) => {
  const serverAPI = ProtonRunnerGlobal.getServer();

  const [protonPath, setProtonPath] = useState<string | null | undefined>(undefined);
  const [targetPath, setTargetPath] = useState<string | undefined>(undefined);
  const pathInputRef: MutableRefObject<any> = useRef();

  const fetchContent = async () => {
    const targetDirs = (await SteamClient.InstallFolder.GetInstallFolders()).map(
      (n: any) => n.strFolderPath
    );

    const protonDirData = await serverAPI.callPluginMethod<{}, string>("get_proton_compat_dir", {
      id: appId,
      target_dirs: targetDirs,
    })

    if (protonDirData.success) setProtonPath(protonDirData.result);
    else setProtonPath(null);
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
    if (appId && protonPath === undefined) {
      fetchContent();
    }
  });

  if (protonPath === undefined) return <SteamSpinner />
  else if (protonPath === null) return <Focusable><p>This app does not have proton directory. It could be due to app being Linux native.</p></Focusable>
  return <Focusable>
  <Focusable>
    <p><b>Proton Path</b>: {protonPath}</p>
  </Focusable>
  <Focusable>
    <div className={staticClasses.Title}>Launch Executable</div>
    <TextField
      onChange={e => setTargetPath(e.target.value)} 
      // @ts-ignore
      ref={pathInputRef} 
    />
    <DialogButton onClick={() => startPicker(protonPath)}>Open Picker</DialogButton>
  </Focusable>
</Focusable>
}

export default ProtonFiles;
