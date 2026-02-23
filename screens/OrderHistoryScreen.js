
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Animated } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

const orderHistoryData = [
  { id: 'ORD12345', date: '2026-02-20', status: 'Delivered', total: '$25' },
  { id: 'ORD12346', date: '2026-02-15', status: 'Delivered', total: '$18' },
  { id: 'ORD12347', date: '2026-02-10', status: 'Cancelled', total: '$0' },
  // Add more orders as needed
];

const OrderHistoryScreen = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <View style={styles.headerBox}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.brandTitle}>DIPLOMATS</Text>
        <Text style={styles.brandSubtitle}>DRYCLEANERS</Text>
      </View>
      <Text style={styles.createTitle}>Order History</Text>
      <FlatList
        data={orderHistoryData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Date: {item.date}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            <Text style={styles.orderText}>Total: {item.total}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Animated.View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  headerBox: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingTop: 30,
    paddingBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  brandTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 0,
  },
  brandSubtitle: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 2,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
    color: '#222',
    marginLeft: 4,
  },
  orderItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  orderText: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 2,
  },
});
