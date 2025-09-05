import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isAdmin, openLoginModal } = useAdmin();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/ebooks", label: "eBooks" },
    { href: "/tutorials", label: "Tutoriales" },
    { href: "/real-time", label: "Tiempo Real" },
    { href: "/ai-strategies", label: "Estrategias IA" },
  ];

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium ${
            location === link.href ? "text-primary" : ""
          }`}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">Aprendiendo Trading</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavItems />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={openLoginModal}
                className="admin-hidden text-muted-foreground hover:text-foreground"
                data-testid="button-admin-login"
              >
                Admin
              </Button>
            )}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-admin-panel">
                  Panel Admin
                </Button>
              </Link>
            )}
            <Button size="sm" className="trading-glow" data-testid="button-start-free-nav">
              Comenzar Gratis
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                  <div className="border-t border-border pt-4 space-y-2">
                    {!isAdmin && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          openLoginModal();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start admin-hidden"
                        data-testid="button-admin-mobile"
                      >
                        Admin
                      </Button>
                    )}
                    {isAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          Panel Admin
                        </Button>
                      </Link>
                    )}
                    <Button className="w-full trading-glow" onClick={() => setIsOpen(false)}>
                      Comenzar Gratis
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
