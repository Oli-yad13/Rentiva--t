import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export const Header = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        setRole(profile?.role || null);
      } else {
        setRole(null);
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => setRole(profile?.role || null));
      } else {
        setRole(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Vehicles", path: "/vehicles" },
    { label: "Add Car", path: "/add-car" },
    { label: "My Cars", path: "/my-cars" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    // Special case for Details - active when on any vehicle details page
    if (path === "/vehicle/1" && location.pathname.startsWith("/vehicle/")) return true;
    return false;
  };

  return (
    <header className="flex items-center gap-2.5 px-4 sm:px-8 lg:px-16 py-4 sm:py-7 w-full bg-white sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            className="w-10 h-10 sm:w-12 sm:h-12"
            alt="Rentiva car rental logo"
            src="/car-logo.svg"
          />
          <div className="inline-flex items-start gap-3">
            <div className="relative w-fit -mt-[1px] font-inter font-bold text-[#000080] text-2xl sm:text-3xl lg:text-[32px] leading-normal">
              Rentiva
            </div>
          </div>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:block flex-1">
        <NavigationMenuList className="flex gap-3 lg:gap-5 justify-center">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.path}
                  className={`inline-flex items-center justify-center px-2 lg:px-3 py-1 font-inter text-sm lg:text-lg transition-colors hover:text-[#000080] ${
                    isActive(item.path)
                      ? "font-bold text-[#000080]"
                      : "font-medium text-black"
                  }`}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          {role === 'admin' && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/admin"
                  className={`inline-flex items-center justify-center px-2 lg:px-3 py-1 font-inter text-sm lg:text-lg transition-colors hover:text-[#000080] ${
                    isActive("/admin")
                      ? "font-bold text-[#000080]"
                      : "font-medium text-black"
                  }`}
                >
                  Admin Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex-1 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex gap-2 sm:gap-3 ml-auto">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile menu placeholder */}
            <Link to="/profile" className="font-medium text-[#000080] hover:underline text-sm sm:text-base">
              Profile
            </Link>
            <Button onClick={handleSignOut} className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 sm:px-4 py-1 rounded-lg font-medium text-sm sm:text-base">
              Sign out
            </Button>
          </div>
        ) : (
          <>
        <Button asChild variant="ghost" className="px-2 sm:px-3 py-1 font-inter font-medium text-gray-600 text-sm sm:text-lg hover:text-[#000080]">
          <Link to="/login">
            <span className="hidden sm:inline">Sign in</span>
            <span className="sm:hidden">In</span>
          </Link>
        </Button>
        <Button asChild className="px-2 sm:px-4 py-1 font-inter font-semibold text-white text-sm sm:text-lg bg-[#000080] hover:bg-[#000060] rounded-lg">
          <Link to="/signup">
            <span className="hidden sm:inline">Sign up</span>
            <span className="sm:hidden">Up</span>
          </Link>
        </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-inter text-base transition-colors hover:bg-gray-100 hover:text-[#000080] ${
                  isActive(item.path)
                    ? "font-bold text-[#000080] bg-blue-50"
                    : "font-medium text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-inter text-base transition-colors hover:bg-gray-100 hover:text-[#000080] ${
                  isActive("/admin")
                    ? "font-bold text-[#000080] bg-blue-50"
                    : "font-medium text-black"
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};