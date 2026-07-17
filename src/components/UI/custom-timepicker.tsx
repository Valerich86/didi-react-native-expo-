import { fontSizes, globalStyles, offsetX, theme } from "@/src/styles/globals";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./custom-button";

interface Props {
  onSetTime: (hours: string, minutes: string) => void;
  selectedTime: string;
}

export function CustomTimePicker({ onSetTime, selectedTime }: Props) {
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);
  const [pickerIsOpened, setPickerIsOpened] = useState(false);
  const [hours, minutes] = selectedTime.split(":");
  const formatString = (value: number) => {
    const strValue = value.toString();
    return strValue.length === 1 ? "0" + strValue : strValue;
  };
  const [selectedHour, setSelectedHour] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);

  const onSelectHours = useCallback((type: "up" | "down") => {
    setSelectedHour((prev) => {
      const numValue = Number(prev);
      const newValue =
        type === "down"
          ? numValue !== 0
            ? numValue - 1
            : 23
          : numValue !== 23
            ? numValue + 1
            : 0;
      return formatString(newValue);
    });
  }, []);

  const onSelectMinutes = useCallback((type: "up" | "down") => {
    setSelectedMinutes((prev) => {
      const numValue = Number(prev);
      const newValue =
        type === "down"
          ? numValue !== 0
            ? numValue - 1
            : 59
          : numValue !== 59
            ? numValue + 1
            : 0;
      return formatString(newValue);
    });
  }, []);

  const startRepeat = useCallback((callback: () => void, delay: number) => {
    if (timerRef.current) return;
    timerRef.current = setInterval(callback, delay);
  }, []);

  const stopRepeat = useCallback(() => {
    if (typeof timerRef.current === "number") {
      clearInterval(timerRef.current);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current as NodeJS.Timeout);
    }
    timerRef.current = null;
  }, []);

  const handleLongPressHoursUp = useCallback(() => {
    startRepeat(() => onSelectHours("up"), 300);
  }, [onSelectHours, startRepeat]);

  const handleLongPressHoursDown = useCallback(() => {
    startRepeat(() => onSelectHours("down"), 300);
  }, [onSelectHours, startRepeat]);

  const handleLongPressMinutesUp = useCallback(() => {
    startRepeat(() => onSelectMinutes("up"), 100);
  }, [onSelectMinutes, startRepeat]);

  const handleLongPressMinutesDown = useCallback(() => {
    startRepeat(() => onSelectMinutes("down"), 100);
  }, [onSelectMinutes, startRepeat]);

  return (
    <>
      <View style={{ width: "45%" }}>
        <Text style={globalStyles.label}>Время</Text>
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => setPickerIsOpened(true)}
        >
          <Text style={{ fontSize: fontSizes.default }}>
            {hours}:{minutes}
          </Text>
          <MaterialCommunityIcons
            name="clock-edit-outline"
            size={25}
            color={theme.base}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickerIsOpened}
        onRequestClose={() => {
          setPickerIsOpened((prev) => !prev);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.selectContainer, globalStyles.shadow]}>
            <View style={styles.select}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectHours("up")}
                onLongPress={handleLongPressHoursUp}
                onPressOut={stopRepeat}
              >
                <MaterialCommunityIcons
                  name="chevron-up-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
              <View style={styles.activeOption}>
                <Text style={styles.digits}>{selectedHour}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectHours("down")}
                onLongPress={handleLongPressHoursDown}
                onPressOut={stopRepeat}
              >
                <MaterialCommunityIcons
                  name="chevron-down-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 50 }}>:</Text>
            <View style={styles.select}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectMinutes("up")}
                onLongPress={handleLongPressMinutesUp}
                onPressOut={stopRepeat}
              >
                <MaterialCommunityIcons
                  name="chevron-up-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
              <View style={styles.activeOption}>
                <Text style={styles.digits}>{selectedMinutes}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectMinutes("down")}
                onLongPress={handleLongPressMinutesDown}
                onPressOut={stopRepeat}
              >
                <MaterialCommunityIcons
                  name="chevron-down-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.abort}
              onPress={() => {
                const [hoursNow, minutesNow] = new Date()
                  .toLocaleTimeString()
                  .substring(0, 5)
                  .split(":");
                setSelectedHour(hoursNow);
                setSelectedMinutes(minutesNow);
                onSetTime(hoursNow, minutesNow);
              }}
            >
              <MaterialCommunityIcons
                name="refresh-circle"
                size={40}
                color={theme.accept}
              />
            </TouchableOpacity>
          </View>
          <CustomButton
            text="Готово"
            onPress={() => {
              onSetTime(selectedHour, selectedMinutes);
              setPickerIsOpened(false);
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: offsetX,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: offsetX,
    backgroundColor: theme.light,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
  },
  selectContainer: {
    width: "100%",
    flexDirection: "row",
    columnGap: 10,
    borderRadius: 10,
    padding: 20,
    backgroundColor: theme.neutral2,
    justifyContent: "center",
    alignItems: "center",
  },
  select: {
    alignItems: "center",
  },
  activeOption: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: theme.base,
  },
  digits: {
    fontSize: 50,
    color: theme.light,
    fontFamily: "DigitTech",
    backgroundColor: theme.dark,
    padding: 10,
  },
  abort: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
