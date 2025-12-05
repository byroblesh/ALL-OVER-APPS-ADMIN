// Import Dependencies
import { useEffect, useState, ReactNode, useCallback } from "react";

// Local Imports
import { App } from "@/@types/app";
import { appService } from "@/services";
import { AppProvider as AppContext } from "./context";
import { useAuthContext } from "@/app/contexts/auth/context";

// ----------------------------------------------------------------------

const STORAGE_KEY = "selectedAppId";

export function AppProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const [currentApp, setCurrentAppState] = useState<App | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load apps from API
  const loadApps = useCallback(async () => {
    // Only load apps if user is authenticated
    if (!isAuthenticated) {
      setApps([]);
      setCurrentAppState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedApps = await appService.getApps();

      // Validate response - ensure it's an array
      if (!Array.isArray(fetchedApps)) {
        console.warn("Apps service returned invalid data, expected array");
        setApps([]);
        setCurrentAppState(null);
        return;
      }

      setApps(fetchedApps);

      // Only proceed if we have apps
      if (fetchedApps.length === 0) {
        setCurrentAppState(null);
        return;
      }

      // Try to restore previously selected app
      const savedAppId = localStorage.getItem(STORAGE_KEY);

      if (savedAppId) {
        const savedApp = fetchedApps.find((app) => app.id === savedAppId);
        if (savedApp) {
          setCurrentAppState(savedApp);
        } else {
          // If saved app not found, select first active app
          const firstActiveApp = fetchedApps.find((app) => app.isActive);
          setCurrentAppState(firstActiveApp || fetchedApps[0]);
        }
      } else {
        // No saved app, select first active app
        const firstActiveApp = fetchedApps.find((app) => app.isActive);
        setCurrentAppState(firstActiveApp || fetchedApps[0]);
      }
    } catch (error) {
      console.warn("Failed to load apps (endpoint may not exist yet):", error);
      // Don't throw error, just set empty state
      setApps([]);
      setCurrentAppState(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize when auth state changes
  useEffect(() => {
    if (isInitialized) {
      loadApps();
    }
  }, [isInitialized, isAuthenticated, loadApps]);

  // Set current app and persist to localStorage
  const setCurrentApp = useCallback((app: App) => {
    setCurrentAppState(app);
    localStorage.setItem(STORAGE_KEY, app.id);
  }, []);

  // Refresh apps list
  const refreshApps = useCallback(async () => {
    await loadApps();
  }, [loadApps]);

  if (!children) {
    return null;
  }

  return (
    <AppContext
      value={{
        currentApp,
        apps,
        isLoading,
        setCurrentApp,
        refreshApps,
      }}
    >
      {children}
    </AppContext>
  );
}
