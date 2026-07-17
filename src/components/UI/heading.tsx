import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fontSizes } from "../../styles/globals";

interface Props {
  text: string;
}

export default function Heading({ text }: Props) {
  const translate = useSharedValue(-300);
  const animation = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value }],
  }));
  useEffect(() => {
    translate.value = withSpring(0, { damping: 30, stiffness: 300 });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animation]}>{text}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
  },
  text: {
    fontSize: fontSizes.max,
    fontWeight: "600",
    textAlign: "center",
  },
});
