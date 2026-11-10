import { useHaritaStore } from "../store/haritaStore";

export const useDarkMode = () => {
  const isDark = useHaritaStore((s) => s.karanlikMod);
  const toggleDarkMode = useHaritaStore((s) => s.karanlikModDegistir);
  return { isDark, toggleDarkMode };
};
