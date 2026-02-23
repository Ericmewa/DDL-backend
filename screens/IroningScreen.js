// IroningScreen.js
// Complete Ironing Services ordering screen for laundromat app
// Includes: UI, state, price logic, validation, navigation, bundles, accessibility

  // State declarations
  // All user selections and form state
  // Update quantity for an item
  // Handles +/- quantity changes for each item
  // Calculate item price with upgrades
  // Returns item price including press upcharge
  // Calculate starch charges
  // Returns starch upcharge for all items
  // Calculate subtotal
  // Returns subtotal for all items and upgrades
  // Calculate total with all charges and savings
  // Returns total price after bundle and upcharges
  // Check for applicable bundles
  // Updates bundle suggestions based on item selection
  // Apply a bundle deal
  // Sets item quantities to match bundle and applies deal
  // Validate order
  // Checks if at least one item is selected
  // Handle schedule pickup
  // Handles navigation to pickup scheduling with order data
  // Handle add to cart
  // Handles saving order to cart
  // Quick repeat previous order
  // Loads previous order state for quick repeat
  // Reset form
  // Resets all form fields to default
  // Simulate previous order fetch
  // Loads previous order for quick repeat
  // UI Components
  // All UI sections rendered below
  {/* Header: Title, back, cart */}
  {/* Hero Section: Service description, badge */}
  {/* Press Preference Cards: Horizontal scroll */}
  {/* Starch Options: Segmented control if Extra Crisp selected */}
  {/* Item Selection Grid: Item cards, quantity selectors */}
  {/* Bundle Deals Carousel: Horizontal scroll, apply deal */}
  {/* Special Instructions: Text input for instructions */}
  {/* Price Breakdown Card: All price details */}
  {/* Quick Tips Section: Collapsible info */}
  {/* Action Buttons: Add to cart, schedule pickup */}
  {/* Related Services Section: Dry Cleaning, Wash & Fold links */}
  {/* Quick Repeat Previous Order: Repeat, reset buttons */}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Pricing and options
const ironingPricing = {
  items: [
    { id: 'dress-shirt', name: 'Dress Shirt', basePrice: 2.99, icon: '👔', bundleEligible: true },
    { id: 'pants', name: 'Pants/Trousers', basePrice: 3.99, icon: '👖', bundleEligible: true },
    { id: 'skirt', name: 'Skirt', basePrice: 3.49, icon: '👗', bundleEligible: true },
    { id: 'blouse', name: 'Blouse', basePrice: 3.49, icon: '👚', bundleEligible: true },
    { id: 'dress', name: 'Dress', basePrice: 5.99, icon: '👗', bundleEligible: false },
    { id: 'uniform', name: 'Uniform', basePrice: 4.99, icon: '👔', bundleEligible: true },
    { id: 'table-linen', name: 'Table Linen', basePrice: 4.99, icon: '🍽️', bundleEligible: false },
    { id: 'bed-sheet', name: 'Bed Sheet', basePrice: 5.99, icon: '🛏️', bundleEligible: false }
  ],
  starchOptions: [
    { id: 'none', name: 'No Starch', price: 0 },
    { id: 'light', name: 'Light Starch', price: 0.5 },
    { id: 'heavy', name: 'Heavy Starch', price: 1.0 }
  ],
  pressOptions: [
    { id: 'standard', name: 'Standard Press', description: 'Professional finish', price: 0 },
    { id: 'crisp', name: 'Extra Crisp', description: 'Military-style sharp creases', price: 1.0 },
    { id: 'light', name: 'Light Steam', description: 'Minimal pressing, remove wrinkles only', price: 0 }
  ],
  bundleDeals: [
    { id: 'shirt-pack', name: '5 Shirts Special', items: { 'dress-shirt': 5 }, price: 12.99, savings: 2.96 },
    { id: 'suit-pack', name: 'Suit Press', items: { 'dress-shirt': 1, 'pants': 1 }, price: 5.99, savings: 0.99 },
    { id: 'uniform-pack', name: '3 Uniforms', items: { 'uniform': 3 }, price: 12.99, savings: 2.98 }
  ]
};

const pressOptions = ironingPricing.pressOptions;
const starchOptions = ironingPricing.starchOptions;
const bundleDeals = ironingPricing.bundleDeals;

export default function IroningScreen() {
  const navigation = useNavigation();

  // State declarations
  const [quantities, setQuantities] = useState({
    'dress-shirt': 0,
    'pants': 0,
    'skirt': 0,
    'blouse': 0,
    'dress': 0,
    'uniform': 0,
    'table-linen': 0,
    'bed-sheet': 0
  });
  const [pressType, setPressType] = useState('standard');
  const [starchType, setStarchType] = useState('none');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [appliedBundle, setAppliedBundle] = useState(null);
  const [showBundles, setShowBundles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [error, setError] = useState('');
  const [previousOrder, setPreviousOrder] = useState(null);

  // Update quantity for an item
  const updateQuantity = (itemId, increment) => {
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[itemId] || 0) + increment);
      return { ...prev, [itemId]: newQty };
    });
  };

  // Calculate item price with upgrades
  const calculateItemPrice = (itemId, quantity) => {
    const item = ironingPricing.items.find(i => i.id === itemId);
    if (!item || quantity === 0) return 0;
    let price = item.basePrice * quantity;
    if (pressType === 'crisp') {
      price += quantity * 1.0;
    }
    return price;
  };

  // Calculate starch charges
  const calculateStarchCharges = () => {
    if (starchType === 'none') return 0;
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    const starchPrice = starchOptions.find(s => s.id === starchType)?.price || 0;
    return totalItems * starchPrice;
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    let total = 0;
    Object.entries(quantities).forEach(([itemId, qty]) => {
      if (qty > 0) {
        total += calculateItemPrice(itemId, qty);
      }
    });
    return total;
  };

  // Calculate total with all charges and savings
  const calculateTotal = () => {
    let total = calculateSubtotal();
    total += calculateStarchCharges();
    if (appliedBundle) {
      const bundle = bundleDeals.find(b => b.id === appliedBundle);
      if (bundle) {
        total = bundle.price;
      }
    }
    return total;
  };

  // Check for applicable bundles
  useEffect(() => {
    const applicableBundles = bundleDeals.filter(bundle => {
      return Object.entries(bundle.items).every(([itemId, requiredQty]) => {
        return (quantities[itemId] || 0) >= requiredQty;
      });
    });
    setShowBundles(applicableBundles.length > 0);
  }, [quantities]);

  // Apply a bundle deal
  const applyBundle = (bundleId) => {
    const bundle = bundleDeals.find(b => b.id === bundleId);
    if (bundle) {
      setQuantities(bundle.items);
      setAppliedBundle(bundleId);
    }
  };

  // Validate order
  const validateOrder = () => {
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
      setError('Please select at least one item to iron');
      return false;
    }
    setError('');
    return true;
  };

  // Handle schedule pickup
  const handleSchedulePickup = () => {
    if (!validateOrder()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const orderData = {
        serviceType: 'ironing',
        items: quantities,
        pressType,
        starchType,
        specialInstructions,
        appliedBundle,
        subtotal: calculateSubtotal(),
        starchCharges: calculateStarchCharges(),
        total: calculateTotal(),
        itemCount: Object.values(quantities).reduce((a, b) => a + b, 0)
      };
      navigation.navigate('PickupSchedule', { orderData });
    }, 1200);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!validateOrder()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Added to Cart', 'Your Ironing order has been added to the cart.');
    }, 800);
  };

  // Quick repeat previous order
  const handleRepeatOrder = () => {
    if (!previousOrder) return;
    setQuantities(previousOrder.quantities);
    setPressType(previousOrder.pressType);
    setStarchType(previousOrder.starchType);
    setSpecialInstructions(previousOrder.specialInstructions);
    setAppliedBundle(previousOrder.appliedBundle);
  };

  // Reset form
  const handleReset = () => {
    setQuantities({
      'dress-shirt': 0,
      'pants': 0,
      'skirt': 0,
      'blouse': 0,
      'dress': 0,
      'uniform': 0,
      'table-linen': 0,
      'bed-sheet': 0
    });
    setPressType('standard');
    setStarchType('none');
    setSpecialInstructions('');
    setAppliedBundle(null);
    setError('');
  };

  // Simulate previous order fetch
  useEffect(() => {
    setPreviousOrder({
      quantities: { 'dress-shirt': 2, 'pants': 1, 'skirt': 0, 'blouse': 1, 'dress': 0, 'uniform': 0, 'table-linen': 0, 'bed-sheet': 0 },
      pressType: 'crisp',
      starchType: 'light',
      specialInstructions: 'Extra care for collars.',
      appliedBundle: null,
    });
  }, []);

  // UI Components
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ironing Services</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Crisp & Professional</Text>
        <Text style={styles.heroDesc}>Expert pressing for wrinkle-free garments. Perfect for shirts, pants, uniforms, and more.</Text>
        <View style={styles.badgeRow}>
          <FontAwesome name="bolt" size={16} color="#FF9800" />
          <Text style={styles.badgeText}>Same-day available</Text>
        </View>
      </View>

      {/* Press Preference Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pressScroll}>
        {pressOptions.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.pressCard, pressType === opt.id && styles.pressSelected]}
            onPress={() => setPressType(opt.id)}
            disabled={loading}
          >
            <Text style={styles.pressName}>{opt.name}</Text>
            <Text style={styles.pressDesc}>{opt.description}</Text>
            {opt.price > 0 && <Text style={styles.pressUpcharge}>+${opt.price.toFixed(2)}/item</Text>}
            {opt.id === 'crisp' && <FontAwesome name="star" size={16} color="#FF9800" style={{ marginTop: 4 }} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Starch Options (if Extra Crisp selected) */}
      {pressType === 'crisp' && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Starch Preference</Text>
          <View style={styles.segmentRow}>
            {starchOptions.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.segment, starchType === opt.id && styles.segmentSelected]}
                onPress={() => setStarchType(opt.id)}
                disabled={loading}
              >
                <Text style={styles.segmentText}>{opt.name}</Text>
                {opt.price > 0 && <Text style={styles.starchUpcharge}>+${opt.price.toFixed(2)}/item</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Item Selection Grid */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>What needs ironing?</Text>
        <View style={styles.gridRow}>
          {ironingPricing.items.map(item => (
            <View key={item.id} style={[styles.itemCard, quantities[item.id] > 0 && styles.itemSelected]}> 
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.basePrice.toFixed(2)}</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                  disabled={loading || quantities[item.id] === 0}
                >
                  <Text style={styles.quantityBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                  disabled={loading}
                >
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              {quantities[item.id] > 0 && (
                <View style={styles.itemTotalBadge}>
                  <Text style={styles.itemTotalText}>${calculateItemPrice(item.id, quantities[item.id]).toFixed(2)}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Bundle Deals Carousel */}
      {showBundles && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bundleScroll}>
          {bundleDeals.map(bundle => {
            // Only show if quantities match bundle
            const matches = Object.entries(bundle.items).every(([itemId, requiredQty]) => {
              return (quantities[itemId] || 0) >= requiredQty;
            });
            if (!matches) return null;
            return (
              <View key={bundle.id} style={styles.bundleCard}>
                <Text style={styles.bundleName}>{bundle.name}</Text>
                <Text style={styles.bundleIncludes}>Includes: {Object.entries(bundle.items).map(([item, qty]) => `${qty} ${ironingPricing.items.find(i => i.id === item)?.name || item}`).join(', ')}</Text>
                <View style={styles.bundlePricing}>
                  <Text style={styles.bundlePrice}>${bundle.price.toFixed(2)}</Text>
                  <Text style={styles.bundleSavings}>Save ${bundle.savings.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.applyBundleButton}
                  onPress={() => applyBundle(bundle.id)}
                  disabled={loading}
                >
                  <Text style={styles.applyBundleText}>Apply Deal</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Special Instructions */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Special Instructions</Text>
        <TextInput
          style={styles.specialInput}
          placeholder="Specific pressing instructions? Delicate fabrics, extra care areas..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          editable={!loading}
          maxLength={500}
        />
        <Text style={styles.charCount}>{specialInstructions.length}/500</Text>
      </View>

      {/* Price Breakdown Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Price Breakdown</Text>
        {Object.entries(quantities).map(([itemId, qty]) => qty > 0 && (
          <View key={itemId} style={styles.priceRow}>
            <Text>{ironingPricing.items.find(i => i.id === itemId)?.name} ({qty}x)</Text>
            <Text>${calculateItemPrice(itemId, qty).toFixed(2)}</Text>
          </View>
        ))}
        {pressType === 'crisp' && (
          <View style={styles.priceRow}><Text>Extra Crisp Upcharge</Text><Text>+${(Object.values(quantities).reduce((a, b) => a + b, 0) * 1.0).toFixed(2)}</Text></View>
        )}
        {starchType !== 'none' && pressType === 'crisp' && (
          <View style={styles.priceRow}><Text>Starch Upcharge</Text><Text>+${calculateStarchCharges().toFixed(2)}</Text></View>
        )}
        {appliedBundle && (
          <View style={styles.priceRow}><Text>Bundle Deal Applied</Text><Text>-${(calculateSubtotal() + calculateStarchCharges() - bundleDeals.find(b => b.id === appliedBundle)?.price).toFixed(2)}</Text></View>
        )}
        <View style={styles.priceRow}><Text style={styles.priceTotal}>Total</Text><Text style={styles.priceTotal}>${calculateTotal().toFixed(2)}</Text></View>
        <Text style={styles.priceNote}>Professional pressing guarantees crisp results</Text>
      </View>

      {/* Quick Tips Section */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowTips(!showTips)} style={styles.tipsToggle}>
          <Text style={styles.sectionLabel}>Quick Tips</Text>
          <Ionicons name={showTips ? 'chevron-up' : 'chevron-down'} size={20} color="#FF9800" />
        </TouchableOpacity>
        {showTips && (
          <View style={styles.tipsContent}>
            <Text style={styles.tipText}>• Shirts include collar and cuff pressing</Text>
            <Text style={styles.tipText}>• Pants include crease preservation</Text>
            <Text style={styles.tipText}>• Dresses pressed according to fabric type</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleAddToCart} disabled={loading}>
          {loading ? <ActivityIndicator color="#FF9800" /> : <Text style={styles.actionBtnText}>Add to Cart</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={handleSchedulePickup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnTextPrimary}>Schedule Pickup</Text>}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Related Services Section */}
      <View style={styles.relatedRow}>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('DryCleaningScreen')}>
          <FontAwesome name="tint" size={20} color="#FF9800" />
          <Text style={styles.relatedBtnText}>Dry Cleaning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('WashFoldScreen')}>
          <MaterialIcons name="local-laundry-service" size={20} color="#FF9800" />
          <Text style={styles.relatedBtnText}>Wash & Fold</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Repeat Previous Order */}
      <View style={styles.repeatRow}>
        <TouchableOpacity style={styles.repeatBtn} onPress={handleRepeatOrder} disabled={!previousOrder || loading}>
          <MaterialIcons name="history" size={20} color="#FF9800" />
          <Text style={styles.repeatBtnText}>Repeat Previous Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} disabled={loading}>
          <Ionicons name="refresh" size={20} color="#FF9800" />
          <Text style={styles.resetBtnText}>Reset Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  badgeText: {
    color: '#FF9800',
    fontSize: 13,
    marginLeft: 6,
  },
  pressScroll: {
    marginVertical: 8,
  },
  pressCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pressSelected: {
    backgroundColor: '#FF9800',
  },
  pressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pressDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  pressUpcharge: {
    color: '#FF9800',
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  segment: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  segmentSelected: {
    backgroundColor: '#FF9800',
  },
  segmentText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  starchUpcharge: {
    color: '#FF9800',
    fontSize: 12,
    marginLeft: 4,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  itemIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantityButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotalBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  itemTotalText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bundleScroll: {
    marginVertical: 8,
  },
  bundleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bundleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bundleIncludes: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  bundlePricing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bundlePrice: {
    fontSize: 15,
    color: '#FF9800',
    fontWeight: 'bold',
    marginRight: 8,
  },
  bundleSavings: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  applyBundleButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  applyBundleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  specialInput: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 44,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  tipsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tipsContent: {
    marginTop: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryBtn: {
    backgroundColor: '#FF9800',
  },
  secondaryBtn: {
    backgroundColor: '#E0E0E0',
  },
  actionBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionBtnTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  relatedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  relatedBtnText: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  repeatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  repeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  repeatBtnText: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  resetBtnText: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
});