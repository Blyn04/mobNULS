// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   Alert,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from 'react-native';
// import { collection, getDocs, deleteDoc, doc, onSnapshot, Timestamp, setDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../../backend/firebase/FirebaseConfig';
// import { useAuth } from '../contexts/AuthContext';
// import { useRequestMetadata } from '../contexts/RequestMetadataContext';
// import styles from '../styles/userStyle/RequestListStyle';
// import Header from '../Header';
// import { useNavigation } from '@react-navigation/native';

// const RequestListScreen = ({navigation}) => {
//   const { user } = useAuth();
//   const [requestList, setRequestList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quantity, setQuantity] = useState('');
//   const { metadata } = useRequestMetadata();
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
//   const [confirmationData, setConfirmationData] = useState(null);
//   const [tempDocIdsToDelete, setTempDocIdsToDelete] = useState([]);


  
//   useEffect(() => {
//     if (!user || !user.id) return;
  
//     const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
  
//     const unsubscribe = onSnapshot(tempRequestRef, (querySnapshot) => {
//       const tempRequestList = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           selectedItem: {
//             value: data.selectedItemId,
//             label: data.selectedItemLabel,
//           },
//         };
//       });
      
//       // ✅ Collect all temp doc IDs to delete later
//       const ids = querySnapshot.docs.map(doc => doc.id);
//       setTempDocIdsToDelete(ids);
      
//       setRequestList(tempRequestList);      
//       setLoading(false);
      
//     }, (error) => {
//       console.error('Error fetching request list in real-time:', error);
//       setLoading(false);
//     });
  
//     return () => unsubscribe(); // cleanup listener on unmount
//   }, [user]);  

//   const handleRequestNow = async () => {
//     console.log('Current metadata:', metadata);
  
//     // Check if all required fields are filled
//     if (
//       !metadata?.dateRequired ||
//       !metadata?.timeFrom ||
//       !metadata?.timeTo ||
//       !metadata?.program ||
//       !metadata?.room ||
//       !metadata?.usageType
      
//     ) {
//       Alert.alert('Missing Info', 'Please go back and fill the required borrowing details.');
//       return;
//     }
  
//     // Show the confirmation modal with the metadata details
//     setConfirmationData(metadata);
//     setShowConfirmationModal(true);
    
//   };

//   const logRequestOrReturn = async (userId, userName, action, requestDetails) => {
//     await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//       action, // e.g. "Requested Items" or "Returned Items"
//       userName,
//       timestamp: serverTimestamp(),
//       requestList: requestDetails, 
//     });
//   };

//   const submitRequest = async () => {
//     console.log('submitRequest initiated');
//     console.log('Submitting for user:', user?.id);
  
//     if (!user || !user.id) {
//       console.log('No user logged in');
//       Alert.alert('Error', 'User is not logged in.');
//       return false;
//     }
  
//     if (!requestList || requestList.length === 0) {
//       console.log('Request list is empty');
//       Alert.alert('Error', 'No items in the request list.');
//       return false;
//     }
  
//     try {
//       const userDocRef = doc(db, 'accounts', user.id);
//       const userDocSnapshot = await getDoc(userDocRef);
  
//       if (!userDocSnapshot.exists()) {
//         console.log('User document does not exist');
//         Alert.alert('Error', 'User not found.');
//         return false;
//       }
  
//       const userName = userDocSnapshot.data().name;
  
//       // Prepare request data
//       const requestData = {
//         dateRequired: metadata.dateRequired,
//         timeFrom: metadata.timeFrom,
//         timeTo: metadata.timeTo,
//         program: metadata.program,
//         room: metadata.room,
//         reason: metadata.reason,
//         filteredMergedData: requestList.map((item) => ({
//           ...item,
//           // program: metadata.program,
//           // reason: metadata.reason,
//           // room: metadata.room,
//           // timeFrom: metadata.timeFrom,
//           // timeTo: metadata.timeTo,
//         })),
//         userName,
//         timestamp: Timestamp.now(),
//         usageType: metadata.usageType,
//       };
  
//       console.log('Request data to be saved:', requestData);
  
//       // Add to user's personal requests collection
//       const userRequestRef = collection(db, 'accounts', user.id, 'userRequests');
//       await addDoc(userRequestRef, requestData);
  
//       // Add to global user requests collection
//       const userRequestsRootRef = collection(db, 'userrequests');
//       const newUserRequestRef = doc(userRequestsRootRef);
//       await setDoc(newUserRequestRef, {
//         ...requestData,
//         accountId: user.id,
//       });

//       // ✅ Delete the original temporary request
//       if (tempDocIdsToDelete.length > 0) {
//         for (const id of tempDocIdsToDelete) {
//           await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', id));
//           console.log('Deleted temp request with ID:', id);
//         }

//       } else {
//         console.log('No temp requests to delete');
//       }      
  
//       // Log the "Requested Items" action
//       await logRequestOrReturn(user.id, userName, "Requested Items", requestData.filteredMergedData);

//       console.log('Request submitted successfully');
//       return true; 

//     } catch (error) {
//       console.error('Error submitting request:', error);
//       Alert.alert('Error', 'Failed to submit request. Please try again.');
//       return false; 
//     }
//   };
  
//   const handleConfirmRequest = async () => {
//     console.log('Metadata:', metadata);
//     console.log('Confirm button pressed');
//     await submitRequest(); // Await the request submission
  
//     // Close the confirmation modal after the request is saved
//     setShowConfirmationModal(false);
//   };
  

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setQuantity(String(item.quantity)); // prefill quantity
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedItem(null);
//     setQuantity('');
//   };

//   const handleQuantityChange = (text) => {
//     const numericValue = text.replace(/[^0-9]/g, '');
//     setQuantity(numericValue);
//   };

//   const removeFromList = async (idToDelete) => {
//     try {
//       const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
//       const querySnapshot = await getDocs(tempRequestRef);
  
//       let foundDocId = null;
  
//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (data.selectedItemId === idToDelete) {
//           foundDocId = docSnap.id;
//         }
//       });
  
//       if (foundDocId) {
//         await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', foundDocId));
//         console.log(`Item with Firestore doc ID ${foundDocId} removed from Firestore.`);
  
//         // Remove from local list
//         const updatedList = requestList.filter((item) => item.selectedItemId !== idToDelete);
//         setRequestList(updatedList);

//       } else {
//         console.warn('Item not found in Firestore.');
//       }

//     } catch (error) {
//       console.error('Error removing item from Firestore:', error);
//     }
//   };
  
//   const confirmRemoveItem = (item) => {
//     Alert.alert(
//       'Remove Item',
//       'Are you sure you want to remove this item from the list?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Remove',
//           onPress: () => removeFromList(item.selectedItemId),
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };  

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => openModal(item)} style={styles.cardTouchable}>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.title}>{item.selectedItem?.label}</Text>
//           <TouchableOpacity onPress={() => confirmRemoveItem(item)} >
//             <Text style={styles.xIcon}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         <Text>Quantity: {item.quantity}</Text>
//         <Text>Category: {item.category}</Text>
//         <Text>Status: {item.status}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#333" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Header />

//       <View style={styles.tableContainer}>
//         <FlatList
//           data={requestList}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
//         />
//       </View>

//       <TouchableOpacity style={styles.requestButton} onPress={handleRequestNow}>
//         <Text style={styles.requestButtonText}>Request Now</Text>
//       </TouchableOpacity>

//       <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.title}>Request Details</Text>

//             {selectedItem && (
//               <>
//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item:</Text> {selectedItem.selectedItem?.label}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Quantity:</Text>
//                 </Text>

//                 <TextInput
//                   style={styles.inputQuantity}
//                   value={quantity}
//                   onChangeText={handleQuantityChange}
//                   keyboardType="numeric"
//                   placeholder="Enter quantity"
//                 />

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Category:</Text> {selectedItem.category}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Usage Type:</Text> {selectedItem.usageType}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item Type:</Text> {selectedItem.type}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Lab Room:</Text> {selectedItem.labRoom}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Condition:</Text> {selectedItem.condition}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Department:</Text> {selectedItem.department}
//                 </Text>
//               </>
//             )}

//             <TouchableOpacity style={styles.requestButtonModal} onPress={closeModal}>
//               <Text style={styles.requestButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {showConfirmationModal && (
//         <Modal
//           visible={showConfirmationModal}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setShowConfirmationModal(false)}
//         >
//           <TouchableWithoutFeedback onPress={() => setShowConfirmationModal(false)}>
//             <View style={styles.modalBackground}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContainer}>
//                   <Text style={styles.modalTitle}>Confirm Request</Text>
//                   <Text style={styles.modalText}>Date Required: {confirmationData?.dateRequired}</Text>
                  
//                   <Text>Start Time: {`${metadata.timeFrom?.hour}:${metadata.timeFrom?.minute} ${metadata.timeFrom?.period}`}</Text>
//                   <Text>End Time: {`${metadata.timeTo?.hour}:${metadata.timeTo?.minute} ${metadata.timeTo?.period}`}</Text>

//                   <Text style={styles.modalText}>Program: {confirmationData?.program}</Text>
//                   <Text style={styles.modalText}>Room: {confirmationData?.room}</Text>
//                   <Text style={styles.modalText}>Reason: {confirmationData?.reason}</Text>

//                   <ScrollView horizontal>
//                     <View>
//                       {/* Table Header */}
//                       <View style={styles.tableRowHeader}>
//                         <Text style={[styles.tableCellHeader, { width: 150 }]}>Item Name</Text>
//                         <Text style={[styles.tableCellHeader, { width: 100 }]}>Qty</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Category</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Status</Text>
//                       </View>

//                       {/* Table Rows */}
//                       {requestList.map((item) => (
//                         <View key={item.id} style={styles.tableRow}>
//                           <Text style={[styles.tableCell, { width: 150 }]}>{item.selectedItem?.label}</Text>
//                           <Text style={[styles.tableCell, { width: 100 }]}>{item.quantity}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.category}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.status}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   </ScrollView>

//                   <View style={styles.modalActions}>
//                     <TouchableOpacity
//                       style={styles.cancelButton}
//                       onPress={() => setShowConfirmationModal(false)}
//                     >
//                       <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={styles.confirmButton}
//                       onPress={async () => {
//                         console.log('Confirm button pressed');

//                         const requestSuccess = await submitRequest(); // Await submitRequest to finish

//                         if (requestSuccess) {
//                           console.log('Request successfully submitted. Closing modal.');
//                           alert('Request Submitted Succesfully!')
//                           setShowConfirmationModal(false); // Close the modal only if the request was successful
//                           navigation.goBack()
//                         } else {
//                           alert('There was a problem in processing you request. Try again later.')
//                           console.log('Request submission failed. Not closing modal.');
//                         }
//                       }}
//                     >
//                       <Text style={styles.confirmButtonText}>Confirm</Text>
//                     </TouchableOpacity>

//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export default RequestListScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   Alert,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from 'react-native';
// import { collection, getDocs, deleteDoc, doc, onSnapshot, Timestamp, setDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../../backend/firebase/FirebaseConfig';
// import { useAuth } from '../contexts/AuthContext';
// import { useRequestMetadata } from '../contexts/RequestMetadataContext';
// import styles from '../styles/userStyle/RequestListStyle';
// import Header from '../Header';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Checkbox  } from 'react-native-paper';

// const RequestListScreen = ({navigation}) => {
//   const { user } = useAuth();
//   const [requestList, setRequestList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quantity, setQuantity] = useState('');
//   const { metadata } = useRequestMetadata();
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
//   const [confirmationData, setConfirmationData] = useState(null);
//   const [tempDocIdsToDelete, setTempDocIdsToDelete] = useState([]);
//   const [headerHeight, setHeaderHeight] = useState(0);

//   const handleHeaderLayout = (event) => {
//     const { height } = event.nativeEvent.layout;
//     setHeaderHeight(height);
//   };

  
//   useEffect(() => {
//     if (!user || !user.id) return;
  
//     const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
  
//     const unsubscribe = onSnapshot(tempRequestRef, (querySnapshot) => {
//       const tempRequestList = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           selectedItem: {
//             value: data.selectedItemId,
//             label: data.selectedItemLabel,
//           },
//         };
//       });
      
//       // ✅ Collect all temp doc IDs to delete later
//       const ids = querySnapshot.docs.map(doc => doc.id);
//       setTempDocIdsToDelete(ids);
      
//       setRequestList(tempRequestList);      
//       setLoading(false);
      
//     }, (error) => {
//       console.error('Error fetching request list in real-time:', error);
//       setLoading(false);
//     });
  
//     return () => unsubscribe(); // cleanup listener on unmount
//   }, [user]);  

//   const handleRequestNow = async () => {
//     console.log('Current metadata:', metadata);
  
//     // Check if all required fields are filled
//     if (
//       !metadata?.dateRequired ||
//       !metadata?.timeFrom ||
//       !metadata?.timeTo ||
//       !metadata?.program ||
//       !metadata?.room ||
//       !metadata?.usageType
      
//     ) {
//       Alert.alert('Missing Info', 'Please go back and fill the required borrowing details.');
//       return;
//     }
  
//     // Show the confirmation modal with the metadata details
//     setConfirmationData(metadata);
//     setShowConfirmationModal(true);
    
//   };

//   const logRequestOrReturn = async (userId, userName, action, requestDetails) => {
//     await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//       action, // e.g. "Requested Items" or "Returned Items"
//       userName,
//       timestamp: serverTimestamp(),
//       requestList: requestDetails, 
//     });
//   };

//   const submitRequest = async () => {
//     console.log('submitRequest initiated');
//     console.log('Submitting for user:', user?.id);
  
//     if (!user || !user.id) {
//       console.log('No user logged in');
//       Alert.alert('Error', 'User is not logged in.');
//       return false;
//     }
  
//     if (!requestList || requestList.length === 0) {
//       console.log('Request list is empty');
//       Alert.alert('Error', 'No items in the request list.');
//       return false;
//     }
  
//     try {
//       const userDocRef = doc(db, 'accounts', user.id);
//       const userDocSnapshot = await getDoc(userDocRef);
  
//       if (!userDocSnapshot.exists()) {
//         console.log('User document does not exist');
//         Alert.alert('Error', 'User not found.');
//         return false;
//       }
  
//       const userName = userDocSnapshot.data().name;
  
//       // Prepare request data
//       const requestData = {
//         dateRequired: metadata.dateRequired,
//         timeFrom: metadata.timeFrom,
//         timeTo: metadata.timeTo,
//         program: metadata.program,
//         room: metadata.room,
//         reason: metadata.reason,
//         filteredMergedData: requestList.map((item) => ({
//           ...item,
//           // program: metadata.program,
//           // reason: metadata.reason,
//           // room: metadata.room,
//           // timeFrom: metadata.timeFrom,
//           // timeTo: metadata.timeTo,
//         })),
//         userName,
//         timestamp: Timestamp.now(),
//         usageType: metadata.usageType,
//       };
  
//       console.log('Request data to be saved:', requestData);
  
//       // Add to user's personal requests collection
//       const userRequestRef = collection(db, 'accounts', user.id, 'userRequests');
//       await addDoc(userRequestRef, requestData);
  
//       // Add to global user requests collection
//       const userRequestsRootRef = collection(db, 'userrequests');
//       const newUserRequestRef = doc(userRequestsRootRef);
//       await setDoc(newUserRequestRef, {
//         ...requestData,
//         accountId: user.id,
//       });

//       // ✅ Delete the original temporary request
//       if (tempDocIdsToDelete.length > 0) {
//         for (const id of tempDocIdsToDelete) {
//           await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', id));
//           console.log('Deleted temp request with ID:', id);
//         }

//       } else {
//         console.log('No temp requests to delete');
//       }      
  
//       // Log the "Requested Items" action
//       await logRequestOrReturn(user.id, userName, "Requested Items", requestData.filteredMergedData);

//       console.log('Request submitted successfully');
//       return true; 

//     } catch (error) {
//       console.error('Error submitting request:', error);
//       Alert.alert('Error', 'Failed to submit request. Please try again.');
//       return false; 
//     }
//   };
  
//   const handleConfirmRequest = async () => {
//     console.log('Metadata:', metadata);
//     console.log('Confirm button pressed');
//     await submitRequest(); // Await the request submission
  
//     // Close the confirmation modal after the request is saved
//     setShowConfirmationModal(false);
//   };
  

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setQuantity(String(item.quantity)); // prefill quantity
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedItem(null);
//     setQuantity('');
//   };

//   const handleQuantityChange = (text) => {
//     const numericValue = text.replace(/[^0-9]/g, '');
//     setQuantity(numericValue);
//   };

//   const removeFromList = async (idToDelete) => {
//     try {
//       const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
//       const querySnapshot = await getDocs(tempRequestRef);
  
//       let foundDocId = null;
  
//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (data.selectedItemId === idToDelete) {
//           foundDocId = docSnap.id;
//         }
//       });
  
//       if (foundDocId) {
//         await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', foundDocId));
//         console.log(`Item with Firestore doc ID ${foundDocId} removed from Firestore.`);
  
//         // Remove from local list
//         const updatedList = requestList.filter((item) => item.selectedItemId !== idToDelete);
//         setRequestList(updatedList);

//       } else {
//         console.warn('Item not found in Firestore.');
//       }

//     } catch (error) {
//       console.error('Error removing item from Firestore:', error);
//     }
//   };
  
//   const confirmRemoveItem = (item) => {
//     Alert.alert(
//       'Remove Item',
//       'Are you sure you want to remove this item from the list?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Remove',
//           onPress: () => removeFromList(item.selectedItemId),
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };  

//   const renderItem = ({ item }) => (
//     <View style={{flex: 1, flexDirection: 'row', marginBottom: 5, elevation: 1, backgroundColor: 'white', borderRadius: 10}}>
//     <TouchableOpacity onPress={() => openModal(item)} style={[styles.touchable, {borderBottomColor: '#395a7f'}]}>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.title}>{item.selectedItem?.label}</Text>
//           <Text>Quantity: {item.quantity}</Text>
//         <Text>Category: {item.category}</Text>
//         <Text>Status: {item.status}</Text>
//       </View>
//         </View>
//     </TouchableOpacity>
//     <TouchableOpacity onPress={() => confirmRemoveItem(item)} style={styles.trash} >
//             <Icon name='trash' size={15} color='#fff'/>
//           </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#333" />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container]}>
//        <Header onLayout={handleHeaderLayout} />
//         <FlatList
//         style={{ paddingHorizontal: 5, marginTop: headerHeight+5, paddingTop: 10, backgroundColor:'#fff', borderRadius: 10}}
//         showsVerticalScrollIndicator={false}
        
//         scrollEnabled={true}
//           data={requestList}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
//         />
   

      
//       <View style={styles.bottomNav}>
//         <Text style={{backgroundColor: '#f5f5f5',borderBottomColor: '#e9ecee',borderBottomWidth: 1, paddingLeft: 20, fontSize:11, color: 'gray'}}><Text style={{fontWeight:'bold'}}>Note: </Text>Finalize your item list before submitting</Text>
        

//         <View style={{flex:1, flexDirection: 'row', paddingLeft:5}}>
          
          
//           <View style={{flex:1, width: '70%', flexDirection: 'row'}}>
//             <View style={{width: '50%', flexDirection: 'row', alignItems:'center'}}>
//             <Checkbox
//             />
//           <Text>Select All</Text>
//           </View>

//           <TouchableOpacity style={{width: '50%', backgroundColor: '#a3cae9', justifyContent:'center', alignItems: 'center'}}>
//             <Text style={styles.requestButtonText}>
//               Add to Drafts
//             </Text>
//           </TouchableOpacity>
//         </View>
        

//         <TouchableOpacity style={styles.requestButton} onPress={handleRequestNow}>
//         <Text style={styles.requestButtonText}>Submit</Text>
//       </TouchableOpacity>
//         </View>
      
//       </View>

//       <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.title}>Request Details</Text>

//             {selectedItem && (
//               <>
//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item:</Text> {selectedItem.selectedItem?.label}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Quantity:</Text>
//                 </Text>

//                 <TextInput
//                   style={styles.inputQuantity}
//                   value={quantity}
//                   onChangeText={handleQuantityChange}
//                   keyboardType="numeric"
//                   placeholder="Enter quantity"
//                 />

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Category:</Text> {selectedItem.category}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Usage Type:</Text> {selectedItem.usageType}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item Type:</Text> {selectedItem.type}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Lab Room:</Text> {selectedItem.labRoom}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Condition:</Text> {selectedItem.condition}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Department:</Text> {selectedItem.department}
//                 </Text>
//               </>
//             )}

//             <TouchableOpacity style={styles.requestButtonModal} onPress={closeModal}>
//               <Text style={styles.requestButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {showConfirmationModal && (
//         <Modal
//           visible={showConfirmationModal}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setShowConfirmationModal(false)}
//         >
//           <TouchableWithoutFeedback onPress={() => setShowConfirmationModal(false)}>
//             <View style={styles.modalBackground}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContainer}>
//                   <Text style={styles.modalTitle}>Confirm Request</Text>
//                   <Text style={styles.modalText}>Date Required: {confirmationData?.dateRequired}</Text>
                  
//                   <Text>Start Time: {`${metadata.timeFrom?.hour}:${metadata.timeFrom?.minute} ${metadata.timeFrom?.period}`}</Text>
//                   <Text>End Time: {`${metadata.timeTo?.hour}:${metadata.timeTo?.minute} ${metadata.timeTo?.period}`}</Text>

//                   <Text style={styles.modalText}>Program: {confirmationData?.program}</Text>
//                   <Text style={styles.modalText}>Room: {confirmationData?.room}</Text>
//                   <Text style={styles.modalText}>Reason: {confirmationData?.reason}</Text>

//                   <ScrollView horizontal>
//                     <View>
//                       {/* Table Header */}
//                       <View style={styles.tableRowHeader}>
//                         <Text style={[styles.tableCellHeader, { width: 150 }]}>Item Name</Text>
//                         <Text style={[styles.tableCellHeader, { width: 100 }]}>Qty</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Category</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Status</Text>
//                       </View>

//                       {/* Table Rows */}
//                       {requestList.map((item) => (
//                         <View key={item.id} style={styles.tableRow}>
//                           <Text style={[styles.tableCell, { width: 150 }]}>{item.selectedItem?.label}</Text>
//                           <Text style={[styles.tableCell, { width: 100 }]}>{item.quantity}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.category}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.status}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   </ScrollView>

//                   <View style={styles.modalActions}>
//                     <TouchableOpacity
//                       style={styles.cancelButton}
//                       onPress={() => setShowConfirmationModal(false)}
//                     >
//                       <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={styles.confirmButton}
//                       onPress={async () => {
//                         console.log('Confirm button pressed');

//                         const requestSuccess = await submitRequest(); // Await submitRequest to finish

//                         if (requestSuccess) {
//                           console.log('Request successfully submitted. Closing modal.');
//                           alert('Request Submitted Succesfully!')
//                           setShowConfirmationModal(false); // Close the modal only if the request was successful
//                           navigation.goBack()
//                         } else {
//                           alert('There was a problem in processing you request. Try again later.')
//                           console.log('Request submission failed. Not closing modal.');
//                         }
//                       }}
//                     >
//                       <Text style={styles.confirmButtonText}>Confirm</Text>
//                     </TouchableOpacity>

//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export default RequestListScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { Card } from 'react-native-paper';
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   getDoc,
//   deleteDoc,
//   setDoc,
//   query,
//   where,
//   onSnapshot
// } from 'firebase/firestore';
// import { db } from '../../backend/firebase/FirebaseConfig';
// import { useAuth } from '../contexts/AuthContext';
// import styles from '../styles/userStyle/RequestStyle';
// import Header from '../Header';

// export default function RequestScreen() {
//   const [requests, setRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);

//   const { user } = useAuth();

//   const [headerHeight, setHeaderHeight] = useState(0);
  
//     const handleHeaderLayout = (event) => {
//       const { height } = event.nativeEvent.layout;
//       setHeaderHeight(height);
//     };

//   // const fetchRequests = async () => {
//   //   setLoading(true);
//   //   try {
//   //     if (!user?.uid) throw new Error('User is not logged in.');

//   //     const querySnapshot = await getDocs(collection(db, `accounts/${user.id}/userRequests`));
//   //     console.log('Fetched docs:', querySnapshot.docs.length);
//   //     const fetched = [];

//   //     for (const docSnap of querySnapshot.docs) {
//   //       const data = docSnap.data();
//   //       const enrichedItems = await Promise.all(
//   //         (data.filteredMergedData || data.requestList || []).map(async (item) => {
//   //           const inventoryId = item.selectedItemId || item.selectedItem?.value;
//   //           let itemId = 'N/A';
//   //           if (inventoryId) {
//   //             try {
//   //               const invDoc = await getDoc(doc(db, `inventory/${inventoryId}`));
//   //               if (invDoc.exists()) {
//   //                 itemId = invDoc.data().itemId || 'N/A';
//   //               }
//   //             } catch (err) {
//   //               console.error(`Error fetching inventory item ${inventoryId}:`, err);
//   //             }
//   //           }

//   //           return {
//   //             ...item,
//   //             itemIdFromInventory: itemId,
//   //           };
//   //         })
//   //       );

//   //       const dateObj = data.timestamp?.toDate?.();
//   //       const dateRequested = dateObj ? dateObj : new Date();

//   //       fetched.push({
//   //         id: docSnap.id,
//   //         dateRequested,
//   //         dateRequired: data.dateRequired || 'N/A',
//   //         requester: data.userName || 'Unknown',
//   //         room: data.room || 'N/A',
//   //         timeNeeded: `${data.timeFrom || 'N/A'} - ${data.timeTo || 'N/A'}`,
//   //         courseCode: data.program || 'N/A',
//   //         courseDescription: data.reason || 'N/A',
//   //         items: enrichedItems,
//   //         status: 'PENDING',
//   //         message: data.reason || '',
//   //       });
//   //     }

//   //     const sortedByDate = fetched.sort((a, b) => b.dateRequested - a.dateRequested);

//   //     setRequests(sortedByDate);
//   //   } catch (err) {
//   //     console.error('Error fetching requests:', err);
//   //     Alert.alert('Error', 'Failed to fetch user requests.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchRequests = () => {
//     setLoading(true);
//     try {
//       if (!user?.id) throw new Error('User is not logged in.');
  
//       // Set up the real-time listener using onSnapshot
//       const requestsRef = collection(db, `accounts/${user.id}/userRequests`);
//       const unsubscribe = onSnapshot(requestsRef, async (querySnapshot) => {
//         console.log('Fetched docs:', querySnapshot.docs.length);
//         const fetched = [];
  
//         // Loop through each document and enrich the request items
//         for (const docSnap of querySnapshot.docs) {
//           const data = docSnap.data();
//           const enrichedItems = await Promise.all(
//             (data.filteredMergedData || data.requestList || []).map(async (item) => {
//               const inventoryId = item.selectedItemId || item.selectedItem?.value;
//               let itemId = 'N/A';
//               if (inventoryId) {
//                 try {
//                   const invDoc = await getDoc(doc(db, `inventory/${inventoryId}`));
//                   if (invDoc.exists()) {
//                     itemId = invDoc.data().itemId || 'N/A';
//                   }
                  
//                 } catch (err) {
//                   console.error(`Error fetching inventory item ${inventoryId}:`, err);
//                 }
//               }
  
//               return {
//                 ...item,
//                 itemIdFromInventory: itemId,
//               };
//             })
//           );
  
//           const dateObj = data.timestamp?.toDate?.();
//           const dateRequested = dateObj ? dateObj : new Date();
  
//           fetched.push({
//             id: docSnap.id,
//             dateRequested,
//             dateRequired: data.dateRequired || 'N/A',
//             requester: data.userName || 'Unknown',
//             room: data.room || 'N/A',
//             timeNeeded: `${data.timeFrom || 'N/A'} - ${data.timeTo || 'N/A'}`,
//             courseCode: data.program || 'N/A',
//             courseDescription: data.reason || 'N/A',
//             items: enrichedItems,
//             status: 'PENDING',
//             message: data.reason || '',
//           });
//         }
  
//         const sortedByDate = fetched.sort((a, b) => b.dateRequested - a.dateRequested);
  
//         setRequests(sortedByDate); // Update state with new requests
//       });
  
//       // Clean up the listener when the component unmounts
//       return () => unsubscribe();
  
//     } catch (err) {
//       console.error('Error fetching requests:', err);
//       Alert.alert('Error', 'Failed to fetch user requests.');

//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelRequest = async () => {
//     try {
//       if (!user?.id || !selectedRequest?.id) {
//         throw new Error('Missing user ID or selected request ID.');
//       }

//       const userRequestRef = doc(db, `accounts/${user.id}/userRequests`, selectedRequest.id);
//       const activityLogRef = doc(db, `accounts/${user.id}/historylog`, selectedRequest.id);
//       const requestSnap = await getDoc(userRequestRef);
//       if (!requestSnap.exists()) throw new Error('Request not found.');

//       const requestData = requestSnap.data();

//       await setDoc(activityLogRef, {
//         ...requestData,
//         status: 'CANCELLED',
//         cancelledAt: new Date(),
//       });

//       await deleteDoc(userRequestRef);

//       const rootQuery = query(
//         collection(db, 'userrequests'),
//         where('accountId', '==', user.id),
//         where('timestamp', '==', requestData.timestamp)
//       );

//       const rootSnap = await getDocs(rootQuery);
//       const batchDeletes = [];

//       rootSnap.forEach((docSnap) => {
//         batchDeletes.push(deleteDoc(doc(db, 'userrequests', docSnap.id)));
//       });

//       await Promise.all(batchDeletes);

//       Alert.alert('Success', 'Request successfully cancelled.');
//       setModalVisible(false);
//       fetchRequests();

//     } catch (err) {
//       console.error('Cancel error:', err);
//       Alert.alert('Error', 'Failed to cancel the request.');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => { setSelectedRequest(item); setModalVisible(true); }}>
//       <Card style={styles.card}>
//         <Text style={styles.requestId}>ID: {item.id}</Text>
//         <Text>Date Requested: {item.dateRequested.toLocaleDateString()}</Text>
//         <Text>Date Required: {item.dateRequired}</Text>
//         <Text>Status: {item.status}</Text>
//       </Card>
//     </TouchableOpacity>
//   );

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
    
//     <View style={styles.container}>
//       <Header onLayout={handleHeaderLayout} />
//       <View style={[styles.topNav, {top:headerHeight}]}>

//         <TouchableOpacity style={{width: '50%', backgroundColor: '#e9ecee',justifyContent:'center',alignItems:'center',paddingVertical: 15}}>
//           <Text style={{fontWeight: 'bold', fontSize: 15}}>Processed</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={{width: '50%', backgroundColor: 'white',justifyContent:'center',alignItems:'center',paddingVertical: 15, borderLeftColor: '#acacac', borderLeftWidth:1}}>
//           <Text style={{fontWeight: 'bold', fontSize: 15}}>Pending</Text>
//         </TouchableOpacity>
        
//       </View>

//       <View style={[styles.containerInner, {paddingTop: headerHeight}]}>
        
//       <Text style={styles.title}>📋 Request List</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#1890ff" style={{ marginTop: 30 }} />
//       ) : requests.length === 0 ? (
//         <Text style={{ textAlign: 'center', marginTop: 20 }}>No requests found.</Text>
//       ) : (
//         <FlatList
//           data={requests}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}

//       </View>
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <ScrollView style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Request Details - {selectedRequest?.id}</Text>
//             <Text><Text style={styles.label}>Requester:</Text> {selectedRequest?.requester}</Text>
//             <Text><Text style={styles.label}>Requisition Date:</Text> {selectedRequest?.dateRequested?.toLocaleDateString()}</Text>
//             <Text><Text style={styles.label}>Date Required:</Text> {selectedRequest?.dateRequired}</Text>
//             <Text><Text style={styles.label}>Time Needed:</Text> {selectedRequest?.timeNeeded}</Text>
//             <Text><Text style={styles.label}>Course Code:</Text> {selectedRequest?.courseCode}</Text>
//             <Text><Text style={styles.label}>Course Description:</Text> {selectedRequest?.courseDescription}</Text>
//             <Text><Text style={styles.label}>Room:</Text> {selectedRequest?.room}</Text>

//             <Text style={styles.subTitle}>Requested Items:</Text>
//               <View style={styles.table}>
//                 <View style={styles.tableHeader}>
//                   <Text style={styles.tableHeaderCell}>Item Name</Text>
//                   <Text style={styles.tableHeaderCell}>Item ID</Text>
//                   <Text style={styles.tableHeaderCell}>Qty</Text>
//                   <Text style={styles.tableHeaderCell}>Dept</Text>
//                   <Text style={styles.tableHeaderCell}>Usage</Text>
//                 </View>
                
//                 {selectedRequest?.items.map((item, idx) => (
//                   <View key={idx} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{item.itemName}</Text>
//                     <Text style={styles.tableCell}>{item.itemIdFromInventory}</Text>
//                     <Text style={styles.tableCell}>{item.quantity}</Text>
//                     <Text style={styles.tableCell}>{item.department}</Text>
//                     <Text style={styles.tableCell}>{item.usageType}</Text>
//                   </View>
//                 ))}
//               </View>

//             <Text><Text style={styles.label}>Message:</Text> {selectedRequest?.message || 'No message provided.'}</Text>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity onPress={cancelRequest} style={styles.cancelButton}>
//                 <Text style={styles.cancelText}>Cancel Request</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//                 <Text style={styles.closeText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   Alert,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from 'react-native';
// import { collection, getDocs, deleteDoc, doc, onSnapshot, Timestamp, setDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../../backend/firebase/FirebaseConfig';
// import { useAuth } from '../contexts/AuthContext';
// import { useRequestMetadata } from '../contexts/RequestMetadataContext';
// import styles from '../styles/userStyle/RequestListStyle';
// import Header from '../Header';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Checkbox  } from 'react-native-paper';

// const RequestListScreen = ({navigation}) => {
//   const { user } = useAuth();
//   const [requestList, setRequestList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quantity, setQuantity] = useState('');
//   const { metadata } = useRequestMetadata();
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
//   const [confirmationData, setConfirmationData] = useState(null);
//   const [tempDocIdsToDelete, setTempDocIdsToDelete] = useState([]);
//   const [headerHeight, setHeaderHeight] = useState(0);

//   const handleHeaderLayout = (event) => {
//     const { height } = event.nativeEvent.layout;
//     setHeaderHeight(height);
//   };

  
//   useEffect(() => {
//     if (!user || !user.id) return;
  
//     const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
  
//     const unsubscribe = onSnapshot(tempRequestRef, (querySnapshot) => {
//       const tempRequestList = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           selectedItem: {
//             value: data.selectedItemId,
//             label: data.selectedItemLabel,
//           },
//         };
//       });
      
//       // ✅ Collect all temp doc IDs to delete later
//       const ids = querySnapshot.docs.map(doc => doc.id);
//       setTempDocIdsToDelete(ids);
      
//       setRequestList(tempRequestList);      
//       setLoading(false);
      
//     }, (error) => {
//       console.error('Error fetching request list in real-time:', error);
//       setLoading(false);
//     });
  
//     return () => unsubscribe(); // cleanup listener on unmount
//   }, [user]);  

//   const formatTime = (timeObj) => {
//     if (!timeObj || typeof timeObj !== 'object') return '';

//     let { hour, minute, period } = timeObj;
//     hour = parseInt(hour);
//     minute = parseInt(minute);

//     if (period === 'PM' && hour !== 12) {
//       hour += 12;
      
//     } else if (period === 'AM' && hour === 12) {
//       hour = 0;
//     }

//     const paddedHour = hour.toString().padStart(2, '0');
//     const paddedMinute = minute.toString().padStart(2, '0');

//     return `${paddedHour}:${paddedMinute}`;
//   };

//   const handleRequestNow = async () => {
//     console.log('Current metadata:', metadata);
  
//     // Check if all required fields are filled
//     if (
//       !metadata?.dateRequired ||
//       !metadata?.timeFrom ||
//       !metadata?.timeTo ||
//       !metadata?.program ||
//       !metadata?.room ||
//       !metadata?.usageType
      
//     ) {
//       Alert.alert('Missing Info', 'Please go back and fill the required borrowing details.');
//       return;
//     }
  
//     // Show the confirmation modal with the metadata details
//     setConfirmationData(metadata);
//     setShowConfirmationModal(true);
    
//   };

//   const logRequestOrReturn = async (userId, userName, action, requestDetails) => {
//     await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//       action, // e.g. "Requested Items" or "Returned Items"
//       userName,
//       timestamp: serverTimestamp(),
//       requestList: requestDetails, 
//     });
//   };

//   const submitRequest = async () => {
//     console.log('submitRequest initiated');
//     console.log('Submitting for user:', user?.id);
  
//     if (!user || !user.id) {
//       console.log('No user logged in');
//       Alert.alert('Error', 'User is not logged in.');
//       return false;
//     }
  
//     if (!requestList || requestList.length === 0) {
//       console.log('Request list is empty');
//       Alert.alert('Error', 'No items in the request list.');
//       return false;
//     }
  
//     try {
//       const userDocRef = doc(db, 'accounts', user.id);
//       const userDocSnapshot = await getDoc(userDocRef);
  
//       if (!userDocSnapshot.exists()) {
//         console.log('User document does not exist');
//         Alert.alert('Error', 'User not found.');
//         return false;
//       }
  
//       const userName = userDocSnapshot.data().name;
  
//       // Prepare request data
//       const requestData = {
//         dateRequired: metadata.dateRequired,
//         timeFrom: metadata.timeFrom,
//         timeTo: metadata.timeTo,
//         program: metadata.program,
//         room: metadata.room,
//         reason: metadata.reason,
//         filteredMergedData: requestList.map((item) => ({
//           ...item,
//           // program: metadata.program,
//           // reason: metadata.reason,
//           // room: metadata.room,
//           // timeFrom: metadata.timeFrom,
//           // timeTo: metadata.timeTo,
//         })),
//         userName,
//         timestamp: Timestamp.now(),
//         usageType: metadata.usageType,
//       };
  
//       console.log('Request data to be saved:', requestData);
  
//       // Add to user's personal requests collection
//       const userRequestRef = collection(db, 'accounts', user.id, 'userRequests');
//       await addDoc(userRequestRef, requestData);
  
//       // Add to global user requests collection
//       const userRequestsRootRef = collection(db, 'userrequests');
//       const newUserRequestRef = doc(userRequestsRootRef);
//       await setDoc(newUserRequestRef, {
//         ...requestData,
//         accountId: user.id,
//       });

//       // ✅ Delete the original temporary request
//       if (tempDocIdsToDelete.length > 0) {
//         for (const id of tempDocIdsToDelete) {
//           await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', id));
//           console.log('Deleted temp request with ID:', id);
//         }

//       } else {
//         console.log('No temp requests to delete');
//       }      
  
//       // Log the "Requested Items" action
//       await logRequestOrReturn(user.id, userName, "Requested Items", requestData.filteredMergedData);

//       console.log('Request submitted successfully');
//       return true; 

//     } catch (error) {
//       console.error('Error submitting request:', error);
//       Alert.alert('Error', 'Failed to submit request. Please try again.');
//       return false; 
//     }
//   };
  
//   const handleConfirmRequest = async () => {
//     console.log('Metadata:', metadata);
//     console.log('Confirm button pressed');
//     await submitRequest(); // Await the request submission
  
//     // Close the confirmation modal after the request is saved
//     setShowConfirmationModal(false);
//   };
  

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setQuantity(String(item.quantity)); // prefill quantity
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedItem(null);
//     setQuantity('');
//   };

//   const handleQuantityChange = (text) => {
//     const numericValue = text.replace(/[^0-9]/g, '');
//     setQuantity(numericValue);
//   };

//   const removeFromList = async (idToDelete) => {
//     try {
//       const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
//       const querySnapshot = await getDocs(tempRequestRef);
  
//       let foundDocId = null;
  
//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (data.selectedItemId === idToDelete) {
//           foundDocId = docSnap.id;
//         }
//       });
  
//       if (foundDocId) {
//         await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', foundDocId));
//         console.log(`Item with Firestore doc ID ${foundDocId} removed from Firestore.`);
  
//         // Remove from local list
//         const updatedList = requestList.filter((item) => item.selectedItemId !== idToDelete);
//         setRequestList(updatedList);

//       } else {
//         console.warn('Item not found in Firestore.');
//       }

//     } catch (error) {
//       console.error('Error removing item from Firestore:', error);
//     }
//   };
  
//   const confirmRemoveItem = (item) => {
//     Alert.alert(
//       'Remove Item',
//       'Are you sure you want to remove this item from the list?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Remove',
//           onPress: () => removeFromList(item.selectedItemId),
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };  

//   const renderItem = ({ item }) => (
//     <View style={{flex: 1, flexDirection: 'row', marginBottom: 5, elevation: 1, backgroundColor: 'white', borderRadius: 10}}>
//     <TouchableOpacity onPress={() => openModal(item)} style={[styles.touchable, {borderBottomColor: '#395a7f'}]}>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.title}>{item.selectedItem?.label}</Text>
//           <Text>Quantity: {item.quantity}</Text>
//         <Text>Category: {item.category}</Text>
//         <Text>Status: {item.status}</Text>
//       </View>
//         </View>
//     </TouchableOpacity>
//     <TouchableOpacity onPress={() => confirmRemoveItem(item)} style={styles.trash} >
//             <Icon name='trash' size={15} color='#fff'/>
//           </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#333" />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container]}>
//        <Header onLayout={handleHeaderLayout} />
//         <FlatList
//         style={{ paddingHorizontal: 5, marginTop: headerHeight+5, paddingTop: 10, backgroundColor:'#fff', borderRadius: 10}}
//         showsVerticalScrollIndicator={false}
        
//         scrollEnabled={true}
//           data={requestList}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
//         />
   

      
//       <View style={styles.bottomNav}>
//         <Text style={{backgroundColor: '#f5f5f5',borderBottomColor: '#e9ecee',borderBottomWidth: 1, paddingLeft: 20, fontSize:11, color: 'gray'}}><Text style={{fontWeight:'bold'}}>Note: </Text>Finalize your item list before submitting</Text>
        

//         <View style={{flex:1, flexDirection: 'row', paddingLeft:5}}>
          
          
//           <View style={{flex:1, width: '70%', flexDirection: 'row'}}>
//             <View style={{width: '50%', flexDirection: 'row', alignItems:'center'}}>
//             <Checkbox
//             />
//           <Text>Select All</Text>
//           </View>

//           <TouchableOpacity style={{width: '50%', backgroundColor: '#a3cae9', justifyContent:'center', alignItems: 'center'}}>
//             <Text style={styles.requestButtonText}>
//               Add to Drafts
//             </Text>
//           </TouchableOpacity>
//         </View>
        

//         <TouchableOpacity style={styles.requestButton} onPress={handleRequestNow}>
//         <Text style={styles.requestButtonText}>Submit</Text>
//       </TouchableOpacity>
//         </View>
      
//       </View>

//       <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.title}>Request Details</Text>

//             {selectedItem && (
//               <>
//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item:</Text> {selectedItem.selectedItem?.label}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Quantity:</Text>
//                 </Text>

//                 <TextInput
//                   style={styles.inputQuantity}
//                   value={quantity}
//                   onChangeText={handleQuantityChange}
//                   keyboardType="numeric"
//                   placeholder="Enter quantity"
//                 />

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Category:</Text> {selectedItem.category}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Usage Type:</Text> {selectedItem.usageType}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Item Type:</Text> {selectedItem.type}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Lab Room:</Text> {selectedItem.labRoom}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Condition:</Text> {selectedItem.condition}
//                 </Text>

//                 <Text style={styles.modalDetail}>
//                   <Text style={styles.bold}>Department:</Text> {selectedItem.department}
//                 </Text>
//               </>
//             )}

//             <TouchableOpacity style={styles.requestButtonModal} onPress={closeModal}>
//               <Text style={styles.requestButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {showConfirmationModal && (
//         <Modal
//           visible={showConfirmationModal}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setShowConfirmationModal(false)}
//         >
//           <TouchableWithoutFeedback onPress={() => setShowConfirmationModal(false)}>
//             <View style={styles.modalBackground}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContainer}>
//                   <Text style={styles.modalTitle}>Confirm Request</Text>
//                   <Text style={styles.modalText}>Date Required: {confirmationData?.dateRequired}</Text>

//                   {/* Use the formatted time strings directly */}
//                   <Text>Time From: {formatTime(metadata.timeFrom)}</Text>
//                   <Text>Time To: {formatTime(metadata.timeTo)}</Text>

//                   <Text style={styles.modalText}>Program: {confirmationData?.program}</Text>
//                   <Text style={styles.modalText}>Room: {confirmationData?.room}</Text>
//                   <Text style={styles.modalText}>Reason: {confirmationData?.reason}</Text>

//                   <ScrollView horizontal>
//                     <View>
//                       {/* Table Header */}
//                       <View style={styles.tableRowHeader}>
//                         <Text style={[styles.tableCellHeader, { width: 150 }]}>Item Name</Text>
//                         <Text style={[styles.tableCellHeader, { width: 100 }]}>Qty</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Category</Text>
//                         <Text style={[styles.tableCellHeader, { width: 120 }]}>Status</Text>
//                       </View>

//                       {/* Table Rows */}
//                       {requestList.map((item) => (
//                         <View key={item.id} style={styles.tableRow}>
//                           <Text style={[styles.tableCell, { width: 150 }]}>{item.selectedItem?.label}</Text>
//                           <Text style={[styles.tableCell, { width: 100 }]}>{item.quantity}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.category}</Text>
//                           <Text style={[styles.tableCell, { width: 120 }]}>{item.status}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   </ScrollView>

//                   <View style={styles.modalActions}>
//                     <TouchableOpacity
//                       style={styles.cancelButton}
//                       onPress={() => setShowConfirmationModal(false)}
//                     >
//                       <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={styles.confirmButton}
//                       onPress={async () => {
//                         console.log('Confirm button pressed');

//                         const requestSuccess = await submitRequest(); // Await submitRequest to finish

//                         if (requestSuccess) {
//                           console.log('Request successfully submitted. Closing modal.');
//                           alert('Request Submitted Successfully!');
//                           setShowConfirmationModal(false); // Close the modal only if the request was successful
//                           navigation.goBack();
//                         } else {
//                           alert('There was a problem processing your request. Try again later.');
//                           console.log('Request submission failed. Not closing modal.');
//                         }
//                       }}
//                     >
//                       <Text style={styles.confirmButtonText}>Confirm</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export default RequestListScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { collection, getDocs, deleteDoc, doc, onSnapshot, Timestamp, setDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { useRequestMetadata } from '../contexts/RequestMetadataContext';
import styles from '../styles/userStyle/RequestListStyle';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Checkbox  } from 'react-native-paper';

const RequestListScreen = ({navigation}) => {
  const { user } = useAuth();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const { metadata } = useRequestMetadata();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
  const [confirmationData, setConfirmationData] = useState(null);
  const [tempDocIdsToDelete, setTempDocIdsToDelete] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  
  useEffect(() => {
    if (!user || !user.id) return;
  
    const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
  
    const unsubscribe = onSnapshot(tempRequestRef, (querySnapshot) => {
      const tempRequestList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          selectedItem: {
            value: data.selectedItemId,
            label: data.selectedItemLabel,
          },
        };
      });
      
      // ✅ Collect all temp doc IDs to delete later
      const ids = querySnapshot.docs.map(doc => doc.id);
      setTempDocIdsToDelete(ids);
      
      setRequestList(tempRequestList);      
      setLoading(false);
      
    }, (error) => {
      console.error('Error fetching request list in real-time:', error);
      setLoading(false);
    });
  
    return () => unsubscribe(); // cleanup listener on unmount
  }, [user]);  

  const formatTime = (timeObj) => {
    if (!timeObj || typeof timeObj !== 'object') return '';

    let { hour, minute, period } = timeObj;
    hour = parseInt(hour);
    minute = parseInt(minute);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
      
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const paddedHour = hour.toString().padStart(2, '0');
    const paddedMinute = minute.toString().padStart(2, '0');

    return `${paddedHour}:${paddedMinute}`;
  };

  const handleRequestNow = async () => {
    console.log('Current metadata:', metadata);
  
    // Check if all required fields are filled
    if (
      !metadata?.dateRequired ||
      !metadata?.timeFrom ||
      !metadata?.timeTo ||
      !metadata?.program ||
      !metadata?.course ||
      !metadata?.room ||
      !metadata?.usageType
      
    ) {
      Alert.alert('Missing Info', 'Please go back and fill the required borrowing details.');
      return;
    }
  
    // Show the confirmation modal with the metadata details
    setConfirmationData(metadata);
    setShowConfirmationModal(true);
    
  };

  const logRequestOrReturn = async (userId, userName, action, requestDetails) => {
    await addDoc(collection(db, `accounts/${userId}/activitylog`), {
      action, // e.g. "Requested Items" or "Returned Items"
      userName,
      timestamp: serverTimestamp(),
      requestList: requestDetails, 
    });
  };

  const submitRequest = async () => {
    console.log('submitRequest initiated');
    console.log('Submitting for user:', user?.id);
  
    if (!user || !user.id) {
      console.log('No user logged in');
      Alert.alert('Error', 'User is not logged in.');
      return false;
    }
  
    if (!requestList || requestList.length === 0) {
      console.log('Request list is empty');
      Alert.alert('Error', 'No items in the request list.');
      return false;
    }
  
    try {
      const userDocRef = doc(db, 'accounts', user.id);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (!userDocSnapshot.exists()) {
        console.log('User document does not exist');
        Alert.alert('Error', 'User not found.');
        return false;
      }
  
      const userName = userDocSnapshot.data().name;
  
      // Prepare request data
      const requestData = {
        dateRequired: metadata.dateRequired,
        timeFrom: metadata.timeFrom,
        timeTo: metadata.timeTo,
        program: metadata.program,
        course: metadata.course,
        room: metadata.room,
        reason: metadata.reason,
        filteredMergedData: requestList.map((item) => ({
          ...item,
          // program: metadata.program,
          // reason: metadata.reason,
          // room: metadata.room,
          // timeFrom: metadata.timeFrom,
          // timeTo: metadata.timeTo,
        })),
        userName,
        timestamp: Timestamp.now(),
        usageType: metadata.usageType,
      };
  
      console.log('Request data to be saved:', requestData);
  
      // Add to user's personal requests collection
      const userRequestRef = collection(db, 'accounts', user.id, 'userRequests');
      await addDoc(userRequestRef, requestData);
  
      // Add to global user requests collection
      const userRequestsRootRef = collection(db, 'userrequests');
      const newUserRequestRef = doc(userRequestsRootRef);
      await setDoc(newUserRequestRef, {
        ...requestData,
        accountId: user.id,
      });

      // ✅ Delete the original temporary request
      if (tempDocIdsToDelete.length > 0) {
        for (const id of tempDocIdsToDelete) {
          await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', id));
          console.log('Deleted temp request with ID:', id);
        }

      } else {
        console.log('No temp requests to delete');
      }      
  
      // Log the "Requested Items" action
      await logRequestOrReturn(user.id, userName, "Requested Items", requestData.filteredMergedData);

      console.log('Request submitted successfully');
      return true; 

    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
      return false; 
    }
  };
  
  const handleConfirmRequest = async () => {
    console.log('Metadata:', metadata);
    console.log('Confirm button pressed');
    await submitRequest(); // Await the request submission
  
    // Close the confirmation modal after the request is saved
    setShowConfirmationModal(false);
  };
  

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(String(item.quantity)); // prefill quantity
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setQuantity('');
  };

  const handleQuantityChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setQuantity(numericValue);
  };

  const removeFromList = async (idToDelete) => {
    try {
      const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
      const querySnapshot = await getDocs(tempRequestRef);
  
      let foundDocId = null;
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.selectedItemId === idToDelete) {
          foundDocId = docSnap.id;
        }
      });
  
      if (foundDocId) {
        await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', foundDocId));
        console.log(`Item with Firestore doc ID ${foundDocId} removed from Firestore.`);
  
        // Remove from local list
        const updatedList = requestList.filter((item) => item.selectedItemId !== idToDelete);
        setRequestList(updatedList);

      } else {
        console.warn('Item not found in Firestore.');
      }

    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };
  
  const confirmRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from the list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeFromList(item.selectedItemId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
    const handleSaveDraft = async () => {
    try {
      if (!user?.id) {
        Alert.alert('Authentication Error', 'No user is currently logged in.');
        return;
      }

      const draftId = Date.now().toString();
      const draftRef = doc(db, 'accounts', user.id, 'draftRequests', draftId);

      await setDoc(draftRef, {
        ...metadata,
        filteredMergedData: requestList.map((item) => ({
          ...item,
          program: metadata.program,
          reason: metadata.reason,
          room: metadata.room,
          timeFrom: metadata.timeFrom,
          timeTo: metadata.timeTo,
          usageType: metadata.usageType,
        })),
        timestamp: new Date(),
        status: 'draft',
      });

      Alert.alert('Draft Saved', 'Your request has been saved as a draft.');

    } catch (error) {
      console.error('Error saving draft request:', error);
      Alert.alert('Error', 'Failed to save your draft request.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={{flex: 1, flexDirection: 'row', marginBottom: 5, elevation: 1, backgroundColor: 'white', borderRadius: 10}}>
    <TouchableOpacity onPress={() => openModal(item)} style={[styles.touchable, {borderBottomColor: '#395a7f'}]}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.selectedItem?.label}</Text>
          <Text>Quantity: {item.quantity}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Status: {item.status}</Text>
      </View>
        </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => confirmRemoveItem(item)} style={styles.trash} >
            <Icon name='trash' size={15} color='#fff'/>
          </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
       <Header onLayout={handleHeaderLayout} />
        <FlatList
        style={{ paddingHorizontal: 5, marginTop: headerHeight+5, paddingTop: 10, backgroundColor:'#fff', borderRadius: 10}}
        showsVerticalScrollIndicator={false}
        
        scrollEnabled={true}
          data={requestList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
        />
   

      
      <View style={styles.bottomNav}>
        <Text style={{backgroundColor: '#f5f5f5',borderBottomColor: '#e9ecee',borderBottomWidth: 1, paddingLeft: 20, fontSize:11, color: 'gray'}}><Text style={{fontWeight:'bold'}}>Note: </Text>Finalize your item list before submitting</Text>
        

        <View style={{flex:1, flexDirection: 'row', paddingLeft:5}}>
          
          
          <View style={{flex:1, width: '70%', flexDirection: 'row'}}>
            <View style={{width: '50%', flexDirection: 'row', alignItems:'center'}}>
            <Checkbox
            />
          <Text>Select All</Text>
          </View>

          <TouchableOpacity style={{width: '50%', backgroundColor: '#a3cae9', justifyContent:'center', alignItems: 'center'}}>
            <Text style={styles.requestButtonText}>
              Add to Drafts
            </Text>
          </TouchableOpacity>
        </View>
        

        <TouchableOpacity style={styles.requestButton} onPress={handleRequestNow}>
        <Text style={styles.requestButtonText}>Submit</Text>
      </TouchableOpacity>
        </View>
      
      </View>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Request Details</Text>

            {selectedItem && (
              <>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Item:</Text> {selectedItem.selectedItem?.label}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Item Description:</Text> {selectedItem.itemDetails}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Quantity:</Text>
                </Text>

                <TextInput
                  style={styles.inputQuantity}
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                />

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Category:</Text> {selectedItem.category}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Usage Type:</Text> {selectedItem.usageType}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Item Type:</Text> {selectedItem.type}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Lab Room:</Text> {selectedItem.labRoom}
                </Text>

                {/* <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Condition:</Text> {selectedItem.condition}
                </Text> */}

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Department:</Text> {selectedItem.department}
                </Text>
              </>
            )}

            <TouchableOpacity style={styles.requestButtonModal} onPress={closeModal}>
              <Text style={styles.requestButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showConfirmationModal && (
        <Modal
          visible={showConfirmationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowConfirmationModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowConfirmationModal(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Confirm Request</Text>
                  <Text style={styles.modalText}>Date Required: {confirmationData?.dateRequired}</Text>

                  {/* Use the formatted time strings directly */}
                  <Text>Time From: {metadata.timeFrom}</Text>
                  <Text>Time To: {metadata.timeTo}</Text>

                  <Text style={styles.modalText}>Program: {confirmationData?.program}</Text>
                  <Text style={styles.modalText}>Course: {confirmationData?.course}</Text>
                  <Text style={styles.modalText}>Room: {confirmationData?.room}</Text>
                  <Text style={styles.modalText}>Reason: {confirmationData?.reason}</Text>

                  <ScrollView horizontal>
                    <View>
                      {/* Table Header */}
                      <View style={styles.tableRowHeader}>
                        <Text style={[styles.tableCellHeader, { width: 150 }]}>Item Name</Text>
                        <Text style={[styles.tableCellHeader, { width: 150 }]}>Item Description</Text>
                        <Text style={[styles.tableCellHeader, { width: 100 }]}>Qty</Text>
                        <Text style={[styles.tableCellHeader, { width: 120 }]}>Category</Text>
                        <Text style={[styles.tableCellHeader, { width: 120 }]}>Status</Text>
                      </View>

                      {/* Table Rows */}
                      {requestList.map((item) => (
                        <View key={item.id} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { width: 150 }]}>{item.selectedItem?.label}</Text>
                          <Text style={[styles.tableCell, { width: 100 }]}>{item.itemDetails}</Text>
                          <Text style={[styles.tableCell, { width: 100 }]}>{item.quantity}</Text>
                          <Text style={[styles.tableCell, { width: 120 }]}>{item.category}</Text>
                          <Text style={[styles.tableCell, { width: 120 }]}>{item.status}</Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowConfirmationModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={async () => {
                        console.log('Confirm button pressed');

                        const requestSuccess = await submitRequest(); // Await submitRequest to finish

                        if (requestSuccess) {
                          console.log('Request successfully submitted. Closing modal.');
                          alert('Request Submitted Successfully!');
                          setShowConfirmationModal(false); // Close the modal only if the request was successful
                          navigation.goBack();
                        } else {
                          alert('There was a problem processing your request. Try again later.');
                          console.log('Request submission failed. Not closing modal.');
                        }
                      }}
                    >
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default RequestListScreen;
