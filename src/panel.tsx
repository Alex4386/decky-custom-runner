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
} from "decky-frontend-lib";
import { useState, VFC } from "react";
import { FaCog, FaPlus, FaTimesCircle } from "react-icons/fa";
import ProtonRunnerGlobal from "./common/global";

const SidePanel: VFC<{
  serverAPI: ServerAPI
}> = ({ serverAPI }) => {

  const appId = ProtonRunnerGlobal.getAppId();

  return <div style={{ boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {
      appId ? <PanelSection title={'App ID: '+appId}>
        <Button onClick={() => serverAPI.openFilePicker('~')}>Open File</Button>
      </PanelSection> : <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <div className={staticClasses.Title}>Not Selected</div>
        <div>Application was not selected</div>
      </div>
    }
  </div>;
};

export default SidePanel;