import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CustomButton from "../components/UI/custom-button";
import { theme } from "../styles/globals";

export default function Index() {
  const router = useRouter();
  const scale = useSharedValue(0.7);
  const rotate1 = useSharedValue(15);
  const rotate2 = useSharedValue(180);
  const rotate3 = useSharedValue(0);
  const translate = useSharedValue(20);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 120 });
    rotate1.value = withTiming(0, { duration: 2000 });
    rotate2.value = withTiming(0, { duration: 2000 });
    rotate3.value = withTiming(-10, { duration: 2000 });
    translate.value = withTiming(0, { duration: 2000 });
    const timer = setTimeout(() => {
      router.push("/(tabs)/home");
    }, 3000);
  }, []);

  const image1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate1.value}deg` }],
  }));

  const image2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate2.value}deg` }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translate.value },
      { rotate: `${rotate3.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}></View>
      <Animated.View style={[styles.image2Wrapper, image2Style]}>
        <Image
          source={require("../../assets/images/hero_2.png")}
          style={styles.background}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.image1Wrapper, image1Style]}>
        <Image
          source={require("../../assets/images/hero_1.png")}
          style={styles.background}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.logo, logoStyle]}>Didi</Animated.Text>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ width: 50, marginRight: 20 }}>
          <CustomButton text=">" onPress={() => router.push("/(tabs)/home")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: "30%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  wrapper: {
    position: "absolute",
    width: "200%",
    height: 430,
    transform: [{ rotate: "-35deg" }],
    top: "25%",
    left: "-50%",
    backgroundColor: theme.neutral2,
  },
  image1Wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 130,
  },
  image2Wrapper: {
    position: "absolute",
    width: "70%",
    height: "100%",
    left: 140,
    top: -180,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    fontSize: 150,
    fontFamily: "ReenieBeanie",
    color: theme.dark,
    position: "absolute",
    bottom: "10%",
    left: "10%",
    transform: [{ rotate: "-20deg" }],
  },
});
