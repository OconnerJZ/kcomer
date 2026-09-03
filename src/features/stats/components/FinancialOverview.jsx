/* eslint-disable react/prop-types */
import { Box, Stack } from "@mui/material";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyReport, MixRow, ReportPanel } from "./ReportPrimitives";
import { money, orderTypeLabel, paymentLabel } from "../model/statsPresentation";

export default function FinancialOverview({ salesByDay, paymentMix, orderTypeMix, categoryPerformance }) {
  return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,2fr) minmax(280px,1fr)" }, gap: 2 }}>
    <ReportPanel title="Pulso de ventas" subtitle="Ventas brutas y ticket promedio de órdenes completadas">
      {!salesByDay.length ? <EmptyReport /> : <Box sx={{ height: { xs: 250, sm: 310 } }}><ResponsiveContainer><AreaChart data={salesByDay} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="financeRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#315efb" stopOpacity={.25}/><stop offset="95%" stopColor="#315efb" stopOpacity={.01}/></linearGradient></defs><CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#edf0f3"/><XAxis dataKey="label" axisLine={false} tickLine={false} minTickGap={25} tick={{ fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }}/><Tooltip formatter={(value, name) => [money(value), name]}/><Area type="monotone" dataKey="revenue" name="Ventas" stroke="#315efb" strokeWidth={2.7} fill="url(#financeRevenue)"/><Area type="monotone" dataKey="averageTicket" name="Ticket promedio" stroke="#3c4148" strokeWidth={1.8} fill="transparent"/></AreaChart></ResponsiveContainer></Box>}
    </ReportPanel>
    <Stack gap={2}>
      <ReportPanel title="Métodos de pago" subtitle="Participación sobre ventas completadas" sx={{ flex: 1 }}>{paymentMix.length ? <Stack gap={1.7}>{paymentMix.map((item) => <MixRow key={item.method} label={paymentLabel(item.method)} value={money(item.revenue)} share={item.share} helper={`${item.orders} órdenes · ${item.share}%`} />)}</Stack> : <EmptyReport />}</ReportPanel>
      <ReportPanel title="Canal de entrega" subtitle="Cómo reciben sus órdenes" sx={{ flex: 1 }}>{orderTypeMix.length ? <Stack gap={1.7}>{orderTypeMix.map((item) => <MixRow key={item.type} label={orderTypeLabel(item.type)} value={`${item.orders} órdenes`} share={item.share} helper={money(item.revenue)} />)}</Stack> : <EmptyReport />}</ReportPanel>
    </Stack>
    <ReportPanel title="Rendimiento por categoría" subtitle="Aporte de cada familia al ingreso" sx={{ gridColumn: { lg: "1 / -1" } }}>{categoryPerformance.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2 }}>{categoryPerformance.map((item) => <MixRow key={item.category} label={item.category} value={money(item.revenue)} share={item.revenueShare} helper={`${item.quantity} artículos · ${item.revenueShare}%`} />)}</Box> : <EmptyReport />}</ReportPanel>
  </Box>;
}
