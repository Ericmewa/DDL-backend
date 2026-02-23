import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const garmentTypes = [
  { id: 1, name: 'Suit (2-piece)', basePrice: 15.99, icon: '👔' },
  { id: 2, name: 'Dress', basePrice: 12.99, icon: '👗' },
  { id: 3, name: 'Dress Shirt', basePrice: 4.99, icon: '👕' },
  { id: 4, name: 'Blouse', basePrice: 5.99, icon: '👚' },
  { id: 5, name: 'Tie', basePrice: 3.99, icon: '👔' },
  { id: 6, name: 'Sweater', basePrice: 7.99, icon: '🧥' },
  { id: 7, name: 'Coat/Jacket', basePrice: 14.99, icon: '🧥' }
];

const fabricTypes = [
  { label: 'Cotton', value: 'cotton', upcharge: 0 },
  { label: 'Silk (premium)', value: 'silk', upcharge: 5 },
  { label: 'Wool (premium)', value: 'wool', upcharge: 3 },
  { label: 'Linen', value: 'linen', upcharge: 2 },
  { label: 'Polyester', value: 'polyester', upcharge: 0 },
  { label: 'Rayon', value: 'rayon', upcharge: 1 }
];

const DryCleaningScreen = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [fabricType, setFabricType] = useState('cotton');
  const [stainTreatment, setStainTreatment] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [photos, setPhotos] = useState([]);
  const [expressService, setExpressService] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (itemId, increment) => {
    setSelectedItems(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = currentQty + increment;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const calculateItemPrice = (item) => {
    const fabricUpcharge = fabricTypes.find(f => f.value === fabricType)?.upcharge || 0;
    const stainFee = stainTreatment ? 2 : 0;
    return (item.basePrice + fabricUpcharge + stainFee) * (selectedItems[item.id] || 0);
  };

  const calculateSubtotal = () => {
    return garmentTypes.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  };

  const calculateExpressFee = () => expressService ? calculateSubtotal() * 0.5 : 0;

  const calculateTotal = () => calculateSubtotal() + calculateExpressFee();

  const validateOrder = () => {
    if (Object.keys(selectedItems).length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }
    return true;
  };

  // Replace with actual user ID from auth context or redux
  const userId = 'USER_ID_PLACEHOLDER'; // TODO: Replace with real user ID

  // Backend API URL
  const API_URL = 'http://192.168.0.15:5002/orders'; // Update with your backend IP/port

  const handleSchedulePickup = async () => {
    if (!validateOrder()) return;
    setLoading(true);
    try {
      const orderData = {
        userId,
        serviceType: 'dry-cleaning',
        items: selectedItems,
        fabricType,
        stainTreatment,
        specialInstructions,
        photos,
        expressService,
        total: calculateTotal()
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        Alert.alert('Order Failed', data.error || 'Could not place order.');
        return;
      }
      navigation.navigate('PickupDelivery', { orderData: data.order });
    } catch (err) {
      setLoading(false);
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };

  const handleAddToCart = async () => {
    if (!validateOrder()) return;
    setLoading(true);
    try {
      const orderData = {
        userId,
        serviceType: 'dry-cleaning',
        items: selectedItems,
        fabricType,
        stainTreatment,
        specialInstructions,
        photos,
        expressService,
        total: calculateTotal()
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        Alert.alert('Add to Cart Failed', data.error || 'Could not add to cart.');
        return;
      }
      Alert.alert('Success', 'Added to cart', [
        { text: 'Continue', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err) {
      setLoading(false);
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };

  const handlePhotoUpload = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit reached', 'You can upload up to 3 photos.');
      return;
    }
    Alert.alert('Photo Upload', 'Photo upload logic goes here.');
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dry Cleaning</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.headerBtn}>
          <Icon name="shopping-cart" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Professional care for your delicate garments.</Text>
          <Text style={styles.heroDescription}>
            Chemical cleaning that preserves fabric quality.
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Select Garments</Text>
        <View style={styles.gridContainer}>
          {garmentTypes.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <Text style={styles.garmentIcon}>{item.icon}</Text>
              <Text style={styles.garmentName}>{item.name}</Text>
              <Text style={styles.garmentPrice}>${item.basePrice.toFixed(2)}</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{selectedItems[item.id] || 0}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fabric Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fabricType}
              onValueChange={setFabricType}
              style={Platform.OS === 'ios' ? { height: 120 } : undefined}
            >
              {fabricTypes.map((fabric) => (
                <Picker.Item
                  key={fabric.value}
                  label={`${fabric.label}${fabric.upcharge > 0 ? ` (+$${fabric.upcharge})` : ''}`}
                  value={fabric.value}
                />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setStainTreatment(!stainTreatment)}
        >
          <View style={[styles.checkbox, stainTreatment && styles.checkboxChecked]}>
            {stainTreatment && <Icon name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Stain treatment (+$2 per item)</Text>
        </TouchableOpacity>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe any stains, loose buttons, or special requests..."
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Upload photos of stains for better treatment</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={styles.photo}
              />
            ))}
            {photos.length < 3 && (
              <TouchableOpacity style={styles.photoUploadBtn} onPress={handlePhotoUpload}>
                <Icon name="add-a-photo" size={28} color="#4A90E2" />
                <Text style={styles.photoUploadText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Express Service (Same-day, +50%)</Text>
          <TouchableOpacity
            style={[styles.toggle, expressService && styles.toggleActive]}
            onPress={() => setExpressService(!expressService)}
          >
            <View style={[styles.toggleCircle, expressService && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceCardTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text>Items subtotal</Text>
            <Text>${calculateSubtotal().toFixed(2)}</Text>
          </View>
          {stainTreatment && (
            <View style={styles.priceRow}>
              <Text>Stain treatment fee</Text>
              <Text>+${(Object.values(selectedItems).reduce((a, b) => a + b, 0) * 2).toFixed(2)}</Text>
            </View>
          )}
          {expressService && (
            <View style={styles.priceRow}>
              <Text>Express service (50%)</Text>
              <Text>+${calculateExpressFee().toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleAddToCart}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSchedulePickup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Schedule Pickup</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Turnaround</Text>
          <Text style={styles.sectionSubtitle}>
            {expressService ? 'Same-day (Express)' : '2-3 business days'}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Services</Text>
          <View style={styles.relatedContainer}>
            <TouchableOpacity
              style={styles.relatedBtn}
              onPress={() => navigation.navigate('Ironing')}
            >
              <Text style={styles.relatedIcon}>🧺</Text>
              <Text style={styles.relatedText}>Ironing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.relatedBtn}
              onPress={() => navigation.navigate('Alterations')}
            >
              <Text style={styles.relatedIcon}>✂️</Text>
              <Text style={styles.relatedText}>Alterations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  scrollContent: { paddingBottom: 32 },
  heroSection: { backgroundColor: '#4A90E2', padding: 20, marginBottom: 16 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  heroDescription: { fontSize: 14, color: '#fff', opacity: 0.9, lineHeight: 20 },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 8 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', padding: 8 },
  gridItem: {
    width: '48%',
    margin: '1%',
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  garmentIcon: { fontSize: 32, marginBottom: 4 },
  garmentName: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  garmentPrice: { fontSize: 15, fontWeight: 'bold', color: '#4A90E2', marginVertical: 4 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  quantityButton: {
    width: 28, height: 28, backgroundColor: '#f0f0f0', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold' },
  quantityText: { marginHorizontal: 10, fontSize: 15, fontWeight: '500' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#4A90E2', borderRadius: 4, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#4A90E2' },
  checkboxLabel: { fontSize: 15 },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80 },
  photo: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
  photoUploadBtn: { alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderWidth: 1, borderColor: '#4A90E2', borderRadius: 8, marginRight: 8, backgroundColor: '#f0f8ff' },
  photoUploadText: { fontSize: 11, color: '#4A90E2', marginTop: 2 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  toggleLabel: { fontSize: 15 },
  toggle: { width: 44, height: 26, backgroundColor: '#ddd', borderRadius: 13, padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: '#4A90E2' },
  toggleCircle: { width: 22, height: 22, backgroundColor: '#fff', borderRadius: 11 },
  toggleCircleActive: { transform: [{ translateX: 18 }] },
  priceCard: { backgroundColor: '#fff', padding: 16, margin: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  priceCardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalRow: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  totalText: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#4A90E2' },
  buttonContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  button: { flex: 1, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#4A90E2' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#4A90E2' },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  secondaryButtonText: { color: '#4A90E2', fontSize: 15, fontWeight: '600' },
  relatedContainer: { flexDirection: 'row', gap: 16 },
  relatedBtn: { alignItems: 'center', marginRight: 24 },
  relatedIcon: { fontSize: 28 },
  relatedText: { fontSize: 13, color: '#4A90E2', marginTop: 2 },
});

export default DryCleaningScreen;