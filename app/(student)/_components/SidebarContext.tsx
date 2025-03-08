"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
const SidebarStateContext = createContext({
  isCollapsed: false,
  setIsCollapsed: (value: boolean) => {},
});

// Custom hook for using the sidebar context
export const useSidebarState = () => useContext(SidebarStateContext);

// Provider component
export default function SidebarContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference from localStorage on component mount
  useEffect(() => {
    // Get stored sidebar state
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState !== null) {
      setIsCollapsed(storedState === "true");
    }
    setIsLoaded(true);
  }, []);

  // Update main content margin when sidebar state changes
  useEffect(() => {
    if (!isLoaded) return;

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      if (isCollapsed) {
        mainContent.classList.remove("ml-80");
        mainContent.classList.add("ml-16");
      } else {
        mainContent.classList.remove("ml-16");
        mainContent.classList.add("ml-80");
      }
    }
  }, [isCollapsed, isLoaded]);

  return (
    <SidebarStateContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarStateContext.Provider>
  );
}
