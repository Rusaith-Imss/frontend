import React, { useState } from "react";

const StockReCheck = () => {
    const [items, setItems] = useState([
        {
            itemId: "101",
            itemName: "Pepsi",
            currentStock: 100,
            physicalQuantity: 100,
            discrepancy: 0,
            remarks: "",
            status: "Saved", // Added status field
        },
        {
            itemId: "102",
            itemName: "Chips",
            currentStock: 200,
            physicalQuantity: 200,
            discrepancy: 0,
            remarks: "",
            status: "Saved", // Added status field
        },
        {
            itemId: "103",
            itemName: "Water",
            currentStock: 50,
            physicalQuantity: 50,
            discrepancy: 0,
            remarks: "",
            status: "Saved", // Added status field
        },
    ]);

    const [showReCheckForm, setShowReCheckForm] = useState(false);
    const [adjustmentDetails, setAdjustmentDetails] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const handlePhysicalQuantityChange = (index, value) => {
        const newItems = [...items];
        newItems[index].physicalQuantity = parseInt(value, 10);
        newItems[index].discrepancy =
            newItems[index].physicalQuantity - newItems[index].currentStock;
        setItems(newItems);
    };

    const handleUpdateStock = (index) => {
        const newItems = [...items];
        if (newItems[index].discrepancy !== 0) {
            const adjustment = {
                itemId: newItems[index].itemId,
                itemName: newItems[index].itemName,
                previousStock: newItems[index].currentStock,
                newStock: newItems[index].physicalQuantity,
                discrepancy: newItems[index].discrepancy,
                remarks: newItems[index].remarks,
            };
            setAdjustmentDetails((prev) => [...prev, adjustment]);
            newItems[index].currentStock = newItems[index].physicalQuantity;
            newItems[index].discrepancy = 0;
            newItems[index].status = "Updated"; // Update status
        }
        setItems(newItems);
    };

    const handleSave = (index) => {
        const newItems = [...items];
        newItems[index].status = "Saved"; // Update status
        setItems(newItems);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
    };

    const handleEdit = (index) => {
        setSelectedItem(items[index]);
        setShowReCheckForm(true);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center font-sans">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full text-center py-4 rounded-lg shadow-lg mb-6">
                <h1 className="text-2xl font-bold">Stock Re-Check</h1>
                <p className="text-sm mt-1">Verify and update stock quantities</p>
            </div>

            {/* Main Table */}
            <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg mb-6">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                S.No
                            </th>
                            <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                Description
                            </th>
                            <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                Status
                            </th>
                            <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {item.itemName} (ID: {item.itemId})
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === "Saved"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    <button
                                        onClick={() => handleViewDetails(item)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Re-Check Form (Edit Form) */}
            {showReCheckForm && selectedItem && (
                <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Edit Stock Details</h2>
                    <table className="w-full border-collapse bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Item ID
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Item Name
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Current Stock
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Physical Quantity
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Discrepancy
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-50 transition duration-200">
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {selectedItem.itemId}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {selectedItem.itemName}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {selectedItem.currentStock}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    <input
                                        type="number"
                                        value={selectedItem.physicalQuantity}
                                        onChange={(e) =>
                                            handlePhysicalQuantityChange(
                                                items.findIndex((item) => item.itemId === selectedItem.itemId),
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    {selectedItem.discrepancy}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                    <input
                                        type="text"
                                        value={selectedItem.remarks}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            const index = items.findIndex((item) => item.itemId === selectedItem.itemId);
                                            newItems[index].remarks = e.target.value;
                                            setItems(newItems);
                                        }}
                                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={() => handleUpdateStock(items.findIndex((item) => item.itemId === selectedItem.itemId))}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update Stock
                        </button>
                        <button
                            onClick={() => handleSave(items.findIndex((item) => item.itemId === selectedItem.itemId))}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setShowReCheckForm(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Adjustment Details Section */}
            {adjustmentDetails.length > 0 && (
                <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Adjustment Details</h2>
                    <table className="w-full border-collapse bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Item ID
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Item Name
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Previous Stock
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    New Stock
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Discrepancy
                                </th>
                                <th className="border-b-2 border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-800">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustmentDetails.map((adjustment, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition duration-200"
                                >
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.itemId}
                                    </td>
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.itemName}
                                    </td>
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.previousStock}
                                    </td>
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.newStock}
                                    </td>
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.discrepancy}
                                    </td>
                                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                        {adjustment.remarks}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={handlePrint}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                        Print Adjustment Details
                    </button>
                </div>
            )}
        </div>
    );
};

export default StockReCheck;