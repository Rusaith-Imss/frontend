import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Items from './pages/items/Items.jsx';
import PurchasingEntryForm from './pages/purchasing/purchasing.jsx';
import SettingsForm from './pages/settings.jsx';
import Sales from './pages/sales/sales.jsx';
import StockReportForm from './pages/Report/StockReport.jsx';
import UnitForm from './components/Unit/UnitForm.jsx';
import SupplierForm from './components/supplier/SupplierForm.jsx';
import CategoryForm from './components/category/CategoryForm.jsx';
import POSForm from './components/pos/POSForm.jsx';
import Suppliers from './pages/items/Suppliers.jsx';
import Units from './pages/items/Units.jsx';
import Categories from './pages/items/Categories.jsx';
import StoreLocations from './pages/items/StoreLocations.jsx';
import Notification from './components/notification/Notification.jsx';
import ItemWiseReport from './pages/Report/ItemWiseStockReport.jsx';
import DailyProfitReport from './pages/Profit/DailyProfit.jsx';
import BillWiseProfitReport from './pages/Profit/BillWiseProfit.jsx';
import ReportTable from './components/reports/ReportTable.jsx';
import Calculator from './components/models/calculator/CalculatorModal.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './login/login.jsx';
import BillPrintModal from './components/models/BillPrintModel.jsx';
import { formatNumberWithCommas } from './utils/numberformat.jsx';
import CustomerManagement from './pages/sales/Customers.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { useAuth } from './context/AuthContext'; // Import useAuth hook
import StockRecheck from './pages/Report/StockRecheck.jsx';
import AdminAccess from './pages/UserManagement/AdminAccess.jsx';
import UserForm from './pages/UserManagement/UserForm.jsx';
import UserList from './pages/UserManagement/UserList.jsx';
// import Product from './components/barcode/Product.jsx';
// import BarcodePrinter from './pages/items/BarcodePage.jsx';
// ProtectedRoute Component to protect routes based on authentication
export function ProtectedRoute({ children, roles }) {
  const { user } = useAuth(); // Access the user from context

  if (!user) {
    return <Navigate to="/login" />; // If no user, redirect to login
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect if user doesn't have required role
  }

  return children; // If authenticated and authorized, render children
}

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('isDarkMode') === 'true' // Retrieve theme preference
  );

  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', isDarkMode); // Save theme preference
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 3000); // Hide notification after 3 seconds
  };

  return (
    <div className="h-full text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-300">
      <AuthProvider> {/* Wrap the app with AuthProvider */}
        <Router>
          <Layout isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle}>
            {notification.visible && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() =>
                  setNotification({ ...notification, visible: false })
                }
              />
            )}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/purchasing" element={<PurchasingEntryForm />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/settings" element={<SettingsForm />} />
              <Route path="/pos" element={<POSForm />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/units" element={<Units />} />
              <Route path="/UnitForm" element={<UnitForm />} />
              <Route path="/SupplierForm" element={<SupplierForm />} />
              <Route path="/CategoryForm" element={<CategoryForm />} />
              <Route path="/store-locations" element={<StoreLocations />} />
              <Route path="/StockReport" element={<StockReportForm />} />
              <Route path="/ItemWiseStockReport" element={<ItemWiseReport />} />
              <Route path="/DailyProfit" element={<DailyProfitReport />} />
              <Route path="/BillWiseProfit" element={<BillWiseProfitReport />} />
              <Route path="/ReportTable" element={<ReportTable />} />
              <Route path="/StockRecheck" element={<StockRecheck />} />
              <Route path="/CalculatorModal" element={<Calculator />} />
              <Route path="/billPrintModel" element={<BillPrintModal />} />
              <Route path="/numberformat" element={<formatNumberWithCommas />} />
              <Route path="/Customers" element={<CustomerManagement />} />
              <Route path="/AdminAccess" element={<AdminAccess />} />
              <Route path="/UserForm" element={<UserForm />} />
              <Route path="/UserList" element={<UserList />} />
              {/* <Route path="/BarcodePage" element={<BarcodePrinter />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;