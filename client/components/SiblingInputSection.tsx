import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FormikValues } from 'formik';

interface SiblingInputSectionProps {
  values: FormikValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors?: FormikValues;
  touched?: FormikValues;
}

interface SiblingCountProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

const SiblingCount: React.FC<SiblingCountProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}) => {
  const handleDecrease = () => {
    const newVal = Number(value) - 1;
    onChange(newVal >= min ? newVal : min);
  };

  const handleIncrease = () => {
    const newVal = Number(value) + 1;
    onChange(newVal <= max ? newVal : max);
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity style={styles.stepButton} onPress={handleDecrease}>
          <Text style={styles.stepText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.valueText}>{value}</Text>

        <TouchableOpacity style={styles.stepButton} onPress={handleIncrease}>
          <Text style={styles.stepText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SiblingInputSection: React.FC<SiblingInputSectionProps> = ({
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    <>
      {/* Elder Siblings */}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Elder Siblings</Text>
      <View style={styles.row}>
        <SiblingCount
          label="Elder brothers"
          value={values.elderBrothers || 0}
          onChange={(val) => setFieldValue('elderBrothers', val)}
          min={0}
          max={10}
        />
        <SiblingCount
          label="Elder sisters"
          value={values.elderSisters || 0}
          onChange={(val) => setFieldValue('elderSisters', val)}
          min={0}
          max={10}
        />
      </View>
      {touched?.elderBrothers && errors?.elderBrothers && (
        <Text style={styles.errorText}>{errors.elderBrothers}</Text>
      )}
      {touched?.elderSisters && errors?.elderSisters && (
        <Text style={styles.errorText}>{errors.elderSisters}</Text>
      )}

      {/* Younger Siblings */}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Younger Siblings (Optional)</Text>
      <View style={styles.row}>
        <SiblingCount
          label="Younger brothers"
          value={values.youngerBrothers || 0}
          onChange={(val) => setFieldValue('youngerBrothers', val)}
          min={0}
          max={10}
        />
        <SiblingCount
          label="Younger sisters"
          value={values.youngerSisters || 0}
          onChange={(val) => setFieldValue('youngerSisters', val)}
          min={0}
          max={10}
        />
      </View>
      {touched?.youngerBrothers && errors?.youngerBrothers && (
        <Text style={styles.errorText}>{errors.youngerBrothers}</Text>
      )}
      {touched?.youngerSisters && errors?.youngerSisters && (
        <Text style={styles.errorText}>{errors.youngerSisters}</Text>
      )}
    </>
  );
};

export default SiblingInputSection;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#01A550',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 6,
  },
});
