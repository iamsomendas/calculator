import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const API_URL = 'http://10.73.152.93:8082/api/calculate';

const OPERATOR_SYMBOLS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [runningTotal, setRunningTotal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [currentOperand, setCurrentOperand] = useState('');
  const [justCalculated, setJustCalculated] = useState(false);

  const callBackend = async (num1, num2, op) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num1, num2, operator: op }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data.result;
  };

  // Called when a digit (0-9) or "." is tapped
  const handleDigit = (digit) => {
  if (justCalculated) {
    // Starting a brand new calculation after a result
    setCurrentOperand(digit);
    setDisplay(digit);
    setJustCalculated(false);
    return;
  }
  setCurrentOperand(currentOperand + digit);
  setDisplay(display === '0' ? digit : display + digit);
};

  // Called when +, -, ×, ÷ is tapped
  const handleOperator = async (nextOperator) => {
  const symbol = OPERATOR_SYMBOLS[nextOperator];
  setJustCalculated(false); // <-- add this line at the top

  if (currentOperand === '') {
    if (operator !== null) {
      setOperator(nextOperator);
      setDisplay(display.slice(0, -1) + symbol);
    }
    return;
  }

  const typedNumber = parseFloat(currentOperand);

  if (operator === null) {
    setRunningTotal(typedNumber);
    setOperator(nextOperator);
    setCurrentOperand('');
    setDisplay(display + symbol);
    return;
  }

  try {
    const result = await callBackend(runningTotal, typedNumber, operator);
    setRunningTotal(result);
    setOperator(nextOperator);
    setCurrentOperand('');
    setDisplay(display + symbol);
  } catch (error) {
    setDisplay(error.message || 'Error');
    setRunningTotal(null);
    setOperator(null);
    setCurrentOperand('');
  }
};

  // Called when "AC" is tapped
  const handleClear = () => {
  setDisplay('0');
  setRunningTotal(null);
  setOperator(null);
  setCurrentOperand('');
  setJustCalculated(false);
};

  // Called when "=" is tapped
  const handleEquals = async () => {
  if (operator === null || runningTotal === null) return;

  const typedNumber = currentOperand === '' ? runningTotal : parseFloat(currentOperand);

  try {
    const result = await callBackend(runningTotal, typedNumber, operator);
    setDisplay(String(result));
    setCurrentOperand(String(result)); // <-- keep the result available for chaining
  } catch (error) {
    setDisplay(error.message || 'Error');
    setCurrentOperand('');
  }

  setRunningTotal(null);
  setOperator(null);
  setJustCalculated(true); // <-- next digit press should start fresh
};

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.display}>{display}</Text>
      </View>

      <View style={styles.buttonGrid}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.grayBtn]} onPress={handleClear}>
            <Text style={styles.grayBtnText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.grayBtn]}>
            <Text style={styles.grayBtnText}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.grayBtn]}>
            <Text style={styles.grayBtnText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={() => handleOperator('divide')}>
            <Text style={styles.whiteBtnText}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {['7', '8', '9'].map((d) => (
            <TouchableOpacity key={d} style={[styles.btn, styles.darkBtn]} onPress={() => handleDigit(d)}>
              <Text style={styles.whiteBtnText}>{d}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={() => handleOperator('multiply')}>
            <Text style={styles.whiteBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {['4', '5', '6'].map((d) => (
            <TouchableOpacity key={d} style={[styles.btn, styles.darkBtn]} onPress={() => handleDigit(d)}>
              <Text style={styles.whiteBtnText}>{d}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={() => handleOperator('subtract')}>
            <Text style={styles.whiteBtnText}>−</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {['1', '2', '3'].map((d) => (
            <TouchableOpacity key={d} style={[styles.btn, styles.darkBtn]} onPress={() => handleDigit(d)}>
              <Text style={styles.whiteBtnText}>{d}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={() => handleOperator('add')}>
            <Text style={styles.whiteBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.darkBtn, styles.zeroBtn]} onPress={() => handleDigit('0')}>
            <Text style={[styles.whiteBtnText, styles.zeroText]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkBtn]} onPress={() => handleDigit('.')}>
            <Text style={styles.whiteBtnText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={handleEquals}>
            <Text style={styles.whiteBtnText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BUTTON_SIZE = 78;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end', padding: 12 },
  displayContainer: { alignItems: 'flex-end', paddingHorizontal: 15, marginBottom: 20 },
  display: { color: '#fff', fontSize: 48, fontWeight: '300' },
  buttonGrid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  btn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBtn: { backgroundColor: '#333' },
  grayBtn: { backgroundColor: '#a5a5a5' },
  orangeBtn: { backgroundColor: '#ff9f0a' },
  whiteBtnText: { color: '#fff', fontSize: 32 },
  grayBtnText: { color: '#000', fontSize: 28 },
  zeroBtn: { width: BUTTON_SIZE * 2 + 12, borderRadius: BUTTON_SIZE / 2, alignItems: 'flex-start', paddingLeft: 28 },
  zeroText: { fontSize: 32 },
});