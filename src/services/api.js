// Simulating API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const ITEMS_KEY = 'pos_items';
const SALES_KEY = 'pos_sales';

// Helper functions
const getStorageItems = (key) => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

const setStorageItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Items API
export const itemsApi = {
  async getItems() {
    await delay(500);
    return getStorageItems(ITEMS_KEY);
  },

  async addItem(item) {
    await delay(500);
    const items = getStorageItems(ITEMS_KEY);
    const newItem = { ...item, id: Date.now().toString() };
    setStorageItems(ITEMS_KEY, [...items, newItem]);
    return newItem;
  },

  async updateItem(id, item) {
    await delay(500);
    const items = getStorageItems(ITEMS_KEY);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');

    const updatedItem = { ...items[index], ...item };
    items[index] = updatedItem;
    setStorageItems(ITEMS_KEY, items);
    return updatedItem;
  },

  async deleteItem(id) {
    await delay(500);
    const items = getStorageItems(ITEMS_KEY);
    setStorageItems(ITEMS_KEY, items.filter(item => item.id !== id));
  }
};

// Sales API
export const salesApi = {
  async getSales() {
    await delay(500);
    return getStorageItems(SALES_KEY);
  },

  async addSale(sale) {
    await delay(500);
    const sales = getStorageItems(SALES_KEY);
    const newSale = { ...sale, id: Date.now().toString() };
    setStorageItems(SALES_KEY, [...sales, newSale]);
    return newSale;
  }
};

// Profit API
export const profitApi = {
  async getDailyProfit() {
    await delay(500);
    // Simulate fetching daily profit data
    return [
      { date: "2025-01-20", totalSales: 50000.0, totalCost: 35000.0, profit: 15000.0 },
      { date: "2025-01-21", totalSales: 60000.0, totalCost: 40000.0, profit: 20000.0 },
      { date: "2025-01-22", totalSales: 55000.0, totalCost: 37000.0, profit: 18000.0 },
    ];
  },

  async getBillWiseProfit() {
    await delay(500);
    // Simulate fetching bill-wise profit data
    return [
      { billNo: "500", date: "31-12-2024", profitLoss: 411.25, profitPercent: "56.05%" },
      { billNo: "895", date: "31-12-2024", profitLoss: 120.0, profitPercent: "11.11%" },
    ];
  }
};
