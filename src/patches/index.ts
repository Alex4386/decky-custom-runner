import { RoutePatch, ServerAPI } from "decky-frontend-lib";
import appPageHandler from "./handler";

interface PatchInfo {
    path: string;
    patch: RoutePatch;
}

const registeredPatches: PatchInfo[] = [];

export function registerPatches(serverAPI: ServerAPI) {
    patch(serverAPI, '/library/app/:appid', appPageHandler)
}

export function unregisterPatches(serverAPI: ServerAPI) {
    for (const patch of registeredPatches) {
        unpatch(serverAPI, patch)
    }
}

function patch(serverAPI: ServerAPI, path: string, routerPatch: RoutePatch) {
    const res = serverAPI.routerHook.addPatch(
        path,
        routerPatch
    );

    registeredPatches.push({
        path,
        patch: res,
    });
}

function unpatch(serverAPI: ServerAPI, patchInfo: PatchInfo) {
    serverAPI.routerHook.removePatch(
        patchInfo.path,
        patchInfo.patch,
    );
}