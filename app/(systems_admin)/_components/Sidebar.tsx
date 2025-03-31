"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useSession } from "../SessionProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem, MenuLink, useMenuItems } from "./MenuItems";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { user } = useSession();
  const pathname = usePathname();
  const menuItems = useMenuItems();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Handle main content margin when sidebar toggles
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      if (isOpen) {
        mainContent.style.marginLeft = "280px";
      } else {
        mainContent.style.marginLeft = "0px";
      }
    }
  }, [isOpen]);

  const toggleDropdown = useCallback((index: number, e: React.MouseEvent) => {
    // Prevent the click event from bubbling up
    e.stopPropagation();

    // Only process if we're not currently animating
    if (!isAnimating.current) {
      isAnimating.current = true;

      setActiveDropdown((prev) => (prev === index ? null : index));

      // Reset the animation flag after a short delay
      setTimeout(() => {
        isAnimating.current = false;
      }, 300); // Match this to your animation duration
    }
  }, []);

  const toggleSidebar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const getDropdownClasses = useCallback((isOpen: boolean) => {
    return `transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
    } overflow-hidden`;
  }, []);

  // Render a standard link
  const renderLink = useCallback(
    (link: MenuLink) => {
      const isActive = pathname === link.href;
      return (
        <Link
          href={link.href}
          className={`block pl-8 pr-4 py-2.5 text-sm transition-all duration-200 relative ${
            isActive
              ? "bg-primary/10 text-primary border-l-2 border-primary font-medium"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          }`}
        >
          <span>{link.name}</span>
        </Link>
      );
    },
    [pathname],
  );

  // Collapsed sidebar view
  if (!isOpen) {
    return (
      <div className="relative h-full flex">
        <div className="w-0 overflow-hidden flex flex-col bg-background border-r" />
        <button
          onClick={toggleSidebar}
          className="fixed top-24 left-0 bg-background text-muted-foreground p-2 rounded-r border border-l-0 hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-40"
          aria-label="Open sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  // Expanded sidebar view
  return (
    <div className="fixed top-[88px] left-0 bottom-0 z-40" ref={sidebarRef}>
      <div className="w-[280px] h-full bg-background border-r flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* User Welcome Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground">
                Welcome back,
              </h2>
              <div className="flex items-center mt-2">
                <span className="text-xl font-bold text-foreground">
                  {user?.displayName || "Administrator"}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {user?.role === "SYSTEM_ADMINISTRATOR"
                    ? "Admin"
                    : user?.role || "Admin"}
                </span>
              </div>
            </div>

            <nav className="space-y-0.5">
              {menuItems.map((item, index) => {
                const isDropdownOpen = activeDropdown === index;

                return (
                  <div key={`${item.title}-${index}`} className="bg-background">
                    <button
                      onClick={(e) => toggleDropdown(index, e)}
                      className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-200 rounded-md ${
                        isDropdownOpen
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium">{item.title}</span>
                      <div
                        className={`text-muted-foreground transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    <div className={getDropdownClasses(isDropdownOpen)}>
                      {item.links.map((link, idx) => (
                        <div key={`${item.title}-link-${idx}`}>
                          {renderLink(link)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-10 bg-background text-muted-foreground p-2 rounded-r border hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Close sidebar"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default CollapsibleSidebar;
