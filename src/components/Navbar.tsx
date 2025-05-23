"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import AuthButton from "@/components/AuthButton";
import { supabase } from "@/lib/supabaseClient";
import { isAdmin } from "@/lib/isAdmin";

const navLinks = [
  { name: "메인", href: "/" },
  { name: "일기", href: "/diary" },
  { name: "프로젝트", href: "/project" },
  { name: "About", href: "/about" },
  { name: "목록(이웃)", href: "/list" },
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // localStorage에 사용자 설정이 있으면 우선 적용, 없으면 라이트
    const theme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (theme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }

    supabase.auth.getUser().then(async ({ data }) => {
      const email = data.user?.email;
      if (email && (await isAdmin(email))) {
        setIsAdminUser(true);
      } else {
        setIsAdminUser(false);
      }
    });
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex flex-wrap items-center justify-between px-2 sm:px-8 bg-white/90 dark:bg-[#18181b]/90 border-b border-gray-200 dark:border-gray-700 backdrop-blur z-50 font-pretendard shadow-[0_2px_16px_0_rgba(49,130,246,0.04)]">
      <div className="flex gap-2 sm:gap-6 items-center overflow-x-auto scrollbar-hide max-w-full">
        <span className="font-bold text-lg sm:text-xl tracking-tight select-none text-[#222] dark:text-white whitespace-nowrap">
          포트폴리오
        </span>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full font-semibold transition-all hover:bg-[#3182f6]/10 dark:hover:bg-[#3182f6]/20 focus:outline-none focus:ring-2 focus:ring-[#3182f6] text-[#222] dark:text-white shadow-sm whitespace-nowrap"
            style={{ boxShadow: "0 1px 4px 0 rgba(49,130,246,0.04)" }}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/comments"
          className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full font-semibold transition-all hover:bg-[#3182f6]/10 dark:hover:bg-[#3182f6]/20 focus:outline-none focus:ring-2 focus:ring-[#3182f6] text-[#222] dark:text-white shadow-sm whitespace-nowrap"
          style={{ boxShadow: "0 1px 4px 0 rgba(49,130,246,0.04)" }}
        >
          댓글
        </Link>
        {isAdminUser && (
          <Link
            href="/admin"
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full font-semibold transition-all bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[#3182f6] shadow-sm whitespace-nowrap"
            style={{ boxShadow: "0 1px 4px 0 rgba(49,130,246,0.08)" }}
          >
            어드민
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 ml-2 sm:ml-4">
        {isMounted && (
          <button
            onClick={toggleDark}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-[#f4f6fa] dark:bg-[#232a36] text-lg sm:text-xl hover:bg-[#3182f6]/10 dark:hover:bg-[#3182f6]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#3182f6] shadow"
            aria-label="다크모드 토글"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        )}
        <div className="ml-1 sm:ml-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
