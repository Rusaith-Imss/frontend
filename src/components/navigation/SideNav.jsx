import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Package,
  ShoppingCart,
  FileText,
  Settings as SettingsIcon,
  DollarSign,
  BookOpen,
  BarChart2,
  Menu,
  PanelLeftClose,
  Box,
  Users,
  Tag,
  Layers,
  MapPin,
  Search,
  User,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  ClipboardPen,
  ClipboardList,
  BadgeDollarSign,
  ShoppingBasket,
  ClipboardPenLine,
  ClipboardCheck,
  Undo,
  TrendingUp,
  Calendar,
  Barcode,
  FileBarChart,
  Table,
} from "lucide-react";

const SideNav = ({ isPosOpen }) => {
  const location = useLocation();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      path: "/item",
      icon: Package,
      label: "Item",
      subItems: [
        { path: "/items", label: "Items", icon: Box },
        { path: "/suppliers", label: "Suppliers", icon: Users },
        { path: "/categories", label: "Categories", icon: Tag },
        { path: "/units", label: "Units", icon: Layers },
        { path: "/store-locations", label: "Store Locations", icon: MapPin },
        // { path: "/BarcodePage", label: "Barcode", icon: Barcode },
      ],
    },
    {
      path: "/sales",
      icon: ShoppingBag,
      label: "Sales",
      subItems: [
        { path: "/sales", label: "Sales", icon: BadgeDollarSign },
        { path: "/SalesInvoice", label: "Sales Invoice", icon: ClipboardPen },
        { path: "/quotation", label: "Quotations", icon: FileText },
        { path: "/SalesReturn", label: "Sales Return", icon: RefreshCcw },
        { path: "/Customers", label: "Customers", icon: User },
      ],
    },
    {
      path: "/purchasing",
      icon: ShoppingCart,
      label: "Purchasing",
      subItems: [
        { path: "/purchasing", label: "Purchasing", icon: ShoppingBasket },
        { path: "/PurchasingInvoice", label: "Purchasing Invoice", icon: ClipboardPenLine },
        { path: "/PurchaseOrder", label: "Purchase Order", icon: FileText },
        { path: "/PurchaseReturn", label: "Purchase Return", icon: RotateCcw },
      ],
    },
    { path: "/outstanding", icon: DollarSign, label: "Outstanding" },
    { path: "/ledger", icon: BookOpen, label: "Ledger" },
    {
      path: "/profit",
      icon: FileText,
      label: "Profit",
      subItems: [
        { path: "/DailyProfit", label: "Daily Profit" },
        { path: "/BillWiseProfit", label: "Bill Wise Profit" },
      ],
    },
    {
      path: "/report",
      icon: BarChart2,
      label: "Reports",
      subItems: [
        { path: "/StockReport", label: "Stock Reports" },
        { path: "/ItemWiseStockReport", label: "Item Wise Report" },
        { path: "/StockRecheck", label: "Stock Re-Check" },
      ],
    },
    {
      path: "/UserManagement",
      icon: FileText,
      label: "User Management",
      subItems: [
        { path: "/AdminAccess", label: "Admin Panel" },
        { path: "/UserForm", label: "User Create" },
        { path: "/UserList", label: "Users" },
      ],
    },
    { path: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  // Persist collapsed state in localStorage
  useEffect(() => {
    const storedState = localStorage.getItem("isNavVisible");
    if (storedState !== null) setIsNavVisible(JSON.parse(storedState));
  }, []);

  const toggleNav = () => {
    setIsNavVisible((prev) => {
      localStorage.setItem("isNavVisible", !prev);
      return !prev;
    });
  };

  // Expand menus based on active route
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subItems?.some((subItem) => location.pathname.startsWith(subItem.path))) {
        setOpenMenus((prev) => ({ ...prev, [item.path]: true }));
      }
    });
  }, [location.pathname]);

  // Handle menu toggle
  const toggleMenu = (menuPath) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = navItems.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subItems?.some((subItem) =>
          subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(navItems);
    }
  }, [searchTerm]);

  const itemsToRender = searchTerm ? filteredItems : navItems;

  if (isPosOpen) {
    return null; // Return nothing if POS is open (hide sidebar)
  }

  return (
    <div className="flex ">
      <aside
        className={`sticky ml-2 top-0 h-screen overflow-y-auto dark:bg-gray-800 transition-all duration-300 
          ${isNavVisible ? "w-64" : "w-20"

          }`}
      >
        <nav className="h-100 mt-20 flex flex-col">
          {/* Search Bar */}
          <div className="p-1 mt-4 border-b dark:border-gray-700 flex items-center">
            <button
              onClick={toggleNav}
              className=" p-2  text-slate-800 bg-gray-200 dark:bg-slate-600 rounded-full hover:bg-amber-600 dark:hover:bg-amber-600"
              title={isNavVisible ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isNavVisible ? <PanelLeftClose size={25} /> : <Menu size={25} />}
            </button> {isNavVisible && (
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 rounded-lg border border-amber-600 dark:border-amber-600 dark:bg-gray-700 dark:text-white"
                />
                <Search
                  size={16}
                  className="absolute right-3 top-3 text-gray-400 dark:text-gray-500"
                />
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            {itemsToRender.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              const isMenuOpen = openMenus[item.path] || false;

              return (
                <div key={item.path}>
                  <Link
                    to={item.subItems ? "#" : item.path}
                    onClick={() => item.subItems && toggleMenu(item.path)}
                    className={`hover:bg-amber-600 dark:hover:bg-slate-600 flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-100 ${isActive
                      ? " hover:text-slate-900 text-blue-700  dark:text-amber-600"
                      : "text-gray-700 hover:text-slate-900 dark:text-gray-400 dark:hover:text-cyan-500"
                      }`}
                  >
                    <Icon size={20} />
                    {isNavVisible && <span className="ml-3">{item.label}</span>}
                    {item.subItems && isNavVisible && (
                      <span className="ml-auto">
                        {isMenuOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    )}
                  </Link>
                  {isMenuOpen &&
                    isNavVisible &&
                    item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center ml-8 p-2 rounded-lg transition-colors duration-200 ${location.pathname === subItem.path
                          ? "bg-amber-500 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                          : "text-gray-700 hover:bg-amber-500 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                      >
                        {subItem.icon && <subItem.icon size={16} />}
                        <span className="ml-3">{subItem.label}</span>
                      </Link>
                    ))}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default SideNav;
