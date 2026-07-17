import NoteCard from "@/src/components/cards/note-card";
import CustomButton from "@/src/components/UI/custom-button";
import { CustomDatePicker } from "@/src/components/UI/custom-datepicker";
import { CustomSelect } from "@/src/components/UI/custom-select";
import Heading from "@/src/components/UI/heading";
import ScrollButton from "@/src/components/UI/scroll-button";
import { getNotes } from "@/src/db/data";
import { NOTE_TYPES } from "@/src/lib/constants";
import { Note } from "@/src/lib/types";
import { getFormattedDate, groupNotesByDate } from "@/src/lib/utils";
import { globalStyles } from "@/src/styles/globals";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Notes() {
  const db = useSQLiteContext();
  const scrollViewRef = useRef<any>(null);
  if (!NOTE_TYPES.includes("Все")) NOTE_TYPES.unshift("Все");
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const [startDate, setStartDate] = useState(getFormattedDate(oneWeekAgo));
  const [endDate, setEndDate] = useState(getFormattedDate(today));
  const [noteType, setNoteType] = useState(NOTE_TYPES[0]);
  const [showError, setShowError] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState<Note[] | undefined>(
    undefined,
  );
  const [refresh, setRefresh] = useState(false);
  const grouped = useMemo(
    () => groupNotesByDate(filteredNotes ?? []),
    [filteredNotes],
  );

  useEffect(() => {
    if (startDate > endDate) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const fetchData = async () => {
      const response = await getNotes(db, startDate, endDate, noteType);
      if (response.success) setFilteredNotes(response.data);
    };
    fetchData();
  }, [refresh]);

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={globalStyles.screen}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const y = nativeEvent.contentOffset.y;
          setShowScrollBtn(y > 400);
        }}
        scrollEventThrottle={16}
      >
        <View style={{ rowGap: 10 }}>
          <View style={styles.rowContainer}>
            <CustomDatePicker
              currentDate={startDate}
              onSetDate={(v) => setStartDate(v)}
            />
            <CustomDatePicker
              currentDate={endDate}
              onSetDate={(v) => setEndDate(v)}
            />
          </View>
          {showError && (
            <Text style={globalStyles.error}>
              Начальная дата не может быть больше конечной
            </Text>
          )}
          <CustomSelect
            label="Тип записи"
            value={noteType}
            onSelect={(v) => setNoteType(v)}
            items={NOTE_TYPES}
          />
          <CustomButton
            text="Фильтровать"
            onPress={() => setRefresh(!refresh)}
          />
        </View>
        <View>
          <View style={globalStyles.separator}></View>
          {filteredNotes !== undefined && filteredNotes.length !== 0 ? (
            <View style={globalStyles.listContainer}>
              {grouped.map((item, index) => {
                if (item.type === "date") {
                  return (
                    <View key={index} style={{}}>
                      <Heading
                        text={new Date(item.date).toLocaleDateString()}
                      />
                    </View>
                  );
                }
                return (
                  <NoteCard
                    key={index}
                    note={item.note}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={globalStyles.noInfo}>
              По данному фильтру записей не найдено
            </Text>
          )}
        </View>
      </ScrollView>
      {showScrollBtn && <ScrollButton scrollViewRef={scrollViewRef} />}
    </>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
