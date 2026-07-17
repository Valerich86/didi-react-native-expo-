import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { theme } from "../styles/globals";

export default function Loading() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const speed = 360 / 1.2; // 360 градусов за 1.2 секунды (можно менять)
    let frameId: number;

    const loop = () => {
      rotation.value += (speed * 16.67) / 1000; // ~60 FPS: 16.67 мс
      frameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(frameId);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: theme.base,
  },
});
