import { fontSizes, globalStyles, offsetX, theme } from "@/src/styles/globals";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SelectProps<T> {
  label?: string;
  value?: any;
  onSelect: (item: any) => void;
  items: string[];
  placeholder?: string;
}

export function CustomSelect<T>({
  label,
  value,
  onSelect,
  items,
  placeholder,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      {label && <Text style={globalStyles.label}>{label}</Text>}
      <View
        style={[{ position: "relative", width: "100%" }, globalStyles.shadow]}
      >
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => setIsOpen((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text
            style={{ opacity: isOpen ? 0.3 : 1, fontSize: fontSizes.default }}
          >
            {value}
          </Text>
          <MaterialCommunityIcons
            name={!isOpen ? "arrow-down" : "arrow-up"}
            size={24}
            color={theme.base}
          />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpen}
          onRequestClose={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <View style={styles.modal}>
            <View style={[styles.list, globalStyles.shadow]}>
              <FlatList
                data={items}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.option]}
                    onPress={() => {
                      onSelect(item);
                      setIsOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        item === value && styles.optionSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    paddingHorizontal: offsetX,
    backgroundColor: theme.light,
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
    backgroundColor: theme.neutral2,
    borderRadius: 10,
  },
  option: {
    justifyContent: "center",
    padding: 20,
  },
  optionText: { fontSize: fontSizes.default, fontWeight: "600" },
  optionSelected: { color: theme.base },
});
