import {
  useGetAllBusinessQuery,
  useGetMenuQuery,
} from "@Features/business/api/business.api";
import { useCallback, useMemo, useState } from "react";

export const useBusiness = () => {
  const { data: dataBusiness, refetch, ...helperBusinesses } =
    useGetAllBusinessQuery(undefined);
  const [businessId, setBusinessId] = useState(null);
  const { data: dataMenu, ...helperMenu } = useGetMenuQuery(
    { businessId },
    { skip: !businessId },
  );

  const rawBusinesses = dataBusiness || [];
  const menu = dataMenu || [];

  const businesses = useMemo(() => {
    return rawBusinesses.map((business) => {
      if (business.id === businessId && menu.length > 0) {
        return { ...business, menu };
      }
      return business;
    });
  }, [rawBusinesses, businessId, menu]);

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
