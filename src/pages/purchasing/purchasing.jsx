import React, { useState, useEffect } from "react";
import axios from "axios";
import notification from "../../components/notification/Notification";
import ItemForm from "../../components/Item Form/ItemForm";

const PurchasingEntryForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    dateOfPurchase: new Date().toISOString().split("T")[0],
    billNumber: "GRN-00001",
    invoiceNumber: "",
    paymentMethod: "Cash",
    dueDate: "",
    selectedSupplier: "",
    selectedStore: "",
    selectedItemId: "",
    quantity: "",
    freeItems: "",
    buyingCost: "",
    sellingPrice: "",
    mrp: "",
    minimumPrice: "",
    discount: "",
    tax: "",
    expiryDate: "",
  });

  // State for fetched data
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, storesRes, itemsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/suppliers"),
          axios.get("http://127.0.0.1:8000/api/store-locations"),
          axios.get("http://127.0.0.1:8000/api/products"),
        ]);
        setSuppliers(suppliersRes.data);
        setStores(storesRes.data);
        setItems(itemsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { product_name, value } = e.target;
    setFormData({ ...formData, [product_name]: value });
  };

  // Handle search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add item to the purchased items table
  const addItemToTable = () => {
    const selectedItem = items.find(
      (item) => item.id === formData.selectedItemId
    );
    if (selectedItem) {
      const totalQuantity =
        parseInt(formData.quantity) + parseInt(formData.freeItems);
      const totalPrice =
        totalQuantity * formData.buyingCost - formData.discount - formData.discountAmount + formData.tax;
      setPurchasedItems([
        ...purchasedItems,
        {
          ...selectedItem,
          quantity: totalQuantity,
          buyingCost: formData.buyingCost,
          sellingPrice: formData.sellingPrice,
          mrp: formData.mrp,
          minimumPrice: formData.minimumPrice,
          discountPercentage: formData.discountPercentage,
          discountAmount: formData.discountAmount,
          tax: formData.tax,
          expiryDate: formData.expiryDate,
          totalPrice,
        },
      ]);
      resetItemFields();
    } else {
      setNotification("Please select a valid item.");
    }
  };

  // Reset item selection fields
  const resetItemFields = () => {
    setFormData({
      ...formData,
      selectedItemId: "",
      quantity: "",
      freeItems: "",
      buyingCost: "",
      sellingPrice: "",
      mrp: "",
      minimumPrice: "",
      discountPercentage: "",
      discountAmount: "",
      tax: "",
      expiryDate: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm(
      "Are you sure you want to save this entry?"
    );
    if (confirmation) {
      if (
        !formData.dateOfPurchase ||
        !formData.invoiceNumber ||
        !formData.selectedSupplier ||
        !formData.selectedStore
      ) {
        setNotification("Please fill in all required fields.");
        return;
      }

      const purchaseEntry = {
        ...formData,
        purchasedItems,
      };

      try {
        await axios.post("/api/purchases", purchaseEntry);
        setNotification("Purchase entry recorded successfully!");
        setPurchasedItems([]);
        setFormData({
          dateOfPurchase: new Date().toISOString().split("T")[0],
          billNumber: `GRN-${String(
            parseInt(formData.billNumber.split("-")[1]) + 1
          ).padStart(5, "0")}`,
          invoiceNumber: "",
          paymentMethod: "Cash",
          dueDate: "",
          selectedSupplier: "",
          selectedStore: "",
          selectedItemId: "",
          quantity: "",
          freeItems: "",
          buyingCost: "",
          sellingPrice: "",
          mrp: "",
          minimumPrice: "",
          discountAmount: "",
          discountPercentage: "",
          tax: "",
          expiryDate: "",
        });
      } catch (error) {
        setNotification("Error recording purchase entry: " + error.message);
      }
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = purchasedItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    const totalDiscount = purchasedItems.reduce(
      (acc, item) => acc + (item.discount ? item.discount : 0),
      0
    );
    const totalTax = purchasedItems.reduce(
      (acc, item) => acc + (item.tax ? item.tax : 0),
      0
    );
    const grandTotal = subtotal - totalDiscount + totalTax;
    return { subtotal, totalDiscount, totalTax, grandTotal };
  };

  const { subtotal, totalDiscount, totalTax, grandTotal } = calculateTotals();

  // Open modal for editing an item
  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Update item in the purchased items table
  const updateItem = (updatedItem) => {
    const updatedItems = purchasedItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setPurchasedItems(updatedItems);
    closeModal();
  };
  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const nextElement = document.querySelector(`[name="${nextField}"]`);
      if (nextElement) {
        nextElement.focus();// Focus on the next input field
      }
    }
  };

  // Open Item Form Modal
  const openItemForm = () => {
    setIsItemFormOpen(true);
  };

  // Close Item Form Modal
  const closeItemForm = () => {
    setIsItemFormOpen(false);
  };


  return (
    <div className="p-4 rounded-xl bg-transparent">
      {notification && (
        <div className="p-2 mb-4 bg-green-00 rounded">{notification}</div>
      )}

      {/* Header Section */}
      <div className="grid bg-transparent text-center text-slate-900 p-8 grid-cols-6 gap-4 mb-6 rounded-lg border border-slate-400">
        {/* Purchase Date */}
        <input
          type="date"
          name="dateOfPurchase"
          value={formData.dateOfPurchase}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "invoiceNumber")}
          className="p-2 bg-emerald-700 text-white border rounded w-full"
          required
        />

        {/* Bill Number (Read-Only) */}
        <input
          type="text"
          name="billNumber"
          value={formData.billNumber}
          readOnly
          className="p-2 border rounded bg-amber-500 text-center text-slate-700 w-full"
        />

        {/* Invoice Number */}
        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "paymentMethod")}
          className="p-2 text-center bg-cyan-800 text-white border rounded w-full"
          required
        />

        {/* Payment Method */}
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "selectedSupplier")}
          className="p-2 border rounded w-full bg-white"
        >
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
          <option value="Other">Other</option>
        </select>

        {/* Supplier Selection */}
        <select
          name="selectedSupplier"
          value={formData.selectedSupplier}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "selectedStore")}
          className="p-2 border rounded w-full bg-white"
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.supplier_name}
            </option>
          ))}
        </select>

        {/* Store Selection */}
        <select
          name="selectedStore"
          value={formData.selectedStore}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "selectedItemId")}
          className="p-2 border rounded w-full bg-white"
          required
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>

      {/* Item Selection Section */}
      <div className="grid grid-cols-6 gap-4 mb-6  text-slate-900">

        <select
          name="selectedItemId"
          value={formData.selectedItemId}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "quantity")}
          className="p-2 border roundedx text-slate-900 w-full"
          required
        >
          <option value="">Select Item</option>
          {filteredItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.product_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "freeItems")}
          placeholder="Quantity"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="freeItems"
          value={formData.freeItems}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "discountPercentage")}
          placeholder="Free Items"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "discountAmount")}
          placeholder="Discount %"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="discountAmount"
          value={formData.discountAmount}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "tax")}
          placeholder="Discount Amount"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="tax"
          value={formData.tax}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, "addItem")}
          placeholder="Tax"
          className="p-2 border rounded"
        />

      </div>

      {/* Buttons Section */}
      <div className="grid grid-cols-6 p-2  gap-4 mb-6 ml-0">
        <button
          type="button"
          name="addItem"
          onClick={addItemToTable}
          className="p-2 bg-green-700 rounded"
        >
          Add Item
        </button>

        <button
          type="button"
          name="AddNewItem"
          onClick={openItemForm}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add New Item
        </button>
        <button
          type="button"
          onClick={resetItemFields}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      {/* Purchased Items Table */}
      <div className="mb-6">
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white border border-gray-300 rounded-md">
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Cost</th>
              <th className="p-2 border">Discount</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchasedItems.map((item, index) => (
              <tr key={index} className="border border-collapse">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.product_name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{item.buyingCost}</td>
                <td className="p-2 border">{item.discount}</td>
                <td className="p-2 border">{item.tax}</td>
                <td className="p-2 border">{item.totalPrice}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setPurchasedItems(
                        purchasedItems.filter((_, i) => i !== index)
                      )
                    }
                    className="p-1 bg-red-500 text-white rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">Summary</h3>
          <p>Subtotal: {subtotal.toFixed(2)}</p>
          <p>Total Discount: {totalDiscount.toFixed(2)}</p>
          <p>Total Tax: {totalTax.toFixed(2)}</p>
          <p className="font-bold">Grand Total: {grandTotal.toFixed(2)}</p>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="p-2 bg-green-500 text-white rounded"
        >
          Save Entry
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Edit Item</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateItem(editingItem);
              }}
            >
              <div className="space-y-4">
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      quantity: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                  placeholder="Quantity"
                />
                <input
                  type="number"
                  value={editingItem.buyingCost}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      buyingCost: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                  placeholder="Buying Cost"
                />
                <input
                  type="number"
                  value={editingItem.discount}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      discount: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                  placeholder="Discount"
                />
                <input
                  type="number"
                  value={editingItem.tax}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      tax: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                  placeholder="Tax"
                />
                <input
                  type="date"
                  value={editingItem.expiryDate}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      expiryDate: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                  placeholder="Expiry Date"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 bg-gray-500 text-white rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Form Modal */}
      {isItemFormOpen && (
        <div className="fixed inset-0 mt-24 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Add New Item</h3>
            <ItemForm onClose={closeItemForm} /> {/* Item Form Component */}
            <button
              className="mt-4 p-2 bg-red-500 text-white rounded w-full"
              onClick={closeItemForm}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasingEntryForm;