/**
 * Shopify Application Type
 */
export interface App {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  isActive: boolean;
}

/**
 * App Context Type
 */
export interface AppContextType {
  currentApp: App | null;
  apps: App[];
  isLoading: boolean;
  setCurrentApp: (app: App) => void;
  refreshApps: () => Promise<void>;
}
