import { View, Text, StyleSheet } from 'react-native';

export default function Stats() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика</Text>
      <Text>Здесь будут графики и средние значения глюкозы.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});