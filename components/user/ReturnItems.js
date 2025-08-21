// VERSION 1
// import React, { useState, useEffect } from 'react';
// import { Picker } from '@react-native-picker/picker';
// import {
//   View, Text, TouchableOpacity, Modal,
//   Button, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
// import {
//   collection, getDocs, doc, updateDoc, getDoc, deleteDoc,
//   setDoc, addDoc, serverTimestamp, onSnapshot, query, where
// } from 'firebase/firestore';
// import { db } from '../../backend/firebase/FirebaseConfig';
// import { useAuth } from '../contexts/AuthContext';
// import styles from '../styles/userStyle/ReturnItemsStyle';
// import Header from '../Header';

// const ReturnItems = () => {
//   const { user } = useAuth();
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [historyData, setHistoryData] = useState([]);
//   const [inventoryData, setInventoryData] = useState({});
//   const [returnQuantities, setReturnQuantities] = useState({});
//   const [itemConditions, setItemConditions] = useState({});

//   useEffect(() => {
//     console.log("Updated conditions state:", itemConditions);
//   }, [itemConditions]); // This will run every time itemConditions changes

// //   useEffect(() => {
// //     const fetchRequestLogs = async () => {
// //       try {
// //         const snapshot = await getDocs(collection(db, `accounts/${user.id}/userrequestlog`));
// //         const logs = snapshot.docs.map((docSnap) => {
// //           const data = docSnap.data();
// //           let rawDate = null;
// //           let rawTimestamp = "N/A";
// //           let formattedTimestamp = "N/A";
  
// //           if (data.rawTimestamp?.toDate) {
// //             try {
// //               rawDate = data.rawTimestamp.toDate();
// //               rawTimestamp = rawDate.toLocaleString("en-PH", {
// //                 timeZone: "Asia/Manila",
// //               });

// //             } catch (e) {
// //               console.warn("Error parsing rawTimestamp:", e);
// //             }
// //           }
  
// //           if (data.timestamp?.toDate) {
// //             try {
// //               formattedTimestamp = data.timestamp.toDate().toLocaleString("en-PH", {
// //                 timeZone: "Asia/Manila",
// //               });

// //             } catch (e) {
// //               console.warn("Error parsing timestamp:", e);
// //             }
// //           }
  
// //           return {
// //             id: docSnap.id,
// //             date: data.dateRequired ?? "N/A",
// //             status: data.status ?? "Pending",
// //             requestor: data.userName ?? "Unknown",
// //             requestedItems: data.requestList?.map(item => item.itemName).join(", ") ?? "No items",
// //             requisitionId: docSnap.id,
// //             rawDate,
// //             rawTimestamp,
// //             timestamp: formattedTimestamp,
// //             raw: data
// //           };
// //         });
  
// //         // Sort by rawDate descending (latest first)
// //         const sortedLogs = logs.sort((a, b) => {
// //           if (!a.rawDate) return 1;
// //           if (!b.rawDate) return -1;
// //           return b.rawDate - a.rawDate;
// //         });
  
// //         setHistoryData(sortedLogs);

// //       } catch (error) {
// //         console.error("Fetch error:", error);
// //       }
// //     };
  
// //     if (user?.id) {
// //       fetchRequestLogs();
// //     }
// //   }, [user]);

//   useEffect(() => {
//     const unsubscribe = () => {
//       if (user?.id) {
//         const requestLogRef = collection(db, `accounts/${user.id}/userrequestlog`);
  
//         // Real-time listener for changes in the request logs
//         return onSnapshot(requestLogRef, (snapshot) => {
//           const logs = snapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             let rawDate = null;
//             let rawTimestamp = "N/A";
//             let formattedTimestamp = "N/A";
  
//             if (data.rawTimestamp?.toDate) {
//               try {
//                 rawDate = data.rawTimestamp.toDate();
//                 rawTimestamp = rawDate.toLocaleString("en-PH", {
//                   timeZone: "Asia/Manila",
//                 });

//               } catch (e) {
//                 console.warn("Error parsing rawTimestamp:", e);
//               }
//             }
  
//             if (data.timestamp?.toDate) {
//               try {
//                 formattedTimestamp = data.timestamp.toDate().toLocaleString("en-PH", {
//                   timeZone: "Asia/Manila",
//                 });

//               } catch (e) {
//                 console.warn("Error parsing timestamp:", e);
//               }
//             }
  
//             return {
//               id: docSnap.id,
//               date: data.dateRequired ?? "N/A",
//               status: data.status ?? "Pending",
//               requestor: data.userName ?? "Unknown",
//               requestedItems: data.requestList?.map(item => item.itemName).join(", ") ?? "No items",
//               requisitionId: docSnap.id,
//               rawDate,
//               rawTimestamp,
//               timestamp: formattedTimestamp,
//               raw: data
//             };
//           });
  
//           // Sort by rawDate descending (latest first)
//           const sortedLogs = logs.sort((a, b) => {
//             if (!a.rawDate) return 1;
//             if (!b.rawDate) return -1;
//             return b.rawDate - a.rawDate;
//           });
  
//           setHistoryData(sortedLogs); // Update the state with the sorted logs
//         });
//       }
//     };
  
//     const unsubscribeListener = unsubscribe();
  
//     // Cleanup function to unsubscribe when component is unmounted or user changes
//     return () => {
//       if (unsubscribeListener) {
//         unsubscribeListener(); // Remove Firestore listener
//       }
//     };
//   }, [user]);

//   const handleViewDetails = async (record) => {
//     setSelectedRequest(record);
//     setModalVisible(true);

//     // Initialize an empty object to map item conditions
//     const inventoryMap = {};
//     const requestItems = record.raw?.requestList || [];

//     try {
//         // Fetch all inventory documents from Firestore
//         const inventoryRef = collection(db, 'inventory');
//         const inventorySnapshot = await getDocs(inventoryRef);

//         // Iterate through each inventory document
//         inventorySnapshot.forEach((docSnap) => {
//         const item = docSnap.data();
        
//         // Match the inventory item with request items
//         requestItems.forEach((req) => {
//             if (item.id === req.itemIdFromInventory) {
              
//             // Add the inventory item to the map
//             inventoryMap[req.itemIdFromInventory] = item;
//             }
//         });
//         });

//         // Update inventory data with the mapped inventory items
//         setInventoryData(inventoryMap);

//         // Initialize item conditions with default values or values from request list
//         const initialConditions = {};
//         requestItems.forEach((item) => {
//         // Set the condition from the requestList or default to "Good"
//         initialConditions[item.itemIdFromInventory] = item.condition || "Good";
//         });

//         // Update the state for item conditions
//         setItemConditions(initialConditions);

//     } catch (err) {
//         console.error("Error fetching inventory:", err);
//     }
//   };

//     // const handleReturn = async () => {
//     // try {
//     //     const currentDate = new Date().toISOString();

//     //     const fullReturnData = {
//     //     accountId: user.id,  // Use user.id for accountId
//     //     approvedBy: selectedRequest.raw?.approvedBy || "N/A",
//     //     courseCode: selectedRequest.raw?.course || "N/A",
//     //     courseDescription: selectedRequest.raw?.courseDescription || "N/A",
//     //     dateRequired: selectedRequest.raw?.dateRequired || "N/A",
//     //     program: selectedRequest.raw?.program || "N/A",
//     //     reason: selectedRequest.raw?.reason || "No reason provided",
//     //     room: selectedRequest.raw?.room || "N/A",
//     //     timeFrom: selectedRequest.raw?.timeFrom || "N/A",
//     //     timeTo: selectedRequest.raw?.timeTo || "N/A",
//     //     timestamp: serverTimestamp(),
//     //     userName: selectedRequest.raw?.userName || "N/A",
//     //     requisitionId: selectedRequest.requisitionId,
//     //     status: "Returned",
//     //     requestList: (selectedRequest.raw?.requestList || [])
//     //         .map((item) => {
//     //         const returnQty = Number(returnQuantities[item.itemIdFromInventory] || 0);
//     //         if (returnQty <= 0) return null;

//     //         return {
//     //             ...item,
//     //             returnedQuantity: returnQty,
//     //             condition: itemConditions[item.itemIdFromInventory] || item.condition || "Good",
//     //             status: "Returned",
//     //             dateReturned: currentDate,
//     //         };
//     //         })
//     //         .filter(Boolean),
//     //     };

//     //     // Save to returnedItems and userreturneditems
//     //     const returnedRef = doc(collection(db, "returnedItems"));
//     //     const userReturnedRef = doc(collection(db, `accounts/${user.id}/userreturneditems`));
//     //     await setDoc(returnedRef, fullReturnData);
//     //     await setDoc(userReturnedRef, fullReturnData);

//     //     // Update full data in original borrowcatalog
//     //     const borrowDocRef = doc(db, "borrowcatalog", selectedRequest.requisitionId);
//     //     await setDoc(borrowDocRef, fullReturnData, { merge: true });

//     //     // 🗑️ Delete from userrequestlog
//     //     const userRequestLogRef = doc(db, `accounts/${user.id}/userrequestlog/${selectedRequest.requisitionId}`);
//     //     await deleteDoc(userRequestLogRef);

//     //     // 📝 Add to history log
//     //     const historyRef = doc(collection(db, `accounts/${user.id}/historylog`));
//     //     await setDoc(historyRef, {
//     //     ...fullReturnData,
//     //     action: "Returned",
//     //     date: currentDate,
//     //     });

//     //     // 📝 Add to activity log
//     //     const activityRef = doc(collection(db, `accounts/${user.id}/activitylog`));
//     //     await setDoc(activityRef, {
//     //     ...fullReturnData,
//     //     action: "Returned",
//     //     date: currentDate,
//     //     });

//     //     console.log("Returned items processed, removed from userRequests, added to history log.");
//     //     closeModal();
        
//     // } catch (error) {
//     //     console.error("Error saving returned item details:", error);
//     // }
//     // };

//     const handleReturn = async () => {
//   try {
//     const currentDate = new Date().toISOString();
//     const timestamp = serverTimestamp();

//     const fullReturnData = {
//       accountId: user.id,
//       approvedBy: selectedRequest.raw?.approvedBy || "N/A",
//       courseCode: selectedRequest.raw?.courseCode || "N/A",
//       courseDescription: selectedRequest.raw?.courseDescription || "N/A",
//       dateRequired: selectedRequest.raw?.dateRequired || "N/A",
//       program: selectedRequest.raw?.program || "N/A",
//       reason: selectedRequest.raw?.reason || "No reason provided",
//       room: selectedRequest.raw?.room || "N/A",
//       timeFrom: selectedRequest.raw?.timeFrom || "N/A",
//       timeTo: selectedRequest.raw?.timeTo || "N/A",
//       timestamp,
//       userName: selectedRequest.raw?.userName || "N/A",
//       requisitionId: selectedRequest.requisitionId,
//       status: "Returned",
//       requestList: (selectedRequest.raw?.requestList || [])
//         .map((item) => {
//           const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
//           const conditions = Array.from({ length: item.quantity }, (_, idx) =>
//             returnedConditions[idx] || "Good"
//           );
//           return {
//             ...item,
//             returnedQuantity: conditions.length,
//             conditions,
//             scannedCount: 0,
//             dateReturned: currentDate,
//           };
//         }),
//     };

//     console.log("Saving fullReturnData:", JSON.stringify(fullReturnData, null, 2));

//     // 🔄 Update condition counts in inventory
//     for (const item of selectedRequest.raw?.requestList || []) {
//       const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
//       if (returnedConditions.length === 0) continue;

//       const inventoryDocRef = doc(db, "inventory", item.itemIdFromInventory);
//       const inventoryDoc = await getDoc(inventoryDocRef);

//       if (!inventoryDoc.exists()) continue;

//       const inventoryData = inventoryDoc.data();
//       const existingConditionCount = inventoryData.conditionCount || {
//         Good: 0,
//         Damage: 0,
//         Defect: 0,
//       };

//       const newCounts = { ...existingConditionCount };
//       returnedConditions.forEach((condition) => {
//         if (newCounts[condition] !== undefined) {
//           newCounts[condition]++;
//         }
//       });

//       await updateDoc(inventoryDocRef, {
//         conditionCount: newCounts,
//       });
//     }

//     // 💾 Save to returnedItems and userreturneditems
//     const returnedRef = doc(collection(db, "returnedItems"));
//     const userReturnedRef = doc(collection(db, `accounts/${user.id}/userreturneditems`));
//     await setDoc(returnedRef, fullReturnData);
//     await setDoc(userReturnedRef, fullReturnData);

//     // 📋 Update borrowcatalog document
//     const borrowQuery = query(
//       collection(db, "borrowcatalog"),
//       where("userName", "==", selectedRequest.raw?.userName),
//       where("dateRequired", "==", selectedRequest.raw?.dateRequired),
//       where("room", "==", selectedRequest.raw?.room),
//       where("timeFrom", "==", selectedRequest.raw?.timeFrom),
//       where("timeTo", "==", selectedRequest.raw?.timeTo)
//     );

//     const querySnapshot = await getDocs(borrowQuery);
//     if (!querySnapshot.empty) {
//       const docToUpdate = querySnapshot.docs[0];
//       const borrowDocRef = doc(db, "borrowcatalog", docToUpdate.id);
//       await updateDoc(borrowDocRef, {
//         requestList: fullReturnData.requestList,
//         status: "Returned",
//       });
//       console.log("✅ Borrowcatalog updated.");
//     } else {
//       console.warn("⚠️ No matching document found in borrowcatalog.");
//     }

//     // 🗑️ Remove from userrequestlog
//     const userRequestLogRef = doc(
//       db,
//       `accounts/${user.id}/userrequestlog/${selectedRequest.requisitionId}`
//     );
//     await deleteDoc(userRequestLogRef);

//     // 📝 Add to history and activity logs
//     const historyRef = doc(collection(db, `accounts/${user.id}/historylog`));
//     await setDoc(historyRef, {
//       ...fullReturnData,
//       action: "Returned",
//       date: currentDate,
//     });

//     const activityRef = doc(collection(db, `accounts/${user.id}/activitylog`));
//     await setDoc(activityRef, {
//       ...fullReturnData,
//       action: "Returned",
//       date: currentDate,
//     });

//     console.log("✅ Return process completed.");
//     closeModal();
//   } catch (error) {
//     console.error("❌ Error processing return:", error);
//   }
// };


//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedRequest(null);
//     setReturnQuantities({});
//     setItemConditions({});
//     setInventoryData({});
//   };

//   const filteredData =
//     filterStatus === "All" ? historyData : historyData.filter((item) => item.status === filterStatus);

//   return (
//     <View style={styles.container}>
//       <Header />
      
//       <View style={styles.filterContainer}>
//         {["All", "Approved", "Declined"].map((status) => (
//           <TouchableOpacity
//             key={status}
//             style={[styles.filterButton, filterStatus === status && styles.activeButton]}
//             onPress={() => setFilterStatus(status)}
//           >
//             <Text style={styles.filterText}>{status}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.tableContainer1}>
//         <View style={styles.tableHeader}>
//           <Text style={styles.headerCell}>Date</Text>
//           <Text style={styles.headerCell}>Status</Text>
//           <Text style={styles.headerCell}>Action</Text>
//         </View>

//         <ScrollView style={{ maxHeight: 500 }}>
//           {filteredData.map((item) => (
//             <View key={item.id} style={styles.tableRow}>
//               <Text style={styles.cell}>{item.rawTimestamp}</Text>
//               <Text style={styles.cell}>{item.status}</Text>
//               <TouchableOpacity onPress={() => handleViewDetails(item)}>
//                 <Text style={styles.linkText}>View</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       </View>

//             {/* <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal} transparent={true}>
//             <View style={styles.modalOverlay}>
//                 <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={{ flex: 1, width: '90%' }}
//                 >
//                 <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
//                     <Text style={styles.modalTitle}>📄 Requisition Slip</Text>
//                     <Text>Name: {selectedRequest?.raw?.userName}</Text>
//                     <Text>Requisition ID: {selectedRequest?.requisitionId}</Text>
//                     <Text>Request Date: {selectedRequest?.timestamp}</Text>

//                     <Text style={styles.boldText}>Requested Items:</Text>

//                     <View style={styles.tableContainer2}>
//                     <View style={styles.tableHeader}>
//                         <Text style={styles.headerCell}>Item Name</Text>
//                         <Text style={styles.headerCell}>Quantity</Text>
//                         <Text style={styles.headerCell}>Returned Qty</Text>
//                         <Text style={styles.headerCell}>Condition</Text>
//                     </View>

//                     {selectedRequest?.raw?.requestList?.map((item, index) => (
//                         <View key={index} style={styles.tableRow}>
//                         <Text style={[styles.cell, { flex: 1 }]}>{item.itemName}</Text>
//                         <Text style={[styles.cell, { flex: 0.7 }]}>{item.quantity}</Text>

//                         <View style={{ flex: 1, paddingHorizontal: 4 }}>
//                             <TextInput
//                             placeholder="Returned Qty"
//                             keyboardType="number-pad"
//                             style={styles.input}
//                             value={returnQuantities[item.itemIdFromInventory] || ""}
//                             onChangeText={(text) => {
//                                 const input = parseInt(text, 10);
//                                 const max = item.quantity;

//                                 if (!isNaN(input) && input <= max) {
//                                 setReturnQuantities((prev) => ({
//                                     ...prev,
//                                     [item.itemIdFromInventory]: input.toString(),
//                                 }));
//                                 } else if (input > max) {
//                                 alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
//                                 } else {
//                                 setReturnQuantities((prev) => ({
//                                     ...prev,
//                                     [item.itemIdFromInventory]: "",
//                                 }));
//                                 }
//                             }}
//                             />
//                         </View>

//                         <View style={{ flex: 1, paddingHorizontal: 4 }}>
//                         <Picker
//                             selectedValue={itemConditions[item.itemIdFromInventory] || "Good"}  // Default to "Good" if no condition
//                             style={styles.picker}
//                             onValueChange={(value) => {
//                                 console.log(`Updating condition for item ${item.itemIdFromInventory}:`, value);

//                                 setItemConditions((prev) => ({
//                                 ...prev,
//                                 [item.itemIdFromInventory]: value,
//                                 }));
//                             }}
//                             >
//                             <Picker.Item label="Good" value="Good" />
//                             <Picker.Item label="Defect" value="Defect" />
//                             <Picker.Item label="Damage" value="Damage" />
//                         </Picker>
//                         </View>
//                         </View>
//                     ))}
//                     </View>

//                     <View style={styles.modalButtons}>
//                     <Button title="Back" onPress={closeModal} />
//                     <Button title="Return" onPress={handleReturn} />
//                     </View>
//                 </ScrollView>
//                 </KeyboardAvoidingView>
//             </View>
//         </Modal> */}

//         {/* <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal} transparent={true}>
//           <View style={styles.modalOverlay}>
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={{ flex: 1, width: '90%' }}
//             >
//               <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
//                 <Text style={styles.modalTitle}>📄 Requisition Slip</Text>
//                 <Text>Name: {selectedRequest?.raw?.userName}</Text>
//                 <Text>Requisition ID: {selectedRequest?.requisitionId}</Text>
//                 <Text>Request Date: {selectedRequest?.timestamp}</Text>

//                 <Text style={styles.boldText}>Requested Items:</Text>

//                 <View style={styles.tableContainer2}>
//                   <View style={styles.tableHeader}>
//                     <Text style={styles.headerCell}>Item Name</Text>
//                     <Text style={styles.headerCell}>Quantity</Text>
//                     <Text style={styles.headerCell}>Returned Qty</Text>
//                     <Text style={styles.headerCell}>Condition</Text>
//                   </View>

//                   {selectedRequest?.raw?.requestList?.map((item, index) => {
           
//                     const quantityArray = Array.from({ length: item.quantity }, (_, i) => i + 1);
//                     return quantityArray.map((q, i) => (
//                       <View key={`${index}-${i}`} style={styles.tableRow}>
//                         <Text style={[styles.cell, { flex: 1 }]}>{item.itemName}</Text>
                 
//                         <Text style={[styles.cell, { flex: 0.7 }]}>1</Text>

//                         <View style={{ flex: 1, paddingHorizontal: 4 }}>
//                           <TextInput
//                             placeholder="Returned Qty"
//                             keyboardType="number-pad"
//                             style={styles.input}
//                             value={returnQuantities[`${item.itemIdFromInventory}-${i}`] || ""}
//                             onChangeText={(text) => {
//                               const input = parseInt(text, 10);
//                               const max = 1; 

//                               if (!isNaN(input) && input <= max) {
//                                 setReturnQuantities((prev) => ({
//                                   ...prev,
//                                   [`${item.itemIdFromInventory}-${i}`]: input.toString(),
//                                 }));
//                               } else if (input > max) {
//                                 alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
//                               } else {
//                                 setReturnQuantities((prev) => ({
//                                   ...prev,
//                                   [`${item.itemIdFromInventory}-${i}`]: "",
//                                 }));
//                               }
//                             }}
//                           />
//                         </View>

//                         <View style={{ flex: 1, paddingHorizontal: 4 }}>
//                           <Picker
//                             selectedValue={itemConditions[`${item.itemIdFromInventory}-${i}`] || "Good"}
//                             style={styles.picker}
//                             onValueChange={(value) => {
//                               setItemConditions((prev) => ({
//                                 ...prev,
//                                 [`${item.itemIdFromInventory}-${i}`]: value,
//                               }));
//                             }}
//                           >
//                             <Picker.Item label="Good" value="Good" />
//                             <Picker.Item label="Defect" value="Defect" />
//                             <Picker.Item label="Damage" value="Damage" />
//                           </Picker>
//                         </View>
//                       </View>
//                     ));
//                   })}
//                 </View>

//                 <View style={styles.modalButtons}>
//                   <Button title="Back" onPress={closeModal} />
//                   {selectedRequest?.status === 'Deployed' && (
//                     <Button title="Return" onPress={handleReturn} />
//                   )}
//                 </View>
//               </ScrollView>
//             </KeyboardAvoidingView>
//           </View>
//         </Modal> */}

//         <Modal
//           visible={modalVisible}
//           animationType="slide"
//           onRequestClose={closeModal}
//           transparent={true}
//         >
//           <TouchableWithoutFeedback onPress={closeModal}>
//             <View style={styles.modalOverlay}>
//               <TouchableWithoutFeedback>
//                 <KeyboardAvoidingView
//                   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                   style={{ flex: 1, width: '90%', maxWidth: 600 }}
//                 >
//                   <ScrollView
//                     contentContainerStyle={styles.modalContent}
//                     keyboardShouldPersistTaps="handled"
//                     showsVerticalScrollIndicator={false}
//                   >
//                     <Text style={styles.modalTitle}>Returning Items</Text>
//                     {/* <Text>Name: {selectedRequest?.raw?.userName}</Text>
//                     <Text>Requisition ID: {selectedRequest?.requisitionId}</Text> */}
//                     <Text>Request Date: {selectedRequest?.timestamp}</Text>

//                     <Text style={styles.boldText}>Requested Items:</Text>

//                     <View style={styles.tableContainer2}>
//                       <View style={styles.tableHeader}>
//                         <Text style={styles.headerCell}>Item Name</Text>
//                         <Text style={styles.headerCell}>Quantity</Text>
//                         <Text style={styles.headerCell}>Returned Qty</Text>
//                         <Text style={styles.headerCell}>Condition</Text>
//                       </View>

//                       {selectedRequest?.raw?.requestList?.map((item, index) => {
//                         const quantityArray = Array.from({ length: item.quantity }, (_, i) => i + 1);
//                         return quantityArray.map((q, i) => (
//                           <View key={`${index}-${i}`} style={styles.tableRow}>
//                             <Text style={styles.cell}>{item.itemName}</Text>
//                             <Text style={styles.cell}>1</Text>

//                             <View style={{ flex: 1, paddingHorizontal: 6 }}>
//                               <TextInput
//                                 placeholder="Returned Qty"
//                                 keyboardType="number-pad"
//                                 style={styles.input}
//                                 value={returnQuantities[`${item.itemIdFromInventory}-${i}`] || ''}
//                                 onChangeText={(text) => {
//                                   const input = parseInt(text, 10);
//                                   const max = 1;
//                                   if (!isNaN(input) && input <= max) {
//                                     setReturnQuantities((prev) => ({
//                                       ...prev,
//                                       [`${item.itemIdFromInventory}-${i}`]: input.toString(),
//                                     }));
//                                   } else if (input > max) {
//                                     alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
//                                   } else {
//                                     setReturnQuantities((prev) => ({
//                                       ...prev,
//                                       [`${item.itemIdFromInventory}-${i}`]: '',
//                                     }));
//                                   }
//                                 }}
//                               />
//                             </View>

//                             <View style={{ flex: 1, paddingHorizontal: 6 }}>
//                               <Picker
//                                 selectedValue={itemConditions[`${item.itemIdFromInventory}-${i}`] || 'Good'}
//                                 style={styles.picker}
//                                 onValueChange={(value) => {
//                                   setItemConditions((prev) => ({
//                                     ...prev,
//                                     [`${item.itemIdFromInventory}-${i}`]: value,
//                                   }));
//                                 }}
//                               >
//                                 <Picker.Item label="Good" value="Good" />
//                                 <Picker.Item label="Defect" value="Defect" />
//                                 <Picker.Item label="Damage" value="Damage" />
//                                 <Picker.Item label="Lost" value="Lost" />
//                               </Picker>
//                             </View>
//                           </View>
//                         ));
//                       })}
//                     </View>

//                     <View style={styles.modalButtons}>
//                       <View style={styles.modalButton}>
//                         <Button title="Back" onPress={closeModal} />
//                       </View>
//                       {selectedRequest?.status === 'Deployed' && (
//                         <View style={styles.modalButton}>
//                           <Button title="Return" onPress={handleReturn} />
//                         </View>
//                       )}
//                     </View>
//                   </ScrollView>
//                 </KeyboardAvoidingView>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//     </View>
//   );
// };

// export default ReturnItems;


// VERSION 2
import React, { useState, useEffect, useCallback } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View, Text, TouchableOpacity, Modal,
  Button, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, 
  StatusBar, Dimensions } from 'react-native';
import {
  collection, getDocs, doc, updateDoc, getDoc, deleteDoc,
  setDoc, addDoc, serverTimestamp, onSnapshot, query, where
} from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/userStyle/ReturnItemsStyle';
import Header from '../Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox, Dialog, Portal } from 'react-native-paper';

const ReturnItems = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [inventoryData, setInventoryData] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});
  const [itemConditions, setItemConditions] = useState({});
  const [itemUnitConditions, setItemUnitConditions] = useState({});
  const [issuedStatus, setIssuedStatus] = useState({});
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [currentIssueItem, setCurrentIssueItem] = useState(null);
  const [issueQuantities, setIssueQuantities] = useState({});
  const [glasswareIssues, setGlasswareIssues] = useState({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const modalMaxHeight = screenHeight * 0.8; 

  const navigation = useNavigation()

  useEffect(() => {
    console.log("Updated conditions state:", itemConditions);
  }, [itemConditions]); // This will run every time itemConditions changes


  useEffect(() => {
    const unsubscribe = () => {
      if (user?.id) {
        const requestLogRef = collection(db, `accounts/${user.id}/userrequestlog`);
  
        // Real-time listener for changes in the request logs
        return onSnapshot(requestLogRef, (snapshot) => {
          const logs = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let rawDate = null;
            let rawTimestamp = "N/A";
            let formattedTimestamp = "N/A";
  
            if (data.rawTimestamp?.toDate) {
              try {
                rawDate = data.rawTimestamp.toDate();
                rawTimestamp = rawDate.toLocaleString("en-PH", {
                  timeZone: "Asia/Manila",
                });

              } catch (e) {
                console.warn("Error parsing rawTimestamp:", e);
              }
            }
  
            if (data.timestamp?.toDate) {
              try {
                formattedTimestamp = data.timestamp.toDate().toLocaleString("en-PH", {
                  timeZone: "Asia/Manila",
                });

              } catch (e) {
                console.warn("Error parsing timestamp:", e);
              }
            }
  
            return {
              id: docSnap.id,
              date: data.dateRequired ?? "N/A",
              status: data.status ?? "Pending",
              requestor: data.userName ?? "Unknown",
              requestedItems: data.requestList?.map(item => item.itemName).join(", ") ?? "No items",
              requisitionId: docSnap.id,
              rawDate,
              rawTimestamp,
              timestamp: formattedTimestamp,
              raw: data,
              dateRequired: data.dateRequired,
            };
          });
  
          // Sort by rawDate descending (latest first)
          const sortedLogs = logs.sort((a, b) => {
            if (!a.rawDate) return 1;
            if (!b.rawDate) return -1;
            return b.rawDate - a.rawDate;
          });
  
          setHistoryData(sortedLogs); // Update the state with the sorted logs
        });
      }
    };
  
    const unsubscribeListener = unsubscribe();
  
    // Cleanup function to unsubscribe when component is unmounted or user changes
    return () => {
      if (unsubscribeListener) {
        unsubscribeListener(); // Remove Firestore listener
      }
    };
  }, [user]);

  const handleViewDetails = async (record) => {
    setSelectedRequest(record);
    setModalVisible(true);

    // Initialize an empty object to map item conditions
    const inventoryMap = {};
    const requestItems = record.raw?.requestList || [];

    try {
        // Fetch all inventory documents from Firestore
        const inventoryRef = collection(db, 'inventory');
        const inventorySnapshot = await getDocs(inventoryRef);

        // Iterate through each inventory document
        inventorySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        
        // Match the inventory item with request items
        requestItems.forEach((req) => {
            if (item.id === req.itemIdFromInventory) {
            // Add the inventory item to the map
            inventoryMap[req.itemIdFromInventory] = item;
            }
        });
        });

        // Update inventory data with the mapped inventory items
        setInventoryData(inventoryMap);

        // Initialize item conditions with default values or values from request list
        const initialConditions = {};
        requestItems.forEach((item) => {
        // Set the condition from the requestList or default to "Good"
        initialConditions[item.itemIdFromInventory] = item.condition || "Good";
        });

        // Update the state for item conditions
        setItemConditions(initialConditions);

    } catch (err) {
        console.error("Error fetching inventory:", err);
    }
  };

  // const handleReturn = async () => {
  //   try {
  //     const currentDate = new Date().toISOString();
  //     const timestamp = serverTimestamp();

  //     const fullReturnData = {
  //       accountId: user.id,
  //       approvedBy: selectedRequest.raw?.approvedBy || "N/A",
  //       courseCode: selectedRequest.raw?.courseCode || "N/A",
  //       courseDescription: selectedRequest.raw?.courseDescription || "N/A",
  //       dateRequired: selectedRequest.raw?.dateRequired || "N/A",
  //       program: selectedRequest.raw?.program || "N/A",
  //       reason: selectedRequest.raw?.reason || "No reason provided",
  //       room: selectedRequest.raw?.room || "N/A",
  //       timeFrom: selectedRequest.raw?.timeFrom || "N/A",
  //       timeTo: selectedRequest.raw?.timeTo || "N/A",
  //       timestamp,
  //       userName: selectedRequest.raw?.userName || "N/A",
  //       requisitionId: selectedRequest.requisitionId,
  //       status: "Returned",
  //       requestList: (selectedRequest.raw?.requestList || [])
  //         .map((item) => {
  //           const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
  //           const conditions = Array.from({ length: item.quantity }, (_, idx) =>
  //             returnedConditions[idx] || "Good"
  //           );
  //           return {
  //             ...item,
  //             returnedQuantity: conditions.length,
  //             conditions,
  //             scannedCount: 0,
  //             dateReturned: currentDate,
  //           };
  //         }),
  //     };

  //     console.log("Saving fullReturnData:", JSON.stringify(fullReturnData, null, 2));

  //     // 🔄 Update condition counts in inventory
  //     for (const item of selectedRequest.raw?.requestList || []) {
  //       const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
  //       if (returnedConditions.length === 0) continue;

  //       const inventoryDocRef = doc(db, "inventory", item.itemIdFromInventory);
  //       const inventoryDoc = await getDoc(inventoryDocRef);

  //       if (!inventoryDoc.exists()) continue;

  //       const inventoryData = inventoryDoc.data();
  //       const existingConditionCount = inventoryData.conditionCount || {
  //         Good: 0,
  //         Damage: 0,
  //         Defect: 0,
  //         Lost: 0,
  //       };

  //       const newCounts = { ...existingConditionCount };
  //       returnedConditions.forEach((condition) => {
  //         if (newCounts[condition] !== undefined) {
  //           newCounts[condition]++;
  //         }
  //       });

  //       await updateDoc(inventoryDocRef, {
  //         conditionCount: newCounts,
  //       });
  //     }

  //     // 💾 Save to returnedItems and userreturneditems
  //     const returnedRef = doc(collection(db, "returnedItems"));
  //     const userReturnedRef = doc(collection(db, `accounts/${user.id}/userreturneditems`));
  //     await setDoc(returnedRef, fullReturnData);
  //     await setDoc(userReturnedRef, fullReturnData);

  //     // 📋 Update borrowcatalog document
  //     const borrowQuery = query(
  //       collection(db, "borrowcatalog"),
  //       where("userName", "==", selectedRequest.raw?.userName),
  //       where("dateRequired", "==", selectedRequest.raw?.dateRequired),
  //       where("room", "==", selectedRequest.raw?.room),
  //       where("timeFrom", "==", selectedRequest.raw?.timeFrom),
  //       where("timeTo", "==", selectedRequest.raw?.timeTo)
  //     );

  //     const querySnapshot = await getDocs(borrowQuery);
  //     if (!querySnapshot.empty) {
  //       const docToUpdate = querySnapshot.docs[0];
  //       const borrowDocRef = doc(db, "borrowcatalog", docToUpdate.id);
  //       await updateDoc(borrowDocRef, {
  //         requestList: fullReturnData.requestList,
  //         status: "Returned",
  //       });
  //       console.log("✅ Borrowcatalog updated.");
  //     } else {
  //       console.warn("⚠️ No matching document found in borrowcatalog.");
  //     }

  //     // 🗑️ Remove from userrequestlog
  //     const userRequestLogRef = doc(
  //       db,
  //       `accounts/${user.id}/userrequestlog/${selectedRequest.requisitionId}`
  //     );
  //     await deleteDoc(userRequestLogRef);

  //     // 📝 Add to history and activity logs
  //     const historyRef = doc(collection(db, `accounts/${user.id}/historylog`));
  //     await setDoc(historyRef, {
  //       ...fullReturnData,
  //       action: "Returned",
  //       date: currentDate,
  //     });

  //     const activityRef = doc(collection(db, `accounts/${user.id}/activitylog`));
  //     await setDoc(activityRef, {
  //       ...fullReturnData,
  //       action: "Returned",
  //       date: currentDate,
  //     });

  //     console.log("✅ Return process completed.");
  //     closeModal();
  //   } catch (error) {
  //     console.error("❌ Error processing return:", error);
  //   }
  // };

  const handleReturn = async () => {
    try {
      const currentDate = new Date().toISOString();
      const timestamp = serverTimestamp();

      const fullReturnData = {
        accountId: user.id,
        approvedBy: selectedRequest.raw?.approvedBy || "N/A",
        courseCode: selectedRequest.raw?.courseCode || "N/A",
        courseDescription: selectedRequest.raw?.courseDescription || "N/A",
        dateRequired: selectedRequest.raw?.dateRequired || "N/A",
        program: selectedRequest.raw?.program || "N/A",
        reason: selectedRequest.raw?.reason || "No reason provided",
        room: selectedRequest.raw?.room || "N/A",
        timeFrom: selectedRequest.raw?.timeFrom || "N/A",
        timeTo: selectedRequest.raw?.timeTo || "N/A",
        timestamp,
        userName: selectedRequest.raw?.userName || "N/A",
        requisitionId: selectedRequest.requisitionId,
        status: "Returned",
        requestList: (selectedRequest.raw?.requestList || []).map((item) => {
          const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
          // Keep your existing logic, but filter out "Lost" from returnedQuantity count here:
          const conditions = Array.from({ length: item.quantity }, (_, idx) =>
            returnedConditions[idx] || "Good"
          );

          return {
            ...item,
            returnedQuantity: conditions.filter(c => c !== "Lost").length,
            conditions,
            scannedCount: 0,
            dateReturned: currentDate,
          };
        }),
      };

      console.log("Saving fullReturnData:", JSON.stringify(fullReturnData, null, 2));

      // Update condition counts in inventory
      for (const item of selectedRequest.raw?.requestList || []) {
        const returnedConditions = itemUnitConditions[item.itemIdFromInventory] || [];
        if (returnedConditions.length === 0) continue;

        const inventoryDocRef = doc(db, "inventory", item.itemIdFromInventory);
        const inventoryDoc = await getDoc(inventoryDocRef);

        if (!inventoryDoc.exists()) continue;

        const inventoryData = inventoryDoc.data();
        const existingConditionCount = inventoryData.conditionCount || {
          Good: 0,
          Damage: 0,
          Defect: 0,
          Lost: 0,
        };

        const newCounts = { ...existingConditionCount };
        returnedConditions.forEach((condition) => {
          if (newCounts[condition] !== undefined) {
            newCounts[condition]++;
          }
        });

        await updateDoc(inventoryDocRef, {
          conditionCount: newCounts,
        });
      }

      // Save to returnedItems and userreturneditems
      const returnedRef = doc(collection(db, "returnedItems"));
      const userReturnedRef = doc(collection(db, `accounts/${user.id}/userreturneditems`));
      await setDoc(returnedRef, fullReturnData);
      await setDoc(userReturnedRef, fullReturnData);

      // Update borrowcatalog document
      const borrowQuery = query(
        collection(db, "borrowcatalog"),
        where("userName", "==", selectedRequest.raw?.userName),
        where("dateRequired", "==", selectedRequest.raw?.dateRequired),
        where("room", "==", selectedRequest.raw?.room),
        where("timeFrom", "==", selectedRequest.raw?.timeFrom),
        where("timeTo", "==", selectedRequest.raw?.timeTo)
      );

      const querySnapshot = await getDocs(borrowQuery);
      if (!querySnapshot.empty) {
        const docToUpdate = querySnapshot.docs[0];
        const borrowDocRef = doc(db, "borrowcatalog", docToUpdate.id);
        await updateDoc(borrowDocRef, {
          requestList: fullReturnData.requestList,
          status: "Returned",
        });
        console.log("✅ Borrowcatalog updated.");
      } else {
        console.warn("⚠️ No matching document found in borrowcatalog.");
      }

      // Remove from userrequestlog
      const userRequestLogRef = doc(
        db,
        `accounts/${user.id}/userrequestlog/${selectedRequest.requisitionId}`
      );
      await deleteDoc(userRequestLogRef);

      // Add to history and activity logs
      // const historyRef = doc(collection(db, `accounts/${user.id}/historylog`));
      // await setDoc(historyRef, {
      //   ...fullReturnData,
      //   action: "Returned",
      //   date: currentDate,
      // });

      const historyCollectionRef = collection(db, `accounts/${user.id}/historylog`);
      const deployedHistoryQuery = query(
        historyCollectionRef,
        where("action", "==", "Deployed"),
        where("userName", "==", selectedRequest.raw?.userName),
        where("dateRequired", "==", selectedRequest.raw?.dateRequired),
        where("room", "==", selectedRequest.raw?.room),
        where("timeFrom", "==", selectedRequest.raw?.timeFrom),
        where("timeTo", "==", selectedRequest.raw?.timeTo)
      );

      const deployedHistorySnapshot = await getDocs(deployedHistoryQuery);
      for (const docSnap of deployedHistorySnapshot.docs) {
        await deleteDoc(doc(db, `accounts/${user.id}/historylog`, docSnap.id));
      }

      // 📝 Add "Returned" to historylog
      const historyRef = doc(historyCollectionRef);
      await setDoc(historyRef, {
        ...fullReturnData,
        action: "Returned",
        date: currentDate,
      });

      const activityRef = doc(collection(db, `accounts/${user.id}/activitylog`));
      await setDoc(activityRef, {
        ...fullReturnData,
        action: "Returned",
        date: currentDate,
      });

      console.log("✅ Return process completed.");
      closeModal();
      setSuccessModalVisible(true);

    } catch (error) {
      console.error("❌ Error processing return:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
    setReturnQuantities({});
    setItemConditions({});
    setInventoryData({});
  };

  const filteredData =
    filterStatus === "All" ? historyData : historyData.filter((item) => item.status === filterStatus);

        const [headerHeight, setHeaderHeight] = useState(0);
      const handleHeaderLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
      };
    useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('transparent'); // Android only
        StatusBar.setTranslucent(true)
      }, [])
    );

  const glasswareData = React.useMemo(() => {
    if (!selectedRequest?.raw?.requestList) return [];

    return selectedRequest.raw.requestList
      .filter(item => item.category?.toLowerCase() === 'glasswares')
      .map(item => ({
        itemId: item.itemIdFromInventory,
        quantity: item.quantity,
        itemName: item.itemName,
      }));
  }, [selectedRequest]);

  useEffect(() => {
    if (glasswareData.length === 0) return;

    const newQuantities = {};

    glasswareData.forEach(item => {
      // You can set initial quantity as string or number, depending on your TextInput value type
      newQuantities[`${item.itemId}-0`] = item.quantity.toString(); 
      // If you want all units separately, loop quantity to set each unit index accordingly
      for(let i=0; i<item.quantity; i++) {
        newQuantities[`${item.itemId}-${i}`] = "1"; // or whatever your initial qty should be
      }
    });

    // Only update state if different
    const isDifferent = Object.keys(newQuantities).some(
      key => returnQuantities[key] !== newQuantities[key]
    );

    if (isDifferent) {
      setReturnQuantities(newQuantities);
    }
  }, [glasswareData]);

  return (
    <View style={styles.container}>
      <View style={styles.inventoryStocksHeader} onLayout={handleHeaderLayout}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="keyboard-backspace" size={28} color="black" />
        </TouchableOpacity>

        {/* Title (Centered) */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 18, color: '#395a7f' }}>
            Return Items
          </Text>
          <Text style={{ fontWeight: '300', fontSize: 13, textAlign: 'center' }}>
            Return Your Borrowed Items
          </Text>
        </View>

        {/* Spacer or Hidden Icon for alignment balance */}
        <View style={{ width: 28 }} />
      </View>

      <View style={[styles.filterContainer, {marginTop: headerHeight}]}>
        {["All", "Approved", "Deployed"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filterStatus === status && styles.activeButton]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterText, filterStatus === status && styles.activeText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.returnTableContainer}>
        <ScrollView style={{ maxHeight: 650, padding: 5 }}>
          {/* Header */}
          <View style={[styles.returnTableRow, styles.returnTableHeader]}>
            <Text style={[styles.returnHeaderCell, styles.returnColDate]}>Date</Text>
            <Text style={[styles.returnHeaderCell, styles.returnColStatus]}>Status</Text>
            <Text style={[styles.returnHeaderCell, styles.returnColAction]}>Action</Text>
          </View>

          {/* Data Rows */}
          {filteredData.map((item) => (
            <View key={item.id} style={styles.returnTableRow}>
              <Text style={[styles.returnCell, styles.returnColDate]}>
                {item.rawTimestamp?.split(',')[0] || 'N/A'}
              </Text>
              <Text style={[styles.returnCell, styles.returnColStatus]}>{item.status}</Text>
              <TouchableOpacity style={styles.returnColAction} onPress={() => handleViewDetails(item)}>
                <Text style={[styles.linkText, { textAlign: 'center' }]}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ width: '90%', maxWidth: 600 }}
                  keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
                >
                  <View style={[styles.modalContent, { maxHeight: modalMaxHeight }]}>
                  <ScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.modalTitle}>Returning Items</Text>
                    {/* <Text>Name: {selectedRequest?.raw?.userName}</Text>
                    <Text>Requisition ID: {selectedRequest?.requisitionId}</Text> */}
                    <Text>Request Date: {selectedRequest?.timestamp}</Text>
                    <Text>Required Date: {selectedRequest?.dateRequired}</Text>

                    <Text style={styles.boldText}>Requested Items:</Text>

                    {/* <View style={styles.tableContainer2}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>Item Name</Text>
                        <Text style={styles.headerCell}>Quantity</Text>
                        <Text style={styles.headerCell}>Returned Qty</Text>
                        <Text style={styles.headerCell}>Condition</Text>
                      </View>

                      {selectedRequest?.raw?.requestList?.map((item, index) => {
                        const quantityArray = Array.from({ length: item.quantity }, (_, i) => i + 1);
                        return quantityArray.map((q, i) => (
                          <View key={`${index}-${i}`} style={styles.tableRow}>
                            <Text style={styles.cell}>{item.itemName}</Text>
                            <Text style={styles.cell}>1</Text>

                            <View style={{ flex: 1, paddingHorizontal: 6 }}>
                              <TextInput
                                placeholder="Returned Qty"
                                keyboardType="number-pad"
                                style={styles.input}
                                value={returnQuantities[`${item.itemIdFromInventory}-${i}`] || ''}
                                onChangeText={(text) => {
                                  const input = parseInt(text, 10);
                                  const max = 1;
                                  if (!isNaN(input) && input <= max) {
                                    setReturnQuantities((prev) => ({
                                      ...prev,
                                      [`${item.itemIdFromInventory}-${i}`]: input.toString(),
                                    }));
                                  } else if (input > max) {
                                    alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
                                  } else {
                                    setReturnQuantities((prev) => ({
                                      ...prev,
                                      [`${item.itemIdFromInventory}-${i}`]: '',
                                    }));
                                  }
                                }}
                              />
                            </View>

                            <View style={{ flex: 1, paddingHorizontal: 6 }}>
                              <Picker
                                selectedValue={itemConditions[`${item.itemIdFromInventory}-${i}`] || 'Good'}
                                style={styles.picker}
                                onValueChange={(value) => {
                                  setItemConditions((prev) => ({
                                    ...prev,
                                    [`${item.itemIdFromInventory}-${i}`]: value,
                                  }));
                                }}
                              >
                                <Picker.Item label="Good" value="Good" />
                                <Picker.Item label="Defect" value="Defect" />
                                <Picker.Item label="Damage" value="Damage" />
                                <Picker.Item label="Lost" value="Lost" />
                              </Picker>
                            </View>
                          </View>
                        ));
                      })}
                    </View> */}

                    {/* <View style={styles.tableContainer2}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>Item Name</Text>
                        <Text style={styles.headerCell}>Quantity</Text>
                        <Text style={styles.headerCell}>Returned Qty</Text>
                        <Text style={styles.headerCell}>Condition</Text>
                      </View>

                      <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
                        {selectedRequest?.raw?.requestList?.map((item, index) => {
                          const quantityArray = Array.from({ length: item.quantity }, (_, i) => i + 1);
                          return quantityArray.map((q, i) => (
                            <View key={`${index}-${i}`} style={styles.tableRow}>
                              <Text style={styles.cell}>{item.itemName}</Text>
                              <Text style={styles.cell}>1</Text>

                              <View style={{ flex: 1, paddingHorizontal: 6 }}>
                                <TextInput
                                  placeholder="Returned Qty"
                                  keyboardType="number-pad"
                                  style={styles.input}
                                  value={returnQuantities[`${item.itemIdFromInventory}-${i}`] || ''}
                                  onChangeText={(text) => {
                                    const input = parseInt(text, 10);
                                    const max = 1;
                                    if (!isNaN(input) && input <= max) {
                                      setReturnQuantities((prev) => ({
                                        ...prev,
                                        [`${item.itemIdFromInventory}-${i}`]: input.toString(),
                                      }));
                                    } else if (input > max) {
                                      alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
                                    } else {
                                      setReturnQuantities((prev) => ({
                                        ...prev,
                                        [`${item.itemIdFromInventory}-${i}`]: '',
                                      }));
                                    }
                                  }}
                                />
                              </View>

                              <View style={{ flex: 1, paddingHorizontal: 6 }}>
                                <Picker
                                  selectedValue={itemConditions[`${item.itemIdFromInventory}-${i}`] || 'Good'}
                                  style={styles.picker}
                                  onValueChange={(value) => {
                                    setItemConditions((prev) => ({
                                      ...prev,
                                      [`${item.itemIdFromInventory}-${i}`]: value,
                                    }));
                                  }}
                                >
                                  <Picker.Item label="Good" value="Good" />
                                  <Picker.Item label="Defect" value="Defect" />
                                  <Picker.Item label="Damage" value="Damage" />
                                  <Picker.Item label="Lost" value="Lost" />
                                </Picker>
                              </View>
                            </View>
                          ));
                        })}
                      </ScrollView>
                    </View> */}

                    {/* <Text style={styles.boldText}>Requested Items:</Text> */}

                    {/* Glasswares Table */}
                    {selectedRequest?.raw?.requestList?.some(
                      item => item.category?.toLowerCase() === 'glasswares'
                    ) && (
                      <>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Glasswares</Text>
                        <View style={styles.tableContainer2}>
                          <View style={styles.tableHeader}>
                            <Text style={styles.headerCell}>Item Name</Text>
                            <Text style={styles.headerCell}>Quantity</Text>
                            <Text style={styles.headerCell}>Returned Qty</Text>
                            <Text style={styles.headerCell}>Issued</Text>
                          </View>

                          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                            {selectedRequest.raw.requestList
                              .filter(item => item.category?.toLowerCase() === 'glasswares')
                              .map((item, index) => {
                                const returnKey = `${item.itemIdFromInventory}`; // ✅ single key per item

                                // Prefill return quantities like in React.js
                                if (returnQuantities[returnKey] === undefined) {
                                  setReturnQuantities(prev => ({
                                    ...prev,
                                    [returnKey]: item.quantity, // default to full quantity
                                  }));
                                }

                                return (
                                  <View key={`glassware-${index}`} style={styles.tableRow}>
                                    <Text style={styles.cell}>{item.itemName}</Text>
                                    <Text style={styles.cell}>{item.quantity}</Text>

                                    {/* Returned Qty Input */}
                                    <View style={{ flex: 1, paddingHorizontal: 6 }}>
                                    <TextInput
                                      placeholder="Returned Qty"
                                      keyboardType="number-pad"
                                      style={[
                                        styles.input,
                                        selectedRequest.status === "Approved" && { backgroundColor: "#e0e0e0", color: "#888" } // ✅ optional grey-out
                                      ]}
                                      value={String(returnQuantities[returnKey] ?? item.quantity)}
                                      editable={selectedRequest.status !== "Approved"} // ✅ disable if approved
                                      onChangeText={(text) => {
                                        const input = parseInt(text, 10);
                                        const max = item.quantity;

                                        if (!isNaN(input) && input <= max) {
                                          setReturnQuantities(prev => ({
                                            ...prev,
                                            [returnKey]: input,
                                          }));

                                        } else if (input > max) {
                                          alert(`Returned quantity cannot exceed borrowed quantity (${max}).`);
                                          
                                        } else {
                                          setReturnQuantities(prev => ({
                                            ...prev,
                                            [returnKey]: '',
                                          }));
                                        }
                                      }}
                                    />
                                    </View>

                                    {/* Issue Checkbox */}
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                      {selectedRequest.status === "Deployed" && (
                                        <Checkbox
                                          status={issuedStatus[returnKey] ? 'checked' : 'unchecked'}
                                          onPress={() => {
                                            setIssuedStatus(prev => {
                                              const newStatus = { ...prev, [returnKey]: !prev[returnKey] };

                                              if (newStatus[returnKey]) {
                                                setCurrentIssueItem(item);
                                                setIssueQuantities({ Defect: 0, Damage: 0, Lost: 0 });
                                                setIssueModalVisible(true);
                                              } else {
                                                setIssueModalVisible(false);
                                              }

                                              return newStatus;
                                            });
                                          }}
                                          color="#1e7898"
                                        />
                                      )}
                                    </View>
                                  </View>
                                );
                              })}
                          </ScrollView>
                        </View>
                      </>
                    )}


                    {/* Equipment Table */}
                   {selectedRequest?.raw?.requestList?.some(
                      item => item.category?.toLowerCase() === 'equipment'
                    ) && (
                      <>
                        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Equipment</Text>
                        <View style={styles.tableContainer2}>
                          <View style={styles.tableHeader}>
                            <Text style={styles.headerCell}>Item Name</Text>
                            <Text style={styles.headerCell}>Quantity</Text>
                            <Text style={styles.headerCell}>Condition</Text>
                          </View>

                          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                            {selectedRequest.raw.requestList
                              .filter(item => item.category?.toLowerCase() === 'equipment')
                              .map((item, index) => {
                                const quantityArray = Array.from({ length: item.quantity }, (_, i) => i + 1);
                                return quantityArray.map((q, i) => (
                                  <View key={`equipment-${index}-${i}`} style={styles.tableRow}>
                                    <Text style={styles.cell}>{item.itemName}</Text>
                                    <Text style={styles.cell}>1</Text>

                                    <View style={{ flex: 1, paddingHorizontal: 6 }}>
                                      <Picker
                                        selectedValue={itemConditions[`${item.itemIdFromInventory}-${i}`] || 'Good'}
                                        style={styles.picker}
                                        onValueChange={(value) => {
                                          setItemConditions(prev => ({
                                            ...prev,
                                            [`${item.itemIdFromInventory}-${i}`]: value,
                                          }));
                                        }}
                                        enabled={selectedRequest.status !== "Approved"} // Disable if status is Approved
                                      >
                                        <Picker.Item label="Good" value="Good" />
                                        <Picker.Item label="Defect" value="Defect" />
                                        <Picker.Item label="Damage" value="Damage" />
                                        <Picker.Item label="Lost" value="Lost" />
                                      </Picker>
                                    </View>
                                  </View>
                                ));
                              })}
                          </ScrollView>
                        </View>
                      </>
                    )}

                    <View style={styles.modalButtons}>
                      <View style={styles.modalButton}>
                        <Button title="Back" onPress={closeModal} />
                      </View>
                      {selectedRequest?.status === 'Deployed' && (
                        <View style={styles.modalButton}>
                          <Button title="Return" onPress={handleReturn} />
                        </View>
                      )}
                    </View>
                  </ScrollView>
                  </View>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={issueModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIssueModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIssueModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.issueModalContent}>
                  <Text style={styles.modalTitle}>
                    Specify issues for: {currentIssueItem?.itemName || ""}
                  </Text>

                  {["Defect", "Damage", "Lost"].map(type => (
                    <View key={type} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ flex: 1 }}>{type}:</Text>
                      <TextInput
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 4,
                          paddingHorizontal: 8
                        }}
                        keyboardType="numeric"
                        value={(issueQuantities[type] || 0).toString()}
                        onChangeText={(val) =>
                          setIssueQuantities(prev => ({
                            ...prev,
                            [type]: parseInt(val, 10) || 0,
                          }))
                        }
                      />
                    </View>
                  ))}

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => setIssueModalVisible(false)}
                      style={[styles.dialogButton, { marginRight: 10 }]}
                    >
                      <Text style={styles.dialogButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (!currentIssueItem) return;

                        const issuedQty = currentIssueItem.quantity || 0;

                        const totalIssues = Object.values(issueQuantities).reduce(
                          (sum, val) => sum + (val || 0),
                          0
                        );

                        const conditionArray = [];

                        // Push issues first
                        Object.entries(issueQuantities).forEach(([type, count]) => {
                          for (let i = 0; i < (count || 0); i++) {
                            conditionArray.push(type);
                          }
                        });

                        // Fill the rest with "Good"
                        const goodQty = Math.max(issuedQty - totalIssues, 0);
                        for (let i = 0; i < goodQty; i++) {
                          conditionArray.push("Good");
                        }

                        setItemUnitConditions(prev => ({
                          ...prev,
                          [currentIssueItem.itemIdFromInventory]: conditionArray,
                        }));

                        setIssueModalVisible(false);
                      }}
                      style={styles.dialogButton}
                    >
                      <Text style={styles.dialogButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          transparent={true}
          visible={successModalVisible}
          animationType="fade"
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Successfully Returned!</Text>
              <Button
                title="Close"
                onPress={() => setSuccessModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
    </View>
  );
};

export default ReturnItems;
