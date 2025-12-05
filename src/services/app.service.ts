import axios from "@/utils/axios";
import { App } from "@/@types/app";

// ============================================================================
// Types
// ============================================================================

export interface ApiApp {
  id: string;
  name: string;
  features?: {
    canEditTemplates?: boolean;
    canManageShops?: boolean;
    canViewMetrics?: boolean;
  };
}

export interface GetAppsResponse {
  success: boolean;
  data: ApiApp[];
}

export interface GetAppResponse {
  success: boolean;
  data: ApiApp;
}

// ============================================================================
// App Service
// ============================================================================

class AppService {
  /**
   * Transform API app to internal App type
   */
  private transformApp(apiApp: ApiApp): App {
    return {
      id: apiApp.id,
      name: apiApp.name,
      slug: apiApp.id,
      icon: this.getAppIcon(apiApp.id),
      isActive: true,
      color: this.getAppColor(apiApp.id),
    };
  }

  /**
   * Get icon for app based on ID
   */
  private getAppIcon(appId: string): string {
    const icons: Record<string, string> = {
      "banners-all-over": "🎨",
      "reviews": "⭐",
      "loyalty": "🎁",
      "default": "📱",
    };
    return icons[appId] || icons.default;
  }

  /**
   * Get color for app based on ID
   */
  private getAppColor(appId: string): string {
    const colors: Record<string, string> = {
      "banners-all-over": "#3B82F6",
      "reviews": "#F59E0B",
      "loyalty": "#10B981",
      "default": "#6B7280",
    };
    return colors[appId] || colors.default;
  }

  /**
   * Get all apps for the current user
   */
  async getApps(): Promise<App[]> {
    const response = await axios.get<GetAppsResponse>("/apps");

    if (!response.data.success || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data.map(apiApp => this.transformApp(apiApp));
  }

  /**
   * Get single app by ID
   */
  async getAppById(appId: string): Promise<App> {
    const response = await axios.get<GetAppResponse>(`/apps/${appId}`);
    return this.transformApp(response.data.data);
  }

  /**
   * Update app settings (if needed in the future)
   */
  async updateApp(appId: string, data: Partial<App>): Promise<App> {
    const response = await axios.patch<GetAppResponse>(`/apps/${appId}`, data);
    return this.transformApp(response.data.data);
  }
}

// Export singleton instance
export const appService = new AppService();
export default appService;
