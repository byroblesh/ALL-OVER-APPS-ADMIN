import { AppContextType } from "@/@types/app";
import { createSafeContext } from "@/utils/createSafeContext";

export const [AppProvider, useAppContext] = createSafeContext<AppContextType>(
  "useAppContext must be used within AppProvider"
);
