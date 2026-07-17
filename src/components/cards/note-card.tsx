import { deleteNote } from "@/src/db/data";
import { Note } from "@/src/lib/types";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fontSizes, globalStyles, theme } from "../../styles/globals";
import CustomButton from "../UI/custom-button";

const emodji = { good: "🙂", bad: "😔", neutral: "🤨" };

interface Props {
  note: Note;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export default function NoteCard({ note, refresh, setRefresh }: Props) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [commentModalOpened, setCommentModalOpened] = useState(false);
  const router = useRouter();
  const db = useSQLiteContext();

  const handleDelete = async () => {
    const response = await deleteNote(db, note.id);
    if (response.success) {
      setRefresh(!refresh);
    }
    setDeleteModalOpened(false);
  };

  return (
    <>
      <View style={[styles.container, globalStyles.shadow]}>
        <View style={[styles.icon, globalStyles.shadow]}>
          {note.note_type === "Инъекция инсулина" && (
            <Fontisto name="injection-syringe" size={20} />
          )}
          {note.note_type === "Измерение глюкозы" && (
            <Fontisto name="blood-drop" size={20} />
          )}
          {note.note_type === "Приём таблеток" && (
            <Fontisto name="pills" size={20} />
          )}
          {note.note_type === "Приём пищи" && (
            <Ionicons name="fast-food" size={20} />
          )}
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.type}>
            {note.note_type === "Инъекция инсулина"
              ? `${note.insulin_type} инсулин`
              : note.note_type === "Приём таблеток"
                ? note.pills
                : note.note_type}
          </Text>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.date}>
              {new Date(note.date).toLocaleDateString()}
            </Text>
            <Text style={styles.time}>{note.time}</Text>
          </View>
        </View>
        {note.note_type === "Измерение глюкозы" && (
          <Text style={styles.value}>
            {note.amount} ммоль/л{" "}
            {note.amount > 4 && note.amount <= 7
              ? emodji.good
              : note.amount > 7 && note.amount < 10
                ? emodji.neutral
                : emodji.bad}
          </Text>
        )}
        {note.note_type === "Инъекция инсулина" && (
          <Text style={styles.value}>{note.amount} ед.</Text>
        )}
        {note.note_type === "Приём таблеток" && (
          <Text style={styles.value}>{note.amount} шт.</Text>
        )}
        {note.note_type === "Приём пищи" && (
          <>
            <Text style={{ fontSize: fontSizes.default }}>{note.food}</Text>
            <Text style={{ fontSize: fontSizes.default }}>
              Порция: {note.portion}
            </Text>
            <Text style={styles.value}>
              {note.bu} хе ({note.carbs} г. угл.)
            </Text>
          </>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setCommentModalOpened(true)}
          >
            <MaterialCommunityIcons
              name="comment-eye-outline"
              size={20}
              color={theme.accept}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              router.push(`/notes/update-note?id=${note.id}&location=home`)
            }
          >
            <MaterialCommunityIcons
              name="note-edit-outline"
              size={20}
              color={theme.accept}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setDeleteModalOpened(true)}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color={theme.danger}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalOpened}
        onRequestClose={() => {
          setDeleteModalOpened((prev) => !prev);
        }}
      >
        <View style={{ height: "100%", justifyContent: "center" }}>
          <View style={[styles.modal, globalStyles.shadow]}>
            <Text style={{ fontSize: fontSizes.default, fontWeight: "700" }}>
              Вы хотите удалить запись?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 20,
              }}
            >
              <View style={{ width: "45%" }}>
                <CustomButton
                  text="нет"
                  onPress={() => setDeleteModalOpened(false)}
                />
              </View>
              <View style={{ width: "45%" }}>
                <CustomButton
                  text="да"
                  bgColor={theme.danger}
                  onPress={handleDelete}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={commentModalOpened}
        onRequestClose={() => {
          setCommentModalOpened((prev) => !prev);
        }}
      >
        <View style={{ height: "100%", justifyContent: "center" }}>
          <View style={[styles.modal, globalStyles.shadow]}>
            <TouchableOpacity
              onPress={() => setCommentModalOpened(false)}
              style={[styles.closeButton, globalStyles.shadow]}
            >
              <MaterialCommunityIcons
                name="close-outline"
                size={20}
                color={theme.neutral}
              />
            </TouchableOpacity>
            {note.comment ? (
              <Text style={{ fontSize: fontSizes.default, fontWeight: "700" }}>
                Ваш комментарий: {note.comment}
              </Text>
            ) : (
              <Text style={{ fontSize: fontSizes.default, fontWeight: "700" }}>
                Комментарий отсутствует
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.neutral2,
    width: "100%",
    padding: 16,
    paddingBottom: 3,
    borderRadius: 12,
  },
  type: { fontSize: 24, maxWidth: "80%" },
  date: { fontSize: 12 },
  value: { fontSize: 28, fontWeight: "900", textAlign: "center" },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.neutral,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  time: {
    backgroundColor: theme.dark,
    color: theme.light,
    fontFamily: "DigitTech",
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  icon: {
    position: "absolute",
    top: 0,
    left: "5%",
    transform: [{ translateY: "-50%" }],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.light,
  },
  modal: {
    width: "80%",
    padding: 20,
    backgroundColor: theme.neutral,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: -15,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: theme.accept,
  },
});
