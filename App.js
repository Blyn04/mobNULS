import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider } from './components/contexts/AuthContext'; 
import LoginScreen from './components/LoginScreen';
import UserDashboard from './components/user/UserDashboard';
import CalendarScreen from './components/user/CalendarScreen';
import PolicyScreen from './components/user/PolicyScreen';
import ProfileScreen from './components/user/ProfileScreen';
import Admin2Dashboard from './components/admin2/Admin2Dashboard';
import PendingRequestScreen from './components/admin2/PendingRequestScreen';
import InventoryScreen from './components/InventoryScreen';
import CameraScreen from './components/admin2/CameraScreen';
import RequestScreen from './components/user/RequestScreen';
import RequestListScreen from './components/user/RequestListScreen';
import RequestLogScreen from './components/user/RequestLogScreen';
import LogScreen from './components/admin2/LogScreen';
import InventoryStocks from './components/admin2/InventoryStocks';
import { RequestListProvider } from './components/contexts/RequestListContext';
import SearchItems from './components/user/SearchItems';
import UserActivityLogScreen from './components/user/UserActivityLogScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RequestListProvider>
      <AuthProvider> 
        <SafeAreaView style={styles.safeArea}>
          <GestureHandlerRootView style={styles.container}>
            <PaperProvider>
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
                  <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="PolicyScreen" component={PolicyScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Admin2Dashboard" component={Admin2Dashboard} options={{ headerShown: false }} />
                  <Stack.Screen name="PendingRequestScreen" component={PendingRequestScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="InventoryScreen" component={InventoryScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="RequestScreen" component={RequestScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="RequestListScreen" component={RequestListScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="UserHistoryLogScreen" component={RequestLogScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="LogScreen" component={LogScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="InventoryStocks" component={InventoryStocks} options={{ headerShown: false }} />
                  <Stack.Screen name="SearchItems" component={SearchItems} options={{ headerShown: false }} />
                  <Stack.Screen name="UserActivityLogScreen" component={UserActivityLogScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </AuthProvider>
    </RequestListProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  container: {
    flex: 1,
  },
});
