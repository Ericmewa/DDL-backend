import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PricingOverviewScreen({ navigation }) {
  const [quantities, setQuantities] = useState({
    dryCleaning: 1,
    washFold: 1,
    ironing: 1,
    shoeCleaning: 1,
  });

  const updateQuantity = (service, increment) => {
    setQuantities(prev => ({
      ...prev,
      [service]: Math.max(1, prev[service] + increment)
    }));
  };

  const calculateTotal = () => {
    return (
      quantities.dryCleaning * 250 +
      quantities.washFold * 100 +
      quantities.ironing * 100 +
      quantities.shoeCleaning * 300
    );
  };

  const bottomNavItems = [
    { name: 'Home', icon: '🏠', screen: 'Home' },
    { name: 'Services', icon: '🔧', screen: 'Services' },
    { name: 'Orders', icon: '📦', screen: 'Orders' },
    { name: 'History', icon: '📋', screen: 'History' },
    { name: 'Profile', icon: '👤', screen: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#007bff', '#0066cc']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.brandTitle}>DIPLOMATS</Text>
            <Text style={styles.brandSubtitle}>DRYCLEANERS</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pricing Header */}
        <View style={styles.pricingHeader}>
          <Text style={styles.pricingTitle}>Pricing Overview</Text>
          <Text style={styles.pricingSubtitle}>See our affordable pricing</Text>
          <Text style={styles.pricingDescription}>Quality service at competitive prices</Text>
        </View>

        {/* Dry Cleaning */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Dry Cleaning</Text>
            <Text style={styles.serviceNote}>Starting from KES 250 per item</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.servicePrice}>KES 250 /item</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('dryCleaning', -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantities.dryCleaning}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('dryCleaning', 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.perItemText}>Per item</Text>
        </View>

        {/* Wash & Fold */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Wash & Fold</Text>
            <Text style={styles.serviceNote}>Pricing is per kg for laundry</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.servicePrice}>KES 100 /kg</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('washFold', -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantities.washFold}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('washFold', 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.perItemText}>Per kg</Text>
        </View>

        {/* Ironing */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Ironing</Text>
            <Text style={styles.serviceNote}>Starting from KES 100 per item</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.servicePrice}>KES 100 /item</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('ironing', -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantities.ironing}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('ironing', 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.perItemText}>Per item</Text>
        </View>

        {/* Shoe Cleaning */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Shoe Cleaning</Text>
            <Text style={styles.serviceNote}>Starting from KES 300 per pair</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.servicePrice}>KES 300 /pair</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('shoeCleaning', -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantities.shoeCleaning}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity('shoeCleaning', 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.perItemText}>Per pair</Text>
        </View>

        {/* Total Cost */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Estimated Cost</Text>
          <Text style={styles.totalValue}>KES {calculateTotal().toLocaleString()}</Text>
        </View>

        {/* M-PESA Button */}
        <TouchableOpacity 
          style={styles.mpesaButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#28a745', '#218838']}
            style={styles.mpesaGradient}
          >
            <Text style={styles.mpesaIcon}>📱</Text>
            <Text style={styles.mpesaButtonText}>Pay with M-PESA</Text>
            <Text style={styles.mpesaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={[styles.navIcon, item.name === 'Services' && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navText, item.name === 'Services' && styles.navTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#fff',
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.9,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pricingHeader: {
    marginTop: 20,
    marginBottom: 20,
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pricingSubtitle: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 2,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#666',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  serviceHeader: {
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  serviceNote: {
    fontSize: 12,
    color: '#888',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 2,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 15,
  },
  perItemText: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  totalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007bff',
  },
  mpesaButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mpesaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mpesaIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
  },
  mpesaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  mpesaArrow: {
    fontSize: 20,
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  navIcon: {
    fontSize: 20,
    color: '#999',
    marginBottom: 2,
  },
  navIconActive: {
    color: '#007bff',
  },
  navText: {
    fontSize: 11,
    color: '#999',
  },
  navTextActive: {
    color: '#007bff',
    fontWeight: '500',
  },
});