import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Placeholder for pricing/options (logic to be added later)
const garmentTypes = [
  { id: 'pants', name: 'Pants/Trousers', icon: '👖' },
  { id: 'shirts', name: 'Shirts/Blouses', icon: '👕' },
  { id: 'dresses', name: 'Dresses/Skirts', icon: '👗' },
  { id: 'jackets', name: 'Jackets/Coats', icon: '🧥' },
  { id: 'suits', name: 'Suits', icon: '👔' },
  { id: 'jeans', name: 'Jeans', icon: '👖' },
  { id: 'formal', name: 'Formal Wear', icon: '👰' },
];

const categories = [
  { id: 'alteration', label: 'Alterations', icon: 'content-cut', iconFamily: 'MaterialIcons' },
  { id: 'repair', label: 'Repairs', icon: 'needle', iconFamily: 'FontAwesome' },
  { id: 'restoration', label: 'Restoration', icon: 'restore', iconFamily: 'MaterialIcons' },
];

export default function AlterationsScreen() {
  const navigation = useNavigation();
  // UI state only for now
  const [activeCategory, setActiveCategory] = useState('alteration');
  const [selectedGarment, setSelectedGarment] = useState('pants');
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [urgency, setUrgency] = useState('standard');
  const [wantConsultation, setWantConsultation] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterations & Repairs</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Perfect Fit. Expert Repair.</Text>
        <Text style={styles.heroDesc}>Expert tailoring to make your clothes fit perfectly and repairs to extend their life. From hemming to zipper replacement.</Text>
        <View style={styles.badgeRow}>
          <FontAwesome name="user-md" size={16} color="#9C27B0" />
          <Text style={styles.badgeText}>Expert Tailors</Text>
          <FontAwesome name="clock-o" size={16} color="#4A90E2" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Quick Turnaround</Text>
          <FontAwesome name="comments" size={16} color="#FF9800" style={{ marginLeft: 8 }} />
          <Text style={styles.badgeText}>Free Consultation</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryTab, activeCategory === category.id && styles.categoryTabActive]}
            onPress={() => setActiveCategory(category.id)}
          >
            {category.iconFamily === 'MaterialIcons' ? (
              <MaterialIcons name={category.icon} size={20} color={activeCategory === category.id ? '#fff' : '#9C27B0'} style={{ marginBottom: 2 }} />
            ) : category.iconFamily === 'FontAwesome' ? (
              <FontAwesome name={category.icon} size={20} color={activeCategory === category.id ? '#fff' : '#9C27B0'} style={{ marginBottom: 2 }} />
            ) : null}
            <Text style={[styles.categoryLabel, activeCategory === category.id && styles.categoryLabelActive]}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Garment Type Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.garmentScroll}>
        {garmentTypes.map(garment => (
          <TouchableOpacity
            key={garment.id}
            style={[styles.garmentChip, selectedGarment === garment.id && styles.garmentChipSelected]}
            onPress={() => setSelectedGarment(garment.id)}
          >
            <Text style={styles.garmentIcon}>{garment.icon}</Text>
            <Text style={styles.garmentName}>{garment.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Service Selection Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>What needs to be done?</Text>
        <View style={styles.serviceListPlaceholder}>
          <Text style={{ color: '#aaa' }}>[Service list will appear here]</Text>
        </View>
      </View>

      {/* Measurements Section Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Your measurements</Text>
        <View style={styles.measurementBanner}>
          <Text style={styles.measurementBannerText}>Measure an existing garment that fits well</Text>
          <TouchableOpacity style={styles.measureGuideBtn} onPress={() => setShowMeasurementGuide(true)}>
            <Ionicons name="help-circle-outline" size={18} color="#9C27B0" />
            <Text style={styles.measureGuideBtnText}>How to measure</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.measurementFieldsPlaceholder}>
          <Text style={{ color: '#aaa' }}>[Measurement fields will appear here]</Text>
        </View>
      </View>

      {/* Original Garment Details Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Tell us about the original garment</Text>
        <TextInput style={styles.textArea} placeholder="Describe fit issues, preferences..." multiline numberOfLines={3} />
        <View style={styles.photoUploadPlaceholder}>
          <Text style={{ color: '#aaa' }}>[Photo upload will appear here]</Text>
        </View>
      </View>

      {/* Damage Documentation Placeholder (for repairs) */}
      {activeCategory === 'repair' && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Damage Documentation</Text>
          <View style={styles.photoUploadPlaceholder}>
            <Text style={{ color: '#aaa' }}>[Damage photo upload will appear here]</Text>
          </View>
          <Text style={{ color: '#aaa', marginTop: 8 }}>[Damage type selector, severity slider will appear here]</Text>
        </View>
      )}

      {/* Fabric/Thread Matching Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Do you have matching thread/buttons?</Text>
        <View style={styles.matchingRow}>
          <Text style={styles.matchingLabel}>No</Text>
          <Switch value={wantConsultation} onValueChange={setWantConsultation} trackColor={{ false: '#ddd', true: '#9C27B0' }} />
          <Text style={styles.matchingLabel}>Yes</Text>
        </View>
      </View>

      {/* Special Instructions */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Special Instructions</Text>
        <TextInput style={styles.textArea} placeholder="Specific alteration requests, fit preferences, fabric concerns..." multiline numberOfLines={3} />
      </View>

      {/* Urgency Selector */}
      <View style={styles.urgencyContainer}>
        {[{ id: 'standard', label: 'Standard', time: '3-5 days', multiplier: 1.0 },
          { id: 'rush', label: 'Rush', time: '24-48h', multiplier: 1.5 },
          { id: 'express', label: 'Express', time: 'Same-day', multiplier: 2.0 }].map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.urgencyCard, urgency === option.id && styles.urgencyCardSelected]}
            onPress={() => setUrgency(option.id)}
          >
            <Text style={styles.urgencyLabel}>{option.label}</Text>
            <Text style={styles.urgencyTime}>{option.time}</Text>
            {option.multiplier > 1 && (
              <Text style={styles.urgencyMultiplier}>+{(option.multiplier - 1) * 100}%</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Price Breakdown Placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Price Estimate</Text>
        <View style={styles.priceBreakdownPlaceholder}>
          <Text style={{ color: '#aaa' }}>[Price breakdown will appear here]</Text>
        </View>
        <Text style={styles.priceNote}>*Price includes consultation and basting fitting</Text>
      </View>

      {/* Consultation Option */}
      <View style={styles.consultationRow}>
        <Switch value={wantConsultation} onValueChange={setWantConsultation} trackColor={{ false: '#ddd', true: '#9C27B0' }} />
        <Text style={styles.consultationLabel}>I'd like an in-person fitting consultation</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
          <Text style={styles.actionBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
          <Text style={styles.actionBtnTextPrimary}>Schedule Drop-off</Text>
        </TouchableOpacity>
      </View>

      {/* Related Services */}
      <View style={styles.relatedRow}>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('DryCleaningScreen')}>
          <MaterialIcons name="local-laundry-service" size={20} color="#9C27B0" />
          <Text style={styles.relatedBtnText}>Dry Cleaning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.relatedBtn} onPress={() => navigation.navigate('IroningScreen')}>
          <MaterialIcons name="iron" size={20} color="#9C27B0" />
          <Text style={styles.relatedBtnText}>Ironing</Text>
        </TouchableOpacity>
      </View>

      {/* Measurement Guide Modal */}
      <Modal visible={showMeasurementGuide} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>How to Measure</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>[Measurement instructions will appear here]</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowMeasurementGuide(false)}>
              <Text style={styles.modalCloseText}>Got it</Text>
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
    backgroundColor: '#9C27B0',
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
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  badgeText: {
    color: '#9C27B0',
    fontSize: 13,
    marginLeft: 6,
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: '#F3E5F5',
  },
  categoryTabActive: {
    backgroundColor: '#9C27B0',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryLabel: {
    fontSize: 15,
    color: '#9C27B0',
    fontWeight: 'bold',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  garmentScroll: {
    marginVertical: 8,
  },
  garmentChip: {
    backgroundColor: '#F3E5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  garmentChipSelected: {
    backgroundColor: '#9C27B0',
  },
  garmentIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  garmentName: {
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
  serviceListPlaceholder: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  measurementBannerText: {
    color: '#9C27B0',
    fontSize: 13,
    flex: 1,
  },
  measureGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  measureGuideBtnText: {
    color: '#9C27B0',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  measurementFieldsPlaceholder: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 44,
    marginBottom: 4,
  },
  photoUploadPlaceholder: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  matchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  matchingLabel: {
    color: '#333',
    fontSize: 15,
    marginHorizontal: 8,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  urgencyCard: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 4,
  },
  urgencyCardSelected: {
    backgroundColor: '#FF9800',
  },
  urgencyLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  urgencyTime: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  urgencyMultiplier: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  priceBreakdownPlaceholder: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  consultationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'center',
  },
  consultationLabel: {
    color: '#9C27B0',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
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
    backgroundColor: '#9C27B0',
  },
  secondaryBtn: {
    backgroundColor: '#F3E5F5',
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
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  relatedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  relatedBtnText: {
    color: '#9C27B0',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});