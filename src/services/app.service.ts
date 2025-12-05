import axios from "@/utils/axios";
import { App } from "@/@types/app";

// ============================================================================
// Types
// ============================================================================

export interface GetAppsResponse {
  apps: App[];
}

export interface GetAppResponse {
  app: App;
}

// ============================================================================
// App Service
// ============================================================================

class AppService {
  /**
   * Get all apps for the current user
   */
  async getApps(): Promise<App[]> {
    const response = await axios.get<GetAppsResponse>("/apps");
    return response.data.apps;
  }

  /**
   * Get single app by ID
   */
  async getAppById(appId: string): Promise<App> {
    const response = await axios.get<GetAppResponse>(`/apps/${appId}`);
    return response.data.app;
  }

  /**
   * Update app settings (if needed in the future)
   */
  async updateApp(appId: string, data: Partial<App>): Promise<App> {
    const response = await axios.patch<GetAppResponse>(`/apps/${appId}`, data);
    return response.data.app;
  }
}

// Export singleton instance
export const appService = new AppService();
export default appService;
