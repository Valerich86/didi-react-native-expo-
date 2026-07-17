export type NoteType =
  | "Измерение глюкозы"
  | "Приём пищи"
  | "Инъекция инсулина"
  | "Приём таблеток";
export type Portion = "Обычная" | "Меньше обычной" | "Больше обычной";
export type InsulinType = "Короткий" | "Продлённый" | "Ультра короткий";

export type NoteForm = {
  id?: number;
  noteType: NoteType;
  date: string;
  time: string;
  food: string;
  portion: Portion;
  carbs: string;
  bu: string;
  amount: string;
  pills: string;
  insulinType: InsulinType;
  comment: string;
};

export type Note = {
  id: number;
  note_type: NoteType;
  date: string;
  time: string;
  date_tyme: string;
  food: string;
  portion: Portion;
  carbs: number;
  bu: number;
  amount: number;
  pills: string;
  insulin_type: string;
  comment: string;
};

export type NoteErrors = {
  food?: string;
  carbs?: string;
  bu?: string;
  amount?: string;
};
