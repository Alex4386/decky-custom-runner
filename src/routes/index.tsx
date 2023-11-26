import { RouterHook } from "decky-frontend-lib";
import AppPage from "../pages/AppPage";

export function registerRoutes(routerHook: RouterHook) {
    routerHook.addRoute('/decky-custom-runner/app/:appId', AppPage);
}

export function unregisterRoutes(routerHook: RouterHook) {
    routerHook.removeRoute('/decky-custom-runner/app/:appId');
}