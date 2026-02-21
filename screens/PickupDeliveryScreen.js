import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PickupDeliveryScreen() {
  const [pickupDate, setPickupDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showPickup, setShowPickup] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Pickup & Delivery</Text>
      <Button title="Select Pickup Date & Time" onPress={() => setShowPickup(true)} />
      {showPickup && (
        <DateTimePicker
          value={pickupDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowPickup(false);
            if (date) setPickupDate(date);
          }}
        />
      )}
      <Text style={styles.label}>Pickup: {pickupDate.toLocaleString()}</Text>
      <Button title="Select Delivery Date & Time" onPress={() => setShowDelivery(true)} />
      {showDelivery && (
        <DateTimePicker
          value={deliveryDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowDelivery(false);
            if (date) setDeliveryDate(date);
          }}
        />
      )}
      <Text style={styles.label}>Delivery: {deliveryDate.toLocaleString()}</Text>
      <Button title="Confirm Schedule" onPress={() => alert('Schedule confirmed!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
});
