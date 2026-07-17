import { type SQLiteDatabase } from "expo-sqlite";
import { Note, NoteErrors, NoteForm } from "../lib/types";
import { getFormattedDate } from "../lib/utils";

export async function postNewNote(data: NoteForm, db: SQLiteDatabase) {
  let errors: NoteErrors = {};
  const numBu = Number(data.bu);
  const numCarbs = Number(data.carbs);
  const numAmount = Number(data.amount);
  const dateTime = data.date + "T" + data.time;
  if (
    ["Измерение глюкозы", "Инъекция инсулина", "Приём таблеток"].includes(
      data.noteType,
    )
  ) {
    if (Number.isNaN(numAmount) || numAmount === 0) {
      errors["amount"] = "Введите корректное значение";
    }
  } else {
    if (Number.isNaN(numCarbs) || Number.isNaN(numBu)) {
      errors["bu"] = "Введите корректное значение";
    }
    if (data.food.trim().length === 0) {
      errors["food"] = "Напишите, что было съедено";
    }
  }
  if (Object.keys(errors).length > 0) return { success: false, errors: errors };
  try {
    const result = await db.runAsync(
      `INSERT INTO notes 
    (note_type, date, time, date_time, food, portion, carbs, bu, amount, insulin_type, pills, comment) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.noteType,
        data.date,
        data.time,
        dateTime,
        data.food.trim(),
        data.portion,
        numCarbs,
        numBu,
        numAmount,
        data.insulinType,
        data.pills,
        data.comment.trim(),
      ],
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
    return { success: false };
  }
}

export async function updateNote(data: NoteForm, db: SQLiteDatabase) {
  let errors: NoteErrors = {};
  const numBu = Number(data.bu);
  const numCarbs = Number(data.carbs);
  const numAmount = Number(data.amount);
  const dateTime = data.date + "T" + data.time;
  if (
    ["Измерение глюкозы", "Инъекция инсулина", "Приём таблеток"].includes(
      data.noteType,
    )
  ) {
    if (Number.isNaN(numAmount) || numAmount === 0) {
      errors["amount"] = "Введите корректное значение";
    }
  } else {
    if (Number.isNaN(numCarbs) || Number.isNaN(numBu)) {
      errors["bu"] = "Введите корректное значение";
    }
    if (data.food.trim().length === 0) {
      errors["food"] = "Напишите, что было съедено";
    }
  }
  if (Object.keys(errors).length > 0) return { success: false, errors: errors };
  try {
    const result = await db.runAsync(
      `UPDATE notes SET 
      note_type=?, date=?, time=?, date_time=?, food=?, portion=?, 
      carbs=?, bu=?, amount=?, insulin_type=?, pills=?, comment=? 
      WHERE id=?`,
      [
        data.noteType,
        data.date,
        data.time,
        dateTime,
        data.food.trim(),
        data.portion,
        numCarbs,
        numBu,
        numAmount,
        data.insulinType,
        data.pills,
        data.comment.trim(),
        data.id!,
      ],
    );
    return { success: true };
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
    return { success: false };
  }
}

export async function getNotes(
  db: SQLiteDatabase,
  startDate: string = getFormattedDate(),
  endDate: string = getFormattedDate(),
  noteType: string = "Все",
) {
  let query = "SELECT * FROM notes WHERE date = ?";
  let params = [startDate];
  if (startDate !== endDate) {
    query = "SELECT * FROM notes WHERE date >= ? AND date <= ?";
    params.push(endDate);
  }
  if (noteType !== "Все") {
    query += " AND note_type = ?";
    params.push(noteType);
  }
  query += " ORDER BY date DESC, time DESC";
  try {
    const notes = await db.getAllAsync<Note>(query, params);
    return { success: true, data: notes };
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
    return { success: false };
  }
}

export async function getOneNote(db: SQLiteDatabase, id: number) {
  try {
    const note = await db.getFirstAsync<Note>(
      "SELECT * FROM notes WHERE id = ?",
      [id],
    );
    return { success: true, data: note };
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
    return { success: false };
  }
}

export async function deleteNote(db: SQLiteDatabase, id: number) {
  try {
    await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
    return { success: false };
  }
}
