"use client";

import { Menu, Search, ShoppingCart, User, LogOut, Settings, LayoutDashboard, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/config/navigation";
import { useCartStore } from "@/store/cartStore";
import { cn, getInitials } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.items.reduce((s, i) => s + i.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-dark/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
            <span className="text-xs font-bold text-white">OC</span>
          </div>
          <span className="hidden sm:block text-base font-heading font-semibold text-white/90 tracking-tight">
            Omni Cartix
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-white bg-white/[0.06]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors duration-150"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors duration-150"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-accent text-dark border-0 font-semibold">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-semibold">
                      {getInitials(session.user?.name || session.user?.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{session.user?.name || "My Account"}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/orders" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {session.user?.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 text-primary">
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="h-8 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.04]">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="h-8 text-[13px] bg-gradient-primary text-white hover:opacity-90 rounded-full px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-white/50 hover:text-white/80">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-dark border-white/[0.06] text-white">
              <div className="flex flex-col gap-0.5 pt-6">
                <Link
                  href="/"
                  className="mb-6 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
                    <span className="text-xs font-bold text-white">OC</span>
                  </div>
                  <span className="text-base font-heading font-semibold text-white/90">Omni Cartix</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 text-[13px] font-medium rounded-md transition-colors duration-150",
                      pathname === link.href
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/[0.06] mt-4 pt-4 flex flex-col gap-2">
                  {session ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full border-white/[0.08] text-white/70 hover:bg-white/[0.04]">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-white/50 hover:text-white/80"
                        onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full border-white/[0.08] text-white/70 hover:bg-white/[0.04]">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-gradient-primary text-white hover:opacity-90 rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
