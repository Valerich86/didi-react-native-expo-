import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { globalStyles, theme } from "../../styles/globals";

interface Props {
  text: string;
  bgColor?: string;
  onPress: () => void;
}

export default function CustomButton({
  text,
  onPress,
  bgColor = theme.accept,
}: Props) {
  return (
    <LinearGradient
      colors={[bgColor, "#c6a7ff", bgColor]}
      locations={[0, 0.8, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, globalStyles.shadow]}
    >
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    color: theme.light,
  },
});
