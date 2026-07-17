import { theme } from "@/src/styles/globals";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  scrollViewRef: any;
}
export default function ScrollButton({ scrollViewRef }: Props) {
  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <TouchableOpacity style={styles.scroller} onPress={handleScrollToTop}>
      <MaterialCommunityIcons name="arrow-up" size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroller: {
    position: "absolute",
    right: "2%",
    bottom: 100,
    width: 40,
    height: 40,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.neutral,
    opacity: 0.7,
  },
});
