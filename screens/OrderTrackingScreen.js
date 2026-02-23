
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

const orderStatus = {
  id: 'ORD12345',
  status: 'In Progress',
  pickup: '2026-02-22 10:00 AM',
  delivery: '2026-02-23 04:00 PM',
};

const OrderTrackingScreen = ({ navigation }) => {
  const [status] = useState(orderStatus);
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
      <Text style={styles.createTitle}>Track My Order</Text>
      <Text style={styles.label}>Order ID: {status.id}</Text>
      <Text style={styles.label}>Status: {status.status}</Text>
      <Text style={styles.label}>Pickup: {status.pickup}</Text>
      <Text style={styles.label}>Delivery: {status.delivery}</Text>
      <TouchableScale style={styles.menuButton} activeScale={0.98} onPress={() => alert('Status refreshed!')}>
        <Text style={styles.menuButtonText}>Refresh Status</Text>
      </TouchableScale>
    </Animated.View>
  );
};

export default OrderTrackingScreen;

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
  menuButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    marginLeft: 4,
  },
});
