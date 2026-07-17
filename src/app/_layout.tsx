import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { StatusBar } from "react-native";
import { migrateDbIfNeeded } from "../db/migrations";
import Loading from "./loading";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GlassAntiqua: require("../../assets/fonts/Glass_Antiqua/GlassAntiqua-Regular.ttf"),
    ReenieBeanie: require("../../assets/fonts/Reenie_Beanie/ReenieBeanie-Regular.ttf"),
    RockSalt: require("../../assets/fonts/Rock_Salt/RockSalt-Regular.ttf"),
    DigitTech: require("../../assets/fonts/DigitTech7-Regular.otf"),
  });

  if (!fontsLoaded) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider
        databaseName="diabetic-diary.db"
        onInit={migrateDbIfNeeded}
        useSuspense
      >
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
      <StatusBar barStyle={"light-content"} />
    </Suspense>
  );
}
