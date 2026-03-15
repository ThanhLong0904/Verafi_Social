"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavItem = {
  key: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

function IconHome(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconSearch(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconCreate(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function IconHeart(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconProfile(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMenu(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function LeftSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      key: "home",
      href: "/" as const,
      label: "Home",
      icon: <IconHome className="w-6 h-6" />,
      match: (p) => p === "/",
    },
    {
      key: "search",
      href: "/search" as const,
      label: "Search",
      icon: <IconSearch className="w-6 h-6" />,
      match: (p) => p.startsWith("/search"),
    },
    {
      key: "create",
      href: "/create" as const,
      label: "Create",
      icon: <IconCreate className="w-6 h-6" />,
      match: (p) => p.startsWith("/create"),
    },
    {
      key: "activity",
      href: "/activity" as const,
      label: "Activity",
      icon: <IconHeart className="w-6 h-6" />,
      match: (p) => p.startsWith("/activity"),
    },
    {
      key: "profile",
      href: "/profile/mock" as const,
      label: "Profile",
      icon: <IconProfile className="w-6 h-6" />,
      match: (p) => p.startsWith("/profile"),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[72px]">
        <div className="flex flex-col items-center w-full py-6">
          {/* Logo */}
          <div className="mb-10">
            <Link href="/" className="flex items-center justify-center group">
              <svg
                className="w-7 h-7 text-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.5 3c-2.5 0-4.5 2-4.5 4.5 0 .3 0 .6.1.9h-.1c-2.7 0-4.9 2.2-4.9 4.9 0 1.8 1 3.4 2.4 4.3-.1.4-.1.7-.1 1.1 0 2.5 2 4.5 4.5 4.5 1.5 0 2.8-.7 3.6-1.8 1.4.5 3 .2 4.1-.9 1.5-1.5 1.5-4 0-5.5-.7-.7-1.6-1.1-2.5-1.2-.1-1.3-.6-2.5-1.5-3.4-.2-.2-.5-.4-.8-.6.4-.6.7-1.4.7-2.3 0-2.5-2-4.5-4.5-4.5zm0 2c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5zM12 10h.1c.8.4 1.6 1 2.2 1.7.4.5.8 1.1 1 1.7.7.2 1.3.5 1.8 1 .9.9.9 2.4 0 3.3-.9.9-2.4.9-3.3 0-.5-.5-.8-1.1-1-1.8-.6-.2-1.2-.5-1.7-1-.9-.9-1.4-2-1.4-3.2 0-1.5 1.2-2.7 2.7-2.7h.6zm-2 7.5c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8z" />
              </svg>
            </Link>
          </div>

          {/* Navigation Items - Centered */}
          <nav className="flex-1 flex flex-col justify-center space-y-4">
            {navItems.map((item) => {
              const isActive = item.match
                ? item.match(pathname)
                : pathname === item.href;

              return (
                <Link
                  key={item.key}
                  href={item.href as any}
                  className={clsx(
                    "flex items-center justify-center p-3 transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={item.label}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>

          {/* More Menu */}
          <div className="mt-auto">
            <button
              className="flex items-center justify-center p-3 text-muted hover:text-foreground transition-colors"
              title="More"
            >
              <IconMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background">
        <div className="flex items-center justify-around px-2 py-3 max-w-screen-sm mx-auto">
          {navItems.slice(0, 4).map((item) => {
            const isActive = item.match
              ? item.match(pathname)
              : pathname === item.href;

            return (
              <Link
                key={item.key}
                href={item.href as any}
                className={clsx(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon}
              </Link>
            );
          })}
          {/* Profile in mobile */}
          <Link
            href="/profile/mock"
            className={clsx(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-colors",
              pathname.startsWith("/profile")
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            <IconProfile className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      {/* Floating Create Button (Mobile) */}
      <Link
        href="/create"
        className="lg:hidden fixed bottom-20 right-5 z-40 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
        aria-label="Create post"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </>
  );
}
