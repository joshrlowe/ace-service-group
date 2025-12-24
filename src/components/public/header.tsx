"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  businessName: string;
  phone: string;
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header({ businessName, phone }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const phoneLink = `tel:${phone.replace(/[^\d+]/g, "")}`;

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header
        className={`bg-[#121212]/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-0"
        }`}
      >
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="flex items-center group transition-transform hover:scale-105 duration-200"
              >
                <span className="text-xl font-bold bg-gradient-to-r from-white via-[#E0E0E0] to-white bg-clip-text text-transparent tracking-wide">
                  {businessName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 text-base font-medium transition-all duration-200 group"
                  >
                    <span
                      className={`relative z-10 ${
                        isActive
                          ? "text-[#B71C1C] font-semibold"
                          : "text-[#E0E0E0] group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#B71C1C] rounded-full" />
                    )}
                    {/* Hover underline */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#B71C1C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <Button asChild className="relative overflow-hidden group">
                <a href={phoneLink} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-[#E0E0E0] hover:bg-gray-800 min-h-[44px] min-w-[44px]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="space-y-1 pb-4 pt-2">
                  {navigation.map((item, index) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex px-3 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] items-center ${
                            isActive
                              ? "text-[#B71C1C] font-semibold bg-[#B71C1C]/10 border-l-2 border-[#B71C1C]"
                              : "text-[#E0E0E0] hover:bg-gray-800 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navigation.length * 0.05 }}
                    className="px-3 pt-4"
                  >
                    <Button asChild className="w-full">
                      <a
                        href={phoneLink}
                        className="flex items-center justify-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
