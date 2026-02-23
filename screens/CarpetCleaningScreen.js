
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Pricing and options
const carpetCleaningPricing = {
  rugTypes: [
    { id: 'area-rug', name: 'Area Rug', baseMultiplier: 1.0, icon: '🖼️', description: 'Standard machine-made rugs' },
    { id: 'runner', name: 'Runner Rug', baseMultiplier: 1.1, icon: '📏', description: 'Long, narrow hallway rugs' },
    { id: 'bath-mat', name: 'Bath Mat', baseMultiplier: 0.7, icon: '🚿', description: 'Small bathroom mats' },
    { id: 'decorative', name: 'Decorative Rug', baseMultiplier: 1.0, icon: '🎨', description: 'Accent pieces' },
    { id: 'oriental', name: 'Oriental/Persian', baseMultiplier: 1.5, icon: '🏺', description: 'Hand-woven, delicate' },
    { id: 'wool', name: 'Wool Rug', baseMultiplier: 1.3, icon: '🐑', description: 'Natural fiber, special care' },
    { id: 'synthetic', name: 'Synthetic', baseMultiplier: 0.9, icon: '🧪', description: 'Polyester, nylon, olefin' }
  ],
  sizeCategories: [
    { id: 'small', name: 'Small', dimensions: '2x3 - 4x6 ft', sqft: '6-24', basePrice: 29.99 },
    { id: 'medium', name: 'Medium', dimensions: '5x7 - 6x9 ft', sqft: '35-54', basePrice: 49.99 },
    { id: 'large', name: 'Large', dimensions: '8x10 - 9x12 ft', sqft: '80-108', basePrice: 79.99 },
    { id: 'xl', name: 'Extra Large', dimensions: '10x14+ ft', sqft: '140+', basePrice: 129.99 }
  ],
  cleaningMethods: [
    { id: 'steam', name: 'Hot Water Extraction', description: 'Deep steam cleaning, fastest drying', multiplier: 1.0, icon: '💨' },
    { id: 'dry', name: 'Dry Cleaning', description: 'Gentle, no water, for delicate rugs', multiplier: 1.2, icon: '🧹' },
    { id: 'eco', name: 'Eco-Friendly', description: 'Green products, hypoallergenic', multiplier: 1.15, icon: '🌱' }
  ],
  soilLevels: [
    { id: 'light', name: 'Light', multiplier: 1.0, description: 'Regular maintenance' },
    { id: 'medium', name: 'Medium', multiplier: 1.2, description: 'Normal wear, light traffic' },
    { id: 'heavy', name: 'Heavy', multiplier: 1.5, description: 'High traffic, pets' },
    { id: 'extreme', name: 'Extreme', multiplier: 2.0, description: 'Deep stains, neglect' }
  ],
  addOns: [
    { id: 'stain-protect', name: 'Stain Protection', price: 14.99, icon: '🛡️' },
    { id: 'deodorize', name: 'Deodorizing', price: 9.99, icon: '🌸' },
    { id: 'pet-odor', name: 'Pet Odor Removal', price: 19.99, icon: '🐕' },
    { id: 'spot-treatment', name: 'Spot Stain Treatment', price: 7.99, icon: '✨' },
    { id: 'fringe-clean', name: 'Fringe Cleaning', price: 12.99, icon: '🎀' },
    { id: 'backing-clean', name: 'Backing Cleaning', price: 15.99, icon: '⬇️' }
  ],
  pricePerSqFt: 2.49,
  pickupFee: 9.99,
  deliveryFee: 9.99,
  roundTripFee: 14.99
};

export default function CarpetCleaningScreen() {
  const navigation = useNavigation();

  // State declarations
  const [rugType, setRugType] = useState('area-rug');
  const [sizeCategory, setSizeCategory] = useState('medium');
  const [customSize, setCustomSize] = useState({ width: 0, length: 0, unit: 'ft' });
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [cleaningMethod, setCleaningMethod] = useState('steam');
  const [soilLevel, setSoilLevel] = useState('medium');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [needPickup, setNeedPickup] = useState(false);
  const [pickupType, setPickupType] = useState('round-trip');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCareGuide, setShowCareGuide] = useState(false);

  // Calculate square footage
  const calculateSquareFootage = () => {
    if (useCustomSize) {
      let width = customSize.width;
      let length = customSize.length;
      if (customSize.unit === 'in') {
        width = width / 12;
        length = length / 12;
      }
      return Math.round(width * length * 100) / 100;
    } else {
      switch(sizeCategory) {
        case 'small': return 15;
        case 'medium': return 45;
        case 'large': return 94;
        case 'xl': return 150;
        default: return 45;
      }
    }
  };

  // Calculate base price
  const calculateBasePrice = () => {
    let price = 0;
    if (useCustomSize) {
      const sqft = calculateSquareFootage();
      price = sqft * carpetCleaningPricing.pricePerSqFt;
    } else {
      const sizeCat = carpetCleaningPricing.sizeCategories.find(s => s.id === sizeCategory);
      price = sizeCat?.basePrice || 49.99;
    }
    const rugTypeData = carpetCleaningPricing.rugTypes.find(r => r.id === rugType);
    price *= rugTypeData?.baseMultiplier || 1.0;
    const soilData = carpetCleaningPricing.soilLevels.find(s => s.id === soilLevel);
    price *= soilData?.multiplier || 1.0;
    return Math.round(price * 100) / 100;
  };

  // Calculate method adjustment
  const calculateMethodAdjustment = () => {
    const method = carpetCleaningPricing.cleaningMethods.find(m => m.id === cleaningMethod);
    const basePrice = calculateBasePrice();
    return basePrice * (method?.multiplier - 1 || 0);
  };

  // Calculate add-ons total
  const calculateAddOnsTotal = () => selectedAddOns.reduce((total, addOnId) => {
    const addOn = carpetCleaningPricing.addOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  // Calculate pickup/delivery fees
  const calculatePickupFee = () => {
    if (!needPickup) return 0;
    switch(pickupType) {
      case 'pickup-only': return carpetCleaningPricing.pickupFee;
      case 'delivery-only': return carpetCleaningPricing.deliveryFee;
      case 'round-trip': return carpetCleaningPricing.roundTripFee;
      default: return 0;
    }
  };

  // Calculate total
  const calculateTotal = () => {
    const base = calculateBasePrice();
    const methodAdj = calculateMethodAdjustment();
    const addOns = calculateAddOnsTotal();
    const pickup = calculatePickupFee();
    return base + methodAdj + addOns + pickup;
  };

  // Get soil level description
  const getSoilLevelDescription = (level) => {
    const descriptions = {
      light: 'Regular maintenance, minimal soiling',
      medium: 'Normal wear, light traffic, routine cleaning',
      heavy: 'High traffic areas, pets, visible soiling',
      extreme: 'Deep stains, neglect, heavy pet odors'
    };
    return descriptions[level] || '';
  };

  // Validate dimensions
  const validateDimensions = () => {
    if (useCustomSize) {
      if (customSize.width <= 0 || customSize.length <= 0) {
        setError('Please enter valid dimensions');
        return false;
      }
      if (customSize.width > 20 || customSize.length > 20) {
        Alert.alert('Warning', 'Large rugs may require special handling');
      }
    }
    setError('');
    return true;
  };

  // Validate order
  const validateOrder = () => {
    if (!validateDimensions()) return false;
    if (needPickup && !selectedAddress) {
      setError('Please select a pickup/delivery address');
      return false;
    }
    setError('');
    return true;
  };

  // Handle schedule
  const handleScheduleService = () => {
    if (!validateOrder()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const orderData = {
        serviceType: 'carpet-cleaning',
        rugType,
        size: useCustomSize ? {
          type: 'custom',
          dimensions: customSize,
          squareFootage: calculateSquareFootage()
        } : {
          type: sizeCategory,
          category: carpetCleaningPricing.sizeCategories.find(s => s.id === sizeCategory)
        },
        cleaningMethod,
        soilLevel,
        addOns: selectedAddOns,
        specialInstructions,
        photos,
        pickupDelivery: needPickup ? {
          type: pickupType,
          address: selectedAddress
        } : null,
        pricing: {
          basePrice: calculateBasePrice(),
          methodAdjustment: calculateMethodAdjustment(),
          addOnsTotal: calculateAddOnsTotal(),
          pickupFee: calculatePickupFee(),
          total: calculateTotal()
        },
        dryingTime: cleaningMethod === 'steam' ? '4-6 hours' : cleaningMethod === 'dry' ? '1-2 hours' : '2-3 hours'
      };
      navigation.navigate('ScheduleService', { orderData });
    }, 1200);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!validateOrder()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Added to Cart', 'Your Carpet Cleaning order has been added to the cart.');
    }, 800);
  };

  // Reset form
  const handleReset = () => {
    setRugType('area-rug');
    setSizeCategory('medium');
    setCustomSize({ width: 0, length: 0, unit: 'ft' });
    setUseCustomSize(false);
    setCleaningMethod('steam');
    setSoilLevel('medium');
    setSelectedAddOns([]);
    setPhotos([]);
    setSpecialInstructions('');
    setNeedPickup(false);
    setPickupType('round-trip');
    setSelectedAddress(null);
    setError('');
  };

  // UI Components
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carpet Cleaning</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Deep Clean for Your Rugs</Text>
        <Text style={styles.heroDesc}>Professional carpet cleaning that removes dirt, stains, and allergens. Steam cleaning and dry cleaning options available.</Text>
        <View style={styles.badgeRow}>
          <FontAwesome name="paw" size={16} color="#50C878" />
          <Text style={styles.badgeText}>Pet Safe</Text>
          <FontAwesome name="leaf" size={16} color="#50C878" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Eco Options</Text>
          <FontAwesome name="clock-o" size={16} color="#4A90E2" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Quick Drying</Text>
        </View>
      </View>

      {/* Rug Type Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rugTypeScroll}>
        {carpetCleaningPricing.rugTypes.map(rug => (
          <TouchableOpacity
            key={rug.id}
            style={[styles.rugTypeChip, rugType === rug.id && styles.rugTypeChipSelected]}
            onPress={() => setRugType(rug.id)}
            disabled={loading}
          >
            <Text style={styles.rugTypeIcon}>{rug.icon}</Text>
            <Text style={styles.rugTypeName}>{rug.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Size Selection */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>What size is your rug?</Text>
        <View style={styles.gridRow}>
          {carpetCleaningPricing.sizeCategories.map(size => (
            <TouchableOpacity
              key={size.id}
              style={[styles.sizeCard, !useCustomSize && sizeCategory === size.id && styles.sizeCardSelected]}
              onPress={() => { setSizeCategory(size.id); setUseCustomSize(false); }}
              disabled={loading}
            >
              <Text style={styles.sizeName}>{size.name}</Text>
              <Text style={styles.sizeDimensions}>{size.dimensions}</Text>
              <Text style={styles.sizePrice}>${size.basePrice.toFixed(2)}</Text>
              <Text style={styles.sizeSqft}>{size.sqft} sq ft</Text>
            </TouchableOpacity>
          ))}
          {/* Custom Size Option */}
          <TouchableOpacity
            style={[styles.sizeCard, useCustomSize && styles.sizeCardSelected]}
            onPress={() => setUseCustomSize(true)}
            disabled={loading}
          >
            <Text style={styles.sizeName}>Custom Size</Text>
            <Text style={styles.sizeDimensions}>Enter dimensions</Text>
          </TouchableOpacity>
        </View>
        {/* Custom Size Inputs */}
        {useCustomSize && (
          <View style={styles.customSizeInputs}>
            <View style={styles.dimensionRow}>
              <Text>Width:</Text>
              <TextInput
                style={styles.dimensionInput}
                value={customSize.width ? customSize.width.toString() : ''}
                onChangeText={text => setCustomSize({ ...customSize, width: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
                editable={!loading}
              />
              <Text style={styles.dimensionUnit}>{customSize.unit}</Text>
            </View>
            <View style={styles.dimensionRow}>
              <Text>Length:</Text>
              <TextInput
                style={styles.dimensionInput}
                value={customSize.length ? customSize.length.toString() : ''}
                onChangeText={text => setCustomSize({ ...customSize, length: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
                editable={!loading}
              />
              <Text style={styles.dimensionUnit}>{customSize.unit}</Text>
            </View>
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[styles.unitBtn, customSize.unit === 'ft' && styles.unitBtnActive]}
                onPress={() => setCustomSize({ ...customSize, unit: 'ft' })}
                disabled={loading}
              >
                <Text>ft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitBtn, customSize.unit === 'in' && styles.unitBtnActive]}
                onPress={() => setCustomSize({ ...customSize, unit: 'in' })}
                disabled={loading}
              >
                <Text>in</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sqftDisplay}>Sq ft: {calculateSquareFootage()} • ${(calculateSquareFootage() * carpetCleaningPricing.pricePerSqFt).toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Cleaning Method Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.methodScroll}>
        {carpetCleaningPricing.cleaningMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, cleaningMethod === method.id && styles.methodCardSelected]}
            onPress={() => setCleaningMethod(method.id)}
            disabled={loading}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
            {method.multiplier > 1 && (
              <View style={styles.methodMultiplier}><Text style={styles.multiplierText}>+{((method.multiplier - 1) * 100).toFixed(0)}%</Text></View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Soil Level Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Soil Level</Text>
        <View style={styles.soilLevelRow}>
          {carpetCleaningPricing.soilLevels.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[styles.soilChip, soilLevel === level.id && styles.soilChipSelected]}
              onPress={() => setSoilLevel(level.id)}
              disabled={loading}
            >
              <Text style={styles.soilChipText}>{level.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.soilDescription}>{getSoilLevelDescription(soilLevel)}</Text>
      </View>

      {/* Add-Ons Grid */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Add-On Services</Text>
        <View style={styles.gridRow}>
          {carpetCleaningPricing.addOns.map(addOn => (
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
          placeholder="Describe specific stains, pet accidents, delicate areas..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          editable={!loading}
          maxLength={500}
        />
        <Text style={styles.charCount}>{specialInstructions.length}/500</Text>
      </View>

      {/* Price Breakdown Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Price Estimate</Text>
        <View style={styles.priceRow}><Text>Base cleaning</Text><Text>${calculateBasePrice().toFixed(2)}</Text></View>
        {calculateMethodAdjustment() > 0 && (
          <View style={styles.priceRow}><Text>{cleaningMethod === 'dry' ? 'Dry cleaning' : 'Eco-friendly'} premium</Text><Text>+${calculateMethodAdjustment().toFixed(2)}</Text></View>
        )}
        {selectedAddOns.length > 0 && (
          <View style={styles.priceRow}><Text>Add-ons ({selectedAddOns.length})</Text><Text>+${calculateAddOnsTotal().toFixed(2)}</Text></View>
        )}
        {calculatePickupFee() > 0 && (
          <View style={styles.priceRow}><Text>{pickupType.replace('-', ' ')} fee</Text><Text>+${calculatePickupFee().toFixed(2)}</Text></View>
        )}
        <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Estimated Total</Text><Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text></View>
        <Text style={styles.priceNote}>*Final price may be adjusted after inspection</Text>
      </View>

      {/* Pickup/Delivery Options */}
      <View style={styles.card}>
        <View style={styles.pickupToggle}>
          <Text style={styles.pickupLabel}>Need pickup & delivery?</Text>
          <Switch value={needPickup} onValueChange={setNeedPickup} trackColor={{ false: '#ddd', true: '#4A90E2' }} />
        </View>
        {needPickup && (
          <>
            <View style={styles.pickupTypeSelector}>
              {['pickup-only', 'delivery-only', 'round-trip'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.pickupTypeButton, pickupType === type && styles.pickupTypeButtonActive]}
                  onPress={() => setPickupType(type)}
                  disabled={loading}
                >
                  <Text style={[styles.pickupTypeText, pickupType === type && styles.pickupTypeTextActive]}>{type === 'pickup-only' ? 'Pickup Only' : type === 'delivery-only' ? 'Delivery Only' : 'Round Trip'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addressSelector} onPress={() => Alert.alert('Address', 'Address selection not implemented in this demo.') }>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.addressText}>{selectedAddress ? selectedAddress.label : 'Select address'}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Drying Time Info */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Estimated Drying Time</Text>
        <Text style={styles.dryingTimeText}>{cleaningMethod === 'steam' ? '4-6 hours' : cleaningMethod === 'dry' ? '1-2 hours' : '2-3 hours'}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleAddToCart} disabled={loading}>
          {loading ? <ActivityIndicator color="#4A90E2" /> : <Text style={styles.actionBtnText}>Add to Cart</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={handleScheduleService} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnTextPrimary}>Schedule Service</Text>}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Related Services Section */}
      <View style={styles.relatedRow}>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('ShoeCleaningScreen')}>
          <FontAwesome name="shoe-prints" size={20} color="#4A90E2" />
          <Text style={styles.relatedBtnText}>Shoe Cleaning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('UpholsteryScreen')}>
          <MaterialIcons name="weekend" size={20} color="#4A90E2" />
          <Text style={styles.relatedBtnText}>Upholstery</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Form Button */}
      <View style={styles.repeatRow}>
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
    color: '#50C878',
    fontSize: 13,
    marginLeft: 6,
  },
  rugTypeScroll: {
    marginVertical: 8,
  },
  rugTypeChip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rugTypeChipSelected: {
    backgroundColor: '#4A90E2',
  },
  rugTypeIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  rugTypeName: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
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
  sizeCard: {
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
  sizeCardSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  sizeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sizeDimensions: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  sizePrice: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sizeSqft: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  customSizeInputs: {
    marginTop: 8,
    marginBottom: 4,
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dimensionInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 6,
    width: 60,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  dimensionUnit: {
    fontSize: 13,
    color: '#555',
    marginLeft: 2,
  },
  unitSelector: {
    flexDirection: 'row',
    marginTop: 4,
  },
  unitBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  unitBtnActive: {
    backgroundColor: '#4A90E2',
  },
  sqftDisplay: {
    marginTop: 4,
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  methodScroll: {
    marginVertical: 8,
  },
  methodCard: {
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
  methodCardSelected: {
    backgroundColor: '#4A90E2',
  },
  methodIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  methodInfo: {
    alignItems: 'center',
  },
  methodName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  methodMultiplier: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  multiplierText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  soilLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  soilChip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  soilChipSelected: {
    backgroundColor: '#FF9800',
  },
  soilChipText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  soilDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
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
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  pickupToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickupLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  pickupTypeSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickupTypeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  pickupTypeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  pickupTypeText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickupTypeTextActive: {
    color: '#fff',
  },
  addressSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  addressText: {
    color: '#333',
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  dryingTimeText: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginTop: 4,
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