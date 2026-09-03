import test from "node:test";
import assert from "node:assert/strict";
import {
  copyReferenceSchedule,
  createDefaultWeeklySchedule,
  getScheduleDaySummary,
  getTodayScheduleIndex,
  hasCompleteWeeklySchedule,
  setScheduleDayOpen,
  updateScheduleDay,
} from "./weeklySchedule.js";

test("crea una semana independiente y no acepta un arreglo vacío como horario", () => {
  const first = createDefaultWeeklySchedule();
  const second = createDefaultWeeklySchedule();
  first[0].opened = "09:00";
  assert.equal(second[0].opened, "");
  assert.equal(first.length, 7);
  assert.equal(hasCompleteWeeklySchedule([]), false);
  assert.equal(hasCompleteWeeklySchedule(first), true);
});

test("actualiza y cierra un día sin mutar la semana original", () => {
  const schedule = createDefaultWeeklySchedule();
  const updated = updateScheduleDay(schedule, 0, { opened: "09:00", closed: "18:00" });
  const closed = setScheduleDayOpen(updated, 0, false);
  assert.equal(schedule[0].opened, "");
  assert.deepEqual(closed[0], {
    day: "Lunes",
    isClosed: true,
    opened: "",
    closed: "",
  });
});

test("copia el primer horario válido únicamente a días abiertos", () => {
  const schedule = createDefaultWeeklySchedule();
  schedule[0] = { ...schedule[0], opened: "08:00", closed: "16:00" };
  schedule[1] = { ...schedule[1], isClosed: true };
  const copied = copyReferenceSchedule(schedule);
  assert.equal(copied[2].opened, "08:00");
  assert.equal(copied[1].opened, "");
  assert.equal(getScheduleDaySummary(copied[2]), "08:00 – 16:00");
});

test("convierte domingo al último índice de la semana", () => {
  assert.equal(getTodayScheduleIndex(new Date("2026-08-30T12:00:00")), 6);
  assert.equal(getTodayScheduleIndex(new Date("2026-08-31T12:00:00")), 0);
});
