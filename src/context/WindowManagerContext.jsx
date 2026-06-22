import { createContext, useContext, useState, useCallback } from "react";

const WindowManagerContext = createContext();

const INITIAL_WINDOWS = {
  hero: {
    id: "hero",
    title: "PROFILE.EXE",
    x: 50,
    y: 50,
    width: 580,
    height: 440,
    isOpen: true,
    isMinimized: false,
    zIndex: 100,
  },
  projects: {
    id: "projects",
    title: "WORKS.BAT",
    x: 120,
    y: 90,
    width: 620,
    height: 460,
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
  },
  experience: {
    id: "experience",
    title: "JOURNEY.SYS",
    x: 190,
    y: 130,
    width: 640,
    height: 460,
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
  },
  contact: {
    id: "contact",
    title: "CONTACT.SH",
    x: 260,
    y: 170,
    width: 540,
    height: 420,
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
  },
};

export function WindowManagerProvider({ children }) {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [highestZ, setHighestZ] = useState(100);

  const focusWindow = useCallback((id) => {
    setHighestZ((prev) => {
      const nextZ = prev + 1;
      setWindows((current) => {
        if (
          current[id].zIndex === prev &&
          Object.values(current).filter((w) => w.isOpen && !w.isMinimized)
            .length === 1
        ) {
          return current; // already top-most and sole active
        }
        return {
          ...current,
          [id]: { ...current[id], zIndex: nextZ },
        };
      });
      return nextZ;
    });
  }, []);

  const openWindow = useCallback(
    (id) => {
      setWindows((current) => ({
        ...current,
        [id]: { ...current[id], isOpen: true, isMinimized: false },
      }));
      focusWindow(id);
    },
    [focusWindow],
  );

  const closeWindow = useCallback((id) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], isOpen: false },
    }));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], isMinimized: true },
    }));
  }, []);

  const updateWindowPosition = useCallback((id, x, y) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], x, y },
    }));
  }, []);

  const updateWindowSize = useCallback((id, width, height, x, y) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], width, height, x, y },
    }));
  }, []);

  const tidyWorkspace = useCallback(() => {
    setWindows(INITIAL_WINDOWS);
    setHighestZ(100);
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        tidyWorkspace,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within a WindowManagerProvider",
    );
  }
  return context;
}
