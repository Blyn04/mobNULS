// import React from 'react';
// import { Alert, SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { PaperProvider, Avatar, Title} from 'react-native-paper'; 
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AuthProvider } from './components/contexts/AuthContext';
// import { RequestListProvider } from './components/contexts/RequestListContext';
// import { useAuth } from './components/contexts/AuthContext';  
// import { db } from './backend/firebase/FirebaseConfig';
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import Icon from 'react-native-vector-icons/Ionicons'; 
// import { LogBox } from 'react-native';

// import ActivityLogScreen from './components/admin/ActivityLogScreen';
// import LoginScreen from './components/LoginScreen';
// import UserDashboard from './components/user/UserDashboard';
// import CalendarScreen from './components/user/CalendarScreen';
// import PolicyScreen from './components/PolicyScreen';
// import ProfileScreen from './components/user/ProfileScreen';
// import Admin2Dashboard from './components/admin/Admin2Dashboard';
// import PendingRequestScreen from './components/admin/PendingRequestScreen';
// import InventoryScreen from './components/InventoryScreen';
// import CameraScreen from './components/admin/CameraScreen';
// import RequestScreen from './components/user/RequestScreen';
// import RequestListScreen from './components/user/RequestListScreen';
// import RequestLogScreen from './components/user/RequestLogScreen';
// import LogScreen from './components/admin/LogScreen';
// import InventoryStocks from './components/admin/InventoryStocks';
// import SearchItems from './components/user/SearchItems';
// import UserActivityLogScreen from './components/user/UserActivityLogScreen';
// import BorrowCatalogScreen from './components/admin/BorrowCatalogScreen';
// import { RequestMetadataProvider } from './components/contexts/RequestMetadataContext';
// import CapexRequestScreen from './components/user/CapexRequestScreen';
// import CapexRequestList from './components/admin/CapexListScreen';
// import ReturnItems from './components/user/ReturnItems';

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// LogBox.ignoreLogs([
//   'Support for defaultProps will be removed from function components'
// ]);

// const CustomDrawerContent = ({ navigation }) => {
//   const { user, logout } = useAuth();  

//   return (
//     <View style={styles.drawerContent}>
//       <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
//         <View style={styles.profileSection}>
//           <Avatar.Image size={50} source={{ uri: 'https://your-profile-image-url.com' }} />
//           <Title style={styles.profileName}>{user ? user.name : 'Guest'}</Title>
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('UserDashboard')}>
//         <Title style={styles.drawerItem}>Dashboard</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('InventoryScreen')}>
//         <Title style={styles.drawerItem}>Requisition</Title>
//       </TouchableOpacity>
      
//       <TouchableOpacity onPress={() => navigation.navigate('SearchItems')}>
//         <Title style={styles.drawerItem}>Search Items</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('UserHistoryLogScreen')}>
//         <Title style={styles.drawerItem}>Status Board</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('UserActivityLogScreen')}>
//         <Title style={styles.drawerItem}>Activity Log</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('CalendarScreen')}>
//         <Title style={styles.drawerItem}>Calendar Screen</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('RequestListScreen')}>
//         <Title style={styles.drawerItem}>Request List Screen</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('PolicyScreen')}>
//         <Title style={styles.drawerItem}>Policy Screen</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('CapexRequestScreen')}>
//         <Title style={styles.drawerItem}>Capex Request</Title>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.logoutButton}
//         onPress={() => {
//           Alert.alert(
//             "Logout Confirmation",
//             "Are you sure you want to log out?",
//             [
//               { text: "Cancel", style: "cancel" },
//               {
//                 text: "Logout",
//                 style: "destructive",
//                 onPress: async () => {
//                   try {
//                     if (user?.id) {
//                       await addDoc(collection(db, `accounts/${user.id}/activitylog`), {
//                         action: "User Logged Out (Mobile)",
//                         userName: user.name || "User",
//                         timestamp: serverTimestamp(),
//                       });

//                     } else {
//                       console.warn("No user data available for logout log.");
//                     }

//                   } catch (error) {
//                     console.error("Error logging logout:", error);

//                   } finally {
//                     logout();
//                     navigation.replace("Login");
//                   }
//                 },
//               },
//             ]
//           );
//         }}
//       >
//         <Icon name="log-out-outline" size={24} color="black" />
//         <Title style={styles.logoutText}>Logout</Title>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const CustomAdminDrawerContent = ({ navigation }) => {
//   const { user, logout } = useAuth();  

//   return (
//     <View style={styles.drawerContent}>
//       <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
//         <View style={styles.profileSection}>
//           <Avatar.Image size={50} source={{ uri: 'https://your-profile-image-url.com' }} />
//           <Title style={styles.profileName}>{user ? user.name : 'Guest'}</Title>
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Admin2Dashboard')}>
//         <Title style={styles.drawerItem}>Dashboard</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('InventoryStocks')}>
//         <Title style={styles.drawerItem}>Inventory</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('PendingRequestScreen')}>
//         <Title style={styles.drawerItem}>Pending Requests</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('ActivityLogScreen')}>
//         <Title style={styles.drawerItem}>Activity Log</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('RequestLogScreen')}>
//         <Title style={styles.drawerItem}>Request Log</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('InventoryStocks')}>
//         <Title style={styles.drawerItem}>QR Scanner</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('BorrowCatalogScreen')}>
//         <Title style={styles.drawerItem}>Borrow Catalog</Title>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('CapexRequestListScreen')}>
//         <Title style={styles.drawerItem}>Capex Request List</Title>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.logoutButton} 
//         onPress={() => {
//           Alert.alert(
//             "Logout Confirmation", 
//             "Are you sure you want to log out?", 
//             [
//               { text: "Cancel", style: "cancel" },
//               { 
//                 text: "Logout", 
//                 style: "destructive", 
//                 onPress: async () => {
//                   try {
//                     if (user?.id) {
//                       await addDoc(collection(db, `accounts/${user.id}/activitylog`), {
//                         action: "User Logged Out (Mobile)",
//                         userName: user.name || "User",
//                         timestamp: serverTimestamp(),
//                       });
//                     }
//                   } catch (error) {
//                     console.error("Failed to log logout activity:", error);
//                   } finally {
//                     logout();
//                     navigation.replace('Login'); 
//                   }
//                 }
//               }
//             ]
//           );
//         }}
//       >
//         <Icon name="log-out-outline" size={24} color="black" />
//         <Title style={styles.logoutText}>Logout</Title>
//       </TouchableOpacity>

//     </View>
//   );
// };

// function UserDrawer() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="UserDashboard"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//     >
//       <Drawer.Screen name="UserDashboard" component={UserDashboard} />
//       <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
//       <Drawer.Screen name="PolicyScreen" component={PolicyScreen} />
//       <Drawer.Screen name="RequestScreen" component={RequestScreen} />
//       <Drawer.Screen name="RequestListScreen" component={RequestListScreen} />
//       <Drawer.Screen name="UserHistoryLogScreen" component={RequestLogScreen} />
//       <Drawer.Screen name="SearchItems" component={SearchItems} />
//       <Drawer.Screen name="UserActivityLogScreen" component={UserActivityLogScreen} />
//       <Drawer.Screen name="InventoryScreen" component={InventoryScreen} />
//       <Drawer.Screen name="CapexRequestScreen" component={CapexRequestScreen} />
//       <Drawer.Screen name="ReturnItemsScreen" component={ReturnItems} />
//     </Drawer.Navigator>
//   );
// }

// const AdminDrawer = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Admin2Dashboard"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <CustomAdminDrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Admin2Dashboard" component={Admin2Dashboard} />
//       <Drawer.Screen name="PendingRequestScreen" component={PendingRequestScreen} />
//       <Drawer.Screen name="InventoryScreen" component={InventoryScreen} />
//       <Drawer.Screen name="CameraScreen" component={CameraScreen} />
//       <Drawer.Screen name="RequestLogScreen" component={LogScreen} />
//       <Drawer.Screen name="InventoryStocks" component={InventoryStocks} />
//       <Drawer.Screen name="ActivityLogScreen" component={ActivityLogScreen} />
//       <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
//       <Drawer.Screen name="BorrowCatalogScreen" component={BorrowCatalogScreen} />
//       <Drawer.Screen name="CapexRequestListScreen" component={CapexRequestList} />
//     </Drawer.Navigator>
//   );
// };

// export default function App() {
//   return (
//     <RequestMetadataProvider>
//       <RequestListProvider>
//         <AuthProvider>
//           <SafeAreaView style={styles.safeArea}>
//             <GestureHandlerRootView style={styles.container}>
//               <PaperProvider>
//                 <NavigationContainer>
//                   <Stack.Navigator>
//                     <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//                     <Stack.Screen name="User" component={UserDrawer} options={{ headerShown: false }} />
//                     <Stack.Screen name="Admin" component={AdminDrawer} options={{ headerShown: false }} />
//                     <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
//                   </Stack.Navigator>
//                 </NavigationContainer>
//               </PaperProvider>
//             </GestureHandlerRootView>
//           </SafeAreaView>
//         </AuthProvider>
//       </RequestListProvider>
//     </RequestMetadataProvider>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },

//   container: {
//     flex: 1,
//   },

//   drawerContent: {
//     flex: 1,
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     backgroundColor: '#1A4572', 
//   },  

//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//     padding: 10,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },

//   profileName: {
//     marginLeft: 12,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//   },

//   drawerItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     marginBottom: 12,
//     elevation: 2,
//     color: '#333',
//   },

//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 'auto',
//     padding: 15,
//     backgroundColor: '#ffefef',
//     borderRadius: 10,
//     marginBottom: 30,
//     elevation: 2,
//   },

//   logoutText: {
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#c0392b',
//   },
// });

import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Pressable, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Avatar, Title} from 'react-native-paper'; 
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './components/contexts/AuthContext';
import { RequestListProvider } from './components/contexts/RequestListContext';
import { useAuth } from './components/contexts/AuthContext';  
import { db } from './backend/firebase/FirebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Icon from 'react-native-vector-icons/Ionicons'; 
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'; // or FontAwesome, Ionicons, etc.

import { LogBox } from 'react-native';

import ActivityLogScreen from './components/admin/ActivityLogScreen';
import LoginScreen from './components/LoginScreen';
import UserDashboard from './components/user/UserDashboard';
import CalendarScreen from './components/user/CalendarScreen';
import PolicyScreen from './components/PolicyScreen';
import ProfileScreen from './components/user/ProfileScreen';
import Admin2Dashboard from './components/admin/Admin2Dashboard';
import PendingRequestScreen from './components/admin/PendingRequestScreen';
import InventoryScreen from './components/InventoryScreen';
import CameraScreen from './components/admin/CameraScreen';
import RequestScreen from './components/user/RequestScreen';
import RequestListScreen from './components/user/RequestListScreen';
import RequestLogScreen from './components/user/RequestLogScreen';
import LogScreen from './components/admin/LogScreen';
import InventoryStocks from './components/admin/InventoryStocks';
import SearchItems from './components/user/SearchItems';
import UserActivityLogScreen from './components/user/UserActivityLogScreen';
import BorrowCatalogScreen from './components/admin/BorrowCatalogScreen';
import { RequestMetadataProvider } from './components/contexts/RequestMetadataContext';
import CapexRequestScreen from './components/user/CapexRequestScreen';
import CapexRequestList from './components/admin/CapexListScreen';
import ReturnItems from './components/user/ReturnItems';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

LogBox.ignoreLogs([
  'Support for defaultProps will be removed from function components'
]);

const CustomDrawerContent = ({ navigation }) => {
  const { user, logout } = useAuth();  

  return (
    <View style={styles.drawerContent}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // or 'light-content' depending on your design
      />
      <View style={styles.upperSection}>
        <View style={styles.headProfile}>
          <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('ProfileScreen')}>
            <Avatar.Image style={{backgroundColor: '#5e8fb0'}} size={70} source={{ uri: 'https://your-profile-image-url.com' }} />
          </TouchableOpacity>
        </View>
      
        <View>
          <Text style={styles.profileName}>{user ? user.name : 'Guest'}</Text>
          <Text style={{fontSize: 13, color: '#dceaf2', marginTop: 0}}>Position goes here</Text>   
        </View>
      </View>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('ProfileScreen')} activeOpacity={0.5}>
        <Icon2 name="account-circle-outline" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Profile</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('InventoryScreen')}>
        <Icon2 name="clipboard-list-outline" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Requisition</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('SearchItems')}>
        <Icon2 name="magnify" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Search Items</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('UserHistoryLogScreen')}>
        <Icon2 name="history" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Status Board</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('UserActivityLogScreen')}>
        <Icon2 name="chart-timeline-variant" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Activity Log</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('CalendarScreen')}>
        <Icon2 name="calendar-month" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Calendar</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('RequestListScreen')}>
        <Icon2 name="file-document-outline" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Request List</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('PolicyScreen')}>
        <Icon2 name="shield-outline" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Policy</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('CapexRequestScreen')}>
        <Icon2 name="cash-multiple" size={25} style={styles.icon} />
        <Title style={styles.titleStyle}>Capex Request</Title>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to log out?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                  try {
                    if (user?.id) {
                      await addDoc(collection(db, `accounts/${user.id}/activitylog`), {
                        action: "User Logged Out (Mobile)",
                        userName: user.name || "User",
                        timestamp: serverTimestamp(),
                      });

                    } else {
                      console.warn("No user data available for logout log.");
                    }

                  } catch (error) {
                    console.error("Error logging logout:", error);

                  } finally {
                    logout();
                    navigation.replace("Login");
                  }
                },
              },
            ]
          );
        }}
      >
        <Icon name="log-out-outline" size={24} color="black" />
        <Title style={styles.logoutText}>Logout</Title>
      </TouchableOpacity>
    </View>
  );
};

const CustomAdminDrawerContent = ({ navigation }) => {
  const { user, logout } = useAuth();  

  return (
    
    <View style={styles.drawerContent}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // or 'light-content' depending on your design
      />
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
        <View style={styles.profileSection}>
          <Avatar.Image size={50} source={{ uri: 'https://your-profile-image-url.com' }} />
          <Title style={styles.profileName}>{user ? user.name : 'Guest'}</Title>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Admin2Dashboard')}>
        <Title style={styles.drawerItem}>Dashboard</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('InventoryStocks')}>
        <Title style={styles.drawerItem}>Inventory</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PendingRequestScreen')}>
        <Title style={styles.drawerItem}>Pending Requests</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ActivityLogScreen')}>
        <Title style={styles.drawerItem}>Activity Log</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RequestLogScreen')}>
        <Title style={styles.drawerItem}>Request Log</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('InventoryStocks')}>
        <Title style={styles.drawerItem}>QR Scanner</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('BorrowCatalogScreen')}>
        <Title style={styles.drawerItem}>Borrow Catalog</Title>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CapexRequestListScreen')}>
        <Title style={styles.drawerItem}>Capex Request List</Title>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton} 
        onPress={() => {
          Alert.alert(
            "Logout Confirmation", 
            "Are you sure you want to log out?", 
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Logout", 
                style: "destructive", 
                onPress: async () => {
                  try {
                    if (user?.id) {
                      await addDoc(collection(db, `accounts/${user.id}/activitylog`), {
                        action: "User Logged Out (Mobile)",
                        userName: user.name || "User",
                        timestamp: serverTimestamp(),
                      });
                    }
                  } catch (error) {
                    console.error("Failed to log logout activity:", error);
                  } finally {
                    logout();
                    navigation.replace('Login'); 
                  }
                }
              }
            ]
          );
        }}
      >
        <Icon name="log-out-outline" size={24} color="black" />
        <Title style={styles.logoutText}>Logout</Title>
      </TouchableOpacity>

    </View>
  );
};

function UserDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="UserDashboard"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="UserDashboard" component={UserDashboard} />
      <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
      <Drawer.Screen name="PolicyScreen" component={PolicyScreen} />
      <Drawer.Screen name="RequestScreen" component={RequestScreen} />
      <Drawer.Screen name="RequestListScreen" component={RequestListScreen} />
      <Drawer.Screen name="UserHistoryLogScreen" component={RequestLogScreen} />
      <Drawer.Screen name="SearchItems" component={SearchItems} />
      <Drawer.Screen name="UserActivityLogScreen" component={UserActivityLogScreen} />
      <Drawer.Screen name="InventoryScreen" component={InventoryScreen} />
      <Drawer.Screen name="CapexRequestScreen" component={CapexRequestScreen} />
      <Drawer.Screen name="ReturnItemsScreen" component={ReturnItems} />
    </Drawer.Navigator>
  );
}

const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Admin2Dashboard"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomAdminDrawerContent {...props} />}
    >
      <Drawer.Screen name="Admin2Dashboard" component={Admin2Dashboard} />
      <Drawer.Screen name="PendingRequestScreen" component={PendingRequestScreen} />
      <Drawer.Screen name="InventoryScreen" component={InventoryScreen} />
      <Drawer.Screen name="CameraScreen" component={CameraScreen} />
      <Drawer.Screen name="RequestLogScreen" component={LogScreen} />
      <Drawer.Screen name="InventoryStocks" component={InventoryStocks} />
      <Drawer.Screen name="ActivityLogScreen" component={ActivityLogScreen} />
      <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
      <Drawer.Screen name="BorrowCatalogScreen" component={BorrowCatalogScreen} />
      <Drawer.Screen name="CapexRequestListScreen" component={CapexRequestList} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <RequestMetadataProvider>
      <RequestListProvider>
        <AuthProvider>
          <SafeAreaView style={styles.safeArea}>
            <GestureHandlerRootView style={styles.container}>
              <PaperProvider>
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="User" component={UserDrawer} options={{ headerShown: false }} />
                    <Stack.Screen name="Admin" component={AdminDrawer} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
                  </Stack.Navigator>
                </NavigationContainer>
              </PaperProvider>
            </GestureHandlerRootView>
          </SafeAreaView>
        </AuthProvider>
      </RequestListProvider>
    </RequestMetadataProvider>
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

  drawerContent: {
    flex: 1,
    
    height: '100%',
    backgroundColor: 'white', 
    fontFamily: 'sans-serif'

  },  

  upperSection:{
    display: 'flex',
    backgroundColor: '#6e9fc1',
    height: 'auto',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    marginBottom: 15
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    maxWidth: 70
  },

  headProfile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },

  profileName: {
    marginTop:10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 0
  },

  drawerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    color: '#333',
  },

  titleStyle: {
    fontSize: 15,
    fontWeight: 500,
    color: '#4b4b4b'
  },
  icon: {
    marginRight: 20,
    color: '#8c8c8c', 
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 15,
    backgroundColor: '#ffefef',

    marginBottom: 30,

  },

  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c0392b',
  },
});

