import {
  useGetAllBusinessQuery,
  useGetMenuQuery,
} from "@Features/business/api/business.api";
import { normalizeBusinesses } from "@Features/business/model/business";
import { normalizeMenuItems } from "@Features/menu/model/menuItem";
import { useCallback, useMemo, useState } from "react";

export const useBusiness = () => {
  const { data: dataBusiness, refetch, ...helperBusinesses } =
    useGetAllBusinessQuery(undefined);
  const [businessId, setBusinessId] = useState(null);
  const { data: dataMenu, ...helperMenu } = useGetMenuQuery(
    { businessId },
    { skip: !businessId },
  );

  const rawBusinesses = dataBusiness?.data || dataBusiness || [];
  const rawMenu = dataMenu?.data || dataMenu || [];
  const normalizedBusinesses = useMemo(
    () => normalizeBusinesses(rawBusinesses),
    [rawBusinesses],
  );
  const menu = useMemo(() => normalizeMenuItems(rawMenu), [rawMenu]);

  const businesses = useMemo(() => normalizedBusinesses.map((business) => {
    if (String(business.id) === String(businessId)) {
      return { ...business, menu };
    }
    return business;
  }), [normalizedBusinesses, businessId, menu]);

  const loadBusinessMenu = useCallback((id) => {
    setBusinessId(id);
  }, []);

  return {
    businesses,
    menu,
    helperBusinesses,
    helperMenu,
    loadBusinessMenu,
    refreshBusinesses: refetch,
  };
};

export default useBusiness;
