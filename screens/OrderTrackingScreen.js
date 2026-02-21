import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Example order status data
const orderStatus = {
  id: 'ORD12345',
  status: 'In Progress',
  pickup: '2026-02-22 10:00 AM',
  delivery: '2026-02-23 04:00 PM',
};

export default function OrderTrackingScreen() {
  const [status] = useState(orderStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track My Order</Text>
      <Text style={styles.label}>Order ID: {status.id}</Text>
      <Text style={styles.label}>Status: {status.status}</Text>
      <Text style={styles.label}>Pickup: {status.pickup}</Text>
      <Text style={styles.label}>Delivery: {status.delivery}</Text>
      <Button title="Refresh Status" onPress={() => alert('Status refreshed!')} />
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
    fontSize: 18,
    marginBottom: 10,
  },
});
