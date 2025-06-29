// VERSION 1
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js";
// import { collection, query, getDocs, where, serverTimestamp } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import ItemDetailsModal from "../customs/ItemDetailsModal";
// import CONFIG from "../config";
// import Header from "../Header";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraShowItems = ({ onClose }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [itemDetails, setItemDetails] = useState(null);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   useEffect(() => {
//     animateScanLine();
//   }, []);

//   const animateScanLine = () => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanLinePosition, {
//           toValue: styles.scannerFrame.height,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(scanLinePosition, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   };

//   if (!permission) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need permission to access your camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//     const getTodayDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//     };

//     const handleBackButton = () => {
//         navigation.goBack();
//     };

//     const showItemDetails = (foundItem, borrowedCount) => {
//       const itemData = {
//         ...foundItem,
//         borrowedCount,
//       };

//       setItemDetails(itemData);
//       setDetailsVisible(true);
//     };

//     const logRequestOrReturn = async (userId, userName, action) => {
//         try {
//         await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//             action, // e.g., "Added a Capex Item", "Requested Items", etc.
//             userName,
//             timestamp: serverTimestamp(),
//         });
//         } catch (error) {
//         console.error("Error logging request or return activity:", error);
//         }
//     };

//     // const handleBarCodeScanned = async ({ data }) => {
//     //     if (scanned) return;

//     //     setScanned(true);

//     //     try {
//     //         // Decrypt the scanned data
//     //         const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //         const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //         if (!decryptedData) throw new Error("Invalid QR Code");

//     //         const parsedData = JSON.parse(decryptedData);
//     //         const { itemName } = parsedData;  // Now using itemName instead of itemId

//     //         const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//     //         // Query the inventory to find the item by itemName
//     //         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //         const querySnapshot = await getDocs(inventoryQuery);

//     //         let foundItem = null;
//     //         querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //             foundItem = itemData;
//     //         }
//     //         });

//     //         if (foundItem) {
//     //         // Now query the borrowCatalog to check how many times this item was borrowed today
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;

//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
            
//     //         console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         console.log("Borrowed count:", borrowedCount);

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //         `;

//     //         Alert.alert("Item Details", detailMsg);

//     //         } else {
//     //         Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

//     // const handleBarCodeScanned = async ({ data }) => {
//     // if (scanned) return;
//     // setScanned(true);

//     // try {
//     //     // Decrypt the QR code data
//     //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //     if (!decryptedData) throw new Error("Invalid QR Code");

//     //     const parsedData = JSON.parse(decryptedData);
//     //     const todayDate = getTodayDate();

//     //     if (parsedData.itemName) {
//     //     // It's an item QR code
//     //     const { itemName } = parsedData;

//     //     const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //     const querySnapshot = await getDocs(inventoryQuery);

//     //     let foundItem = null;
//     //     querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //         foundItem = itemData;
//     //         }
//     //     });

//     //     if (foundItem) {
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;
//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList?.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //             `;
//     //             Alert.alert("Item Details", detailMsg);
//     //         } else {
//     //             Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//     //         }

//     //         } else if (parsedData.roomNumber) {
//     //         // It's a lab room QR code
//     //         const { roomNumber } = parsedData;

//     //         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//     //         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//     //         if (labRoomItemsSnapshot.empty) {
//     //             Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
//     //         } else {
//     //             let itemsDetail = "";
//     //             labRoomItemsSnapshot.forEach(doc => {
//     //             const item = doc.data();
//     //             itemsDetail += `
//     //     - ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity || "?"})
//     //             `;
//     //             });

//     //             Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:${itemsDetail}`);
//     //         }

//     //         } else {
//     //         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

// //     const handleBarCodeScanned = async ({ data }) => {
// //   if (scanned) return;
// //   setScanned(true);

// //   try {
// //     // Decrypt the QR code data
// //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
// //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

// //     if (!decryptedData) throw new Error("Invalid QR Code");

// //     const parsedData = JSON.parse(decryptedData);
// //     const todayDate = getTodayDate();

// //     console.log("Parsed QR data:", parsedData);

// //     if (parsedData.itemName) {
// //       // It's an item QR code
// //       const { itemName } = parsedData;

// //       const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
// //       const querySnapshot = await getDocs(inventoryQuery);

// //       let foundItem = null;
// //       querySnapshot.forEach(docSnap => {
// //         const itemData = docSnap.data();
// //         if (itemData.itemName === itemName) {
// //           foundItem = itemData;
// //         }
// //       });

// //       if (foundItem) {
// //         const borrowQuery = query(collection(db, "borrowcatalog"));
// //         const borrowSnapshot = await getDocs(borrowQuery);

// //         let borrowedCount = 0;
// //         borrowSnapshot.forEach(doc => {
// //           const borrowData = doc.data();
// //           if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
// //             borrowData.requestList?.forEach(requestItem => {
// //               if ((requestItem.itemName || "").trim() === itemName) {
// //                 borrowedCount += requestItem.quantity || 0;
// //               }
// //             });
// //           }
// //         });

// //         const detailMsg = `
// //           Item Name: ${foundItem.itemName}
// //           Item ID: ${foundItem.itemId}
// //           Category: ${foundItem.category}
// //           Department: ${foundItem.department}
// //           Quantity Available: ${foundItem.quantity}
// //           Location: ${foundItem.labRoom}
// //           Borrowed Today: ${borrowedCount} times
// //         `;
// //         Alert.alert("Item Details", detailMsg);
// //       } else {
// //         Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
// //       }

// //     } else if (parsedData.roomNumber) {
// //       // It's a lab room QR code
// //       const { roomNumber } = parsedData;

// //       // Use your actual Firestore subcollection name for lab room items
// //       const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
// //       const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

// //       if (labRoomItemsSnapshot.empty) {
// //         Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
// //       } else {
// //         // Build item details with newlines for better formatting
// //         const itemsDetailArray = [];

// //         labRoomItemsSnapshot.forEach(doc => {
// //           const item = doc.data();
// //           itemsDetailArray.push(
// //             `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
// //           );
// //         });

// //         const itemsDetail = itemsDetailArray.join("\n");

// //         Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
// //       }

// //     } else {
// //       Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
// //     }
// //   } catch (error) {
// //     console.error("QR Scan Error:", error);
// //     Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
// //   }

// //   setTimeout(() => setScanned(false), 1500);
// // };

//     // const handleBarCodeScanned = async ({ data }) => {
//     // if (scanned) return;
//     // setScanned(true);

//     // try {
//     //         // Decrypt the QR code data
//     //         const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //         const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //         if (!decryptedData) throw new Error("Invalid QR Code");

//     //         let parsedData;
//     //         try {
//     //         parsedData = JSON.parse(decryptedData);

//     //         } catch {
//     //         // If JSON.parse fails, treat decryptedData as a raw string (labRoom id)
//     //         parsedData = decryptedData;
//     //         }

//     //         const todayDate = getTodayDate();

//     //         console.log("Parsed QR data:", parsedData);

//     //         if (parsedData.itemName) {
//     //         // It's an item QR code
//     //         const { itemName } = parsedData;

//     //         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //         const querySnapshot = await getDocs(inventoryQuery);

//     //         let foundItem = null;
//     //         querySnapshot.forEach(docSnap => {
//     //             const itemData = docSnap.data();

//     //             if (itemData.itemName === itemName) {
//     //             foundItem = itemData;
//     //             }
//     //         });

//     //         if (foundItem) {
//     //             const borrowQuery = query(collection(db, "borrowcatalog"));
//     //             const borrowSnapshot = await getDocs(borrowQuery);

//     //             let borrowedCount = 0;
//     //             borrowSnapshot.forEach(doc => {
//     //             const borrowData = doc.data();
//     //             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //                 borrowData.requestList?.forEach(requestItem => {

//     //                 if ((requestItem.itemName || "").trim() === itemName) {
//     //                     borrowedCount += requestItem.quantity || 0;
//     //                 }
//     //                 });
//     //             }
//     //             });

//     //             const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //             `;
//     //             Alert.alert("Item Details", detailMsg);

//     //         } else {
//     //             Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//     //         }

//     //         } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//     //         // New case for labRoom QR with multiple items inside "items" array
//     //         const room = parsedData.labRoom;
//     //         const itemsDetailArray = parsedData.items.map(item => 
//     //             `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//     //         );

//     //         const itemsDetail = itemsDetailArray.join("\n");

//     //         Alert.alert("Lab Room Inventory", `Room: ${room}\nItems:\n${itemsDetail}`);

//     //         } else if (typeof parsedData === "string") {
//     //             // It's a labRoom id string (e.g. "0430")
//     //             const roomId = parsedData;

//     //             const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//     //             const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//     //             if (labRoomItemsSnapshot.empty) {
//     //                 Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
                    
//     //             } else {
//     //                 const itemsDetailArray = [];

//     //                 labRoomItemsSnapshot.forEach(doc => {
//     //                 const item = doc.data();
//     //                 itemsDetailArray.push(
//     //                     `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//     //                 );
//     //                 });

//     //                 const itemsDetail = itemsDetailArray.join("\n");

//     //                 Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//     //             }

//     //         } else if (parsedData.roomNumber) {
//     //             // Your existing roomNumber object check (if needed)
//     //             const { roomNumber } = parsedData;

//     //             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//     //             const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//     //             if (labRoomItemsSnapshot.empty) {
//     //                 Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//     //             } else {
//     //                 const itemsDetailArray = [];

//     //                 labRoomItemsSnapshot.forEach(doc => {
//     //                 const item = doc.data();
//     //                 itemsDetailArray.push(
//     //                     `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//     //                 );
//     //                 });

//     //                 const itemsDetail = itemsDetailArray.join("\n");

//     //                 Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//     //             }
                    
//     //         } else {
//     //             Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

//      const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     try {
//       // Decrypt the QR code data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//       console.log("Decrypted QR data raw:", decryptedData);
//       if (!decryptedData) throw new Error("Invalid QR Code");

//       let parsedData;
//       try {
//         parsedData = JSON.parse(decryptedData);

//       } catch {
//         parsedData = decryptedData;
//       }

//       const todayDate = getTodayDate();

//       console.log("Parsed QR data:", parsedData);

//       if (parsedData.itemName) {
//         // It's an item QR code
//         const { itemName } = parsedData;

//         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//         const querySnapshot = await getDocs(inventoryQuery);

//         let foundItem = null;
//         querySnapshot.forEach(docSnap => {
//           const itemData = docSnap.data();

//           if (itemData.itemName === itemName) {
//             foundItem = itemData;
//           }
//         });

//         if (foundItem) {
//           const borrowQuery = query(collection(db, "borrowcatalog"));
//           const borrowSnapshot = await getDocs(borrowQuery);

//           let borrowedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//               borrowData.requestList?.forEach(requestItem => {

//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   borrowedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           // const detailMsg = `
//           //         Item Name: ${foundItem.itemName}
//           //         Item ID: ${foundItem.itemId}
//           //         Category: ${foundItem.category}
//           //         Department: ${foundItem.department}
//           //         Quantity Available: ${foundItem.quantity}
//           //         Location: ${foundItem.labRoom}
//           //         Borrowed Today: ${borrowedCount} times
//           //         `;
//           // Alert.alert("Item Details", detailMsg);
//           showItemDetails(foundItem, borrowedCount);

//         } else {
//           Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//         }

//       } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//         // Instead of showing embedded QR code items, fetch live Firestore data for labRoom and filter archived
//         const roomId = parsedData.labRoom;
//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") { 
//               itemsDetailArray.push(
//                 `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//               );
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");
//           Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//         }

//       } else if (typeof parsedData === "string") {
//         // It's a labRoom id string (e.g. "0430")
//         const roomId = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               itemsDetailArray.push(
//                 `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               );
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");

//           Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//         }

//       } else if (parsedData.roomNumber) {
//         // Your existing roomNumber object check (if needed)
//         const { roomNumber } = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               itemsDetailArray.push(
//                 `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               );
//             }
//           });
          
//           const itemsDetail = itemsDetailArray.join("\n");

//           Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//         }

//       } else {
//         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//     const handleLabRoomScan = async (roomNumber) => {
//         try {
//             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//             const snapshot = await getDocs(labRoomItemsRef);

//             if (snapshot.empty) {
//             Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
//             return;
//             }

//             let itemsDetails = `Items in ${roomNumber}:\n\n`;

//             snapshot.forEach(doc => {
//             const item = doc.data();
//             itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
//             });

//             Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

//         } catch (error) {
//             console.error("Error fetching labRoom items:", error);
//             Alert.alert("Error", "Failed to load lab room items.");
//         }
//     };

//     const handleItemScan = async ({ data }) => {
//         if (scanned) return;

//         setScanned(true);

//         try {
//             // Decrypt the scanned data
//             const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) throw new Error("Invalid QR Code");

//             const parsedData = JSON.parse(decryptedData);
//             const { itemName } = parsedData;  // Now using itemName instead of itemId

//             const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//             // Query the inventory to find the item by itemName
//             const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//             const querySnapshot = await getDocs(inventoryQuery);

//             let foundItem = null;
//             querySnapshot.forEach(docSnap => {
//             const itemData = docSnap.data();
//             if (itemData.itemName === itemName) {
//                 foundItem = itemData;
//             }
//             });

//             if (foundItem) {
//             // Now query the borrowCatalog to check how many times this item was borrowed today
//             const borrowQuery = query(collection(db, "borrowcatalog"));
//             const borrowSnapshot = await getDocs(borrowQuery);

//             let borrowedCount = 0;

//             borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
            
//             console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//                 borrowData.requestList.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                     borrowedCount += requestItem.quantity || 0;
//                 }
//                 });
//             }
//             });

//             console.log("Borrowed count:", borrowedCount);

//             const detailMsg = `
//                 Item Name: ${foundItem.itemName}
//                 Item ID: ${foundItem.itemId}
//                 Category: ${foundItem.category}
//                 Department: ${foundItem.department}
//                 Quantity Available: ${foundItem.quantity}
//                 Location: ${foundItem.labRoom}
//                 Borrowed Today: ${borrowedCount} times
//             `;

//             Alert.alert("Item Details", detailMsg);

//             } else {
//             Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//             }

//         } catch (error) {
//             console.error("QR Scan Error:", error);
//             Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//         }

//         setTimeout(() => setScanned(false), 1500);
//     };

//   return (
//     <View style={styles.container}>
//     <Header/>
//       <TouchableOpacity onPress={handleBackButton}>
//         <Text style={styles.text}>Go Back</Text>
//       </TouchableOpacity>

//       <CameraView
//         style={styles.camera}
//         facing={cameraType}
//         ref={cameraRef}
//         barcodeScannerEnabled={true}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.maskTop} />
//           <View style={styles.maskBottom} />
//           <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
//           <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

//           <View style={styles.scannerFrame}>
//             <View style={[styles.corner, styles.cornerTopLeft]} />
//             <View style={[styles.corner, styles.cornerTopRight]} />
//             <View style={[styles.corner, styles.cornerBottomLeft]} />
//             <View style={[styles.corner, styles.cornerBottomRight]} />

//             <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
//           </View>
//         </View>

//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={styles.flipButton}
//             onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
//           >
//             <Text style={styles.text}>Flip</Text>
//           </TouchableOpacity>
//         </View>

//         <ItemDetailsModal
//           visible={detailsVisible}
//           itemData={itemDetails}
//           onClose={() => setDetailsVisible(false)}
//         />
//       </CameraView>
//     </View>
//   );
// };

// export default CameraShowItems;


// VERSION 2
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js";
// import { collection, query, getDocs, where, serverTimestamp } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";
// import Header from "../Header";
// import ItemDetailsModal from "../customs/ItemDetailsModal";
// import LabRoomDetailsModal from "../customs/LabRoomDetailsModal";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraShowItems = ({ onClose }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [itemDetails, setItemDetails] = useState(null);
//   const [labRoomItems, setLabRoomItems] = useState([]);
//   const [labRoomId, setLabRoomId] = useState("");
//   const [labModalVisible, setLabModalVisible] = useState(false);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   useEffect(() => {
//     animateScanLine();
//   }, []);

//   const animateScanLine = () => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanLinePosition, {
//           toValue: styles.scannerFrame.height,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(scanLinePosition, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   };

//   if (!permission) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need permission to access your camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//     const getTodayDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//     };

//     const handleBackButton = () => {
//         navigation.goBack();
//     };

//     const showItemDetails = (foundItem, borrowedCount) => {
//       const itemData = {
//         ...foundItem,
//         borrowedCount,
//       };

//       setItemDetails(itemData);
//       setDetailsVisible(true);
//     };

//     const showLabRoomDetails = (roomId, items) => {
//       setLabRoomId(roomId);
//       setLabRoomItems(items);
//       setLabModalVisible(true);
//     };

//     const logRequestOrReturn = async (userId, userName, action) => {
//         try {
//         await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//             action, // e.g., "Added a Capex Item", "Requested Items", etc.
//             userName,
//             timestamp: serverTimestamp(),
//         });
//         } catch (error) {
//         console.error("Error logging request or return activity:", error);
//         }
//     };

//     // const handleBarCodeScanned = async ({ data }) => {
//     //     if (scanned) return;

//     //     setScanned(true);

//     //     try {
//     //         // Decrypt the scanned data
//     //         const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //         const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //         if (!decryptedData) throw new Error("Invalid QR Code");

//     //         const parsedData = JSON.parse(decryptedData);
//     //         const { itemName } = parsedData;  // Now using itemName instead of itemId

//     //         const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//     //         // Query the inventory to find the item by itemName
//     //         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //         const querySnapshot = await getDocs(inventoryQuery);

//     //         let foundItem = null;
//     //         querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //             foundItem = itemData;
//     //         }
//     //         });

//     //         if (foundItem) {
//     //         // Now query the borrowCatalog to check how many times this item was borrowed today
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;

//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
            
//     //         console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         console.log("Borrowed count:", borrowedCount);

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //         `;

//     //         Alert.alert("Item Details", detailMsg);

//     //         } else {
//     //         Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

//     // const handleBarCodeScanned = async ({ data }) => {
//     // if (scanned) return;
//     // setScanned(true);

//     // try {
//     //     // Decrypt the QR code data
//     //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //     if (!decryptedData) throw new Error("Invalid QR Code");

//     //     const parsedData = JSON.parse(decryptedData);
//     //     const todayDate = getTodayDate();

//     //     if (parsedData.itemName) {
//     //     // It's an item QR code
//     //     const { itemName } = parsedData;

//     //     const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //     const querySnapshot = await getDocs(inventoryQuery);

//     //     let foundItem = null;
//     //     querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //         foundItem = itemData;
//     //         }
//     //     });

//     //     if (foundItem) {
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;
//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList?.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //             `;
//     //             Alert.alert("Item Details", detailMsg);
//     //         } else {
//     //             Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//     //         }

//     //         } else if (parsedData.roomNumber) {
//     //         // It's a lab room QR code
//     //         const { roomNumber } = parsedData;

//     //         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//     //         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//     //         if (labRoomItemsSnapshot.empty) {
//     //             Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
//     //         } else {
//     //             let itemsDetail = "";
//     //             labRoomItemsSnapshot.forEach(doc => {
//     //             const item = doc.data();
//     //             itemsDetail += `
//     //     - ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity || "?"})
//     //             `;
//     //             });

//     //             Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:${itemsDetail}`);
//     //         }

//     //         } else {
//     //         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

// //     const handleBarCodeScanned = async ({ data }) => {
// //   if (scanned) return;
// //   setScanned(true);

// //   try {
// //     // Decrypt the QR code data
// //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
// //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

// //     if (!decryptedData) throw new Error("Invalid QR Code");

// //     const parsedData = JSON.parse(decryptedData);
// //     const todayDate = getTodayDate();

// //     console.log("Parsed QR data:", parsedData);

// //     if (parsedData.itemName) {
// //       // It's an item QR code
// //       const { itemName } = parsedData;

// //       const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
// //       const querySnapshot = await getDocs(inventoryQuery);

// //       let foundItem = null;
// //       querySnapshot.forEach(docSnap => {
// //         const itemData = docSnap.data();
// //         if (itemData.itemName === itemName) {
// //           foundItem = itemData;
// //         }
// //       });

// //       if (foundItem) {
// //         const borrowQuery = query(collection(db, "borrowcatalog"));
// //         const borrowSnapshot = await getDocs(borrowQuery);

// //         let borrowedCount = 0;
// //         borrowSnapshot.forEach(doc => {
// //           const borrowData = doc.data();
// //           if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
// //             borrowData.requestList?.forEach(requestItem => {
// //               if ((requestItem.itemName || "").trim() === itemName) {
// //                 borrowedCount += requestItem.quantity || 0;
// //               }
// //             });
// //           }
// //         });

// //         const detailMsg = `
// //           Item Name: ${foundItem.itemName}
// //           Item ID: ${foundItem.itemId}
// //           Category: ${foundItem.category}
// //           Department: ${foundItem.department}
// //           Quantity Available: ${foundItem.quantity}
// //           Location: ${foundItem.labRoom}
// //           Borrowed Today: ${borrowedCount} times
// //         `;
// //         Alert.alert("Item Details", detailMsg);
// //       } else {
// //         Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
// //       }

// //     } else if (parsedData.roomNumber) {
// //       // It's a lab room QR code
// //       const { roomNumber } = parsedData;

// //       // Use your actual Firestore subcollection name for lab room items
// //       const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
// //       const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

// //       if (labRoomItemsSnapshot.empty) {
// //         Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
// //       } else {
// //         // Build item details with newlines for better formatting
// //         const itemsDetailArray = [];

// //         labRoomItemsSnapshot.forEach(doc => {
// //           const item = doc.data();
// //           itemsDetailArray.push(
// //             `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
// //           );
// //         });

// //         const itemsDetail = itemsDetailArray.join("\n");

// //         Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
// //       }

// //     } else {
// //       Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
// //     }
// //   } catch (error) {
// //     console.error("QR Scan Error:", error);
// //     Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
// //   }

// //   setTimeout(() => setScanned(false), 1500);
// // };

//   // const handleBarCodeScanned = async ({ data }) => {
//   //   if (scanned) return;
//   //   setScanned(true);

//   //   try {
//   //           // Decrypt the QR code data
//   //           const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//   //           const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//   //           console.log("Decrypted QR data raw:", decryptedData);
//   //           if (!decryptedData) throw new Error("Invalid QR Code");

//   //           let parsedData;
//   //           try {
//   //           parsedData = JSON.parse(decryptedData);

//   //           } catch {
//   //           // If JSON.parse fails, treat decryptedData as a raw string (labRoom id)
//   //           parsedData = decryptedData;
//   //           }

//   //           const todayDate = getTodayDate();

//   //           console.log("Parsed QR data:", parsedData);

//   //           if (parsedData.itemName) {
//   //           // It's an item QR code
//   //           const { itemName } = parsedData;

//   //           const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//   //           const querySnapshot = await getDocs(inventoryQuery);

//   //           let foundItem = null;
//   //           querySnapshot.forEach(docSnap => {
//   //               const itemData = docSnap.data();

//   //               if (itemData.itemName === itemName) {
//   //               foundItem = itemData;
//   //               }
//   //           });

//   //           if (foundItem) {
//   //               const borrowQuery = query(collection(db, "borrowcatalog"));
//   //               const borrowSnapshot = await getDocs(borrowQuery);

//   //               let borrowedCount = 0;
//   //               borrowSnapshot.forEach(doc => {
//   //               const borrowData = doc.data();
//   //               if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//   //                   borrowData.requestList?.forEach(requestItem => {

//   //                   if ((requestItem.itemName || "").trim() === itemName) {
//   //                       borrowedCount += requestItem.quantity || 0;
//   //                   }
//   //                   });
//   //               }
//   //               });

//   //               const detailMsg = `
//   //               Item Name: ${foundItem.itemName}
//   //               Item ID: ${foundItem.itemId}
//   //               Category: ${foundItem.category}
//   //               Department: ${foundItem.department}
//   //               Quantity Available: ${foundItem.quantity}
//   //               Location: ${foundItem.labRoom}
//   //               Borrowed Today: ${borrowedCount} times
//   //               `;
//   //               Alert.alert("Item Details", detailMsg);

//   //           } else {
//   //               Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//   //           }

//   //           } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//   //           // New case for labRoom QR with multiple items inside "items" array
//   //           const room = parsedData.labRoom;
//   //           const itemsDetailArray = parsedData.items.map(item => 
//   //               `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//   //           );

//   //           const itemsDetail = itemsDetailArray.join("\n");

//   //           Alert.alert("Lab Room Inventory", `Room: ${room}\nItems:\n${itemsDetail}`);

//   //           } else if (typeof parsedData === "string") {
//   //               // It's a labRoom id string (e.g. "0430")
//   //               const roomId = parsedData;

//   //               const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//   //               const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//   //               if (labRoomItemsSnapshot.empty) {
//   //                   Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
                    
//   //               } else {
//   //                   const itemsDetailArray = [];

//   //                   labRoomItemsSnapshot.forEach(doc => {
//   //                   const item = doc.data();
//   //                   itemsDetailArray.push(
//   //                       `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//   //                   );
//   //                   });

//   //                   const itemsDetail = itemsDetailArray.join("\n");

//   //                   Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//   //               }

//   //           } else if (parsedData.roomNumber) {
//   //               // Your existing roomNumber object check (if needed)
//   //               const { roomNumber } = parsedData;

//   //               const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//   //               const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//   //               if (labRoomItemsSnapshot.empty) {
//   //                   Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//   //               } else {
//   //                   const itemsDetailArray = [];

//   //               labRoomItemsSnapshot.forEach(doc => {
//   //                 const item = doc.data();
//   //                 if (item.status !== "archived") {
//   //                   itemsDetailArray.push(
//   //                     `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//   //                   );
//   //                 }
//   //               });
//   //                   const itemsDetail = itemsDetailArray.join("\n");

//   //                   Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//   //               }
                    
//   //           } else {
//   //               Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//   //           }

//   //       } catch (error) {
//   //           console.error("QR Scan Error:", error);
//   //           Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//   //       }

//   //       setTimeout(() => setScanned(false), 1500);
//   //   };

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     try {
//       // Decrypt the QR code data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//       console.log("Decrypted QR data raw:", decryptedData);
//       if (!decryptedData) throw new Error("Invalid QR Code");

//       let parsedData;
//       try {
//         parsedData = JSON.parse(decryptedData);

//       } catch {
//         parsedData = decryptedData;
//       }

//       const todayDate = getTodayDate();

//       console.log("Parsed QR data:", parsedData);

//       if (parsedData.itemName) {
//         // It's an item QR code
//         const { itemName } = parsedData;

//         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//         const querySnapshot = await getDocs(inventoryQuery);

//         let foundItem = null;
//         querySnapshot.forEach(docSnap => {
//           const itemData = docSnap.data();

//           if (itemData.itemName === itemName) {
//             foundItem = itemData;
//           }
//         });

//         if (foundItem) {
//           const borrowQuery = query(collection(db, "borrowcatalog"));
//           const borrowSnapshot = await getDocs(borrowQuery);

//           let borrowedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//               borrowData.requestList?.forEach(requestItem => {

//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   borrowedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           // const detailMsg = `
//           //         Item Name: ${foundItem.itemName}
//           //         Item ID: ${foundItem.itemId}
//           //         Category: ${foundItem.category}
//           //         Department: ${foundItem.department}
//           //         Quantity Available: ${foundItem.quantity}
//           //         Location: ${foundItem.labRoom}
//           //         Borrowed Today: ${borrowedCount} times
//           //         `;
//           // Alert.alert("Item Details", detailMsg);
//           showItemDetails(foundItem, borrowedCount);

//         } else {
//           Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//         }

//       } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//         // Instead of showing embedded QR code items, fetch live Firestore data for labRoom and filter archived
//         const roomId = parsedData.labRoom;
//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
//           //  showLabRoomDetails(roomId, items);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") { 
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");
//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (typeof parsedData === "string") {
//         // It's a labRoom id string (e.g. "0430")
//         const roomId = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");

//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (parsedData.roomNumber) {
//         // Your existing roomNumber object check (if needed)
//         const { roomNumber } = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });
          
//           const itemsDetail = itemsDetailArray.join("\n");

//           // Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else {
//         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//     const handleLabRoomScan = async (roomNumber) => {
//         try {
//             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//             const snapshot = await getDocs(labRoomItemsRef);

//             if (snapshot.empty) {
//             Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
//             return;
//             }

//             let itemsDetails = `Items in ${roomNumber}:\n\n`;

//             snapshot.forEach(doc => {
//             const item = doc.data();
//             itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
//             });

//             Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

//         } catch (error) {
//             console.error("Error fetching labRoom items:", error);
//             Alert.alert("Error", "Failed to load lab room items.");
//         }
//     };

//     const handleItemScan = async ({ data }) => {
//         if (scanned) return;

//         setScanned(true);

//         try {
//             // Decrypt the scanned data
//             const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) throw new Error("Invalid QR Code");

//             const parsedData = JSON.parse(decryptedData);
//             const { itemName } = parsedData;  // Now using itemName instead of itemId

//             const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//             // Query the inventory to find the item by itemName
//             const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//             const querySnapshot = await getDocs(inventoryQuery);

//             let foundItem = null;
//             querySnapshot.forEach(docSnap => {
//             const itemData = docSnap.data();
//             if (itemData.itemName === itemName) {
//                 foundItem = itemData;
//             }
//             });

//             if (foundItem) {
//             // Now query the borrowCatalog to check how many times this item was borrowed today
//             const borrowQuery = query(collection(db, "borrowcatalog"));
//             const borrowSnapshot = await getDocs(borrowQuery);

//             let borrowedCount = 0;

//             borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
            
//             console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//                 borrowData.requestList.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                     borrowedCount += requestItem.quantity || 0;
//                 }
//                 });
//             }
//             });

//             console.log("Borrowed count:", borrowedCount);

//             const detailMsg = `
//                 Item Name: ${foundItem.itemName}
//                 Item ID: ${foundItem.itemId}
//                 Category: ${foundItem.category}
//                 Department: ${foundItem.department}
//                 Quantity Available: ${foundItem.quantity}
//                 Location: ${foundItem.labRoom}
//                 Borrowed Today: ${borrowedCount} times
//             `;

//             Alert.alert("Item Details", detailMsg);

//             } else {
//             Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//             }

//         } catch (error) {
//             console.error("QR Scan Error:", error);
//             Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//         }

//         setTimeout(() => setScanned(false), 1500);
//     };

//   return (
//     <View style={styles.container}>
//     <Header/>
//       <TouchableOpacity onPress={handleBackButton}>
//         <Text style={styles.text}>Go Back</Text>
//       </TouchableOpacity>

//       <CameraView
//         style={styles.camera}
//         facing={cameraType}
//         ref={cameraRef}
//         barcodeScannerEnabled={true}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.maskTop} />
//           <View style={styles.maskBottom} />
//           <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
//           <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

//           <View style={styles.scannerFrame}>
//             <View style={[styles.corner, styles.cornerTopLeft]} />
//             <View style={[styles.corner, styles.cornerTopRight]} />
//             <View style={[styles.corner, styles.cornerBottomLeft]} />
//             <View style={[styles.corner, styles.cornerBottomRight]} />

//             <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
//           </View>
//         </View>

//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={styles.flipButton}
//             onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
//           >
//             <Text style={styles.text}>Flip</Text>
//           </TouchableOpacity>
//         </View>

//         <ItemDetailsModal
//           visible={detailsVisible}
//           itemData={itemDetails}
//           onClose={() => setDetailsVisible(false)}
//         />

//         <LabRoomDetailsModal
//           visible={labModalVisible}
//           roomId={labRoomId}
//           items={labRoomItems}
//           onClose={() => setLabModalVisible(false)}
//         />
//       </CameraView>
//     </View>
//   );
// };

// export default CameraShowItems;


// VERSION 3
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js";
// import { collection, query, getDocs, where, serverTimestamp } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";
// import Header from "../Header";
// import ItemDetailsModal from "../customs/ItemDetailsModal";
// import LabRoomDetailsModal from "../customs/LabRoomDetailsModal";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraShowItems = ({ onClose }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [itemDetails, setItemDetails] = useState(null);
//   const [labRoomItems, setLabRoomItems] = useState([]);
//   const [labRoomId, setLabRoomId] = useState("");
//   const [labModalVisible, setLabModalVisible] = useState(false);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   useEffect(() => {
//     animateScanLine();
//   }, []);

//   const animateScanLine = () => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanLinePosition, {
//           toValue: styles.scannerFrame.height,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(scanLinePosition, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   };

//   if (!permission) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need permission to access your camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//     const getTodayDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//     };

//     const handleBackButton = () => {
//         navigation.goBack();
//     };

//     const showItemDetails = (foundItem, borrowedCount) => {
//       const itemData = {
//         ...foundItem,
//         borrowedCount,
//       };

//       setItemDetails(itemData);
//       setDetailsVisible(true);
//     };

//     const showLabRoomDetails = (roomId, items) => {
//       setLabRoomId(roomId);
//       setLabRoomItems(items);
//       setLabModalVisible(true);
//     };

//     const logRequestOrReturn = async (userId, userName, action) => {
//         try {
//         await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//             action, // e.g., "Added a Capex Item", "Requested Items", etc.
//             userName,
//             timestamp: serverTimestamp(),
//         });
//         } catch (error) {
//         console.error("Error logging request or return activity:", error);
//         }
//     };

//     // const handleBarCodeScanned = async ({ data }) => {
//     //     if (scanned) return;

//     //     setScanned(true);

//     //     try {
//     //         // Decrypt the scanned data
//     //         const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //         const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //         if (!decryptedData) throw new Error("Invalid QR Code");

//     //         const parsedData = JSON.parse(decryptedData);
//     //         const { itemName } = parsedData;  // Now using itemName instead of itemId

//     //         const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//     //         // Query the inventory to find the item by itemName
//     //         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //         const querySnapshot = await getDocs(inventoryQuery);

//     //         let foundItem = null;
//     //         querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //             foundItem = itemData;
//     //         }
//     //         });

//     //         if (foundItem) {
//     //         // Now query the borrowCatalog to check how many times this item was borrowed today
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;

//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
            
//     //         console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         console.log("Borrowed count:", borrowedCount);

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //         `;

//     //         Alert.alert("Item Details", detailMsg);

//     //         } else {
//     //         Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

//     // const handleBarCodeScanned = async ({ data }) => {
//     // if (scanned) return;
//     // setScanned(true);

//     // try {
//     //     // Decrypt the QR code data
//     //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//     //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     //     if (!decryptedData) throw new Error("Invalid QR Code");

//     //     const parsedData = JSON.parse(decryptedData);
//     //     const todayDate = getTodayDate();

//     //     if (parsedData.itemName) {
//     //     // It's an item QR code
//     //     const { itemName } = parsedData;

//     //     const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//     //     const querySnapshot = await getDocs(inventoryQuery);

//     //     let foundItem = null;
//     //     querySnapshot.forEach(docSnap => {
//     //         const itemData = docSnap.data();
//     //         if (itemData.itemName === itemName) {
//     //         foundItem = itemData;
//     //         }
//     //     });

//     //     if (foundItem) {
//     //         const borrowQuery = query(collection(db, "borrowcatalog"));
//     //         const borrowSnapshot = await getDocs(borrowQuery);

//     //         let borrowedCount = 0;
//     //         borrowSnapshot.forEach(doc => {
//     //         const borrowData = doc.data();
//     //         if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//     //             borrowData.requestList?.forEach(requestItem => {
//     //             if ((requestItem.itemName || "").trim() === itemName) {
//     //                 borrowedCount += requestItem.quantity || 0;
//     //             }
//     //             });
//     //         }
//     //         });

//     //         const detailMsg = `
//     //             Item Name: ${foundItem.itemName}
//     //             Item ID: ${foundItem.itemId}
//     //             Category: ${foundItem.category}
//     //             Department: ${foundItem.department}
//     //             Quantity Available: ${foundItem.quantity}
//     //             Location: ${foundItem.labRoom}
//     //             Borrowed Today: ${borrowedCount} times
//     //             `;
//     //             Alert.alert("Item Details", detailMsg);
//     //         } else {
//     //             Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//     //         }

//     //         } else if (parsedData.roomNumber) {
//     //         // It's a lab room QR code
//     //         const { roomNumber } = parsedData;

//     //         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//     //         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//     //         if (labRoomItemsSnapshot.empty) {
//     //             Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
//     //         } else {
//     //             let itemsDetail = "";
//     //             labRoomItemsSnapshot.forEach(doc => {
//     //             const item = doc.data();
//     //             itemsDetail += `
//     //     - ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity || "?"})
//     //             `;
//     //             });

//     //             Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:${itemsDetail}`);
//     //         }

//     //         } else {
//     //         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//     //         }

//     //     } catch (error) {
//     //         console.error("QR Scan Error:", error);
//     //         Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     //     }

//     //     setTimeout(() => setScanned(false), 1500);
//     // };

// //     const handleBarCodeScanned = async ({ data }) => {
// //   if (scanned) return;
// //   setScanned(true);

// //   try {
// //     // Decrypt the QR code data
// //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
// //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

// //     if (!decryptedData) throw new Error("Invalid QR Code");

// //     const parsedData = JSON.parse(decryptedData);
// //     const todayDate = getTodayDate();

// //     console.log("Parsed QR data:", parsedData);

// //     if (parsedData.itemName) {
// //       // It's an item QR code
// //       const { itemName } = parsedData;

// //       const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
// //       const querySnapshot = await getDocs(inventoryQuery);

// //       let foundItem = null;
// //       querySnapshot.forEach(docSnap => {
// //         const itemData = docSnap.data();
// //         if (itemData.itemName === itemName) {
// //           foundItem = itemData;
// //         }
// //       });

// //       if (foundItem) {
// //         const borrowQuery = query(collection(db, "borrowcatalog"));
// //         const borrowSnapshot = await getDocs(borrowQuery);

// //         let borrowedCount = 0;
// //         borrowSnapshot.forEach(doc => {
// //           const borrowData = doc.data();
// //           if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
// //             borrowData.requestList?.forEach(requestItem => {
// //               if ((requestItem.itemName || "").trim() === itemName) {
// //                 borrowedCount += requestItem.quantity || 0;
// //               }
// //             });
// //           }
// //         });

// //         const detailMsg = `
// //           Item Name: ${foundItem.itemName}
// //           Item ID: ${foundItem.itemId}
// //           Category: ${foundItem.category}
// //           Department: ${foundItem.department}
// //           Quantity Available: ${foundItem.quantity}
// //           Location: ${foundItem.labRoom}
// //           Borrowed Today: ${borrowedCount} times
// //         `;
// //         Alert.alert("Item Details", detailMsg);
// //       } else {
// //         Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
// //       }

// //     } else if (parsedData.roomNumber) {
// //       // It's a lab room QR code
// //       const { roomNumber } = parsedData;

// //       // Use your actual Firestore subcollection name for lab room items
// //       const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
// //       const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

// //       if (labRoomItemsSnapshot.empty) {
// //         Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);
// //       } else {
// //         // Build item details with newlines for better formatting
// //         const itemsDetailArray = [];

// //         labRoomItemsSnapshot.forEach(doc => {
// //           const item = doc.data();
// //           itemsDetailArray.push(
// //             `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
// //           );
// //         });

// //         const itemsDetail = itemsDetailArray.join("\n");

// //         Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
// //       }

// //     } else {
// //       Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
// //     }
// //   } catch (error) {
// //     console.error("QR Scan Error:", error);
// //     Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
// //   }

// //   setTimeout(() => setScanned(false), 1500);
// // };

//   // const handleBarCodeScanned = async ({ data }) => {
//   //   if (scanned) return;
//   //   setScanned(true);

//   //   try {
//   //           // Decrypt the QR code data
//   //           const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//   //           const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//   //           console.log("Decrypted QR data raw:", decryptedData);
//   //           if (!decryptedData) throw new Error("Invalid QR Code");

//   //           let parsedData;
//   //           try {
//   //           parsedData = JSON.parse(decryptedData);

//   //           } catch {
//   //           // If JSON.parse fails, treat decryptedData as a raw string (labRoom id)
//   //           parsedData = decryptedData;
//   //           }

//   //           const todayDate = getTodayDate();

//   //           console.log("Parsed QR data:", parsedData);

//   //           if (parsedData.itemName) {
//   //           // It's an item QR code
//   //           const { itemName } = parsedData;

//   //           const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//   //           const querySnapshot = await getDocs(inventoryQuery);

//   //           let foundItem = null;
//   //           querySnapshot.forEach(docSnap => {
//   //               const itemData = docSnap.data();

//   //               if (itemData.itemName === itemName) {
//   //               foundItem = itemData;
//   //               }
//   //           });

//   //           if (foundItem) {
//   //               const borrowQuery = query(collection(db, "borrowcatalog"));
//   //               const borrowSnapshot = await getDocs(borrowQuery);

//   //               let borrowedCount = 0;
//   //               borrowSnapshot.forEach(doc => {
//   //               const borrowData = doc.data();
//   //               if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//   //                   borrowData.requestList?.forEach(requestItem => {

//   //                   if ((requestItem.itemName || "").trim() === itemName) {
//   //                       borrowedCount += requestItem.quantity || 0;
//   //                   }
//   //                   });
//   //               }
//   //               });

//   //               const detailMsg = `
//   //               Item Name: ${foundItem.itemName}
//   //               Item ID: ${foundItem.itemId}
//   //               Category: ${foundItem.category}
//   //               Department: ${foundItem.department}
//   //               Quantity Available: ${foundItem.quantity}
//   //               Location: ${foundItem.labRoom}
//   //               Borrowed Today: ${borrowedCount} times
//   //               `;
//   //               Alert.alert("Item Details", detailMsg);

//   //           } else {
//   //               Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//   //           }

//   //           } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//   //           // New case for labRoom QR with multiple items inside "items" array
//   //           const room = parsedData.labRoom;
//   //           const itemsDetailArray = parsedData.items.map(item => 
//   //               `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//   //           );

//   //           const itemsDetail = itemsDetailArray.join("\n");

//   //           Alert.alert("Lab Room Inventory", `Room: ${room}\nItems:\n${itemsDetail}`);

//   //           } else if (typeof parsedData === "string") {
//   //               // It's a labRoom id string (e.g. "0430")
//   //               const roomId = parsedData;

//   //               const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//   //               const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//   //               if (labRoomItemsSnapshot.empty) {
//   //                   Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
                    
//   //               } else {
//   //                   const itemsDetailArray = [];

//   //                   labRoomItemsSnapshot.forEach(doc => {
//   //                   const item = doc.data();
//   //                   itemsDetailArray.push(
//   //                       `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//   //                   );
//   //                   });

//   //                   const itemsDetail = itemsDetailArray.join("\n");

//   //                   Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//   //               }

//   //           } else if (parsedData.roomNumber) {
//   //               // Your existing roomNumber object check (if needed)
//   //               const { roomNumber } = parsedData;

//   //               const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//   //               const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//   //               if (labRoomItemsSnapshot.empty) {
//   //                   Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//   //               } else {
//   //                   const itemsDetailArray = [];

//   //               labRoomItemsSnapshot.forEach(doc => {
//   //                 const item = doc.data();
//   //                 if (item.status !== "archived") {
//   //                   itemsDetailArray.push(
//   //                     `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"})`
//   //                   );
//   //                 }
//   //               });
//   //                   const itemsDetail = itemsDetailArray.join("\n");

//   //                   Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//   //               }
                    
//   //           } else {
//   //               Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//   //           }

//   //       } catch (error) {
//   //           console.error("QR Scan Error:", error);
//   //           Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//   //       }

//   //       setTimeout(() => setScanned(false), 1500);
//   //   };

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     try {
//       // Decrypt the QR code data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//       console.log("Decrypted QR data raw:", decryptedData);
//       if (!decryptedData) throw new Error("Invalid QR Code");

//       let parsedData;
//       try {
//         parsedData = JSON.parse(decryptedData);

//       } catch {
//         parsedData = decryptedData;
//       }

//       const todayDate = getTodayDate();

//       console.log("Parsed QR data:", parsedData);

//       if (parsedData.itemName) {
//         // It's an item QR code
//         const { itemName } = parsedData;

//         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//         const querySnapshot = await getDocs(inventoryQuery);

//         let foundItem = null;
//         querySnapshot.forEach(docSnap => {
//           const itemData = docSnap.data();

//           if (itemData.itemName === itemName) {
//             foundItem = itemData;
//           }
//         });

//         if (foundItem) {
//           const borrowQuery = query(collection(db, "borrowcatalog"));
//           const borrowSnapshot = await getDocs(borrowQuery);

//           let borrowedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//               borrowData.requestList?.forEach(requestItem => {

//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   borrowedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           // const detailMsg = `
//           //         Item Name: ${foundItem.itemName}
//           //         Item ID: ${foundItem.itemId}
//           //         Category: ${foundItem.category}
//           //         Department: ${foundItem.department}
//           //         Quantity Available: ${foundItem.quantity}
//           //         Location: ${foundItem.labRoom}
//           //         Borrowed Today: ${borrowedCount} times
//           //         `;
//           // Alert.alert("Item Details", detailMsg);
//           showItemDetails(foundItem, borrowedCount);

//         } else {
//           Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//         }

//       } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//         // Instead of showing embedded QR code items, fetch live Firestore data for labRoom and filter archived
//         const roomId = parsedData.labRoom;
//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
//           //  showLabRoomDetails(roomId, items);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") { 
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");
//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (typeof parsedData === "string") {
//         // It's a labRoom id string (e.g. "0430")
//         const roomId = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");

//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (parsedData.roomNumber) {
//         // Your existing roomNumber object check (if needed)
//         const { roomNumber } = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });
          
//           const itemsDetail = itemsDetailArray.join("\n");

//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else {
//         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//   const addBorrowedCountToItems = async (itemsDetailArray) => {
//     const todayDate = new Date().toISOString().split("T")[0]; // "2025-05-18"
//     const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

//     console.log("Today's date:", todayDate);

//     for (const item of itemsDetailArray) {
//       let borrowedCount = 0;

//       console.log("\n🔍 Checking item:", item.itemName);

//       borrowSnapshot.forEach(doc => {
//         const borrowData = doc.data();

//         const status = (borrowData.status || "").trim();
//         const dateRequired = (borrowData.dateRequired || "").trim();

//         if (!Array.isArray(borrowData.requestList)) {
//           console.log("⚠️ requestList is missing or not an array:", borrowData);
//           return;
//         }

//         if (status === "Borrowed" && dateRequired === todayDate) {
//           borrowData.requestList.forEach(requestItem => {
//             const requestItemName = (requestItem.itemName || "").trim();
//             const requestQty = requestItem.quantity || 0;

//             console.log(
//               `🆚 Comparing "${requestItemName}" with "${item.itemName}" – Qty: ${requestQty}`
//             );

//             if (requestItemName === item.itemName) {
//               borrowedCount += requestQty;
//             }
//           });
          
//         } else {
//           console.log(`⏩ Skipped: status=${status}, date=${dateRequired}`);
//         }
//       });

//       console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
//       item.borrowedToday = borrowedCount;
//     }
//   };

//     const handleLabRoomScan = async (roomNumber) => {
//         try {
//             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//             const snapshot = await getDocs(labRoomItemsRef);

//             if (snapshot.empty) {
//             Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
//             return;
//             }

//             let itemsDetails = `Items in ${roomNumber}:\n\n`;

//             snapshot.forEach(doc => {
//             const item = doc.data();
//             itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
//             });

//             Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

//         } catch (error) {
//             console.error("Error fetching labRoom items:", error);
//             Alert.alert("Error", "Failed to load lab room items.");
//         }
//     };

//     const handleItemScan = async ({ data }) => {
//         if (scanned) return;

//         setScanned(true);

//         try {
//             // Decrypt the scanned data
//             const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) throw new Error("Invalid QR Code");

//             const parsedData = JSON.parse(decryptedData);
//             const { itemName } = parsedData;  // Now using itemName instead of itemId

//             const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//             // Query the inventory to find the item by itemName
//             const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//             const querySnapshot = await getDocs(inventoryQuery);

//             let foundItem = null;
//             querySnapshot.forEach(docSnap => {
//             const itemData = docSnap.data();
//             if (itemData.itemName === itemName) {
//                 foundItem = itemData;
//             }
//             });

//             if (foundItem) {
//             // Now query the borrowCatalog to check how many times this item was borrowed today
//             const borrowQuery = query(collection(db, "borrowcatalog"));
//             const borrowSnapshot = await getDocs(borrowQuery);

//             let borrowedCount = 0;

//             borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
            
//             console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//                 borrowData.requestList.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                     borrowedCount += requestItem.quantity || 0;
//                 }
//                 });
//             }
//             });

//             console.log("Borrowed count:", borrowedCount);

//             const detailMsg = `
//                 Item Name: ${foundItem.itemName}
//                 Item ID: ${foundItem.itemId}
//                 Category: ${foundItem.category}
//                 Department: ${foundItem.department}
//                 Quantity Available: ${foundItem.quantity}
//                 Location: ${foundItem.labRoom}
//                 Borrowed Today: ${borrowedCount} times
//             `;

//             Alert.alert("Item Details", detailMsg);

//             } else {
//             Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//             }

//         } catch (error) {
//             console.error("QR Scan Error:", error);
//             Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//         }

//         setTimeout(() => setScanned(false), 1500);
//     };

//   return (
//     <View style={styles.container}>
//     <Header/>
//       <TouchableOpacity onPress={handleBackButton}>
//         <Text style={styles.text}>Go Back</Text>
//       </TouchableOpacity>

//       <CameraView
//         style={styles.camera}
//         facing={cameraType}
//         ref={cameraRef}
//         barcodeScannerEnabled={true}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.maskTop} />
//           <View style={styles.maskBottom} />
//           <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
//           <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

//           <View style={styles.scannerFrame}>
//             <View style={[styles.corner, styles.cornerTopLeft]} />
//             <View style={[styles.corner, styles.cornerTopRight]} />
//             <View style={[styles.corner, styles.cornerBottomLeft]} />
//             <View style={[styles.corner, styles.cornerBottomRight]} />

//             <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
//           </View>
//         </View>

//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={styles.flipButton}
//             onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
//           >
//             <Text style={styles.text}>Flip</Text>
//           </TouchableOpacity>
//         </View>

//         <ItemDetailsModal
//           visible={detailsVisible}
//           itemData={itemDetails}
//           onClose={() => setDetailsVisible(false)}
//         />

//         <LabRoomDetailsModal
//           visible={labModalVisible}
//           roomId={labRoomId}
//           items={labRoomItems}
//           onClose={() => setLabModalVisible(false)}
//         />
//       </CameraView>
//     </View>
//   );
// };

// export default CameraShowItems;


// VERSION 4
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js";
// import { collection, query, getDocs, where, serverTimestamp } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";
// import Header from "../Header";
// import ItemDetailsModal from "../customs/ItemDetailsModal";
// import LabRoomDetailsModal from "../customs/LabRoomDetailsModal";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraShowItems = ({ onClose }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [itemDetails, setItemDetails] = useState(null);
//   const [labRoomItems, setLabRoomItems] = useState([]);
//   const [labRoomId, setLabRoomId] = useState("");
//   const [labModalVisible, setLabModalVisible] = useState(false);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   useEffect(() => {
//     animateScanLine();
//   }, []);

//   const animateScanLine = () => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanLinePosition, {
//           toValue: styles.scannerFrame.height,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(scanLinePosition, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   };

//   if (!permission) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need permission to access your camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//     const getTodayDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//     };

//     const handleBackButton = () => {
//         navigation.goBack();
//     };

//     const showItemDetails = (foundItem, borrowedCount, deployedCount) => {
//       const itemData = {
//         ...foundItem,
//         borrowedCount,
//         deployedCount,
//       };

//       setItemDetails(itemData);
//       setDetailsVisible(true);
//     };

//     const showLabRoomDetails = (roomId, items) => {
//       setLabRoomId(roomId);
//       setLabRoomItems(items);
//       setLabModalVisible(true);
//     };

//     const logRequestOrReturn = async (userId, userName, action) => {
//         try {
//         await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//             action, // e.g., "Added a Capex Item", "Requested Items", etc.
//             userName,
//             timestamp: serverTimestamp(),
//         });
        
//         } catch (error) {
//         console.error("Error logging request or return activity:", error);
//         }
//     };

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     try {
//       // Decrypt the QR code data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//       console.log("Decrypted QR data raw:", decryptedData);
//       if (!decryptedData) throw new Error("Invalid QR Code");

//       let parsedData;
//       try {
//         parsedData = JSON.parse(decryptedData);

//       } catch {
//         parsedData = decryptedData;
//       }

//       const todayDate = getTodayDate();

//       console.log("Parsed QR data:", parsedData);

//       if (parsedData.itemName) {
//         // It's an item QR code
//         const { itemName } = parsedData;

//         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//         const querySnapshot = await getDocs(inventoryQuery);

//         let foundItem = null;
//         querySnapshot.forEach(docSnap => {
//           const itemData = docSnap.data();

//           if (itemData.itemName === itemName) {
//             foundItem = itemData;
//           }
//         });

//         if (foundItem) {
//           const borrowQuery = query(collection(db, "borrowcatalog"));
//           const borrowSnapshot = await getDocs(borrowQuery);

//           let borrowedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//               borrowData.requestList?.forEach(requestItem => {

//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   borrowedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           let deployedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if (
//               (borrowData.status || "").trim() === "Deployed" &&
//               (borrowData.dateRequired || "").trim() === todayDate
//             ) {
//               borrowData.requestList?.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   deployedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           // const detailMsg = `
//           //         Item Name: ${foundItem.itemName}
//           //         Item ID: ${foundItem.itemId}
//           //         Category: ${foundItem.category}
//           //         Department: ${foundItem.department}
//           //         Quantity Available: ${foundItem.quantity}
//           //         Location: ${foundItem.labRoom}
//           //         Borrowed Today: ${borrowedCount} times
//           //         `;
//           // Alert.alert("Item Details", detailMsg);
//           showItemDetails(foundItem, borrowedCount, deployedCount);

//         } else {
//           Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//         }

//       } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//         // Instead of showing embedded QR code items, fetch live Firestore data for labRoom and filter archived
//         const roomId = parsedData.labRoom;
//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
//           //  showLabRoomDetails(roomId, items);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") { 
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");
//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (typeof parsedData === "string") {
//         // It's a labRoom id string (e.g. "0430")
//         const roomId = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });

//           const itemsDetail = itemsDetailArray.join("\n");

//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else if (parsedData.roomNumber) {
//         // Your existing roomNumber object check (if needed)
//         const { roomNumber } = parsedData;

//         const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//         const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//         if (labRoomItemsSnapshot.empty) {
//           Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//         } else {
//           const itemsDetailArray = [];

//           labRoomItemsSnapshot.forEach(doc => {
//             const item = doc.data();
//             if (item.status !== "archived") {
//               // itemsDetailArray.push(
//               //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//               // );
//               itemsDetailArray.push(item);
//             }
//           });
          
//           const itemsDetail = itemsDetailArray.join("\n");

//           await addBorrowedCountToItems(itemsDetailArray);

//           // Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//            showLabRoomDetails(roomId, itemsDetailArray);
//         }

//       } else {
//         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//   const addBorrowedCountToItems = async (itemsDetailArray) => {
//     const todayDate = new Date().toISOString().split("T")[0]; // "2025-05-18"
//     const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

//     console.log("Today's date:", todayDate);

//     for (const item of itemsDetailArray) {
//       let borrowedCount = 0;

//       console.log("\n🔍 Checking item:", item.itemName);

//       borrowSnapshot.forEach(doc => {
//         const borrowData = doc.data();

//         const status = (borrowData.status || "").trim();
//         const dateRequired = (borrowData.dateRequired || "").trim();

//         if (!Array.isArray(borrowData.requestList)) {
//           console.log("⚠️ requestList is missing or not an array:", borrowData);
//           return;
//         }

//         if (status === "Borrowed" && dateRequired === todayDate) {
//           borrowData.requestList.forEach(requestItem => {
//             const requestItemName = (requestItem.itemName || "").trim();
//             const requestQty = requestItem.quantity || 0;

//             console.log(
//               `🆚 Comparing "${requestItemName}" with "${item.itemName}" – Qty: ${requestQty}`
//             );

//             if (requestItemName === item.itemName) {
//               borrowedCount += requestQty;
//             }
//           });
          
//         } else {
//           console.log(`⏩ Skipped: status=${status}, date=${dateRequired}`);
//         }
//       });

//       console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
//       item.borrowedToday = borrowedCount;
//     }
//   };

//     const handleLabRoomScan = async (roomNumber) => {
//         try {
//             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//             const snapshot = await getDocs(labRoomItemsRef);

//             if (snapshot.empty) {
//             Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
//             return;
//             }

//             let itemsDetails = `Items in ${roomNumber}:\n\n`;

//             snapshot.forEach(doc => {
//             const item = doc.data();
//             itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
//             });

//             Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

//         } catch (error) {
//             console.error("Error fetching labRoom items:", error);
//             Alert.alert("Error", "Failed to load lab room items.");
//         }
//     };

//     const handleItemScan = async ({ data }) => {
//         if (scanned) return;

//         setScanned(true);

//         try {
//             // Decrypt the scanned data
//             const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) throw new Error("Invalid QR Code");

//             const parsedData = JSON.parse(decryptedData);
//             const { itemName } = parsedData;  // Now using itemName instead of itemId

//             const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//             // Query the inventory to find the item by itemName
//             const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//             const querySnapshot = await getDocs(inventoryQuery);

//             let foundItem = null;
//             querySnapshot.forEach(docSnap => {
//             const itemData = docSnap.data();
//             if (itemData.itemName === itemName) {
//                 foundItem = itemData;
//             }
//             });

//             if (foundItem) {
//             // Now query the borrowCatalog to check how many times this item was borrowed today
//             const borrowQuery = query(collection(db, "borrowcatalog"));
//             const borrowSnapshot = await getDocs(borrowQuery);

//             let borrowedCount = 0;

//             borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
            
//             console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//                 borrowData.requestList.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                     borrowedCount += requestItem.quantity || 0;
//                 }
//                 });
//             }
//             });

//             console.log("Borrowed count:", borrowedCount);

//             const detailMsg = `
//                 Item Name: ${foundItem.itemName}
//                 Item ID: ${foundItem.itemId}
//                 Category: ${foundItem.category}
//                 Department: ${foundItem.department}
//                 Quantity Available: ${foundItem.quantity}
//                 Location: ${foundItem.labRoom}
//                 Borrowed Today: ${borrowedCount} times
//             `;

//             Alert.alert("Item Details", detailMsg);

//             } else {
//             Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//             }

//         } catch (error) {
//             console.error("QR Scan Error:", error);
//             Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//         }

//         setTimeout(() => setScanned(false), 1500);
//     };

//   return (
//     <View style={styles.container}>
//     <Header/>
//       <TouchableOpacity onPress={handleBackButton}>
//         <Text style={styles.text}>Go Back</Text>
//       </TouchableOpacity>

//       <CameraView
//         style={styles.camera}
//         facing={cameraType}
//         ref={cameraRef}
//         barcodeScannerEnabled={true}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.maskTop} />
//           <View style={styles.maskBottom} />
//           <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
//           <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

//           <View style={styles.scannerFrame}>
//             <View style={[styles.corner, styles.cornerTopLeft]} />
//             <View style={[styles.corner, styles.cornerTopRight]} />
//             <View style={[styles.corner, styles.cornerBottomLeft]} />
//             <View style={[styles.corner, styles.cornerBottomRight]} />

//             <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
//           </View>
//         </View>

//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={styles.flipButton}
//             onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
//           >
//             <Text style={styles.text}>Flip</Text>
//           </TouchableOpacity>
//         </View>

//         <ItemDetailsModal
//           visible={detailsVisible}
//           itemData={itemDetails}
//           onClose={() => setDetailsVisible(false)}
//         />

//         <LabRoomDetailsModal
//           visible={labModalVisible}
//           roomId={labRoomId}
//           items={labRoomItems}
//           onClose={() => setLabModalVisible(false)}
//         />
//       </CameraView>
//     </View>
//   );
// };

// export default CameraShowItems;


// VERSION 5
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js";
// import { collection, query, getDocs, where, serverTimestamp } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";
// import Header from "../Header";
// import ItemDetailsModal from "../customs/ItemDetailsModal";
// import LabRoomDetailsModal from "../customs/LabRoomDetailsModal";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraShowItems = ({ onClose }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [itemDetails, setItemDetails] = useState(null);
//   const [labRoomItems, setLabRoomItems] = useState([]);
//   const [labRoomId, setLabRoomId] = useState("");
//   const [labModalVisible, setLabModalVisible] = useState(false);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   useEffect(() => {
//     animateScanLine();
//   }, []);

//   const animateScanLine = () => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanLinePosition, {
//           toValue: styles.scannerFrame.height,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(scanLinePosition, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   };

//   if (!permission) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need permission to access your camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//     const getTodayDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = (today.getMonth() + 1).toString().padStart(2, '0');
//         const day = today.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//     };

//     const handleBackButton = () => {
//         navigation.goBack();
//     };

//     const showItemDetails = (foundItem, borrowedCount, deployedCount, deployedInfo) => {
//       const itemData = {
//         ...foundItem,
//         borrowedCount,
//         deployedCount,
//         deployedInfo
//       };

//       setItemDetails(itemData);
//       setDetailsVisible(true);
//     };

//     const showLabRoomDetails = (roomId, items) => {
//       setLabRoomId(roomId);
//       setLabRoomItems(items);
//       setLabModalVisible(true);
//     };

//     const logRequestOrReturn = async (userId, userName, action) => {
//         try {
//         await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//             action, // e.g., "Added a Capex Item", "Requested Items", etc.
//             userName,
//             timestamp: serverTimestamp(),
//         });
        
//         } catch (error) {
//         console.error("Error logging request or return activity:", error);
//         }
//     };

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     try {
//       // Decrypt the QR code data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//       console.log("Decrypted QR data raw:", decryptedData);
//       if (!decryptedData) throw new Error("Invalid QR Code");

//       let parsedData;
//       try {
//         parsedData = JSON.parse(decryptedData);

//       } catch {
//         parsedData = decryptedData;
//       }

//       const todayDate = getTodayDate();

//       console.log("Parsed QR data:", parsedData);

//       if (parsedData.itemName) {
//         // It's an item QR code
//         const { itemName } = parsedData;

//         const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//         const querySnapshot = await getDocs(inventoryQuery);

//         let foundItem = null;
//         querySnapshot.forEach(docSnap => {
//           const itemData = docSnap.data();

//           if (itemData.itemName === itemName) {
//             foundItem = itemData;
//           }
//         });

//         if (foundItem) {
//           const borrowQuery = query(collection(db, "borrowcatalog"));
//           const borrowSnapshot = await getDocs(borrowQuery);

//           let borrowedCount = 0;
//           let deployedInfo = [];

//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//               borrowData.requestList?.forEach(requestItem => {

//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   borrowedCount += requestItem.quantity || 0;

//                   deployedInfo.push({
//                     requestor: borrowData.userName || "Unknown",
//                     room: borrowData.room || borrowData.roomNumber || "N/A",
//                     quantity: requestItem.quantity || 0,
//                   });
//                 }
//               });
//             }
//           });

//           let deployedCount = 0;
//           borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
//             if (
//               (borrowData.status || "").trim() === "Deployed" &&
//               (borrowData.dateRequired || "").trim() === todayDate
//             ) {
//               borrowData.requestList?.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                   deployedCount += requestItem.quantity || 0;
//                 }
//               });
//             }
//           });

//           // const detailMsg = `
//           //         Item Name: ${foundItem.itemName}
//           //         Item ID: ${foundItem.itemId}
//           //         Category: ${foundItem.category}
//           //         Department: ${foundItem.department}
//           //         Quantity Available: ${foundItem.quantity}
//           //         Location: ${foundItem.labRoom}
//           //         Borrowed Today: ${borrowedCount} times
//           //         `;
//           // Alert.alert("Item Details", detailMsg);
//           showItemDetails(foundItem, borrowedCount, deployedCount, deployedInfo);

//         } else {
//           Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
//         }

//       // } else if (parsedData.items && Array.isArray(parsedData.items) && parsedData.labRoom) {
//       //   // Instead of showing embedded QR code items, fetch live Firestore data for labRoom and filter archived
//       //   const roomId = parsedData.labRoom;
//       //   const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//       //   const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//       //   if (labRoomItemsSnapshot.empty) {
//       //     Alert.alert("Room Details", `No items found in lab room ${roomId}.`);
//       //     //  showLabRoomDetails(roomId, items);

//       //   } else {
//       //     const itemsDetailArray = [];

//       //     labRoomItemsSnapshot.forEach(doc => {
//       //       const item = doc.data();
//       //       if (item.status !== "archived") { 
//       //         // itemsDetailArray.push(
//       //         //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"}, Status: ${item.status || "N/A"})`
//       //         // );
//       //         itemsDetailArray.push(item);
//       //       }
//       //     });

//       //     const itemsDetail = itemsDetailArray.join("\n");
//       //     // await addBorrowedCountToItems(itemsDetailArray);
//       //     await addBorrowedAndDeployedCountToItems(itemsDetailArray)
//       //     // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//       //     showLabRoomDetails(roomId, itemsDetailArray);
//       //   }

//       // } else if (typeof parsedData === "string") {
//       //   // It's a labRoom id string (e.g. "0430")
//       //   const roomId = parsedData;

//       //   const labRoomItemsRef = collection(db, `labRoom/${roomId}/items`);
//       //   const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//       //   if (labRoomItemsSnapshot.empty) {
//       //     Alert.alert("Room Details", `No items found in lab room ${roomId}.`);

//       //   } else {
//       //     const itemsDetailArray = [];

//       //     labRoomItemsSnapshot.forEach(doc => {
//       //       const item = doc.data();
//       //       if (item.status !== "archived") {
//       //         // itemsDetailArray.push(
//       //         //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//       //         // );
//       //         itemsDetailArray.push(item);
//       //       }
//       //     });

//       //     const itemsDetail = itemsDetailArray.join("\n");

//       //     // await addBorrowedCountToItems(itemsDetailArray);
//       //     await addBorrowedAndDeployedCountToItems(itemsDetailArray)
//       //     // Alert.alert("Lab Room Inventory", `Room: ${roomId}\nItems:\n${itemsDetail}`);
//       //      showLabRoomDetails(roomId, itemsDetailArray);
//       //   }

//       // } else if (parsedData.roomNumber) {
//       //   // Your existing roomNumber object check (if needed)
//       //   const { roomNumber } = parsedData;

//       //   const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/items`);
//       //   const labRoomItemsSnapshot = await getDocs(labRoomItemsRef);

//       //   if (labRoomItemsSnapshot.empty) {
//       //     Alert.alert("Room Details", `No items found in lab room ${roomNumber}.`);

//       //   } else {
//       //     const itemsDetailArray = [];

//       //     labRoomItemsSnapshot.forEach(doc => {
//       //       const item = doc.data();
//       //       if (item.status !== "archived") {
//       //         // itemsDetailArray.push(
//       //         //   `- ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}, Qty: ${item.quantity ?? "?"}, Condition: ${item.condition || "N/A"})`
//       //         // );
//       //         itemsDetailArray.push(item);
//       //       }
//       //     });
          
//       //     const itemsDetail = itemsDetailArray.join("\n");

//       //     // await addBorrowedCountToItems(itemsDetailArray);
//       //     await addBorrowedAndDeployedCountToItems(itemsDetailArray)

//       //     // Alert.alert("Lab Room Inventory", `Room: ${roomNumber}\nItems:\n${itemsDetail}`);
//       //      showLabRoomDetails(roomId, itemsDetailArray);
//       //   }

//     // } else if (
//     //     typeof parsedData === "string" ||
//     //     parsedData.labRoom ||
//     //     parsedData.roomNumber

//     // ) {
//     //     const roomNumber =
//     //       typeof parsedData === "string"
//     //         ? parsedData
//     //         : parsedData.labRoom || parsedData.roomNumber;

//     //     try {
//     //       if (!parsedData.items || parsedData.items.length === 0) {
//     //         Alert.alert("Error", "No items found in QR data.");
//     //         return;
//     //       }

//     //       const itemsDetailArray = [];
//     //       let labRoomFromInventory = null; 

//     //       for (const item of parsedData.items) {
//     //         const itemQuery = query(
//     //           collection(db, "inventory"),
//     //           where("itemId", "==", item.itemId)
//     //         );

//     //         const itemSnapshot = await getDocs(itemQuery);
//     //         if (!itemSnapshot.empty) {

//     //           const data = itemSnapshot.docs[0].data();
//     //           if (data.status !== "archived") {
//     //             itemsDetailArray.push(data);

//     //                       if (!labRoomFromInventory && data.labRoom) {
//     //               labRoomFromInventory = data.labRoom;
//     //             }
//     //           }

//     //         } else {
//     //           console.warn(`Item ID ${item.itemId} not found in inventory`);
//     //         }
//     //       }

//     //       if (itemsDetailArray.length === 0) {
//     //         Alert.alert("Inventory", "No valid items found in inventory.");
//     //         return;
//     //       }

//     //       await addBorrowedAndDeployedCountToItems(itemsDetailArray);
//     //       showLabRoomDetails(labRoomFromInventory, itemsDetailArray);

//     //     } catch (error) {
//     //       console.error("Error fetching inventory items:", error);
//     //       Alert.alert("Error", "Failed to fetch inventory item details.");
//     //     }

//     //   } else {
//     //     Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//     //   }

//       } else if (parsedData.labRoomId) {
//         const labRoomId = parsedData.labRoomId;

//         try {
//           const labRoomRef = doc(db, "labRoom", labRoomId);
//           const labRoomDoc = await getDoc(labRoomRef);

//           if (!labRoomDoc.exists()) {
//             Alert.alert("Error", "Lab room not found.");
//             return;
//           }

//           const itemsSnap = await getDocs(collection(labRoomRef, "items"));
//           const itemsDetailArray = [];

//           itemsSnap.forEach((docItem) => {
//             const data = docItem.data();
//             if (data.status !== "archived") {
//               itemsDetailArray.push(data);
//             }
//           });

//           if (itemsDetailArray.length === 0) {
//             Alert.alert("Inventory", "No valid items found in lab room.");
//             return;
//           }

//           await addBorrowedAndDeployedCountToItems(itemsDetailArray);

//           // Show modal with roomId and items
//           showLabRoomDetails(labRoomDoc.data().roomNumber || labRoomId, itemsDetailArray);

//         } catch (error) {
//           console.error("Error fetching lab room data:", error);
//           Alert.alert("Error", "Failed to fetch lab room or items.");
//         }
//       } else {
//         Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//   const addBorrowedCountToItems = async (itemsDetailArray) => {
//     const todayDate = new Date().toISOString().split("T")[0]; // "2025-05-18"
//     const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

//     console.log("Today's date:", todayDate);

//     for (const item of itemsDetailArray) {
//       let borrowedCount = 0;

//       console.log("\n🔍 Checking item:", item.itemName);

//       borrowSnapshot.forEach(doc => {
//         const borrowData = doc.data();

//         const status = (borrowData.status || "").trim();
//         const dateRequired = (borrowData.dateRequired || "").trim();

//         if (!Array.isArray(borrowData.requestList)) {
//           console.log("⚠️ requestList is missing or not an array:", borrowData);
//           return;
//         }

//         if (status === "Borrowed" && dateRequired === todayDate) {
//           borrowData.requestList.forEach(requestItem => {
//             const requestItemName = (requestItem.itemName || "").trim();
//             const requestQty = requestItem.quantity || 0;

//             console.log(
//               `🆚 Comparing "${requestItemName}" with "${item.itemName}" – Qty: ${requestQty}`
//             );

//             if (requestItemName === item.itemName) {
//               borrowedCount += requestQty;
//             }
//           });
          
//         } else {
//           console.log(`⏩ Skipped: status=${status}, date=${dateRequired}`);
//         }
//       });

//       console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
//       item.borrowedToday = borrowedCount;
//     }
//   };

//   const addBorrowedAndDeployedCountToItems = async (itemsDetailArray) => {
//   const todayDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
//   const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

//   console.log("Today's date:", todayDate);

//   for (const item of itemsDetailArray) {
//     let borrowedCount = 0;
//     let deployedCount = 0;

//     console.log("\n🔍 Checking item:", item.itemName);

//     borrowSnapshot.forEach(doc => {
//       const borrowData = doc.data();

//       const status = (borrowData.status || "").trim();
//       const dateRequired = (borrowData.dateRequired || "").trim();

//       if (!Array.isArray(borrowData.requestList)) {
//         console.log("⚠️ requestList is missing or not an array:", borrowData);
//         return;
//       }

//       borrowData.requestList.forEach(requestItem => {
//         const requestItemName = (requestItem.itemName || "").trim();
//         const requestQty = requestItem.quantity || 0;

//         if (requestItemName === item.itemName) {
//           if (status === "Borrowed" && dateRequired === todayDate) {
//             borrowedCount += requestQty;
//           }
//           if (status === "Deployed" && dateRequired === todayDate) {
//             deployedCount += requestQty;
//           }
//         }
//       });
//     });

//     console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
//     console.log(`✅ Total deployed for ${item.itemName}: ${deployedCount}`);

//     item.borrowedToday = borrowedCount;
//     item.deployedToday = deployedCount;
//   }
// };

//     const handleLabRoomScan = async (roomNumber) => {
//         try {
//             const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
//             const snapshot = await getDocs(labRoomItemsRef);

//             if (snapshot.empty) {
//             Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
//             return;
//             }

//             let itemsDetails = `Items in ${roomNumber}:\n\n`;

//             snapshot.forEach(doc => {
//             const item = doc.data();
//             itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
//             });

//             Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

//         } catch (error) {
//             console.error("Error fetching labRoom items:", error);
//             Alert.alert("Error", "Failed to load lab room items.");
//         }
//     };

//     const handleItemScan = async ({ data }) => {
//         if (scanned) return;

//         setScanned(true);

//         try {
//             // Decrypt the scanned data
//             const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) throw new Error("Invalid QR Code");

//             const parsedData = JSON.parse(decryptedData);
//             const { itemName } = parsedData;  // Now using itemName instead of itemId

//             const todayDate = getTodayDate(); // Format as YYYY-MM-DD

//             // Query the inventory to find the item by itemName
//             const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
//             const querySnapshot = await getDocs(inventoryQuery);

//             let foundItem = null;
//             querySnapshot.forEach(docSnap => {
//             const itemData = docSnap.data();
//             if (itemData.itemName === itemName) {
//                 foundItem = itemData;
//             }
//             });

//             if (foundItem) {
//             // Now query the borrowCatalog to check how many times this item was borrowed today
//             const borrowQuery = query(collection(db, "borrowcatalog"));
//             const borrowSnapshot = await getDocs(borrowQuery);

//             let borrowedCount = 0;

//             borrowSnapshot.forEach(doc => {
//             const borrowData = doc.data();
            
//             console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
//             if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
//                 borrowData.requestList.forEach(requestItem => {
//                 if ((requestItem.itemName || "").trim() === itemName) {
//                     borrowedCount += requestItem.quantity || 0;
//                 }
//                 });
//             }
//             });

//             console.log("Borrowed count:", borrowedCount);

//             const detailMsg = `
//                 Item Name: ${foundItem.itemName}
//                 Item ID: ${foundItem.itemId}
//                 Category: ${foundItem.category}
//                 Department: ${foundItem.department}
//                 Quantity Available: ${foundItem.quantity}
//                 Location: ${foundItem.labRoom}
//                 Borrowed Today: ${borrowedCount} times
//             `;

//             Alert.alert("Item Details", detailMsg);

//             } else {
//             Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
//             }

//         } catch (error) {
//             console.error("QR Scan Error:", error);
//             Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
//         }

//         setTimeout(() => setScanned(false), 1500);
//     };

//   return (
//     <View style={styles.container}>
//     <Header/>
//       <TouchableOpacity onPress={handleBackButton}>
//         <Text style={styles.text}>Go Back</Text>
//       </TouchableOpacity>

//       <CameraView
//         style={styles.camera}
//         facing={cameraType}
//         ref={cameraRef}
//         barcodeScannerEnabled={true}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.maskTop} />
//           <View style={styles.maskBottom} />
//           <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
//           <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

//           <View style={styles.scannerFrame}>
//             <View style={[styles.corner, styles.cornerTopLeft]} />
//             <View style={[styles.corner, styles.cornerTopRight]} />
//             <View style={[styles.corner, styles.cornerBottomLeft]} />
//             <View style={[styles.corner, styles.cornerBottomRight]} />

//             <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
//           </View>
//         </View>

//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={styles.flipButton}
//             onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
//           >
//             <Text style={styles.text}>Flip</Text>
//           </TouchableOpacity>
//         </View>

//         <ItemDetailsModal
//           visible={detailsVisible}
//           itemData={itemDetails}
//           onClose={() => setDetailsVisible(false)}
//         />

//         <LabRoomDetailsModal
//           visible={labModalVisible}
//           roomId={labRoomId}
//           items={labRoomItems}
//           onClose={() => setLabModalVisible(false)}
//         />
//       </CameraView>
//     </View>
//   );
// };

// export default CameraShowItems;


// VERSION 6
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CameraView,useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CryptoJS from "crypto-js";
import { collection, query, getDocs, where, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";
import { useAuth } from '../contexts/AuthContext';
import styles from "../styles/adminStyle/CameraStyle";
import CONFIG from "../config";
import Header from "../Header";
import ItemDetailsModal from "../customs/ItemDetailsModal";
import LabRoomDetailsModal from "../customs/LabRoomDetailsModal";
import ShelfDetailsModal from "../customs/ShelfDetailsModal";
import RowDetailsModal from "../customs/RowDetailsModal";


const SECRET_KEY = CONFIG.SECRET_KEY;

const CameraShowItems = ({ onClose }) => {
  const { user } = useAuth();
  const [cameraType, setCameraType] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [labRoomItems, setLabRoomItems] = useState([]);
  const [labRoomId, setLabRoomId] = useState("");
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [shelfModal, setShelfModal] = useState({ visible: false, shelfId: "", rows: [] });
  const [rowModal,   setRowModal]   = useState({ visible: false, rowId: "",  items: [] });

  useEffect(() => {
  if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    animateScanLine();
  }, []);

  const animateScanLine = () => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(scanLinePosition, {
          toValue: styles.scannerFrame.height,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need permission to access your camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.flipButton}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
    };

    const handleBackButton = () => {
        navigation.navigate('QRScanScreen');
    };

    const showItemDetails = (foundItem, borrowedCount, deployedCount, deployedInfo) => {
      const itemData = {
        ...foundItem,
        borrowedCount,
        deployedCount,
        deployedInfo
      };

      setItemDetails(itemData);
      setDetailsVisible(true);
    };

    const showLabRoomDetails = (roomId, items) => {
      setLabRoomId(roomId);
      setLabRoomItems(items);
      setLabModalVisible(true);
    };

    const logRequestOrReturn = async (userId, userName, action) => {
        try {
        await addDoc(collection(db, `accounts/${userId}/activitylog`), {
            action, // e.g., "Added a Capex Item", "Requested Items", etc.
            userName,
            timestamp: serverTimestamp(),
        });
        
        } catch (error) {
        console.error("Error logging request or return activity:", error);
        }
    };

  // const handleBarCodeScanned = async ({ data }) => {
  //   if (scanned) return;
  //   setScanned(true);

  //   try {
  //     // Decrypt the QR code data
  //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  //     console.log("Decrypted QR data raw:", decryptedData);
  //     if (!decryptedData) throw new Error("Invalid QR Code");

  //     let parsedData;
  //     try {
  //       parsedData = JSON.parse(decryptedData);

  //     } catch {
  //       parsedData = decryptedData;
  //     }

  //     const todayDate = getTodayDate();

  //     console.log("Parsed QR data:", parsedData);

  //     if (parsedData.itemName) {
  //       // It's an item QR code
  //       const { itemName } = parsedData;

  //       const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
  //       const querySnapshot = await getDocs(inventoryQuery);

  //       let foundItem = null;
  //       querySnapshot.forEach(docSnap => {
  //         const itemData = docSnap.data();

  //         if (itemData.itemName === itemName) {
  //           foundItem = itemData;
  //         }
  //       });

  //       if (foundItem) {
  //         const borrowQuery = query(collection(db, "borrowcatalog"));
  //         const borrowSnapshot = await getDocs(borrowQuery);

  //         let borrowedCount = 0;
  //         borrowSnapshot.forEach(doc => {
  //           const borrowData = doc.data();
  //           if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
  //             borrowData.requestList?.forEach(requestItem => {

  //               if ((requestItem.itemName || "").trim() === itemName) {
  //                 borrowedCount += requestItem.quantity || 0;
  //               }
  //             });
  //           }
  //         });

  //         let deployedCount = 0;
  //         let deployedInfo = [];

  //         borrowSnapshot.forEach(doc => {
  //           const borrowData = doc.data();
  //           if (
  //             (borrowData.status || "").trim() === "Deployed" &&
  //             (borrowData.dateRequired || "").trim() === todayDate
  //           ) {
  //             borrowData.requestList?.forEach(requestItem => {
  //               if ((requestItem.itemName || "").trim() === itemName) {
  //                 deployedCount += requestItem.quantity || 0;

  //                 deployedInfo.push({
  //                   requestor: borrowData.userName || "Unknown",
  //                   room: borrowData.room || borrowData.roomNumber || "N/A",
  //                   quantity: requestItem.quantity || 0,
  //                 });
  //               }
  //             });
  //           }
  //         });

  //         showItemDetails(foundItem, borrowedCount, deployedCount, deployedInfo);

  //       } else {
  //         Alert.alert("Item Not Found", `Could not find "${itemName}" in the inventory.`);
  //       }



  //     } else if (parsedData.labRoomId) {
  //       const labRoomId = parsedData.labRoomId;

  //       try {
  //         const labRoomRef = doc(db, "labRoom", labRoomId);
  //         const labRoomDoc = await getDoc(labRoomRef);

  //         if (!labRoomDoc.exists()) {
  //           Alert.alert("Error", "Lab room not found.");
  //           return;
  //         }

  //         const itemsSnap = await getDocs(collection(labRoomRef, "items"));
  //         const itemsDetailArray = [];

  //         itemsSnap.forEach((docItem) => {
  //           const data = docItem.data();
  //           if (data.status !== "archived") {
  //             itemsDetailArray.push(data);
  //           }
  //         });

  //         if (itemsDetailArray.length === 0) {
  //           Alert.alert("Inventory", "No valid items found in lab room.");
  //           return;
  //         }

  //         await addBorrowedAndDeployedCountToItems(itemsDetailArray);

  //         // Show modal with roomId and items
  //         showLabRoomDetails(labRoomDoc.data().roomNumber || labRoomId, itemsDetailArray);

  //       } catch (error) {
  //         console.error("Error fetching lab room data:", error);
  //         Alert.alert("Error", "Failed to fetch lab room or items.");
  //       }
  //     } else {
  //       Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
  //     }

  //   } catch (error) {
  //     console.error("QR Scan Error:", error);
  //     Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
  //   }

  //   setTimeout(() => setScanned(false), 1500);
  // };

    const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Decrypt QR code
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) throw new Error("Invalid QR Code");

      let parsedData;
      try {
        parsedData = JSON.parse(decryptedData);
      } catch {
        parsedData = decryptedData;
      }

      const todayDate = getTodayDate();
      console.log("Parsed QR data:", parsedData);

      // 🎯 ITEM QR
      if (parsedData.itemName) {
        const { itemName } = parsedData;

        const inventoryQuery = query(
          collection(db, "inventory"),
          where("itemName", "==", itemName)
        );
        const querySnapshot = await getDocs(inventoryQuery);

        let foundItem = null;
        querySnapshot.forEach((docSnap) => {
          const itemData = docSnap.data();
          if (itemData.itemName === itemName) {
            foundItem = itemData;
          }
        });

        if (foundItem) {
          const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

          let borrowedCount = 0;
          let deployedCount = 0;
          let deployedInfo = [];

          borrowSnapshot.forEach((doc) => {
            const borrowData = doc.data();
            const status = (borrowData.status || "").trim();
            const dateRequired = (borrowData.dateRequired || "").trim();

            if (status === "Borrowed" && dateRequired === todayDate) {
              borrowData.requestList?.forEach((requestItem) => {
                if ((requestItem.itemName || "").trim() === itemName) {
                  borrowedCount += requestItem.quantity || 0;
                }
              });
            }

            if (status === "Deployed" && dateRequired === todayDate) {
              borrowData.requestList?.forEach((requestItem) => {
                if ((requestItem.itemName || "").trim() === itemName) {
                  deployedCount += requestItem.quantity || 0;
                  deployedInfo.push({
                    requestor: borrowData.userName || "Unknown",
                    room: borrowData.room || borrowData.roomNumber || "N/A",
                    quantity: requestItem.quantity || 0,
                  });
                }
              });
            }
          });

          showItemDetails(foundItem, borrowedCount, deployedCount, deployedInfo);
        } else {
          Alert.alert("Item Not Found", `Could not find "${itemName}" in inventory.`);
        }

      // 🧪 LAB ROOM QR
      } else if (parsedData.labRoomId && !parsedData.shelves) {
        const labRoomRef = doc(db, "labRoom", parsedData.labRoomId);
        const labRoomDoc = await getDoc(labRoomRef);

        if (!labRoomDoc.exists()) {
          Alert.alert("Error", "Lab room not found.");
          return;
        }

        const itemsSnap = await getDocs(collection(labRoomRef, "items"));
        const items = [];

        itemsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "archived") {
            items.push(data);
          }
        });

        if (items.length === 0) {
          Alert.alert("Inventory", "No valid items found in this lab room.");
          return;
        }

        await addBorrowedAndDeployedCountToItems(items);
        showLabRoomDetails(labRoomDoc.data().roomNumber || parsedData.labRoomId, items);

      // 🪜 SHELF QR (labRoom + shelf only)
      } else if (parsedData.labRoomId && parsedData.shelves && !parsedData.row) {
        const { labRoomId, shelves: shelfId } = parsedData;

        try {
          const rowsSnap = await getDocs(
            collection(db, `labRoom/${labRoomId}/shelves/${shelfId}/rows`)
          );

          if (rowsSnap.empty) {
            Alert.alert("Shelf Scan", `No rows found in Shelf ${shelfId}.`);
            return;
          }

          let msg = `📦 Shelf ${shelfId} in Lab ${labRoomId.slice(0, 5)}…\n\nRows:\n`;
          rowsSnap.forEach((rowDoc) => {
            msg += `• Row ${rowDoc.id}\n`;
          });

          Alert.alert("Shelf Scan", msg);
        } catch (e) {
          console.error("Shelf QR error:", e);
          Alert.alert("Shelf Scan", "Error loading rows.");
        }

      // 🧱 ROW QR (labRoom + shelf + row)
      } else if (parsedData.labRoomId && parsedData.shelves && parsedData.row) {
        const { labRoomId, shelves: shelfId, row } = parsedData;

        try {
          const rowRef = doc(db, `labRoom/${labRoomId}/shelves/${shelfId}/rows/${row}`);
          const rowDoc = await getDoc(rowRef);

          if (!rowDoc.exists()) {
            Alert.alert("Row Scan", `Row ${row} not found under Shelf ${shelfId}.`);
            return;
          }

          const itemsSnap = await getDocs(collection(rowRef, "items"));

          if (itemsSnap.empty) {
            Alert.alert("Row Scan", `No items found in Row ${row}.`);
            return;
          }

          let msg = `🧱 Lab ${labRoomId.slice(0, 5)}…\nShelf ${shelfId} / Row ${row}\n\nItems:\n`;
          itemsSnap.forEach((d) => {
            const it = d.data();
            msg += `• ${it.itemName} (Qty: ${it.quantity})\n`;
          });

          Alert.alert("Row Scan", msg);
        } catch (e) {
          console.error("Row QR error:", e);
          Alert.alert("Row Scan", "Error reading row data.");
        }

      } else {
        Alert.alert("Invalid QR Code", "QR does not contain recognized data.");
      }

    } catch (error) {
      console.error("QR Scan Error:", error);
      Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
    }

    setTimeout(() => setScanned(false), 1500);
  };
  
  const addBorrowedCountToItems = async (itemsDetailArray) => {
    const todayDate = new Date().toISOString().split("T")[0]; // "2025-05-18"
    const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

    console.log("Today's date:", todayDate);

    for (const item of itemsDetailArray) {
      let borrowedCount = 0;

      console.log("\n🔍 Checking item:", item.itemName);

      borrowSnapshot.forEach(doc => {
        const borrowData = doc.data();

        const status = (borrowData.status || "").trim();
        const dateRequired = (borrowData.dateRequired || "").trim();

        if (!Array.isArray(borrowData.requestList)) {
          console.log("⚠️ requestList is missing or not an array:", borrowData);
          return;
        }

        if (status === "Borrowed" && dateRequired === todayDate) {
          borrowData.requestList.forEach(requestItem => {
            const requestItemName = (requestItem.itemName || "").trim();
            const requestQty = requestItem.quantity || 0;

            console.log(
              `🆚 Comparing "${requestItemName}" with "${item.itemName}" – Qty: ${requestQty}`
            );

            if (requestItemName === item.itemName) {
              borrowedCount += requestQty;
            }
          });
          
        } else {
          console.log(`⏩ Skipped: status=${status}, date=${dateRequired}`);
        }
      });

      console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
      item.borrowedToday = borrowedCount;
    }
  };

  const addBorrowedAndDeployedCountToItems = async (itemsDetailArray) => {
  const todayDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const borrowSnapshot = await getDocs(collection(db, "borrowcatalog"));

  console.log("Today's date:", todayDate);

  for (const item of itemsDetailArray) {
    let borrowedCount = 0;
    let deployedCount = 0;

    console.log("\n🔍 Checking item:", item.itemName);

    borrowSnapshot.forEach(doc => {
      const borrowData = doc.data();

      const status = (borrowData.status || "").trim();
      const dateRequired = (borrowData.dateRequired || "").trim();

      if (!Array.isArray(borrowData.requestList)) {
        console.log("⚠️ requestList is missing or not an array:", borrowData);
        return;
      }

      borrowData.requestList.forEach(requestItem => {
        const requestItemName = (requestItem.itemName || "").trim();
        const requestQty = requestItem.quantity || 0;

        if (requestItemName === item.itemName) {
          if (status === "Borrowed" && dateRequired === todayDate) {
            borrowedCount += requestQty;
          }
          if (status === "Deployed" && dateRequired === todayDate) {
            deployedCount += requestQty;
          }
        }
      });
    });

    console.log(`✅ Total borrowed for ${item.itemName}: ${borrowedCount}`);
    console.log(`✅ Total deployed for ${item.itemName}: ${deployedCount}`);

    item.borrowedToday = borrowedCount;
    item.deployedToday = deployedCount;
  }
};

    const handleLabRoomScan = async (roomNumber) => {
        try {
            const labRoomItemsRef = collection(db, `labRoom/${roomNumber}/collection`);
            const snapshot = await getDocs(labRoomItemsRef);

            if (snapshot.empty) {
            Alert.alert("No Items Found", `No items found in ${roomNumber}.`);
            return;
            }

            let itemsDetails = `Items in ${roomNumber}:\n\n`;

            snapshot.forEach(doc => {
            const item = doc.data();
            itemsDetails += `• ${item.itemName} (Qty: ${item.quantity})\n`;
            });

            Alert.alert(`Lab Room: ${roomNumber}`, itemsDetails);

        } catch (error) {
            console.error("Error fetching labRoom items:", error);
            Alert.alert("Error", "Failed to load lab room items.");
        }
    };

    const handleItemScan = async ({ data }) => {
        if (scanned) return;

        setScanned(true);

        try {
            // Decrypt the scanned data
            const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedData) throw new Error("Invalid QR Code");

            const parsedData = JSON.parse(decryptedData);
            const { itemName } = parsedData;  // Now using itemName instead of itemId

            const todayDate = getTodayDate(); // Format as YYYY-MM-DD

            // Query the inventory to find the item by itemName
            const inventoryQuery = query(collection(db, "inventory"), where("itemName", "==", itemName));
            const querySnapshot = await getDocs(inventoryQuery);

            let foundItem = null;
            querySnapshot.forEach(docSnap => {
            const itemData = docSnap.data();
            if (itemData.itemName === itemName) {
                foundItem = itemData;
            }
            });

            if (foundItem) {
            // Now query the borrowCatalog to check how many times this item was borrowed today
            const borrowQuery = query(collection(db, "borrowcatalog"));
            const borrowSnapshot = await getDocs(borrowQuery);

            let borrowedCount = 0;

            borrowSnapshot.forEach(doc => {
            const borrowData = doc.data();
            
            console.log("BorrowDoc dateRequired:", borrowData.dateRequired, "status:", borrowData.status);
            
            if ((borrowData.status || "").trim() === "Borrowed" && (borrowData.dateRequired || "").trim() === todayDate) {
                borrowData.requestList.forEach(requestItem => {
                if ((requestItem.itemName || "").trim() === itemName) {
                    borrowedCount += requestItem.quantity || 0;
                }
                });
            }
            });

            console.log("Borrowed count:", borrowedCount);

            const detailMsg = `
                Item Name: ${foundItem.itemName}
                Item ID: ${foundItem.itemId}
                Category: ${foundItem.category}
                Department: ${foundItem.department}
                Quantity Available: ${foundItem.quantity}
                Location: ${foundItem.labRoom}
                Borrowed Today: ${borrowedCount} times
            `;

            Alert.alert("Item Details", detailMsg);

            } else {
            Alert.alert("Item Not Found", `Could not find the scanned item in the inventory.`); 
            }

        } catch (error) {
            console.error("QR Scan Error:", error);
            Alert.alert("Scan Failed", "Failed to read QR code. Make sure it's valid.");
        }

        setTimeout(() => setScanned(false), 1500);
    };

const { width, height } = Dimensions.get('window');
const frameWidth = width * 0.7;
const frameHeight = frameWidth; // square frame

const topOffset = (height - frameHeight) / 3;
const bottomOffset = height - topOffset - frameHeight;
const sideWidth = (width - frameWidth) / 2;


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButton} style={styles.backBtn}>
         <Icon name="keyboard-backspace" size={20} color="white" />
        <Text style={styles.text}>Go Back</Text>
      </TouchableOpacity>

            <Text style={[styles.scannerTitle,{bottom: bottomOffset-10}]}>Track Items</Text>

      <CameraView
        style={styles.camera}
        facing={cameraType}
        ref={cameraRef}
        barcodeScannerEnabled={true}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
<View style={styles.overlay}>
  <View style={[styles.maskTop, { height: topOffset }]} />
  <View style={[styles.maskBottom, { height: bottomOffset+35 }]} />
  <View style={[styles.maskLeft, { top: topOffset, height: frameHeight, width: sideWidth }]} />
  <View style={[styles.maskRight, { top: topOffset, height: frameHeight, width: sideWidth }]} />

  <View style={[styles.scannerFrame, { top: topOffset, width: frameWidth, height: frameHeight }]}>
    <View style={[styles.corner, styles.cornerTopLeft]} />
    <View style={[styles.corner, styles.cornerTopRight]} />
    <View style={[styles.corner, styles.cornerBottomLeft]} />
    <View style={[styles.corner, styles.cornerBottomRight]} />

    <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
  </View>
</View>





        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setCameraType((prev) => (prev === "back" ? "front" : "back"))}
          >
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
        </View>

        <ItemDetailsModal
          visible={detailsVisible}
          itemData={itemDetails}
          onClose={() => setDetailsVisible(false)}
        />

        <LabRoomDetailsModal
          visible={labModalVisible}
          roomId={labRoomId}
          items={labRoomItems}
          onClose={() => setLabModalVisible(false)}
        />

        <ShelfDetailsModal
          visible={shelfModal.visible}
          shelfId={shelfModal.shelfId}
          rows={shelfModal.rows}
          onClose={() => setShelfModal({ ...shelfModal, visible: false })}
        />

        <RowDetailsModal
          visible={rowModal.visible}
          rowId={rowModal.rowId}
          items={rowModal.items}
          onClose={() => setRowModal({ ...rowModal, visible: false })}
        />


      </CameraView>
    </View>
  );
};

export default CameraShowItems;
