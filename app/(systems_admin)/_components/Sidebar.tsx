"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSession } from "../SessionProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuItem,
  MenuLink,
  useMenuItems,
  isMenuItem,
  isSubmenu,
} from "./MenuItems";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const { user } = useSession();
  const pathname = usePathname();
  const menuItems = useMenuItems();

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

  const toggleDropdown = useCallback((index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
    setActiveSubMenu(null);
  }, []);

  const toggleSubMenu = useCallback((title: string) => {
    setActiveSubMenu((prev) => (prev === title ? null : title));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const getDropdownClasses = useCallback((isOpen: boolean) => {
    return `transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-[60vh] overflow-y-auto" : "max-h-0"
    } overflow-hidden`;
  }, []);

  // Render a standard link
  const renderLink = useCallback(
    (link: MenuLink, isSubItem = false) => {
      const isActive = pathname === link.href;
      return (
        <Link
          href={link.href}
          className={`block ${
            isSubItem ? "pl-12" : "pl-8"
          } pr-4 py-2.5 text-sm transition-all duration-200 relative ${
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

  // Content rendering logic
  const renderMenuContent = useMemo(() => {
    const renderContent = (item: MenuItem | MenuLink, parentTitle: string) => {
      // Check if this is a submenu item
      if (isMenuItem(item) && isSubmenu(item)) {
        const subMenu = item as MenuItem;
        const isSubMenuOpen = activeSubMenu === subMenu.title;

        return (
          <div key={`${parentTitle}-${subMenu.title}`}>
            <button
              onClick={() => toggleSubMenu(subMenu.title)}
              className={`w-full pl-8 pr-4 py-2.5 flex items-center justify-between text-sm transition-all duration-200 ${
                isSubMenuOpen
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <span>{subMenu.title}</span>
              <div className="text-muted-foreground">
                {isSubMenuOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </button>

            <div className={getDropdownClasses(isSubMenuOpen)}>
              {subMenu.links &&
                subMenu.links.map((link, idx) => (
                  <div key={`${subMenu.title}-${idx}`}>
                    {!isMenuItem(link) && renderLink(link, true)}
                  </div>
                ))}
            </div>
          </div>
        );
      }

      // If it's a regular link
      if (!isMenuItem(item)) {
        return renderLink(item, parentTitle !== "");
      }

      return null;
    };

    return renderContent;
  }, [activeSubMenu, getDropdownClasses, toggleSubMenu, renderLink]);

  // Collapsed sidebar view
  if (!isOpen) {
    return (
      <div className="relative h-full flex">
        <div className="w-0 overflow-hidden flex flex-col bg-background border-r transition-all duration-300 ease-in-out" />
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
    <div className="fixed top-[88px] left-0 bottom-0 z-40 transition-all duration-300 ease-in-out">
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
                  <div key={`${item.title}-${index}`}>
                    <button
                      onClick={() => toggleDropdown(index)}
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
                          {isMenuItem(link) && isSubmenu(link)
                            ? renderMenuContent(link, item.title)
                            : !isMenuItem(link)
                              ? renderLink(link)
                              : null}
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
