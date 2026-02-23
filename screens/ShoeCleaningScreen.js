// ShoeCleaningScreen.js
// Complete Shoe Cleaning ordering screen for laundromat app
// Includes: UI, state, price logic, validation, navigation, add-ons, accessibility

  // State declarations
  // All user selections and form state
  // Add a new shoe entry
  // Handles adding a shoe type to the order
  // Update shoe entry
  // Handles updating shoe details (quantity, material, condition)
  // Remove shoe entry
  // Handles removing a shoe from the order
  // Calculate shoe price
  // Returns price for shoe entry including cleaning level, material, condition
  // Calculate base total
  // Returns subtotal for all shoe entries
  // Calculate add-ons total
  // Returns subtotal for all selected add-ons
  // Calculate total pairs
  // Returns total pairs of shoes in the order
  // Calculate final total
  // Returns total price for the order
  // Validate order
  // Checks if at least one shoe entry is present
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
  {/* Hero Section: Service description, badges */}
  {/* Cleaning Level Selector: Horizontal scroll */}
  {/* Shoe Type Selection Grid: Shoe cards, add button */}
  {/* Shoe Entry Detail Cards: Quantity, material, condition, price */}
  {/* Add-Ons Section: Add-on cards, toggle selection */}
  {/* Special Instructions: Text input for instructions */}
  {/* Price Breakdown Card: All price details */}
  {/* Care Guide Accordion: Collapsible info */}
  {/* Action Buttons: Add to cart, schedule pickup */}
  {/* Related Services Section: Dry Cleaning, Alterations links */}
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
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Pricing and options
const shoeCleaningPricing = {
  shoeTypes: [
    { id: 'sneakers', name: 'Sneakers/Athletic', basePrice: 15.99, icon: '👟', description: 'Canvas, mesh, synthetic', careLevels: ['standard', 'premium', 'quick'] },
    { id: 'leather-dress', name: 'Leather Dress Shoes', basePrice: 18.99, icon: '👞', description: 'Genuine leather, patent leather', careLevels: ['standard', 'premium'] },
    { id: 'canvas', name: 'Canvas Shoes', basePrice: 14.99, icon: '👟', description: 'Fabric, espadrilles', careLevels: ['standard', 'quick'] },
    { id: 'boots-ankle', name: 'Ankle Boots', basePrice: 22.99, icon: '👢', description: 'Up to 6" height', careLevels: ['standard', 'premium'] },
    { id: 'boots-knee', name: 'Knee-High Boots', basePrice: 29.99, icon: '👢', description: 'Over 6" height', careLevels: ['standard', 'premium'] },
    { id: 'suede', name: 'Suede', basePrice: 24.99, icon: '👞', description: 'Specialized suede care', careLevels: ['premium'] },
    { id: 'sandals', name: 'Sandals/Flip Flops', basePrice: 9.99, icon: '🩴', description: 'Quick refresh', careLevels: ['quick'] }
  ],
  cleaningLevels: [
    { id: 'quick', name: 'Quick Refresh', price: 0, description: 'Surface clean, deodorize, light spot treatment', turnaround: '24 hours', includes: ['Surface cleaning', 'Deodorizing', 'Light spot treatment'] },
    { id: 'standard', name: 'Standard Deep Clean', price: 0, description: 'Deep clean, deodorize, stain treatment', turnaround: '48 hours', includes: ['Deep scrubbing', 'Stain treatment', 'Deodorizing', 'Laces cleaned'] },
    { id: 'premium', name: 'Premium Restore', price: 10, description: 'Deep clean + conditioning + waterproofing', turnaround: '72 hours', includes: ['Deep clean', 'Stain treatment', 'Conditioning', 'Waterproofing', 'Color restoration', 'New laces'] }
  ],
  addOns: [
    { id: 'waterproofing', name: 'Waterproofing Treatment', price: 5.99, icon: '💧' },
    { id: 'color-restore', name: 'Color Restoration', price: 7.99, icon: '🎨' },
    { id: 'scuff-removal', name: 'Scuff Mark Removal', price: 3.99, icon: '✨' },
    { id: 'lace-replacement', name: 'New Laces (white)', price: 2.99, icon: '🪢' },
    { id: 'lace-replacement-color', name: 'New Laces (colored)', price: 3.99, icon: '🎨' },
    { id: 'insole-replacement', name: 'New Insoles', price: 8.99, icon: '👣' }
  ],
  materialUpcharges: {
    'suede': 5,
    'exotic-leather': 10,
    'patent': 3
  }
};

const cleaningLevels = shoeCleaningPricing.cleaningLevels;
const addOns = shoeCleaningPricing.addOns;

export default function ShoeCleaningScreen() {
  const navigation = useNavigation();

  // State declarations
  const [shoeEntries, setShoeEntries] = useState([]); // Each entry: { id, type, quantity, material, condition, photos, notes }
  const [cleaningLevel, setCleaningLevel] = useState('standard');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedShoe, setExpandedShoe] = useState(null);
  const [showCareGuide, setShowCareGuide] = useState(false);
  const [error, setError] = useState('');
  const [previousOrder, setPreviousOrder] = useState(null);

  // Add a new shoe entry
  const addShoeEntry = (shoeType) => {
    const newEntry = {
      id: Date.now().toString(),
      type: shoeType.id,
      quantity: 1,
      material: 'standard',
      condition: 'good',
      photos: [],
      notes: ''
    };
    setShoeEntries([...shoeEntries, newEntry]);
    setExpandedShoe(newEntry.id);
  };

  // Update shoe entry
  const updateShoeEntry = (entryId, updates) => {
    setShoeEntries(prev => prev.map(entry => entry.id === entryId ? { ...entry, ...updates } : entry));
  };

  // Remove shoe entry
  const removeShoeEntry = (entryId) => {
    setShoeEntries(prev => prev.filter(entry => entry.id !== entryId));
    if (expandedShoe === entryId) setExpandedShoe(null);
  };

  // Calculate shoe price
  const calculateShoePrice = (entry) => {
    const shoeType = shoeCleaningPricing.shoeTypes.find(s => s.id === entry.type);
    if (!shoeType) return 0;
    let price = shoeType.basePrice * entry.quantity;
    if (cleaningLevel === 'premium') price += entry.quantity * 10;
    if (entry.material === 'suede') price += entry.quantity * 5;
    if (entry.material === 'exotic') price += entry.quantity * 10;
    if (entry.condition === 'very-dirty') price = price * 1.2;
    return price;
  };

  // Calculate base total
  const calculateBaseTotal = () => shoeEntries.reduce((total, entry) => total + calculateShoePrice(entry), 0);

  // Calculate add-ons total
  const calculateAddOnsTotal = () => selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  // Calculate total pairs
  const getTotalPairs = () => shoeEntries.reduce((total, entry) => total + entry.quantity, 0);

  // Calculate final total
  const calculateTotal = () => calculateBaseTotal() + calculateAddOnsTotal();

  // Validate order
  const validateOrder = () => {
    if (shoeEntries.length === 0) {
      setError('Please add at least one pair of shoes');
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
        serviceType: 'shoe-cleaning',
        cleaningLevel,
        shoeEntries: shoeEntries.map(entry => ({ ...entry, price: calculateShoePrice(entry) })),
        addOns: selectedAddOns,
        specialInstructions,
        photos,
        pairCount: getTotalPairs(),
        baseTotal: calculateBaseTotal(),
        addOnsTotal: calculateAddOnsTotal(),
        total: calculateTotal()
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
      Alert.alert('Added to Cart', 'Your Shoe Cleaning order has been added to the cart.');
    }, 800);
  };

  // Quick repeat previous order
  const handleRepeatOrder = () => {
    if (!previousOrder) return;
    setShoeEntries(previousOrder.shoeEntries);
    setCleaningLevel(previousOrder.cleaningLevel);
    setSelectedAddOns(previousOrder.selectedAddOns);
    setSpecialInstructions(previousOrder.specialInstructions);
    setPhotos(previousOrder.photos);
  };

  // Reset form
  const handleReset = () => {
    setShoeEntries([]);
    setCleaningLevel('standard');
    setSelectedAddOns([]);
    setSpecialInstructions('');
    setPhotos([]);
    setError('');
  };

  // Simulate previous order fetch
  useEffect(() => {
    setPreviousOrder({
      shoeEntries: [
        { id: '1', type: 'sneakers', quantity: 2, material: 'standard', condition: 'worn', photos: [], notes: 'Mud stains on soles.' }
      ],
      cleaningLevel: 'premium',
      selectedAddOns: ['waterproofing'],
      specialInstructions: 'Please focus on deodorizing.',
      photos: [],
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
        <Text style={styles.headerTitle}>Shoe Cleaning</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Fresh Kicks, Clean Kicks</Text>
        <Text style={styles.heroDesc}>Professional shoe cleaning and restoration. From sneakers to boots, we bring them back to life.</Text>
        <View style={styles.badgeRow}>
          <FontAwesome name="tint" size={16} color="#4A90E2" />
          <Text style={styles.badgeText}>Deep Cleaning</Text>
          <FontAwesome name="star" size={16} color="#4A90E2" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Deodorizing</Text>
          <FontAwesome name="shield" size={16} color="#4A90E2" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Waterproofing Available</Text>
        </View>
      </View>

      {/* Cleaning Level Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelScroll}>
        {cleaningLevels.map(level => (
          <TouchableOpacity
            key={level.id}
            style={[styles.levelCard, cleaningLevel === level.id && styles.levelSelected]}
            onPress={() => setCleaningLevel(level.id)}
            disabled={loading}
          >
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelDesc}>{level.description}</Text>
            <Text style={styles.levelTurnaround}>{level.turnaround}</Text>
            {level.price > 0 && <Text style={styles.levelUpcharge}>+${level.price.toFixed(2)}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shoe Type Selection Grid */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>What shoes are we cleaning?</Text>
        <View style={styles.gridRow}>
          {shoeCleaningPricing.shoeTypes.map(shoeType => (
            <TouchableOpacity 
              key={shoeType.id}
              style={styles.shoeTypeCard}
              onPress={() => addShoeEntry(shoeType)}
              disabled={loading}
            >
              <Text style={styles.shoeIcon}>{shoeType.icon}</Text>
              <Text style={styles.shoeName}>{shoeType.name}</Text>
              <Text style={styles.shoePrice}>${shoeType.basePrice.toFixed(2)}</Text>
              <Text style={styles.shoeDescription}>{shoeType.description}</Text>
              <View style={styles.addButton}><Text style={styles.addButtonText}>+ Add</Text></View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Shoe Entry Detail Cards */}
      {shoeEntries.map(entry => (
        <View key={entry.id} style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{shoeCleaningPricing.shoeTypes.find(s => s.id === entry.type)?.icon} {shoeCleaningPricing.shoeTypes.find(s => s.id === entry.type)?.name}</Text>
            <TouchableOpacity onPress={() => removeShoeEntry(entry.id)}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {/* Quantity selector */}
          <View style={styles.quantityRow}>
            <Text>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateShoeEntry(entry.id, { quantity: Math.max(1, entry.quantity - 1) })}
                disabled={loading || entry.quantity === 1}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{entry.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateShoeEntry(entry.id, { quantity: entry.quantity + 1 })}
                disabled={loading}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Material selector (if applicable) */}
          {['leather-dress', 'suede', 'boots-ankle', 'boots-knee'].includes(entry.type) && (
            <View style={styles.materialRow}>
              <Text>Material:</Text>
              <View style={styles.materialChips}>
                {['standard', 'suede', 'exotic'].map(material => (
                  <TouchableOpacity
                    key={material}
                    style={[styles.materialChip, entry.material === material && styles.materialChipSelected]}
                    onPress={() => updateShoeEntry(entry.id, { material })}
                    disabled={loading}
                  >
                    <Text style={styles.materialChipText}>{material === 'standard' ? 'Standard' : material.charAt(0).toUpperCase() + material.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {/* Condition selector */}
          <View style={styles.conditionRow}>
            <Text>Condition:</Text>
            <View style={styles.conditionChips}>
              {['good', 'worn', 'very-dirty'].map(condition => (
                <TouchableOpacity
                  key={condition}
                  style={[styles.conditionChip, entry.condition === condition && styles.conditionChipSelected]}
                  onPress={() => updateShoeEntry(entry.id, { condition })}
                  disabled={loading}
                >
                  <Text style={[styles.conditionText, entry.condition === condition && styles.conditionTextSelected]}>{condition === 'good' ? 'Good' : condition === 'worn' ? 'Worn' : 'Very Dirty'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Entry price */}
          <View style={styles.entryPrice}>
            <Text style={styles.entryPriceLabel}>Price:</Text>
            <Text style={styles.entryPriceValue}>${calculateShoePrice(entry).toFixed(2)}</Text>
          </View>
        </View>
      ))}

      {/* Add-Ons Section */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Add-On Services</Text>
        <View style={styles.gridRow}>
          {addOns.map(addOn => (
            <TouchableOpacity
              key={addOn.id}
              style={[styles.addOnCard, selectedAddOns.includes(addOn.id) && styles.addOnCardSelected]}
              onPress={() => {
                if (selectedAddOns.includes(addOn.id)) {
                  setSelectedAddOns(prev => prev.filter(id => id !== addOn.id));
                } else {
                  setSelectedAddOns(prev => [...prev, addOn.id]);
                }
              }}
              disabled={loading}
            >
              <Text style={styles.addOnIcon}>{addOn.icon}</Text>
              <View style={styles.addOnInfo}>
                <Text style={styles.addOnName}>{addOn.name}</Text>
                <Text style={styles.addOnPrice}>+${addOn.price.toFixed(2)}</Text>
              </View>
              <View style={styles.addOnCheckbox}>{selectedAddOns.includes(addOn.id) && <FontAwesome name="check" size={16} color="#4A90E2" />}</View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Instructions */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Special Instructions</Text>
        <TextInput
          style={styles.specialInput}
          placeholder="Describe any specific stains, damage, or concerns..."
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
        {shoeEntries.map(entry => (
          <View key={entry.id} style={styles.priceRow}>
            <Text>{shoeCleaningPricing.shoeTypes.find(s => s.id === entry.type)?.name} ({entry.quantity}x)</Text>
            <Text>${calculateShoePrice(entry).toFixed(2)}</Text>
          </View>
        ))}
        {selectedAddOns.length > 0 && (
          <View style={styles.priceRow}><Text>Add-Ons</Text><Text>+${calculateAddOnsTotal().toFixed(2)}</Text></View>
        )}
        <View style={styles.priceRow}><Text style={styles.priceTotal}>Total</Text><Text style={styles.priceTotal}>${calculateTotal().toFixed(2)}</Text></View>
        <Text style={styles.priceNote}>Price includes deodorizing and basic stain treatment</Text>
      </View>

      {/* Care Guide Accordion */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowCareGuide(!showCareGuide)} style={styles.careGuideToggle}>
          <Text style={styles.sectionLabel}>Care Guide</Text>
          <Ionicons name={showCareGuide ? 'chevron-up' : 'chevron-down'} size={20} color="#4A90E2" />
        </TouchableOpacity>
        {showCareGuide && (
          <View style={styles.careGuideContent}>
            <Text style={styles.careGuideText}>• Sneakers: Avoid harsh chemicals, air dry only.</Text>
            <Text style={styles.careGuideText}>• Leather: Conditioning recommended after cleaning.</Text>
            <Text style={styles.careGuideText}>• Suede: Special brush and waterproofing.</Text>
            <Text style={styles.careGuideText}>• Boots: Store upright, avoid direct heat.</Text>
            <Text style={styles.careGuideText}>• Sandals: Quick refresh, deodorize straps.</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleAddToCart} disabled={loading}>
          {loading ? <ActivityIndicator color="#4A90E2" /> : <Text style={styles.actionBtnText}>Add to Cart</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={handleSchedulePickup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnTextPrimary}>Schedule Pickup</Text>}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Related Services Section */}
      <View style={styles.relatedRow}>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('DryCleaningScreen')}>
          <FontAwesome name="tint" size={20} color="#4A90E2" />
          <Text style={styles.relatedBtnText}>Dry Cleaning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('AlterationsScreen')}>
          <MaterialIcons name="cut" size={20} color="#4A90E2" />
          <Text style={styles.relatedBtnText}>Alterations</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Repeat Previous Order */}
      <View style={styles.repeatRow}>
        <TouchableOpacity style={styles.repeatBtn} onPress={handleRepeatOrder} disabled={!previousOrder || loading}>
          <MaterialIcons name="history" size={20} color="#4A90E2" />
          <Text style={styles.repeatBtnText}>Repeat Previous Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} disabled={loading}>
          <Ionicons name="refresh" size={20} color="#4A90E2" />
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
    backgroundColor: '#4A90E2',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  badgeText: {
    color: '#4A90E2',
    fontSize: 13,
    marginLeft: 6,
  },
  levelScroll: {
    marginVertical: 8,
  },
  levelCard: {
    backgroundColor: '#E3F2FD',
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
  levelSelected: {
    backgroundColor: '#4A90E2',
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  levelTurnaround: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  levelUpcharge: {
    color: '#FF6B6B',
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
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shoeTypeCard: {
    backgroundColor: '#E3F2FD',
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
  shoeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  shoeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  shoePrice: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  shoeDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
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
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  materialChips: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  materialChip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  materialChipSelected: {
    backgroundColor: '#4A90E2',
  },
  materialChipText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionChips: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  conditionChip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  conditionChipSelected: {
    backgroundColor: '#4A90E2',
  },
  conditionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  conditionTextSelected: {
    color: '#fff',
  },
  entryPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  entryPriceLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  entryPriceValue: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  addOnCard: {
    backgroundColor: '#E3F2FD',
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
  addOnCardSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  addOnIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  addOnInfo: {
    alignItems: 'center',
  },
  addOnName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  addOnPrice: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  addOnCheckbox: {
    marginTop: 4,
  },
  specialInput: {
    backgroundColor: '#E3F2FD',
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
    color: '#4A90E2',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  careGuideToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  careGuideContent: {
    marginTop: 4,
  },
  careGuideText: {
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
    backgroundColor: '#4A90E2',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  relatedBtnText: {
    color: '#4A90E2',
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
    color: '#4A90E2',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
});