import NoteCard from "@/src/components/cards/note-card";
import CustomButton from "@/src/components/UI/custom-button";
import Heading from "@/src/components/UI/heading";
import ScrollButton from "@/src/components/UI/scroll-button";
import { getNotes } from "@/src/db/data";
import { Note } from "@/src/lib/types";
import { globalStyles } from "@/src/styles/globals";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Home() {
  const db = useSQLiteContext();
  const router = useRouter();
  const scrollViewRef = useRef<any>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [notesToday, setNotesToday] = useState<Note[] | undefined>(undefined);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotes(db);
      if (response.success) setNotesToday(response.data);
    };
    fetchData();
  }, [refresh]);

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
        <Heading text={`Сегодня ${new Date().toLocaleDateString()}`} />
        <CustomButton
          text="+ Новая запись"
          onPress={() => router.push("/notes/post-note")}
        />
        <View>
          <View style={globalStyles.separator}></View>
          {notesToday !== undefined && notesToday.length !== 0 ? (
            <View style={globalStyles.listContainer}>
              {notesToday.map((item) => {
                return (
                  <NoteCard
                    key={item.id}
                    note={item}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={globalStyles.noInfo}>Сегодня записей нет</Text>
          )}
        </View>
      </ScrollView>
      {showScrollBtn && <ScrollButton scrollViewRef={scrollViewRef} />}
    </>
  );
}

const styles = StyleSheet.create({});
