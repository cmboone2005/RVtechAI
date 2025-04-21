import { Link } from "wouter";
import { Home, Wrench, Book, Package, History } from "lucide-react";

interface BottomNavigationProps {
  currentRoute: string;
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home
    },
    {
      path: "/diagnose",
      label: "Diagnose",
      icon: Wrench
    },
    {
      path: "/repair-guides",
      label: "Guides",
      icon: Book
    },
    {
      path: "/parts",
      label: "Parts",
      icon: Package
    },
    {
      path: "/service-history",
      label: "History",
      icon: History
    }
  ];
  
  return (
    <div className="bg-white border-t py-2 px-4 grid grid-cols-5 gap-1">
      {navItems.map((item) => {
        const isActive = currentRoute === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <a className="flex flex-col items-center py-1">
              <item.icon
                className={`h-5 w-5 mb-1 ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary font-medium" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}