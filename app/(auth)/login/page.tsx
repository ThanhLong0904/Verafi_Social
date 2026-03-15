"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { XChainWalletSelector } from "@shelby-protocol/ui/components/x-chain-wallet-selector";

export default function LoginPage() {
  const { connected, account } = useWallet();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (connected && account && !isLoggingIn) {
        setIsLoggingIn(true);

        try {
          // Call backend to create/get user and set proper session
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: account.address.toString(),
            }),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          if (data.authenticated) {
            router.push("/");
          }
        } catch (error) {
          console.error("Login error:", error);
          setIsLoggingIn(false);
        }
      }
    };

    handleLogin();
  }, [connected, account, router, isLoggingIn]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-3xl font-bold mb-6 tracking-tight">
            Log in or sign up for Verafi
          </h1>

          {/* Subtitle */}
          <p className="text-center text-muted text-[15px] mb-8 leading-relaxed max-w-sm mx-auto">
            See what people are talking about and join the conversation.
          </p>

          {/* Wallet Connect */}
          <div className="flex flex-col gap-3">
            <XChainWalletSelector size="lg" className="w-full" />

            {isLoggingIn && (
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-foreground/20 border-r-foreground"></div>
                <span className="text-sm text-muted">Authenticating...</span>
              </div>
            )}
          </div>

          {/* Additional info */}
          <p className="text-center text-xs text-muted/60 mt-8 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
            <span>© 2026</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Cookies Policy
            </a>
            <a href="#" className="hover:underline">
              Report a problem
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
