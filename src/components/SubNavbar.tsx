import { Menu, Mail, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { useMenus, useSiteSettings } from "../lib/queries";

export default function SubNavbar({ onCategoriesClick }: { onCategoriesClick?: () => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: menus } = useMenus();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  
  const navLinks = menus?.sub_navbar || [
    { name: "Home", url: "/" },
    { name: "Flash Deal", url: "/flash-deal" },
    { name: "All Products", url: "/allproducts" },
    { name: "Seller Shop", url: "/seller-shop" },
    { name: "Compare", url: "/compare" },
    { name: "Blogs", url: "/blogs" },
    { name: "Contact Us", url: "/contact" },
  ];

  const siteEmail = settings?.site_email || "info@kartly.com";
  const isHome = location.pathname === '/';

  return (
    <div className="hidden md:block bg-white border-b border-gray-100 sticky top-[80px] z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          
          {/* Left: All Categories Button with Dropdown */}
          <div 
            className="w-64 flex-shrink-0 relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                   onCategoriesClick?.();
                } else {
                   setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              className="flex items-center justify-between gap-3 px-6 h-12 w-full font-black text-[11px] uppercase tracking-widest transition-all bg-[#0056b3] text-white hover:bg-[#004494] rounded-none relative z-[60]"
            >
              <div className="flex items-center gap-3">
                <Menu className="w-4 h-4" />
                ALL CATEGORIES
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
            </button>

            <CategoryDropdown 
                isOpen={isDropdownOpen} 
                onClose={() => setIsDropdownOpen(false)} 
            />
          </div>

          {/* Center: Page Navigation Bar */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1 px-4 lg:px-8 overflow-x-auto no-scrollbar">
            {navLinks.map((link: any, i: number) => (
              <Link
                key={i}
                to={link.url || link.href}
                className="text-[10px] lg:text-[11px] font-bold text-gray-700 uppercase tracking-wider hover:text-[#0056b3] transition-colors whitespace-nowrap"
              >
                {link.name || link.title || link.label}
              </Link>
            ))}
          </div>

          {/* Right: Email Info */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{siteEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


