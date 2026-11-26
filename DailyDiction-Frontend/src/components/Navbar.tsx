"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Flame,
  Newspaper,
  Star,
  Cpu,
  Tv2,
  Sparkles,
  Info,
  Wallet,
  ChevronDown,
  Gamepad2,
} from "lucide-react";

type NavSubItem = {
  name: string;
  href: string;
  icon: typeof Flame;
};

type NavLinkItem = {
  name: string;
  href?: string;
  icon: typeof Flame;
  external?: boolean;
  children?: NavSubItem[];
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  const navLinks: NavLinkItem[] = [
    { name: "HOME", href: "/", icon: Flame },
    {
      name: "NEWS",
      icon: Newspaper,
      children: [
        { name: "GAME", href: "/game", icon: Gamepad2 },
        { name: "TECHNOLOGY", href: "/technology", icon: Cpu },
        { name: "ENTERTAINMENT", href: "/entertainment", icon: Tv2 },
      ],
    },
    { name: "REVIEW", href: "/review", icon: Star },
    { name: "HOLIDAY RUSH", href: "/holiday-rush", icon: Sparkles },
    { name: "TOPUP", href: "https://topup.dailydiction.id/", icon: Wallet, external: true, },
    { name: "ABOUT", href: "/about", icon: Info },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("user_data");
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Keluar Akun?",
      text: "Anda perlu login lagi untuk akses komentar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#1F2430",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      background: "#141721",
      color: "#FFFFFF",
      iconColor: "#FFD700",
      customClass: {
        popup: "rounded-2xl border border-white/10 shadow-2xl font-mono",
        title: "text-lg font-bold uppercase tracking-wider text-white",
        confirmButton:
          "rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase text-black",
        cancelButton:
          "rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase border border-white/10 text-gray-300 hover:text-white",
      },
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        await fetch(`${apiUrl}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.error("Gagal logout backend:", err);
      }
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);

    await Swal.fire({
      title: "Berhasil Keluar",
      text: "Sesi Anda telah diakhiri.",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      background: "#141721",
      color: "#FFFFFF",
      iconColor: "#FFD700",
      customClass: {
        popup: "rounded-2xl border border-white/10 font-mono text-xs",
      },
    });

    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono text-lg sm:text-xl font-black tracking-wider text-text-primary group"
        >
          <img
            src="/image/logo-dd.png"
            alt="Daily Diction Logo"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex items-center gap-1">
            DAILY<span className="text-[#FFD700]">DICTION</span>
            <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
          </div>
        </Link>

        {/* Desktop Navigation Links (Hanya aktif di resolusi layar laptop/desktop xl ke atas) */}
        <nav
          ref={navRef}
          className="hidden xl:flex items-center gap-4 2xl:gap-5 text-xs lg:text-sm font-medium text-text-muted"
        >
          {navLinks.map((link) => {
            if (link.children) {
              const isChildActive = link.children.some(
                (child) => pathname === child.href
              );
              const isDropdownOpen = openDropdown === link.name;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(isDropdownOpen ? null : link.name)
                    }
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    className={`transition-colors hover:text-[#FFD700] flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      isChildActive || isDropdownOpen
                        ? "font-bold text-[#FFD700]"
                        : ""
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        role="menu"
                        className="absolute left-0 top-full pt-2.5 z-50"
                      >
                        <div className="w-52 rounded-xl border border-dark-border bg-dark-card/98 backdrop-blur-xl p-1.5 shadow-2xl space-y-0.5">
                          {link.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isSubActive = pathname === child.href;
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                  isSubActive
                                    ? "bg-[#FFD700]/15 text-[#FFD700] font-bold"
                                    : "text-text-muted hover:bg-dark-bg hover:text-[#FFD700]"
                                }`}
                              >
                                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const href = link.href || "/";
            const isActive = !link.external && pathname === href;
            const linkClassName = `transition-colors hover:text-[#FFD700] flex items-center gap-1.5 whitespace-nowrap ${
              isActive ? "font-bold text-[#FFD700]" : ""
            }`;

            return link.external ? (
              <a
                key={link.name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                <span>{link.name}</span>
              </a>
            ) : (
              <Link key={link.name} href={href} className={linkClassName}>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Bar (Search & User Status) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Form: Muncul mulai ukuran tablet (sm:) */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center bg-dark-bg border border-dark-border rounded-full px-3.5 py-1.5 focus-within:border-[#FFD700] transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-text-muted mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Cari berita atau game..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-muted w-28 md:w-36 xl:w-44 focus:w-48 transition-all duration-300"
            />
          </form>

          {/* User Desktop Status (Hanya tampil di xl: ke atas agar tidak menumpuk di iPad/HP) */}
          <div className="hidden xl:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#FFD700] font-bold max-w-[140px] truncate" title={user.name}>
                  Halo, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-muted hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-dark-border bg-dark-card px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-text-primary hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Hamburger Menu Button (Tampil di layar Mobile & Tablet / iPad, disembunyikan di xl:) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border bg-dark-card text-text-primary xl:hidden hover:border-[#FFD700] transition-colors"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-[#FFD700]" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Drawer Navigation Menu (Mobile & iPad / Tablet) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-dark-border bg-dark-card/98 backdrop-blur-xl xl:hidden"
          >
            <div className="space-y-3 px-4 pt-3 pb-6 font-mono text-sm">
              {/* Profil Card User di Dalam Drawer Mobile / Tablet */}
              {user ? (
                <div className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-bg/80 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted">MASUK SEBAGAI</span>
                      <span className="font-bold text-white text-xs">{user.name}</span>
                    </div>
                  </div>
                  <span className="rounded bg-[#FFD700]/15 border border-[#FFD700]/30 px-2 py-0.5 text-[10px] font-bold text-[#FFD700]">
                    AKTIF
                  </span>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#FFD700]/40 bg-[#FFD700]/10 py-2.5 font-bold text-xs uppercase text-[#FFD700]"
                >
                  <User className="h-4 w-4" />
                  <span>Masuk ke Akun</span>
                </Link>
              )}

              {/* Mobile Search Form (Khusus layar HP, disembunyikan di tablet jika sudah ada di atas) */}
              <form
                onSubmit={handleSearch}
                className="flex sm:hidden items-center bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 focus-within:border-[#FFD700] transition-colors"
              >
                <Search className="h-4 w-4 text-text-muted mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari berita atau game..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-muted w-full"
                />
              </form>

              {/* Menu Links */}
              <div className="space-y-1.5 pt-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;

                  if (link.children) {
                    const isChildActive = link.children.some(
                      (child) => pathname === child.href
                    );
                    const isSubOpen = mobileOpenMenu === link.name;

                    return (
                      <div key={link.name} className="space-y-1">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileOpenMenu(isSubOpen ? null : link.name)
                          }
                          aria-expanded={isSubOpen}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-bold transition-all text-xs sm:text-sm ${
                            isChildActive
                              ? "bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700]"
                              : "text-text-muted hover:bg-dark-bg hover:text-[#FFD700]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span>{link.name}</span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isSubOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isSubOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden pl-4 space-y-1"
                            >
                              {link.children.map((child) => {
                                const ChildIcon = child.icon;
                                const isSubActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setMobileOpenMenu(null);
                                    }}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-bold transition-all text-xs sm:text-sm ${
                                      isSubActive
                                        ? "bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700]"
                                        : "text-text-muted hover:bg-dark-bg hover:text-[#FFD700]"
                                    }`}
                                  >
                                    <ChildIcon className="h-4 w-4" />
                                    <span>{child.name}</span>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const href = link.href || "/";
                  const isActive = !link.external && pathname === href;
                  const itemClassName = `flex items-center justify-between rounded-xl px-4 py-3 font-bold transition-all text-xs sm:text-sm ${isActive
                      ? "bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700]"
                      : "text-text-muted hover:bg-dark-bg hover:text-[#FFD700]"
                    }`;
                  const content = (
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </div>
                  );

                  return link.external ? (
                    <a
                      key={link.name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={itemClassName}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={itemClassName}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {/* Tombol Logout di Drawer */}
              {user && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/30 py-3 font-bold uppercase text-xs text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>KELUAR AKUN</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}