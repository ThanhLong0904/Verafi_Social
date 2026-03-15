"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { clearWalletSessionCookie } from "@/lib/session-client";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const { account, disconnect } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get real wallet address
  const fullAddress = account?.address?.toString() || "";
  const walletAddress = fullAddress
    ? `${fullAddress.slice(0, 6)}...${fullAddress.slice(-4)}`
    : "Not connected";

  const handleCopyAddress = async () => {
    if (!fullAddress) return;

    try {
      await navigator.clipboard.writeText(fullAddress);
      toast.success("Address copied to clipboard");
      setShowWalletMenu(false);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy address");
    }
  };

  const handleDisconnect = async () => {
    try {
      setShowWalletMenu(false);

      // Call logout API to clear server session
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear client session cookie
      clearWalletSessionCookie();

      // Disconnect wallet
      if (disconnect) {
        await disconnect();
      }

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowWalletMenu(false);
      }
    }

    if (showWalletMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showWalletMenu]);

  return (
    <div className="max-w-[631px] mx-auto sticky top-0 z-30 border-b border-border/40 bg-[#101010]">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left spacer for balance */}
        <div className="w-24"></div>

        {/* Center - For you button */}
        <button className="flex items-center gap-2 text-foreground font-semibold text-[15px] hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
          For you
          <svg
            className="w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Right - Wallet address with dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowWalletMenu(!showWalletMenu)}
            className="flex items-center gap-2 bg-white/5 border border-border/30 text-foreground text-[13px] font-mono px-3 py-1.5 rounded-full hover:bg-white/10 hover:border-border/50 transition-all"
          >
            {/* Connected indicator */}
            {fullAddress && (
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            )}
            <svg
              className="w-3.5 h-3.5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            <span className="tracking-tight">{walletAddress}</span>
          </button>

          {/* Dropdown menu */}
          {showWalletMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border/40 rounded-xl shadow-xl overflow-hidden">
              {/* Full address display */}
              <div className="px-4 py-3 bg-white/5 border-b border-border/20">
                <p className="text-[11px] text-muted font-medium mb-1">
                  WALLET ADDRESS
                </p>
                <p className="text-[12px] font-mono text-foreground break-all leading-relaxed">
                  {fullAddress}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={handleCopyAddress}
                className="w-full px-4 py-3 text-left text-[14px] text-foreground hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy address</span>
              </button>
              <div className="h-px bg-border/20"></div>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-3 text-left text-[14px] text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Disconnect wallet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
