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

  const launchFile = async (filePath?: string) => {};

  useEffect(() => {
    if (appId && protonPath === undefined) {
      fetchContent();
    }
  });

  if (protonPath === undefined) return <SteamSpinner />
  else if (protonPath === null) return <Focusable><p>This app does not have proton directory. It could be due to app being Linux native.</p></Focusable>

  return <Focusable style={{ marginRight: '.5rem', flexDirection: 'column', display: 'flex', gap: '1rem' }}>
    <p><b>Proton Path</b>: {protonPath}</p>
    <div style={{ marginRight: '.5rem', flexDirection: 'column', display: 'flex', gap: '.5rem' }}>
      <p style={{ fontWeight: 'bold', fontSize: '1.25em' }}>Launch Executable</p>
 
      <TextField
        onChange={e => setTargetPath(e.target.value)} 
        // @ts-ignore
        ref={pathInputRef}
      />
      <DialogButton onClick={() => startPicker(protonPath)}>Open Picker</DialogButton>
      <DialogButton onClick={() => launchFile(targetPath)}>Launch File</DialogButton>
    </div>
  </Focusable>
}

export default ProtonFiles;
