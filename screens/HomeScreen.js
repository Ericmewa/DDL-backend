import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const serviceCategories = [
    {
      id: 1,
      title: 'Dry Cleaning',
      description: 'Professional cleaning & pressing',
      icon: '👔',
      screen: 'DryCleaning',
    },
    {
      id: 2,
      title: 'Wash & Fold',
      description: 'Laundry wash, dry & neatly folded',
      icon: '🧺',
      screen: 'WashFold',
    },
    {
      id: 3,
      title: 'Ironing Service',
      description: 'Item neatly ironed and pressed',
      icon: '👕',
      screen: 'Ironing',
    },
    {
      id: 4,
      title: 'Shoe Cleaning',
      description: 'Professional shoe cleaning',
      icon: '👟',
      screen: 'ShoeCleaning',
    },
    {
      id: 5,
      title: 'Carpet Cleaning',
      description: 'Deep cleaning of carpets & rugs',
      icon: '🧵',
      screen: 'CarpetCleaning',
    },
    {
      id: 6,
      title: 'Alterations & Repairs',
      description: 'Tailoring and garment repair',
      icon: '✂️',
      screen: 'Alterations',
    },
    {
      id: 7,
      title: 'Pickup & Delivery',
      description: 'We pick up, clean, and deliver',
      icon: '🚚',
      screen: 'PickupDelivery',
    },
  ];

  const bottomNavItems = [
    { name: 'Home', icon: '🏠', screen: 'Home', active: true },
    { name: 'Services', icon: '🔧', screen: 'Services', active: false },
    { name: 'Orders', icon: '📦', screen: 'Orders', active: false },
    { name: 'History', icon: '📋', screen: 'History', active: false },
    { name: 'Profile', icon: '👤', screen: 'Profile', active: false },
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
          <View>
            <Text style={styles.brandTitle}>DIPLOMATS</Text>
            <Text style={styles.brandSubtitle}>DRYCLEANERS</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Select Service Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Service Categories */}
        <View style={styles.servicesContainer}>
          {serviceCategories.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate(service.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schedule Pickup Button */}
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => navigation.navigate('SchedulePickup')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#28a745', '#218838']}
            style={styles.scheduleGradient}
          >
            <Text style={styles.scheduleIcon}>📅</Text>
            <Text style={styles.scheduleText}>Schedule Pickup</Text>
            <Text style={styles.scheduleArrow}>→</Text>
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
            <Text style={[styles.navIcon, item.active && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navText, item.active && styles.navTextActive]}>
              {item.name}
            </Text>
            {item.active && <View style={styles.activeDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.9,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIcon: {
    fontSize: 22,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#888',
  },
  chevron: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 8,
  },
  scheduleButton: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  scheduleIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scheduleArrow: {
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
    position: 'relative',
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
  activeDot: {
    position: 'absolute',
    bottom: -5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007bff',
  },
});

export default HomeScreen;