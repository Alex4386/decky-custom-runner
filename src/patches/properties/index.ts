import {
    afterPatch, ServerAPI, SidebarNavigation
} from 'decky-frontend-lib';
import { ReactElement, VFC } from 'react';

const propertiesPatcher = 
  (props: { path: string; children: ReactElement }) => {
    console.log('propPatched!', props.path, props.children);
    afterPatch(
      props.children.props,
      'renderFunc',
      (_: Record<string, any>[], re: ReactElement) => {
        console.log('renderFuncTriggered!', re);
        return re;
      }
    )

    return props
  }

export default propertiesPatcher;
