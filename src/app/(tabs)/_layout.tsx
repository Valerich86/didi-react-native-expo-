import { theme } from "@/src/styles/globals";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

export default function TabLayout() {
  const HeaderTitle = ({ title }: { title: string }) => {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: theme.light,
            borderRadius: "50%",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 50,
              fontFamily: "ReenieBeanie",
              color: theme.dark,
              transform: [{ rotate: "-15deg" }],
            }}
          >
            Didi
          </Text>
          <View
            style={{
              position: "absolute",
              top: -20,
              left: -10,
              width: 50,
              height: 70,
            }}
          >
            <Image
              source={require("../../../assets/images/hero_2.png")}
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
                transform: [{ rotate: "40deg" }],
              }}
            />
          </View>
        </View>
        <Text style={{ fontSize: 26, color: theme.light }}>{title}</Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.light,
        tabBarInactiveTintColor: "#8d8d8d",
        tabBarStyle: {
          width: "96%",
          alignSelf: "center",
          borderRadius: 10,
          paddingTop: 5,
          height: 50,
          alignItems: "center",
          backgroundColor: theme.dark,
          opacity: 0.9,
          position: "absolute",
          bottom: 10,
          transform: [{ translateX: "2%" }],
        },
        headerStyle: { backgroundColor: theme.base },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Главная",
          headerTitle: () => <HeaderTitle title="Главная" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Все записи",
          headerTitle: () => <HeaderTitle title="Все записи" />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Динамика глюкозы",
          headerTitle: () => <HeaderTitle title="Динамика глюкозы" />,
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="line-chart" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройки",
          headerTitle: () => <HeaderTitle title="Настройки" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
