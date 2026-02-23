// WashFoldScreen.js
// Complete Wash & Fold ordering screen for laundromat app
// Includes: UI, state, price logic, validation, navigation, loyalty, promo, eco impact, accessibility

  // State declarations
  // All user selections and form state
  // Helper: Estimate bag count
  // Returns bag count string based on weight
  // Helper: Weight category
  // Returns load size category for visual feedback
  // Helper: Calculate base price
  // Returns base price (weight × rate)
  // Helper: Detergent upcharge
  // Returns upcharge for selected detergent
  // Helper: Stain fee
  // Returns fee for stain pretreatment
  // Helper: Fold style fee
  // Returns fee for hanging items
  // Helper: Promo discount
  // Returns applied promo discount
  // Helper: Loyalty points
  // Returns points earned for this order
  // Helper: Eco impact
  // Returns water/energy saved estimate
  // Helper: Total price
  // Returns total price after all add-ons and discounts
  // Validation
  // Checks weight, instructions, and sets error state
  // Weight change handler
  // Handles +/- weight changes with bounds
  // Manual weight input
  // Handles direct weight entry and validation
  // Promo code apply
  // Handles promo code validation and discount
  // Schedule pickup
  // Handles navigation to pickup scheduling with order data
  // Add to cart
  // Handles saving order to cart
  // Quick repeat previous order
  // Loads previous order state for quick repeat
  // Reset form
  // Resets all form fields to default
  // Effects: Loyalty points, eco impact, previous order
  // Updates loyalty, eco impact, and simulates previous order fetch
  // UI Components
  // All UI sections rendered below
  {/* Header: Title, back, cart */}
  {/* Hero Section: Service description, eco badge */}
  {/* Weight Selector Card: Weight input, progress, bag estimator */}
  {/* Laundry Sorting Section: Chip selector */}
  {/* Detergent Selection: Chip selector, info modal */}
  {/* Additional Options Card: Toggles, segmented controls, checkbox */}
  {/* Special Requests: Text input for instructions */}
  {/* Fold Style: Chip selector, info modal */}
  {/* Price Breakdown Card: All price details */}
  {/* Promo Code Section: Collapsible input, apply button */}
  {/* Loyalty Integration: Points earned */}
  {/* Eco Impact Calculator: Water/energy saved */}
  {/* Recurring Order Section: Toggle, frequency, day */}
  {/* Action Buttons: Add to cart, schedule pickup */}
  {/* Related Services Section: Ironing, Dry Cleaning links */}
  {/* Quick Repeat Previous Order: Repeat, reset buttons */}
  {/* Detergent Info Modal: Option details */}
  {/* Fold Info Modal: Fold style details */}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Pricing configuration
const PRICING = {
  pricePerPound: 1.99,
  minimumWeight: 5,
  maximumWeight: 50,
  detergentUpcharges: {
    regular: 0,
    hypoallergenic: 2.00,
    'fragrance-free': 2.00,
    'eco-friendly': 1.50,
  },
  stainTreatmentPerItem: 1.00,
  foldStyles: {
    standard: 0,
    military: 0,
    hung: 0.5,
  },
  weightToBags: {
    5: '½ bag',
    10: '1 bag',
    20: '2 bags',
    30: '3 bags',
    40: '4 bags',
    50: '5 bags',
  },
};

const detergentOptions = [
  { id: 'regular', name: 'Regular', price: 0 },
  { id: 'hypoallergenic', name: 'Hypoallergenic', price: 2 },
  { id: 'fragrance-free', name: 'Fragrance-Free', price: 2 },
  { id: 'eco-friendly', name: 'Eco-Friendly', price: 1.5 },
];

const laundryTypes = [
  { id: 'mixed', name: 'Mixed' },
  { id: 'whites', name: 'Lights/Whites' },
  { id: 'darks', name: 'Darks' },
  { id: 'colors', name: 'Colors' },
  { id: 'delicates', name: 'Delicates' },
];

const waterTemps = ['Cold', 'Warm', 'Hot'];
const dryerOptions = ['Regular Dry', 'Low Heat', 'Air Dry'];
const foldStyles = [
  { id: 'standard', name: 'Standard Fold' },
  { id: 'military', name: 'Military Fold' },
  { id: 'hung', name: 'Hang Items' },
];
const recurringFrequencies = ['Weekly', 'Bi-Weekly'];

export default function WashFoldScreen() {
  const navigation = useNavigation();

  // State declarations
  const [weight, setWeight] = useState(10);
  const [sortType, setSortType] = useState('mixed');
  const [detergent, setDetergent] = useState('regular');
  const [fabricSoftener, setFabricSoftener] = useState(false);
  const [waterTemp, setWaterTemp] = useState('Warm');
  const [dryerPreference, setDryerPreference] = useState('Regular Dry');
  const [stainTreatment, setStainTreatment] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [foldStyle, setFoldStyle] = useState('standard');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('Weekly');
  const [recurringDay, setRecurringDay] = useState('Monday');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showDetergentInfo, setShowDetergentInfo] = useState(false);
  const [showFoldInfo, setShowFoldInfo] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [error, setError] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [ecoImpact, setEcoImpact] = useState({ waterSaved: 0, energySaved: 0 });
  const [previousOrder, setPreviousOrder] = useState(null);

  // Helper: Estimate bag count
  const getBagCount = () => {
    if (weight <= 10) return '1 bag';
    if (weight <= 20) return '2 bags';
    if (weight <= 30) return '3 bags';
    if (weight <= 40) return '4 bags';
    return '5 bags';
  };

  // Helper: Weight category
  const getWeightCategory = () => {
    if (weight < 10) return 'Small';
    if (weight < 20) return 'Medium';
    if (weight < 30) return 'Large';
    return 'Extra Large';
  };

  // Helper: Calculate base price
  const calculateBasePrice = () => weight * PRICING.pricePerPound;

  // Helper: Detergent upcharge
  const calculateDetergentUpcharge = () => PRICING.detergentUpcharges[detergent] || 0;

  // Helper: Stain fee
  const calculateStainFee = () => {
    if (!stainTreatment) return 0;
    // Estimate: 1 item per 10 lbs
    return Math.ceil(weight / 10) * PRICING.stainTreatmentPerItem;
  };

  // Helper: Fold style fee
  const calculateFoldFee = () => foldStyle === 'hung' ? Math.ceil(weight / 10) * PRICING.foldStyles.hung : 0;

  // Helper: Promo discount
  const calculatePromoDiscount = () => promoApplied ? promoDiscount : 0;

  // Helper: Loyalty points
  const calculateLoyaltyPoints = () => Math.floor(calculateTotal() * 10);

  // Helper: Eco impact
  const calculateEcoImpact = () => {
    // Example: 10 lbs saves 20 gal water, 2 kWh energy
    return {
      waterSaved: weight * 2,
      energySaved: weight * 0.2,
    };
  };

  // Helper: Total price
  const calculateTotal = () => {
    let total = calculateBasePrice();
    total += calculateDetergentUpcharge();
    total += calculateStainFee();
    total += calculateFoldFee();
    total -= calculatePromoDiscount();
    return total;
  };

  // Validation
  const validateOrder = () => {
    if (weight < PRICING.minimumWeight) {
      setError(`Minimum weight is ${PRICING.minimumWeight} lbs.`);
      return false;
    }
    if (weight > PRICING.maximumWeight) {
      setError(`Maximum weight is ${PRICING.maximumWeight} lbs.`);
      return false;
    }
    if (specialInstructions.length > 500) {
      setError('Special instructions max 500 characters.');
      return false;
    }
    setError('');
    return true;
  };

  // Weight change handler
  const handleWeightChange = (increment) => {
    let newWeight = weight + increment;
    if (newWeight < PRICING.minimumWeight) newWeight = PRICING.minimumWeight;
    if (newWeight > PRICING.maximumWeight) newWeight = PRICING.maximumWeight;
    setWeight(newWeight);
  };

  // Manual weight input
  const handleWeightManualInput = (text) => {
    let num = parseInt(text);
    if (isNaN(num)) return;
    if (num < PRICING.minimumWeight) num = PRICING.minimumWeight;
    if (num > PRICING.maximumWeight) num = PRICING.maximumWeight;
    setWeight(num);
  };

  // Promo code apply
  const handleApplyPromo = () => {
    // Example: 'SAVE10' gives $10 off
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoDiscount(10);
      setPromoApplied(true);
    } else {
      Alert.alert('Invalid Promo', 'Promo code not recognized.');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  // Schedule pickup
  const handleSchedulePickup = () => {
    if (!validateOrder()) return;
    setLoading(true);
    // Simulate network call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('PickupSchedule', {
        orderData: {
          serviceType: 'wash-fold',
          weight,
          options: {
            sortType,
            detergent,
            fabricSoftener,
            waterTemp,
            dryerPreference,
            stainTreatment,
            foldStyle,
          },
          specialInstructions,
          isRecurring,
          recurringFrequency,
          recurringDay,
          total: calculateTotal(),
        },
      });
    }, 1200);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!validateOrder()) return;
    setLoading(true);
    // Simulate cart save
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Added to Cart', 'Your Wash & Fold order has been added to the cart.');
    }, 800);
  };

  // Quick repeat previous order
  const handleRepeatOrder = () => {
    if (!previousOrder) return;
    setWeight(previousOrder.weight);
    setSortType(previousOrder.sortType);
    setDetergent(previousOrder.detergent);
    setFabricSoftener(previousOrder.fabricSoftener);
    setWaterTemp(previousOrder.waterTemp);
    setDryerPreference(previousOrder.dryerPreference);
    setStainTreatment(previousOrder.stainTreatment);
    setSpecialInstructions(previousOrder.specialInstructions);
    setFoldStyle(previousOrder.foldStyle);
    setIsRecurring(previousOrder.isRecurring);
    setRecurringFrequency(previousOrder.recurringFrequency);
    setRecurringDay(previousOrder.recurringDay);
  };

  // Reset form
  const handleReset = () => {
    setWeight(10);
    setSortType('mixed');
    setDetergent('regular');
    setFabricSoftener(false);
    setWaterTemp('Warm');
    setDryerPreference('Regular Dry');
    setStainTreatment(false);
    setSpecialInstructions('');
    setFoldStyle('standard');
    setIsRecurring(false);
    setRecurringFrequency('Weekly');
    setRecurringDay('Monday');
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
    setError('');
  };

  // Effects: Loyalty points, eco impact, previous order
  useEffect(() => {
    setLoyaltyPoints(calculateLoyaltyPoints());
    setEcoImpact(calculateEcoImpact());
    // Simulate previous order fetch
    setPreviousOrder({
      weight: 15,
      sortType: 'mixed',
      detergent: 'eco-friendly',
      fabricSoftener: true,
      waterTemp: 'Warm',
      dryerPreference: 'Low Heat',
      stainTreatment: true,
      specialInstructions: 'Please use eco detergent.',
      foldStyle: 'military',
      isRecurring: false,
      recurringFrequency: 'Weekly',
      recurringDay: 'Monday',
    });
  }, [weight, detergent, stainTreatment, foldStyle, promoApplied]);

  // UI Components
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wash & Fold</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Fresh & Folded</Text>
        <Text style={styles.heroDesc}>We wash, dry, and fold. You relax. Priced by the pound with your choice of settings.</Text>
        <Text style={styles.heroPrice}>Starting at <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>${PRICING.pricePerPound.toFixed(2)}/lb</Text></Text>
        <View style={styles.ecoBadge}>
          <FontAwesome name="leaf" size={16} color="#4CAF50" />
          <Text style={styles.ecoBadgeText}>Eco-Friendly Detergent Available</Text>
        </View>
      </View>

      {/* Weight Selector Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>How much laundry?</Text>
        <View style={styles.weightRow}>
          <TouchableOpacity style={styles.weightBtn} onPress={() => handleWeightChange(-1)} disabled={loading || weight <= PRICING.minimumWeight}>
            <Ionicons name="remove-circle" size={32} color={weight <= PRICING.minimumWeight ? '#ccc' : '#4CAF50'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.weightDisplay} onPress={() => {}}>
            <TextInput
              style={styles.weightInput}
              value={weight.toString()}
              keyboardType="numeric"
              editable={!loading}
              onChangeText={handleWeightManualInput}
            />
            <Text style={styles.weightUnit}>lbs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.weightBtn} onPress={() => handleWeightChange(1)} disabled={loading || weight >= PRICING.maximumWeight}>
            <Ionicons name="add-circle" size={32} color={weight >= PRICING.maximumWeight ? '#ccc' : '#4CAF50'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.weightNotice}>Minimum {PRICING.minimumWeight} lbs • Max {PRICING.maximumWeight} lbs</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(weight / PRICING.maximumWeight) * 100}%` }]} />
        </View>
        <Text style={styles.weightCategory}>{getWeightCategory()} Load • {getBagCount()} <Text style={styles.bagEst}>({weight} lbs)</Text></Text>
        <Text style={styles.weightGuide}>5 lbs = 5-7 shirts • 10 lbs = 10-15 items • 20 lbs = Family of 4</Text>
      </View>

      {/* Laundry Sorting Section */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>How should we sort?</Text>
        <View style={styles.chipRow}>
          {laundryTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[styles.chip, sortType === type.id && styles.chipSelected]}
              onPress={() => setSortType(type.id)}
              disabled={loading}
            >
              <Text style={styles.chipText}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helpText}>We'll sort similar items together</Text>
      </View>

      {/* Detergent Selection */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>Detergent Preference</Text>
          <TouchableOpacity onPress={() => setShowDetergentInfo(true)}>
            <Ionicons name="information-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {detergentOptions.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, detergent === opt.id && styles.chipSelected]}
              onPress={() => setDetergent(opt.id)}
              disabled={loading}
            >
              <Text style={styles.chipText}>{opt.name}</Text>
              {opt.id === 'eco-friendly' && <FontAwesome name="leaf" size={14} color="#4CAF50" style={{ marginLeft: 4 }} />}
              {opt.price > 0 && <Text style={styles.upcharge}>+${opt.price.toFixed(2)}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Additional Options Card */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>Additional Options</Text>
        </View>
        <View style={styles.optionsRow}>
          <Text style={styles.optionLabel}>Fabric Softener</Text>
          <Switch value={fabricSoftener} onValueChange={setFabricSoftener} disabled={loading} thumbColor={fabricSoftener ? '#4CAF50' : '#ccc'} />
        </View>
        <View style={styles.optionsRow}>
          <Text style={styles.optionLabel}>Water Temp</Text>
          <View style={styles.segmentRow}>
            {waterTemps.map(temp => (
              <TouchableOpacity
                key={temp}
                style={[styles.segment, waterTemp === temp && styles.segmentSelected]}
                onPress={() => setWaterTemp(temp)}
                disabled={loading}
              >
                <Text style={styles.segmentText}>{temp}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.optionsRow}>
          <Text style={styles.optionLabel}>Dryer</Text>
          <View style={styles.segmentRow}>
            {dryerOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.segment, dryerPreference === opt && styles.segmentSelected]}
                onPress={() => setDryerPreference(opt)}
                disabled={loading}
              >
                <Text style={styles.segmentText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.optionsRow}>
          <Text style={styles.optionLabel}>Stain Pretreatment</Text>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setStainTreatment(!stainTreatment)} disabled={loading}>
            <Ionicons name={stainTreatment ? 'checkbox' : 'square-outline'} size={24} color={stainTreatment ? '#4CAF50' : '#ccc'} />
            <Text style={styles.stainFee}>+${PRICING.stainTreatmentPerItem.toFixed(2)} per item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Requests */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Special Instructions</Text>
        <TextInput
          style={styles.specialInput}
          placeholder="Any specific instructions? Delicate items, allergies, etc."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          editable={!loading}
          maxLength={500}
        />
        <Text style={styles.charCount}>{specialInstructions.length}/500</Text>
      </View>

      {/* Fold Style */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>Fold Style</Text>
          <TouchableOpacity onPress={() => setShowFoldInfo(true)}>
            <Ionicons name="information-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {foldStyles.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, foldStyle === opt.id && styles.chipSelected]}
              onPress={() => setFoldStyle(opt.id)}
              disabled={loading}
            >
              <Text style={styles.chipText}>{opt.name}</Text>
              {opt.id === 'hung' && <Text style={styles.upcharge}>+${PRICING.foldStyles.hung.toFixed(2)} per shirt</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Breakdown Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Price Breakdown</Text>
        <View style={styles.priceRow}><Text>Base ({weight} lbs × ${PRICING.pricePerPound.toFixed(2)})</Text><Text>${calculateBasePrice().toFixed(2)}</Text></View>
        {calculateDetergentUpcharge() > 0 && (
          <View style={styles.priceRow}><Text>Detergent Upcharge</Text><Text>${calculateDetergentUpcharge().toFixed(2)}</Text></View>
        )}
        {stainTreatment && (
          <View style={styles.priceRow}><Text>Stain Pretreatment</Text><Text>${calculateStainFee().toFixed(2)}</Text></View>
        )}
        {foldStyle === 'hung' && (
          <View style={styles.priceRow}><Text>Hang Items Fee</Text><Text>${calculateFoldFee().toFixed(2)}</Text></View>
        )}
        {promoApplied && (
          <View style={styles.priceRow}><Text>Promo Discount</Text><Text>-${promoDiscount.toFixed(2)}</Text></View>
        )}
        <View style={styles.priceRow}><Text style={styles.priceTotal}>Estimated Total</Text><Text style={styles.priceTotal}>${calculateTotal().toFixed(2)}</Text></View>
        <Text style={styles.priceNote}>Final price may vary slightly based on actual weight</Text>
        <Text style={styles.priceLock}>Price locked at pickup - if weight differs, we'll adjust</Text>
      </View>

      {/* Promo Code Section */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setShowPromoInput(!showPromoInput)} style={styles.promoToggle}>
          <Text style={styles.sectionLabel}>Promo Code</Text>
          <Ionicons name={showPromoInput ? 'chevron-up' : 'chevron-down'} size={20} color="#4CAF50" />
        </TouchableOpacity>
        {showPromoInput && (
          <View style={styles.promoInputRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!loading}
            />
            <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo} disabled={loading || !promoCode}>
              <Text style={styles.promoBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Loyalty Integration */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Loyalty Points</Text>
        <View style={styles.loyaltyRow}>
          <FontAwesome name="star" size={18} color="#FFD700" />
          <Text style={styles.loyaltyPoints}>Earn {loyaltyPoints} points with this order</Text>
        </View>
      </View>

      {/* Eco Impact Calculator */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Eco Impact</Text>
        <View style={styles.ecoRow}>
          <FontAwesome name="tint" size={18} color="#4CAF50" />
          <Text style={styles.ecoImpact}>Water Saved: {ecoImpact.waterSaved} gal</Text>
        </View>
        <View style={styles.ecoRow}>
          <FontAwesome name="bolt" size={18} color="#4CAF50" />
          <Text style={styles.ecoImpact}>Energy Saved: {ecoImpact.energySaved.toFixed(1)} kWh</Text>
        </View>
      </View>

      {/* Recurring Order Section */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>Make it recurring?</Text>
          <Switch value={isRecurring} onValueChange={setIsRecurring} disabled={loading} thumbColor={isRecurring ? '#4CAF50' : '#ccc'} />
        </View>
        {isRecurring && (
          <View style={styles.recurringRow}>
            <Text style={styles.optionLabel}>Frequency</Text>
            <View style={styles.segmentRow}>
              {recurringFrequencies.map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[styles.segment, recurringFrequency === freq && styles.segmentSelected]}
                  onPress={() => setRecurringFrequency(freq)}
                  disabled={loading}
                >
                  <Text style={styles.segmentText}>{freq}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.optionLabel}>Day</Text>
            <TextInput
              style={styles.recurringDayInput}
              value={recurringDay}
              onChangeText={setRecurringDay}
              editable={!loading}
            />
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleAddToCart} disabled={loading}>
          {loading ? <ActivityIndicator color="#4CAF50" /> : <Text style={styles.actionBtnText}>Add to Cart</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={handleSchedulePickup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnTextPrimary}>Schedule Pickup</Text>}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Related Services Section */}
      <View style={styles.relatedRow}>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('IroningScreen')}>
          <MaterialIcons name="iron" size={20} color="#4CAF50" />
          <Text style={styles.relatedBtnText}>Ironing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('DryCleaningScreen')}>
          <FontAwesome name="tint" size={20} color="#4CAF50" />
          <Text style={styles.relatedBtnText}>Dry Cleaning</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Repeat Previous Order */}
      <View style={styles.repeatRow}>
        <TouchableOpacity style={styles.repeatBtn} onPress={handleRepeatOrder} disabled={!previousOrder || loading}>
          <MaterialIcons name="history" size={20} color="#4CAF50" />
          <Text style={styles.repeatBtnText}>Repeat Previous Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} disabled={loading}>
          <Ionicons name="refresh" size={20} color="#4CAF50" />
          <Text style={styles.resetBtnText}>Reset Form</Text>
        </TouchableOpacity>
      </View>

      {/* Detergent Info Modal */}
      <Modal visible={showDetergentInfo} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Detergent Options</Text>
            <Text style={styles.modalText}>• Regular: Standard detergent, included.
• Hypoallergenic: For sensitive skin, +$2.
• Fragrance-Free: No scent, +$2.
• Eco-Friendly: Plant-based, +$1.50. Less impact on environment.</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowDetergentInfo(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fold Info Modal */}
      <Modal visible={showFoldInfo} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Fold Styles</Text>
            <Text style={styles.modalText}>• Standard Fold: Neat, regular folding.
• Military Fold: Crisp, uniform folds.
• Hang Items: Shirts/blouses hung, +$0.50 per shirt.</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowFoldInfo(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    backgroundColor: '#4CAF50',
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
  heroPrice: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  ecoBadgeText: {
    color: '#4CAF50',
    fontSize: 13,
    marginLeft: 6,
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
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  weightBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weightInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    width: 60,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  weightUnit: {
    fontSize: 18,
    color: '#555',
    marginLeft: 4,
  },
  weightNotice: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 6,
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  weightCategory: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  bagEst: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  weightGuide: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#F1F8E9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  upcharge: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  segmentSelected: {
    backgroundColor: '#4CAF50',
  },
  segmentText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stainFee: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 6,
  },
  specialInput: {
    backgroundColor: '#F1F8E9',
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
    color: '#4CAF50',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  priceLock: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    fontWeight: 'bold',
  },
  promoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#333',
    marginRight: 8,
  },
  promoBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loyaltyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  loyaltyPoints: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ecoImpact: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  recurringRow: {
    marginTop: 8,
  },
  recurringDayInput: {
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#333',
    marginTop: 4,
    marginBottom: 8,
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
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  relatedBtnText: {
    color: '#4CAF50',
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
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  modalClose: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});