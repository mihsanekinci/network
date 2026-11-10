import { useState, useCallback } from "react";

const SIDEBAR_STORAGE_KEY = "network_sidebar_acik";

export const useSidebarState = () => {
  const [sidebarAcik, setSidebarAcik] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false";
  });

  const sidebarDurumuDegistir = useCallback((yeniDurum: boolean) => {
    setSidebarAcik(yeniDurum);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(yeniDurum));
  }, []);

  const toggleSidebar = useCallback(() => {
    sidebarDurumuDegistir(!sidebarAcik);
  }, [sidebarAcik, sidebarDurumuDegistir]);

  return {
    sidebarAcik,
    setSidebarAcik,
    sidebarDurumuDegistir,
    toggleSidebar,
  };
};
