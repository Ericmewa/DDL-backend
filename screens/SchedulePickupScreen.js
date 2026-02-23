import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SchedulePickupScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Morning');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [expressService, setExpressService] = useState(false);

  const dates = ['Today', 'Tomorrow', 'Wed, Mar 5', 'Thu, Mar 6'];
  const times = ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'];

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
        {/* Service Title */}
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>Pickup & Delivery</Text>
          <Text style={styles.serviceDescription}>We pick up, clean, and deliver</Text>
        </View>

        {/* Schedule a Pickup */}
        <Text style={styles.sectionTitle}>Schedule a Pickup</Text>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter pickup address</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="e.g., 123 Kenyatta Avenue, Nairobi"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* Date Selection */}
        <Text style={styles.inputLabel}>Select Date & Time</Text>
        <View style={styles.dateContainer}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateButton,
                selectedDate === date && styles.dateButtonSelected
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dateButtonText,
                selectedDate === date && styles.dateButtonTextSelected
              ]}>
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selection */}
        <View style={styles.timeContainer}>
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeButton,
                selectedTime === time && styles.timeButtonSelected
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeButtonText,
                selectedTime === time && styles.timeButtonTextSelected
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pickup Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.inputLabel}>Pickup Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add instructions for your pickup driver..."
            placeholderTextColor="#999"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Express Service */}
        <TouchableOpacity 
          style={styles.expressContainer}
          onPress={() => setExpressService(!expressService)}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxRow}>
            <View style={[styles.checkbox, expressService && styles.checkboxChecked]}>
              {expressService && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.expressTextContainer}>
              <Text style={styles.expressTitle}>Express Service</Text>
              <Text style={styles.expressDescription}>Get it back in 24 hours</Text>
            </View>
            <Text style={styles.expressPrice}>+$5.00</Text>
          </View>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={styles.confirmButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#28a745', '#218838']}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmButtonText}>Confirm Pickup</Text>
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
            <Text style={[styles.navIcon, item.name === 'Home' && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navText, item.name === 'Home' && styles.navTextActive]}>
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
  serviceHeader: {
    marginTop: 20,
    marginBottom: 25,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  addressInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 50,
  },
  dateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  dateButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#666',
  },
  dateButtonTextSelected: {
    color: '#fff',
  },
  timeContainer: {
    marginBottom: 20,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  timeButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeButtonTextSelected: {
    color: '#fff',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  expressContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expressTextContainer: {
    flex: 1,
  },
  expressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  expressDescription: {
    fontSize: 13,
    color: '#666',
  },
  expressPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
  },
  confirmButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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