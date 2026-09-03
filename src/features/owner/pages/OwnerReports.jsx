/* eslint-disable react/prop-types */
import { useState } from "react";
import { Alert, Box, CircularProgress, FormControl, MenuItem, Select, Stack, Tab, Tabs, Typography } from "@mui/material";
import { CancelPresentationRounded, GroupsRounded, Inventory2Rounded, PaymentsRounded, ReceiptLongRounded, RepeatRounded, ShoppingBagRounded, TrendingUpRounded } from "@mui/icons-material";
import { useGetBusinessStatsQuery } from "@Features/stats/api/stats.api";
import { KpiCard } from "@Features/stats/components/ReportPrimitives";
import FinancialOverview from "@Features/stats/components/FinancialOverview";
import ProductInsights from "@Features/stats/components/ProductInsights";
import OperationalInsights from "@Features/stats/components/OperationalInsights";
import { integer, money } from "@Features/stats/model/statsPresentation";

const periods = [{ value: 7, label: "Últimos 7 días" }, { value: 15, label: "Últimos 15 días" }, { value: 30, label: "Últimos 30 días" }, { value: 90, label: "Últimos 90 días" }];

export default function OwnerReports({ businessId }) {
  const [period, setPeriod] = useState(30);
  const [section, setSection] = useState("finance");
  const { data: response, isLoading, isFetching, error } = useGetBusinessStatsQuery({ businessId, period }, { skip: !businessId, pollingInterval: 60000 });
  if (!businessId || isLoading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 340 }}><CircularProgress size={30}/></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || error?.message || "Error al cargar las métricas"}</Alert>;
  const stats = response?.data || response;
  if (!stats) return <Alert severity="info">Todavía no hay datos disponibles para este negocio.</Alert>;
  const { summary = {}, salesByDay = [], productPerformance = [], slowMovers = [], categoryPerformance = [], paymentMix = [], orderTypeMix = [], peakHours = [], ordersByStatus = [], operations = {}, accountingNote } = stats;

  return <Box sx={{ pb: 3, opacity: isFetching ? .78 : 1, transition: "opacity .2s" }}>
    <Box sx={{ color: "white", bgcolor: "#25272b", backgroundImage: "radial-gradient(circle at 86% 0%, rgba(49,94,251,.3), transparent 34%), linear-gradient(135deg,#222428,#303338)", borderRadius: "10px", p: { xs: 2.2, sm: 3 }, boxShadow: "0 24px 55px rgba(26,28,31,.16)" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} sx={{ mb: 3 }}><Box><Stack direction="row" alignItems="center" gap={.8}><TrendingUpRounded sx={{ color: "#A78BFA", fontSize: 20 }}/><Typography variant="overline" sx={{ color: "rgba(255,255,255,.62)", letterSpacing: ".14em" }}>Inteligencia del negocio</Typography></Stack><Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-.04em" }}>Rendimiento</Typography><Typography variant="body2" sx={{ color: "rgba(255,255,255,.67)", mt: .6 }}>Finanzas, clientes, productos y operación comparados con el periodo anterior.</Typography></Box><FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}><Select value={period} onChange={(event) => setPeriod(event.target.value)} sx={{ color: "white", bgcolor: "rgba(255,255,255,.08)", borderRadius: "10px", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,.15)" }, ".MuiSvgIcon-root": { color: "white" } }}>{periods.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</Select></FormControl></Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", md: "repeat(4,minmax(0,1fr))" }, gap: 1.2 }}>
        <KpiCard label="Ventas brutas" value={money(summary.totalRevenue)} delta={summary.revenueGrowth} icon={<PaymentsRounded fontSize="small"/>}/>
        <KpiCard label="Ticket promedio" value={money(summary.averageTicket)} delta={summary.averageTicketGrowth} icon={<ReceiptLongRounded fontSize="small"/>}/>
        <KpiCard label="Órdenes" value={integer(summary.totalOrders)} delta={summary.ordersGrowth} icon={<ShoppingBagRounded fontSize="small"/>} helper={`${summary.completedOrders || 0} completadas`}/>
        <KpiCard label="Artículos vendidos" value={integer(summary.itemsSold)} delta={summary.itemsGrowth} icon={<Inventory2Rounded fontSize="small"/>}/>
        <KpiCard label="Clientes únicos" value={integer(summary.uniqueCustomers)} delta={summary.customerGrowth} icon={<GroupsRounded fontSize="small"/>}/>
        <KpiCard label="Clientes recurrentes" value={`${summary.repeatCustomerRate || 0}%`} icon={<RepeatRounded fontSize="small"/>} helper={`${summary.returningCustomers || 0} regresaron`}/>
        <KpiCard label="Cancelación" value={`${summary.cancellationRate || 0}%`} delta={Number(summary.cancellationRate || 0) - Number(summary.previousCancellationRate || 0)} inverse icon={<CancelPresentationRounded fontSize="small"/>}/>
        <KpiCard label="Valor cancelado" value={money(summary.potentialCancelledRevenue)} icon={<CancelPresentationRounded fontSize="small"/>} helper="Venta potencial, no ingreso"/>
      </Box>
    </Box>

    <Alert severity="info" variant="outlined" sx={{ mt: 2, borderRadius: "10px" }}>{accountingNote}</Alert>
    <Tabs value={section} onChange={(_event, value) => setSection(value)} variant="scrollable" scrollButtons="auto" sx={{ my: 2, minHeight: 42 }}><Tab value="finance" label="Finanzas y clientes"/><Tab value="products" label="Productos"/><Tab value="operations" label="Operación"/></Tabs>
    {section === "finance" && <FinancialOverview salesByDay={salesByDay} paymentMix={paymentMix} orderTypeMix={orderTypeMix} categoryPerformance={categoryPerformance}/>}
    {section === "products" && <ProductInsights products={productPerformance} slowMovers={slowMovers}/>}
    {section === "operations" && <OperationalInsights operations={operations} peakHours={peakHours} ordersByStatus={ordersByStatus} summary={summary}/>}
  </Box>;
}
