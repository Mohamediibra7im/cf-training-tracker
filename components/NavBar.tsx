"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";
import { Menu } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
const links = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/statistics", label: "Statistics" },
  { href: "/upsolve", label: "Upsolve" },
];

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="flex h-16 w-full px-6 items-center justify-between">
        {/* Left side - Navigation */}
        <div className="flex items-center">
          <div className="mr-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/favicon.ico" alt="Training-Tracker" width={32} height={32} />
              <span className="block font-bold text-lg">Training Tracker</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 hover:text-primary ${pathname === link.href
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
        <div className="flex items-center gap-4">
          {/* User Profile */}
          <ClientOnly>
            {user && (
              <a
                href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-3 hover:bg-muted/50 rounded-lg px-3 py-2 transition-colors duration-200"
              >
                <Avatar className="w-9 h-9 border-2 border-primary/30">
                  <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
                  <AvatarFallback className="text-sm bg-muted">
                    {user.codeforcesHandle.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {user.codeforcesHandle}
                </span>
              </a>
            )}
          </ClientOnly>

          {/* Theme Toggle */}
          <ClientOnly>
            <ModeToggle />
          </ClientOnly>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <div onClick={() => setIsMenuOpen(false)}>
                      <Link href="/" className="flex items-center space-x-2">
                        <Image
                          src="/favicon.ico"
                          alt="Training-Tracker"
                          width={32}
                          height={32}
                          className="w-10 h-10 md:w-12 md:h-12"
                        />
                        <span className="font-bold text-xl">Training Tracker</span>
                      </Link>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-xl transition-all duration-300 hover:text-primary ${pathname === link.href
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
                  <div className="border-t pt-4 mt-4">
                    <a
                      href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors duration-200"
                    >
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.codeforcesHandle}
                        />
                        <AvatarFallback>
                          {user.codeforcesHandle.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">
                          {user.codeforcesHandle}
                        </p>
                        <p className="text-muted-foreground">
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
