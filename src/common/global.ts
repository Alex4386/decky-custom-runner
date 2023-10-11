import { ServerAPI } from "decky-frontend-lib";

class ProtonRunnerGlobal {
    // singleton serverAPI
    private static serverAPI: ServerAPI
    
    // singleton current app page
    private static currentAppId?: number

    static setServer(serverAPI: ServerAPI) {
        this.serverAPI = serverAPI
    }

    static getServer(): ServerAPI {
        return this.serverAPI
    }

    static getAppId(): number | undefined {
        return this.currentAppId;
    }

    static setAppId(appId: number) {
        console.log('appId updated:', appId);
        this.currentAppId = appId;
    }
}

export default ProtonRunnerGlobal;
