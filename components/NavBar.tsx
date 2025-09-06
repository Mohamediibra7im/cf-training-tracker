"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import { Menu } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const links = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/statistics", label: "Statistics" },
  { href: "/upsolve", label: "Upsolve" },
  { href: "/help", label: "Help" },
];

const adminLinks = [
  { href: "/admin/notifications", label: "Admin" },
];

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const allLinks = user?.role === "admin" ? [...links, ...adminLinks] : links;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="flex h-14 sm:h-16 w-full px-3 sm:px-4 md:px-6 items-center justify-between">
        {/* Left side - Navigation */}
        <div className="flex items-center">
          <div className="mr-2 sm:mr-4 md:mr-6 lg:mr-8">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <Image
                src="/favicon.ico"
                alt="Training-Tracker"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
              <span className="hidden xs:block font-bold text-xs sm:text-sm md:text-base lg:text-lg">CF-Training Tracker</span>
              <span className="block xs:hidden font-bold text-s">CF-Training Tracker</span>
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-4 xl:space-x-6 2xl:space-x-8">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 hover:text-primary text-sm lg:text-base ${pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side - User Profile & Controls */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {/* User Profile */}
          <ClientOnly>
            {user && (
              <a
                href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 md:gap-3 hover:bg-muted/50 rounded-lg px-2 md:px-3 py-1.5 md:py-2 transition-colors duration-200"
              >
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 border-2 border-primary/30">
                  <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
                  <AvatarFallback className="text-xs sm:text-sm bg-muted">
                    {user.codeforcesHandle.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-foreground text-sm lg:text-base">
                  {user.codeforcesHandle}
                </span>
              </a>
            )}
          </ClientOnly>

          {/* Notifications */}
          <ClientOnly>
            {user && <NotificationCenter />}
          </ClientOnly>

          {/* Theme Toggle */}
          <ClientOnly>
            <ModeToggle />
          </ClientOnly>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>
                    <div onClick={() => setIsMenuOpen(false)}>
                      <Link href="/" className="flex items-center space-x-2">
                        <Image
                          src="/favicon.ico"
                          alt="Training-Tracker"
                          width={32}
                          height={32}
                          className="w-8 h-8 sm:w-10 sm:h-10"
                        />
                        <span className="font-bold text-lg sm:text-xl">
                          CF-Training Tracker
                        </span>
                      </Link>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-3 sm:gap-4 py-4">
                  {allLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg sm:text-xl transition-all duration-300 hover:text-primary ${pathname === link.href
                        ? "text-primary font-semibold"
                        : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                {/* Mobile User Profile */}
                {user && (
                  <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <a
                      href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors duration-200"
                    >
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-primary/20">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.codeforcesHandle}
                        />
                        <AvatarFallback>
                          {user.codeforcesHandle.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-base sm:text-lg">
                          {user.codeforcesHandle}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {user.rating} ({user.rank || "Unrated"})
                        </p>
                      </div>
                    </a>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
