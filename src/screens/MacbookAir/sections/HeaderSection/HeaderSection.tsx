import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";

export const HeaderSection = (): JSX.Element => {
  const navItems = [
    { label: "Home", active: false },
    { label: "Vehicles", active: false },
    { label: "Details", active: true },
    { label: "About Us", active: false },
    { label: "Contact Us", active: false },
  ];

  return (
    <header className="flex items-center gap-2.5 px-16 py-7 w-full bg-transparent">
      <div className="flex items-center">
        <img
          className="relative w-[74.77px] h-[76.85px] -mt-[22.85px] -ml-[20.77px]"
          alt="Rentiva car rental logo"
          src="/wpf-car-rental.svg"
        />

        <div className="flex items-center gap-3">
          <div className="inline-flex items-start gap-3">
            <div className="relative w-fit -mt-[1px] font-['Inter',Helvetica] font-bold text-[#000080] text-[32px] leading-normal">
              Rentiva
            </div>
          </div>
        </div>
      </div>

      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex gap-5">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink
                className={`inline-flex items-center justify-center px-3 py-1 font-['Inter',Helvetica] text-lg ${
                  item.active
                    ? "font-bold text-[#000080]"
                    : "font-medium text-defaultblack"
                }`}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        variant="ghost"
        className="px-3 py-1 font-['Inter',Helvetica] font-extrabold text-[#000080] text-lg"
      >
        Sign up
      </Button>
    </header>
  );
};
