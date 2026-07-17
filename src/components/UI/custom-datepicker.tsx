import { getFormattedDate } from "@/src/lib/utils";
import { fontSizes, globalStyles, offsetX, theme } from "@/src/styles/globals";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./custom-button";

interface Props {
  onSetDate: (validDate: string) => void;
  currentDate: string;
}

export function CustomDatePicker({ onSetDate, currentDate }: Props) {
  const [pickerIsOpened, setPickerIsOpened] = useState(false);
  const [year, month, day] = currentDate.split("-");
  const formatString = (value: number) => {
    const strValue = value.toString();
    return strValue.length === 1 ? "0" + strValue : strValue;
  };
  const [selectedDate, setSelectedDate] = useState(day);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [maxDate, setMaxDate] = useState(31);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const maxValue =
      ["01", "03", "05", "07", "08", "10", "12"].includes(selectedMonth) &&
      selectedMonth !== month
        ? 31
        : selectedMonth === "02" && selectedMonth !== month
          ? 29
          : 30;
    setMaxDate(maxValue);
    if (Number(selectedDate) > maxValue) setSelectedDate("01");
  }, [selectedMonth]);

  const onSelectDay = (type: "up" | "down") => {
    setSelectedDate((prev) => {
      const numValue = Number(prev);
      const newValue =
        type === "down"
          ? numValue !== 1
            ? numValue - 1
            : maxDate
          : numValue !== maxDate
            ? numValue + 1
            : 1;
      return formatString(newValue);
    });
  };

  const onSelectMonth = (type: "up" | "down") => {
    setSelectedMonth((prev) => {
      const numValue = Number(prev);
      const newValue =
        type === "down"
          ? numValue !== 1
            ? numValue - 1
            : 12
          : numValue !== 12
            ? numValue + 1
            : 1;
      return formatString(newValue);
    });
  };

  const onSelectYear = (type: "up" | "down") => {
    const yearNow = new Date().getFullYear();
    setSelectedYear((prev) => {
      const numValue = Number(prev);
      const newValue =
        type === "down" && numValue === Number(yearNow)
          ? numValue - 1
          : type === "up" && numValue !== Number(yearNow)
            ? numValue + 1
            : Number(selectedYear);
      return formatString(newValue);
    });
  };

  const handleValidate = () => {
    setShowError(false);
    const value = new Date(
      Number(selectedYear),
      Number(selectedMonth) - 1,
      Number(selectedDate),
    );
    if (value) {
      const validDate = getFormattedDate(value);
      onSetDate(validDate);
      setPickerIsOpened(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <View style={{ width: "45%" }}>
        <Text style={globalStyles.label}>Дата</Text>
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => setPickerIsOpened(true)}
        >
          <Text style={{ fontSize: fontSizes.default }}>
            {day}.{month}.{year}
          </Text>
          <MaterialCommunityIcons
            name="calendar-edit-outline"
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
                onPress={() => onSelectDay("up")}
              >
                <MaterialCommunityIcons
                  name="chevron-up-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
              <View style={styles.activeOption}>
                <Text style={styles.digits}>{selectedDate}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectDay("down")}
              >
                <MaterialCommunityIcons
                  name="chevron-down-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 50 }}>.</Text>
            <View style={styles.select}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectMonth("up")}
              >
                <MaterialCommunityIcons
                  name="chevron-up-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
              <View style={styles.activeOption}>
                <Text style={styles.digits}>{selectedMonth}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectMonth("down")}
              >
                <MaterialCommunityIcons
                  name="chevron-down-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 50 }}>.</Text>
            <View style={styles.select}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectYear("up")}
              >
                <MaterialCommunityIcons
                  name="chevron-up-box"
                  size={50}
                  color={theme.accept}
                />
              </TouchableOpacity>
              <View style={styles.activeOption}>
                <Text style={styles.digits}>{selectedYear}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectYear("down")}
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
                const [day, month, year] = new Date()
                  .toLocaleDateString()
                  .split(".");
                setSelectedDate(day);
                setSelectedMonth(month);
                setSelectedYear(year);
                onSetDate(currentDate);
              }}
            >
              <MaterialCommunityIcons
                name="refresh-circle"
                size={40}
                color={theme.accept}
              />
            </TouchableOpacity>
          </View>
          {showError && (
            <Text style={globalStyles.error}>Неверный формат даты</Text>
          )}
          <CustomButton text="Готово" onPress={handleValidate} />
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
    columnGap: 1,
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
    fontSize: 30,
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
