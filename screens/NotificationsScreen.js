import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notificationsData = [
  { id: '1', message: 'Your order ORD12345 has been delivered.' },
  { id: '2', message: 'Pickup scheduled for tomorrow at 10:00 AM.' },
  { id: '3', message: 'New promo: 10% off on Wash & Fold!' },
  // Add more notifications as needed
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notificationsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.message}>{item.message}</Text>
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
  notificationItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  message: {
    fontSize: 16,
  },
});
