import CustomButton from "@/src/components/UI/custom-button";
import { CustomDatePicker } from "@/src/components/UI/custom-datepicker";
import { CustomSelect } from "@/src/components/UI/custom-select";
import { CustomTimePicker } from "@/src/components/UI/custom-timepicker";
import Heading from "@/src/components/UI/heading";
import { getOneNote, updateNote } from "@/src/db/data";
import {
  INSULIN_TYPES,
  NOTE_TYPES,
  PILLS,
  PORTION_TYPES,
} from "@/src/lib/constants";
import type {
  InsulinType,
  NoteErrors,
  NoteForm,
  NoteType,
  Portion,
} from "@/src/lib/types";
import { getFormattedDate, getFormattedTime } from "@/src/lib/utils";
import { globalStyles } from "@/src/styles/globals";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function UpdateNote() {
  const db = useSQLiteContext();
  const router = useRouter();
  const dateNow = getFormattedDate();
  const timeNow = getFormattedTime();
  const [errors, setErrors] = useState<NoteErrors | null>(null);
  const numbersError = `Введите только числа и ".", если нужно дробное значение`;
  const [form, setForm] = useState<NoteForm>({
    noteType: NOTE_TYPES[0] as NoteType,
    date: dateNow,
    time: timeNow,
    food: "",
    portion: PORTION_TYPES[0] as Portion,
    carbs: "",
    bu: "",
    amount: "",
    pills: PILLS[0],
    insulinType: INSULIN_TYPES[0] as InsulinType,
    comment: "",
  });
  const { id, location } = useLocalSearchParams();
  if (!id || !location) router.back();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOneNote(db, Number(id));
      if (response.success && response.data) {
        const note = response.data;
        setForm({
          id: Number(id),
          noteType: note?.note_type,
          date: note.date,
          time: note.time,
          food: note.food,
          portion: note.portion,
          carbs: note.carbs.toString(),
          bu: note.bu.toString(),
          amount: note.amount.toString(),
          pills: note.pills,
          insulinType: note.insulin_type as InsulinType,
          comment: note.comment,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (NOTE_TYPES.includes("Все")) {
      NOTE_TYPES.splice(0, 1);
    }
  }, []);

  useEffect(() => {
    setErrors(null);
  }, [form.noteType]);

  const isValid = (value: string): boolean => {
    setErrors(null);
    const regex = /^(?:\d+(?:\.\d*)?)?$/;
    if (!regex.test(value)) return false;
    return true;
  };

  const onSetTime = (hours: string, minutes: string) => {
    setForm({ ...form, time: hours + ":" + minutes });
  };

  const onSetDate = (date: string) => setForm({ ...form, date: date });

  const handleSubmit = async () => {
    setErrors(null);
    const response = await updateNote(form, db);
    if (!response.success) {
      if (response.errors) setErrors(response.errors);
    } else {
      router.replace(location === "home" ? "/(tabs)/home" : "/(tabs)/stats");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <ScrollView
        contentContainerStyle={[globalStyles.screen, { paddingTop: 50 }]}
      >
        <Heading text="Редактирование" />
        <View style={globalStyles.form}>
          <View style={styles.rowContainer}>
            <CustomDatePicker currentDate={form.date} onSetDate={onSetDate} />
            <CustomTimePicker selectedTime={form.time} onSetTime={onSetTime} />
          </View>
          <CustomSelect
            label="Тип записи"
            value={form.noteType}
            onSelect={(v) => setForm({ ...form, noteType: v })}
            items={NOTE_TYPES}
          />
          {form.noteType === "Измерение глюкозы" && (
            <View style={{ width: "100%" }}>
              <Text style={globalStyles.label}>
                Значение глюкометра, ммоль/л
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0.0"
                value={form.amount.toString()}
                onChangeText={(v) => {
                  if (isValid(v)) setForm({ ...form, amount: v });
                  else setErrors({ ...errors, amount: numbersError });
                }}
                style={globalStyles.input}
              />
              {errors && errors.amount && (
                <Text style={globalStyles.error}>{errors.amount}</Text>
              )}
            </View>
          )}
          {form.noteType === "Инъекция инсулина" && (
            <>
              <CustomSelect
                items={INSULIN_TYPES}
                label="Тип инсулина"
                value={form.insulinType}
                onSelect={(v) => setForm({ ...form, insulinType: v })}
              />
              <View style={{ width: "100%" }}>
                <Text style={globalStyles.label}>Введено, ед.</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0"
                  value={form.amount.toString()}
                  onChangeText={(v) => {
                    if (isValid(v)) setForm({ ...form, amount: v });
                    else if (!isValid(v))
                      setErrors({ ...errors, amount: numbersError });
                  }}
                  style={globalStyles.input}
                />
                {errors && errors.amount && (
                  <Text style={globalStyles.error}>{errors.amount}</Text>
                )}
              </View>
            </>
          )}
          {form.noteType === "Приём таблеток" && (
            <>
              <CustomSelect
                items={PILLS}
                label="Название"
                value={form.pills}
                onSelect={(v) => setForm({ ...form, pills: v })}
              />
              <View style={{ width: "100%" }}>
                <Text style={globalStyles.label}>Количество</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0"
                  value={form.amount.toString()}
                  onChangeText={(v) => {
                    if (isValid(v)) setForm({ ...form, amount: v });
                    else if (!isValid(v))
                      setErrors({ ...errors, amount: numbersError });
                  }}
                  style={globalStyles.input}
                />
                {errors && errors.amount && (
                  <Text style={globalStyles.error}>{errors.amount}</Text>
                )}
              </View>
            </>
          )}
          {form.noteType === "Приём пищи" && (
            <>
              <View style={{ width: "100%" }}>
                <Text style={globalStyles.label}>Что съедено</Text>
                <TextInput
                  placeholder=""
                  value={form.food}
                  onChangeText={(v) => setForm({ ...form, food: v })}
                  style={globalStyles.input}
                />
                {errors && errors.food && (
                  <Text style={globalStyles.error}>{errors.food}</Text>
                )}
              </View>
              <CustomSelect
                items={PORTION_TYPES}
                label="Размер порции"
                value={form.portion}
                onSelect={(v) => setForm({ ...form, portion: v })}
              />
              <View style={{ width: "100%" }}>
                <View style={styles.rowContainer}>
                  <View style={{ width: "45%" }}>
                    <Text style={globalStyles.label}>Углеводы, г</Text>
                    <TextInput
                      placeholder="12"
                      keyboardType="numeric"
                      value={form.carbs.toString()}
                      onChangeText={(v) => {
                        if (isValid(v)) {
                          setForm({
                            ...form,
                            carbs: v,
                            bu: Math.round(Number(v) / 12).toString(),
                          });
                        } else if (!isValid(v))
                          setErrors({ ...errors, carbs: numbersError });
                      }}
                      style={globalStyles.input}
                    />
                  </View>
                  <View style={{ width: "45%" }}>
                    <Text style={globalStyles.label}>Хлебные единицы, хе</Text>
                    <TextInput
                      placeholder="1"
                      keyboardType="numeric"
                      value={form.bu.toString()}
                      onChangeText={(v) => {
                        if (isValid(v)) {
                          setForm({
                            ...form,
                            bu: v,
                            carbs: (Number(v) * 12).toString(),
                          });
                        } else if (!isValid(v))
                          setErrors({ ...errors, bu: numbersError });
                      }}
                      style={globalStyles.input}
                    />
                  </View>
                </View>
                {errors && errors.bu && (
                  <Text style={globalStyles.error}>{errors.bu}</Text>
                )}
              </View>
            </>
          )}
          <View style={{ width: "100%", marginBottom: 10 }}>
            <Text style={globalStyles.label}>Комментарий (не обязательно)</Text>
            <TextInput
              multiline
              value={form.comment}
              onChangeText={(v) => setForm({ ...form, comment: v })}
              style={[globalStyles.input, { height: "auto" }]}
            />
          </View>
          <CustomButton text="Готово" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
