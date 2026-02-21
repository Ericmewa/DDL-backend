import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const pricingData = [
  { id: '1', service: 'Dry Cleaning', price: '$10 per item' },
  { id: '2', service: 'Wash & Fold', price: '$5 per kg' },
  { id: '3', service: 'Ironing', price: '$3 per item' },
  // Add more services and prices as needed
];

export default function PricingOverviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pricing Overview</Text>
      <FlatList
        data={pricingData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.priceItem}>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.price}>{item.price}</Text>
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
  priceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  service: {
    fontSize: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
