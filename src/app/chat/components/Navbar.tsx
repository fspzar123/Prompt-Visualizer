'use client';

import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const getInitials = () => {
    if (!user) return 'US';
    const name = user.fullName || user.username || 'User';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4
      bg-gradient-to-r from-slate-800 via-blue-900 to-blue-600
      border-b border-slate-700/50 shadow-lg z-50">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 font-bold text-xl text-blue-400 tracking-wide">
        <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-md">🤖</span>
        <span className="font-extrabold text-black-200 drop-shadow">Prompt Visualizer</span>
      </Link>

      {/* User Profile Dropdown */}
      <div className="flex items-center gap-4">
        {isSignedIn && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center px-3 py-2 bg-zinc-900/60 hover:bg-zinc-800 border border-blue-500 shadow-md rounded-full transition"
            >
              {/* Circle with Initials */}
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-blue-300 font-bold text-lg border-2 border-blue-300 shadow-inner">
                {getInitials()}
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-60 rounded-xl bg-gradient-to-bl from-zinc-900 via-zinc-800 to-blue-400/20 border border-slate-700 shadow-2xl z-50 overflow-hidden text-sm">
                
                {/* Email Display */}
                <div className="px-4 py-3 border-b border-blue-400 text-blue-200 font-medium bg-zinc-900/50">
                  {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                </div>

                <Link
                  href="/user-profile"
                  className="block px-4 py-3 text-blue-100 hover:bg-blue-500/20 transition"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  href="/pricing"
                  className="block px-4 py-3 text-blue-200 font-semibold hover:bg-blue-400/10 hover:text-blue-300 transition"
                  onClick={() => setOpen(false)}
                >
                  Upgrade Plan 🚀
                </Link>

                <Link
                  href="/help"
                  className="block px-4 py-3 text-blue-100 hover:bg-blue-500/20 transition"
                  onClick={() => setOpen(false)}
                >
                  Help & Support
                </Link>

                <SignOutButton>
                  <button
                    className="w-full text-left px-4 py-3 text-blue-300 hover:bg-blue-500/20 transition"
                    onClick={() => setOpen(false)}
                  >
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
