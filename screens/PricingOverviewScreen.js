
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Animated } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

const pricingData = [
  { id: '1', service: 'Dry Cleaning', price: '$10 per item' },
  { id: '2', service: 'Wash & Fold', price: '$5 per kg' },
  { id: '3', service: 'Ironing', price: '$3 per item' },
  // Add more services and prices as needed
];

const PricingOverviewScreen = ({ navigation }) => {
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
      <Text style={styles.createTitle}>Pricing Overview</Text>
      <FlatList
        data={pricingData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.priceItem}>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Animated.View>
  );
};

export default PricingOverviewScreen;

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
  priceItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  service: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
