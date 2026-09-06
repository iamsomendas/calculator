import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);

  const API_URL = 'http://10.73.152.93:8082/api/calculate';

const handlePress = async (operator) => {
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    setResult('Please enter valid numbers');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num1: n1, num2: n2, operator: operator }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      setResult(errorText);
      return;
    }

    const data = await response.json();
    setResult(data.result);
  } catch (error) {
    setResult('Could not reach server');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter first number"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter second number"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => handlePress('add')}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handlePress('subtract')}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handlePress('multiply')}>
          <Text style={styles.btnText}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handlePress('divide')}>
          <Text style={styles.btnText}>÷</Text>
        </TouchableOpacity>
      </View>

      {result !== null && <Text style={styles.result}>Result: {result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 18, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  result: { fontSize: 24, textAlign: 'center', marginTop: 20 },
});