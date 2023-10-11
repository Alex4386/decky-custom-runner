import { RouterHook, ServerAPI } from "decky-frontend-lib";
import Settings from "../pages/Settings";
import { VFC } from "react";

export function registerRoutes(routerHook: RouterHook) {
    routerHook.addRoute("/decky-proton-runner/settings", Settings, {
        exact: true,
    });
}

export function unregisterRoutes(routerHook: RouterHook) {
    routerHook.removeRoute('/decky-proton-runner/settings');
}