import { useEffect } from "react";
import { useHaritaStore } from "../store/haritaStore";

interface KeyboardShortcutsProps {
  onOpenNewNode: () => void;
  onToggleShortcuts: () => void;
  onAutoLayout: () => void;
  onFocusSearch: () => void;
  onCloseModals: () => void;
  onToggleSidebar?: () => void;
}

export function useKeyboardShortcuts({
  onOpenNewNode,
  onToggleShortcuts,
  onAutoLayout,
  onFocusSearch,
  onCloseModals,
  onToggleSidebar,
}: KeyboardShortcutsProps): void {
  const {
    secilenHaritaId,
    secilenDugumId,
    secilenKenarId,
    dugumSil,
    kenarSil,
    secilenDugumuAyarla,
    secilenKenariAyarla,
    yolVurgusunuTemizle,
  } = useHaritaStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable;

      // ⌘B veya Ctrl+B (Kenar Çubuğunu Aç/Kapat)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        onToggleSidebar?.();
        return;
      }

      // ⌘K veya Ctrl+K (Kısayollar Kılavuzu)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggleShortcuts();
        return;
      }

      // ⌘F veya Ctrl+F (Arama Çubuğuna Odaklan)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // ⌘N veya Ctrl+N (Yeni Düğüm Ekle)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (secilenHaritaId) {
          onOpenNewNode();
        }
        return;
      }

      // ⌘D veya Ctrl+D (Otomatik Düzenle)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (secilenHaritaId) {
          onAutoLayout();
        }
        return;
      }

      // Escape (Tüm seçim ve pencereleri temizle)
      if (e.key === "Escape") {
        onCloseModals();
        secilenDugumuAyarla(null);
        secilenKenariAyarla(null);
        yolVurgusunuTemizle();
        return;
      }

      // Delete veya Backspace (Input içinde değilken seçili düğüm/kenar sil)
      if (!isInput && (e.key === "Delete" || e.key === "Backspace")) {
        if (secilenDugumId) {
          e.preventDefault();
          dugumSil(secilenDugumId);
        } else if (secilenKenarId) {
          e.preventDefault();
          kenarSil(secilenKenarId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    secilenHaritaId,
    secilenDugumId,
    secilenKenarId,
    dugumSil,
    kenarSil,
    secilenDugumuAyarla,
    secilenKenariAyarla,
    yolVurgusunuTemizle,
    onOpenNewNode,
    onToggleShortcuts,
    onAutoLayout,
    onFocusSearch,
    onCloseModals,
    onToggleSidebar,
  ]);
}
