/**
 * AER Public Hearings - React Native App
 * 
 * This is a complete example showing the navigation structure
 * and how all screens connect together.
 * 
 * To use this in a real React Native project:
 * 1. Install dependencies: npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
 * 2. Install icons: npm install @expo/vector-icons (or react-native-vector-icons)
 * 3. Set up navigation as shown below
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApolloProvider } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';

// Import Apollo Client
import { apolloClient } from './config/apolloClient';

// Import screens
import { HearingsListScreen } from './screens/HearingList/HearingsListScreen';
import { HearingDetailScreen } from './screens/HearingDetail/HearingDetailScreen';

// Placeholder for Map screen (would need react-native-maps)
const MapScreen = () => (
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
    <p>Map View - Would use react-native-maps here</p>
  </div>
);

// Placeholder for My Participation screen
const MyParticipationScreen = () => (
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
    <p>My Participation - List of registered hearings</p>
  </div>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Hearings Stack (List → Detail)
function HearingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // We're using custom headers in each screen
      }}
    >
      <Stack.Screen name="HearingsList" component={HearingsListScreen} />
      <Stack.Screen name="HearingDetail" component={HearingDetailScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Hearings') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'MyParticipation') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00598E',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Hearings" component={HearingsStack} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="MyParticipation" component={MyParticipationScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </ApolloProvider>
  );
}

