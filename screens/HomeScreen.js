import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diplomats Drycleaners & Laundry</Text>
      <Button title="Select Services" onPress={() => navigation.navigate('ServiceSelection')} />
      <Button title="Pick Up and Delivery" onPress={() => navigation.navigate('PickupDelivery')} />
      <Button title="Track My Order" onPress={() => navigation.navigate('OrderTracking')} />
      <Button title="Pricing Overview" onPress={() => navigation.navigate('PricingOverview')} />
      <Button title="Order History" onPress={() => navigation.navigate('OrderHistory')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <Button title="Customer Support" onPress={() => navigation.navigate('CustomerSupport')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
