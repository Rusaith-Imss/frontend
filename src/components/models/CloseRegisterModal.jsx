import React from "react";
import logo from "./LOGO-01.png"; // Import your logo

const CloseRegisterModal = ({
    isOpen,
    onClose,
    closingDetails,
    onConfirmClose,
    user,
}) => {
    const closingTime = new Date().toLocaleString(); // Current time when the register is closed

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                {/* Company Logo */}
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="w-32 h-auto" />
                </div>

                {/* Cashier Name */}
                <div className="mb-2">
                    <h2 className="text-xl font-semibold">Cashier: {user?.name || "N/A"}</h2>
                </div>

                {/* Closing Time */}
                <div className="mb-2">
                    <p className="text-sm text-gray-500">Closing Time: {closingTime}</p>
                </div>

                {/* Sales and Cash Details */}
                <div className="mb-2">
                    <p><strong>Total Sales Qty:</strong> {closingDetails.totalSalesQty}</p>
                    <p><strong>Sales Amount:</strong> ${closingDetails.salesAmount}</p>
                    <p><strong>Cash on Hand (Starting):</strong> ${closingDetails.cashOnHand}</p>
                    <p><strong>In Cashier Amount:</strong> ${closingDetails.inCashierAmount}</p>
                    <p><strong>Other Amount:</strong> ${closingDetails.otherAmount}</p>
                </div>

                {/* Close Register Action */}
                <div className="flex justify-between mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400"
                        onClick={onClose} // Close the modal
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                        onClick={onConfirmClose} // Confirm and close register
                    >
                        Confirm Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseRegisterModal;
