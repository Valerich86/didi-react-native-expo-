import { type SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 2;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  try {
    const row = await db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    // const tables = await db.getAllAsync<{ name: string; sql: string }>(
    //   "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    // );
    // console.log("Tables:", tables);

    let currentDbVersion = row?.user_version ?? 0;
    if (currentDbVersion >= DATABASE_VERSION) return;
    await db.execAsync("PRAGMA journal_mode = 'wal'");

    // await db.execAsync("ALTER TABLE notes ADD COLUMN insulin_type TEXT");
    // await db.execAsync("ALTER TABLE notes ADD COLUMN pills TEXT");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note_type TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        date_time TEXT NOT NULL,
        food TEXT,
        portion TEXT,
        carbs INTEGER,
        bu INTEGER,
        amount REAL,
        insulin_type TEXT,
        pills TEXT,
        comment TEXT
      );`);

    currentDbVersion = DATABASE_VERSION;
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    console.log("Миграция выполнена. Текущая версия БД:", currentDbVersion);
  } catch (error) {
    console.error("Перехвачена ошибка:", error);
  }
}
