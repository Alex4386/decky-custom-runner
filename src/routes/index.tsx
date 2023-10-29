import { RouterHook, ServerAPI } from "decky-frontend-lib";
import Settings from "../pages/Settings";
import { VFC } from "react";
import AppPage from "../pages/AppPage";

export function registerRoutes(routerHook: RouterHook) {
    routerHook.addRoute('/decky-custom-runner/app/:appId', AppPage);
    /*routerHook.addRoute("/decky-proton-runner/settings", Settings, {
        exact: true,
    });*/
}

export function unregisterRoutes(routerHook: RouterHook) {
    routerHook.removeRoute('/decky-custom-runner/app/:appId');
    //routerHook.removeRoute('/decky-proton-runner/settings');
}