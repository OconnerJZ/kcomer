import { useMemo, useState } from "react";
import {
  filterOwnerMenu,
  getAvailableMenuCount,
  getMenuCategories,
} from "@Features/owner/model/ownerMenu";

export const useMenuCatalogFilters = (menu = []) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => getMenuCategories(menu), [menu]);
  const filteredMenu = useMemo(
    () => filterOwnerMenu(menu, search, category),
    [category, menu, search],
  );
  const availableCount = useMemo(() => getAvailableMenuCount(menu), [menu]);

  return {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filteredMenu,
    availableCount,
  };
};

export default useMenuCatalogFilters;
