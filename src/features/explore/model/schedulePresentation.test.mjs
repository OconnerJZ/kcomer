import assert from "node:assert/strict";
import test from "node:test";
import {
  createScheduleDialogPresentation,
  createScheduleRows,
  isScheduleClosed,
  normalizeScheduleDay,
  resolveScheduleMediaUrl,
} from "./schedulePresentation.js";

test("normaliza días con acentos y reconoce formatos legacy", () => {
  assert.equal(normalizeScheduleDay("  MIÉRCOLES "), "miercoles");
  assert.equal(isScheduleClosed({ open: "09:00", close: "18:00" }), false);
  assert.equal(isScheduleClosed({ opened: "", closed: "" }), true);
  assert.equal(isScheduleClosed({ opened: "09:00", closed: "18:00", is_closed: true }), true);
});

test("marca el día actual y conserva ambas variantes de horas", () => {
  const rows = createScheduleRows([
    { day: "Domingo", open: "09:00", close: "14:00" },
    { day: "Lunes", opened: "10:00", closed: "18:00" },
  ], new Date("2026-08-31T12:00:00"));
  assert.equal(rows[1].isToday, true);
  assert.equal(rows[1].opened, "10:00");
  assert.equal(rows[1].closedAt, "18:00");
});

test("construye el resumen del negocio y las rutas multimedia", () => {
  const presentation = createScheduleDialogPresentation({
    name: "Las Parotas",
    open: true,
    logo: "logos/parotas.png",
    coverImage: "https://cdn.example.com/cover.jpg",
    schedules: [{ day: "Lunes", opened: "09:00", closed: "17:00" }],
  }, "https://api.example.com/media/", new Date("2026-08-31T12:00:00"));

  assert.equal(presentation.businessInitial, "L");
  assert.equal(presentation.isOpenNow, true);
  assert.equal(presentation.todayHours, "Hoy · 09:00 – 17:00");
  assert.equal(presentation.logoUrl, "https://api.example.com/media/logos/parotas.png");
  assert.equal(presentation.coverUrl, "https://cdn.example.com/cover.jpg");
  assert.equal(resolveScheduleMediaUrl("", "https://api.example.com"), "");
});
