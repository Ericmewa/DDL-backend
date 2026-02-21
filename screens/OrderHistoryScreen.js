import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const orderHistoryData = [
  { id: 'ORD12345', date: '2026-02-20', status: 'Delivered', total: '$25' },
  { id: 'ORD12346', date: '2026-02-15', status: 'Delivered', total: '$18' },
  { id: 'ORD12347', date: '2026-02-10', status: 'Cancelled', total: '$0' },
  // Add more orders as needed
];

export default function OrderHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orderHistoryData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: {item.total}</Text>
          </View>
        )}
      />
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
  orderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
