import React, { useState } from "react";
import { Bell, Settings, User, Sun, Moon, Calculator } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "./LOGO-01.png";
import SideNav from "./SideNav";
import RegisterModal from "../models/registerModel";

const TopNav = ({ isDarkMode, onThemeToggle, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cashOnHand, setCashOnHand] = useState("");
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);

  const pageHeadings = {
    "/dashboard": "Dashboard",
    "/items": "Items",
    "/Customers": "Customers",
    "/sales": "Sales",
    "/purchasing": "Purchasing",
    "/outstanding": "Outstanding",
    "/ledger": "Ledger",
    "/day-book": "Day Book",
    "/profit": "Profit",
    "/settings": "Settings",
    "/pos": "POS",
    "/suppliers": "Suppliers",
    "/store-locations": "Store Locations",
    "/units": "Units",
    "/categories": "Categories",
    "/sales-invoice": "Sales Invoice",
    "/StockReport": "Stock Report",
    "/ItemWiseReport": "Item-wise Report",
    "/DailyProfit": "Daily Profit Report",
    "/BillWiseProfit": "Bill-wise Profit Report",
    "/AdminAccess": "Admin Panal",
    "/UserManagement": "User Management",
    "/UserForm": "User Form",
    "/UserList": "User List",
    "/StockRecheck": "Stock Recheck"

  };

  const heading = pageHeadings[location.pathname] || "Page";

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleConfirm = () => {
  //   console.log("Cash on hand:", cashOnHand);
  //   setIsModalOpen(false);
  //   navigate("/pos");
  // };
  const handleOpenModal = () => {
    navigate("/pos");
  };

  return (
    <>
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div>}

      <div className="fixed top-0 right-0 z-50 flex items-center justify-between w-full h-24 px-6">
        <img src={logo} alt="Logo" className="w-28 h-auto" />

        <div className="flex items-center gap-4 mr-64">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{heading}</h1>
        </div>

        <div className="flex items-center gap-4 mr-10">
          <button
            onClick={handleOpenModal}
            className="flex items-center px-4 py-2 text-white transition-all bg-blue-500 rounded-lg shadow hover:bg-blue-600"
          >
            <span className="hidden md:inline">POS</span>
            <Calculator className="w-5 h-5 ml-2" />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <div className="flex items-center gap-2 pl-4 border-l dark:border-gray-700">
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-700">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-200" />
            </div>
            <div className="hidden text-sm md:block">
              <p className="font-medium text-gray-700 dark:text-gray-200">{user?.name || "Admin"}</p>
              <p className="text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* <RegisterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        cashOnHand={cashOnHand}
        setCashOnHand={setCashOnHand}
        user={user}
      /> */}
    </>
  );
};

export default TopNav;
