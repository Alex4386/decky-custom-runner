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
        console.log('renderFuncTriggered!', props, props['appid'], props.path, re);
        return re;
      }
    )

    return props
  }

export default appPageHandler;
