const STORAGE_KEY = "qscome_user";

export const sessionStorage = {
  save(userData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Error saving user data:", error);
      return false;
    }
  },

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
  },
};

export { STORAGE_KEY };
