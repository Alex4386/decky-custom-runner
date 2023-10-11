import {
    afterPatch, ServerAPI, SidebarNavigation
} from 'decky-frontend-lib';
import { ReactElement, VFC } from 'react';
import ProtonRunnerGlobal from '../../common/global';

const appPageHandler = 
  (props: { path: string; children: ReactElement }) => {

    // add hook for app page
    afterPatch(
      props.children.props,
      'renderFunc',
      (_: Record<string, any>[], re: ReactElement) => {
        const url = new URL(location.href);
        const res = /^\/routes\/library\/app\/([0-9]+)$/.exec(url.pathname);
        if (res) {
          const appIdRaw = res[1];
          if (appIdRaw) {
            const appId = parseInt(appIdRaw);
            if (!isNaN(appId)) ProtonRunnerGlobal.setAppId(appId);
          }
        }
        return re;
      }
    )

    return props
  }

export default appPageHandler;
