import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const initialServices = [
  { id: '1', name: 'Dry Cleaning' },
  { id: '2', name: 'Wash & Fold' },
  { id: '3', name: 'Ironing' },
  // Add more services as needed
];

export default function ServiceSelectionScreen({ navigation }) {
  const [services] = useState(initialServices);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Service</Text>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceItem}>
            <Text style={styles.serviceText}>{item.name}</Text>
          </TouchableOpacity>
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
  serviceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  serviceText: {
    fontSize: 18,
  },
});
