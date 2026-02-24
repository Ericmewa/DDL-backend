import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceSelectionScreen from './screens/ServiceSelectionScreen';
import PickupDeliveryScreen from './screens/PickupDeliveryScreen';
import PricingOverviewScreen from './screens/PricingOverviewScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        <Stack.Screen name="PickupDelivery" component={PickupDeliveryScreen} />
        <Stack.Screen name="PricingOverview" component={PricingOverviewScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ResetPassword" component={require('./screens/ResetPasswordScreen').default} />
        <Stack.Screen name="Services" component={require('./screens/ServicesScreen').default} />
        <Stack.Screen name="Orders" component={require('./screens/OrdersScreen').default} />
        <Stack.Screen name="History" component={require('./screens/HistoryScreen').default} />
        <Stack.Screen name="Profile" component={require('./screens/ProfileScreen').default} />
        <Stack.Screen name="SchedulePickup" component={require('./screens/SchedulePickupScreen').default} />
        <Stack.Screen name="DryCleaning" component={require('./screens/DryCleaningScreen').default} />
        <Stack.Screen name="WashFold" component={require('./screens/WashFoldScreen').default} />
        <Stack.Screen name="Ironing" component={require('./screens/IroningScreen').default} />
        <Stack.Screen name="ShoeCleaning" component={require('./screens/ShoeCleaningScreen').default} />
        <Stack.Screen name="CarpetCleaning" component={require('./screens/CarpetCleaningScreen').default} />
        <Stack.Screen name="Alterations" component={require('./screens/AlterationsScreen').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
