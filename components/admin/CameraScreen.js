// VERSION 1
// import React, { useState, useEffect, useRef } from "react"; 
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js"; // 🔒 Import crypto-js for decryption
// import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import { useAuth } from '../contexts/AuthContext';
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraScreen = ({ onClose, selectedItem }) => {
//   const { user } = useAuth();
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();

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

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = (today.getMonth() + 1).toString().padStart(2, '0');
//     const day = today.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
//   };

//   const handleBackButton = () => {
//     onClose(); // Call onClose to reset the state and go back
//   };

//   const logRequestOrReturn = async (userId, userName, action) => {
//     try {
//       await addDoc(collection(db, `accounts/${userId}/activitylog`), {
//         action, // e.g., "Added a Capex Item", "Requested Items", etc.
//         userName,
//         timestamp: serverTimestamp(),
//       });

//     } catch (error) {
//       console.error("Error logging request or return activity:", error);
//     }
//   };

//   // const handleBarCodeScanned = async ({ data }) => {
//   //   if (scanned) return;

//   //   setScanned(true);

//   //   try {
//   //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//   //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//   //     if (!decryptedData) throw new Error("Invalid QR Code");

//   //     const parsedData = JSON.parse(decryptedData);
//   //     const { itemName } = parsedData;

//   //     const todayDate = getTodayDate();
//   //     const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
//   //     const querySnapshot = await getDocs(q);

//   //     let found = false;
//   //     let alreadyDeployed = false;
//   //     let invalidStatus = false;
//   //     const borrowedItemsDetails = [];

//   //     if (!querySnapshot.empty) {
//   //       for (const docSnap of querySnapshot.docs) {
//   //         const data = docSnap.data();
//   //         // const borrowedItem = data.requestList.find((item) => item.itemName === itemName);
//   //         const borrowedItem = data.requestList.find(
//   //           (item) =>
//   //             item.itemName === itemName &&
//   //             item.selectedItemId === selectedItem.selectedItemId &&
//   //             item.labRoom === selectedItem.labRoom &&
//   //             item.quantity === selectedItem.quantity &&
//   //             item.program === selectedItem.program
//   //         );

//   //         if (borrowedItem) {
//   //           found = true;
//   //           const currentStatus = data.status?.toLowerCase();

//   //           // if (currentStatus === "borrowed") {
//   //           //   const updatedRequestList = data.requestList.map((item) =>
//   //           //     item.itemName === itemName ? { ...item, status: "deployed" } : item
//   //           //   );

//   //           //   await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//   //           //     requestList: updatedRequestList,
//   //           //     status: "Deployed"
//   //           //   });

//   //           if (currentStatus === "borrowed") {
//   //             // const updatedRequestList = data.requestList.map((item) => {
//   //             //   if (item.itemName === itemName) {
//   //             //     const newCount = (item.scannedCount || 0) + 1;
//   //             //     return {
//   //             //       ...item,
//   //             //       // status: "deployed",
//   //             //       scannedCount: newCount
//   //             //     };
//   //             //   }
//   //             //   return item;
//   //             // });

//   //               const updatedRequestList = data.requestList.map((item) => {
//   //                 if (item.itemName === itemName) {
//   //                   const currentCount = item.scannedCount || 0;
//   //                   const maxCount = item.quantity || 1;

//   //                   // Only increment if under the allowed quantity
//   //                   if (currentCount < maxCount) {
//   //                     return {
//   //                       ...item,
//   //                       scannedCount: currentCount + 1,
//   //                     };
//   //                   } else {
//   //                     // Optional: Alert or handle over-scan here
//   //                     console.warn("Scan limit reached for", item.itemName);
//   //                     message.warning(`Maximum scans reached for "${item.itemName}".`);
//   //                     return item;
//   //                   }
//   //                 }
//   //                 return item;
//   //               }); 

//   //             // await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//   //             //   requestList: updatedRequestList,
//   //             //   status: "Deployed"
//   //             // });

//   //             const allDeployed = updatedRequestList.every(item => (item.scannedCount || 0) >= item.quantity); 

//   //             await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//   //               requestList: updatedRequestList,
//   //               ...(allDeployed && { status: "Deployed" })
//   //             });

//   //             borrowedItemsDetails.push({
//   //               borrower: data.userName || "Unknown",
//   //               borrowedDate: data.dateRequired,
//   //               timeFrom: data.timeFrom || "00:00",
//   //               timeTo: data.timeTo || "00:00"
//   //             });

//   //           } else if (currentStatus === "deployed") {
//   //             alreadyDeployed = true;

//   //           } else {
//   //             invalidStatus = true;
//   //           }
//   //         }
//   //       }

//   //       if (borrowedItemsDetails.length > 0) {
//   //         borrowedItemsDetails.sort((a, b) => {
//   //           const [aH, aM] = a.timeFrom.split(":").map(Number);
//   //           const [bH, bM] = b.timeFrom.split(":").map(Number);
//   //           return aH * 60 + aM - (bH * 60 + bM);
//   //         });

//   //         let detailsMessage = `Item: ${itemName}\n\n`;
//   //         borrowedItemsDetails.forEach((detail) => {
//   //           detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
//   //         });

//   //         Alert.alert("Item Deployed", detailsMessage);

//   //         const firstDetail = borrowedItemsDetails[0];
//   //         await logRequestOrReturn(
//   //           user.id,
//   //           user.name || "Unknown",
//   //           `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom}`
//   //         );

//   //         const requestorUserId = data.accountId;

//   //         console.log("Request Data:", requestData);

//   //         if (requestorUserId) {
//   //            console.log("Attempting to write to historylog for:", requestorUserId);
//   //          await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), {
//   //             ...data,
//   //             action: "Deployed",
//   //             date: getTodayDate(),
//   //           });
//   //         } else {
//   //           console.warn("accountId not found in request data");
//   //         }

//   //       } else if (alreadyDeployed) {
//   //         Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);

//   //       } else if (invalidStatus) {
//   //         Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);
          
//   //       } else if (!found) {
//   //         Alert.alert("Item not found", "No records found for this item on today's date.");

//   //       }

//   //     } else {
//   //       Alert.alert("No data found", "No records found for today in the borrow catalog.");
//   //     }
      
//   //   } catch (error) {
//   //     // Alert.alert("Error", "Invalid or unauthorized QR Code.");
//   //   }

//   //   setTimeout(() => setScanned(false), 1500);
//   // };

//   // const handleBarCodeScanned = async ({ data }) => {
//   //   if (scanned) return;

//   //   setScanned(true);

//   //   try {
//   //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//   //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//   //     if (!decryptedData) throw new Error("Invalid QR Code");

//   //     const parsedData = JSON.parse(decryptedData);
//   //     const { itemName } = parsedData;

//   //     const todayDate = getTodayDate();
//   //     const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
//   //     const querySnapshot = await getDocs(q);

//   //     let found = false;
//   //     let alreadyDeployed = false;
//   //     let invalidStatus = false;
//   //     const borrowedItemsDetails = [];

//   //     let requestorUserId = null;
//   //     let requestorLogData = null;

//   //     if (!querySnapshot.empty) {
//   //       for (const docSnap of querySnapshot.docs) {
//   //         const data = docSnap.data();
//   //         const borrowedItem = data.requestList.find(
//   //           (item) =>
//   //             item.itemName === itemName &&
//   //             item.selectedItemId === selectedItem.selectedItemId &&
//   //             item.labRoom === selectedItem.labRoom &&
//   //             item.quantity === selectedItem.quantity &&
//   //             item.program === selectedItem.program
//   //         );

//   //         if (borrowedItem) {
//   //           found = true;
//   //           const currentStatus = data.status?.toLowerCase();

//   //           if (currentStatus === "borrowed") {
//   //             const updatedRequestList = data.requestList.map((item) => {
//   //               if (item.itemName === itemName) {
//   //                 const currentCount = item.scannedCount || 0;
//   //                 const maxCount = item.quantity || 1;

//   //                 if (currentCount < maxCount) {
//   //                   return {
//   //                     ...item,
//   //                     scannedCount: currentCount + 1,
//   //                   };
//   //                 } else {
//   //                   console.warn("Scan limit reached for", item.itemName);
//   //                   message.warning(`Maximum scans reached for "${item.itemName}".`);
//   //                   return item;
//   //                 }
//   //               }
//   //               return item;
//   //             });

//   //             const allDeployed = updatedRequestList.every(item => (item.scannedCount || 0) >= item.quantity); 

//   //             await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//   //               requestList: updatedRequestList,
//   //               ...(allDeployed && { status: "Deployed" })
//   //             });

//   //             borrowedItemsDetails.push({
//   //               borrower: data.userName || "Unknown",
//   //               borrowedDate: data.dateRequired,
//   //               timeFrom: data.timeFrom || "00:00",
//   //               timeTo: data.timeTo || "00:00"
//   //             });

//   //             // Store user ID and log data for later historylog write
//   //             requestorUserId = data.accountId;
//   //             requestorLogData = {
//   //               ...data,
//   //               action: "Deployed",
//   //               deployedBy: user.name || "Unknown",
//   //               deployedById: user.id,
//   //               deployedAt: getTodayDate(),
//   //               timestamp: serverTimestamp()
//   //             };

//   //           } else if (currentStatus === "deployed") {
//   //             alreadyDeployed = true;
//   //           } else {
//   //             invalidStatus = true;
//   //           }
//   //         }
//   //       }

//   //       if (borrowedItemsDetails.length > 0) {
//   //         borrowedItemsDetails.sort((a, b) => {
//   //           const [aH, aM] = a.timeFrom.split(":").map(Number);
//   //           const [bH, bM] = b.timeFrom.split(":").map(Number);
//   //           return aH * 60 + aM - (bH * 60 + bM);
//   //         });

//   //         let detailsMessage = `Item: ${itemName}\n\n`;
//   //         borrowedItemsDetails.forEach((detail) => {
//   //           detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
//   //         });

//   //         Alert.alert("Item Deployed", detailsMessage);

//   //         const firstDetail = borrowedItemsDetails[0];
//   //         await logRequestOrReturn(
//   //           user.id,
//   //           user.name || "Unknown",
//   //           `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom}`
//   //         );

//   //         // if (requestorUserId && requestorLogData) {
//   //         //   try {
//   //         //     console.log("Writing to historylog for:", requestorUserId);
//   //         //     await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), requestorLogData);
              
//   //         //   } catch (error) {
//   //         //     console.error("Failed to write to historylog:", error);
//   //         //   }

//   //         // } else {
//   //         //   console.warn("Missing requestorUserId or log data.");
//   //         // }

//   //         if (allDeployed && requestorUserId && requestorLogData) {
//   //           try {
//   //             console.log("Writing to historylog for:", requestorUserId);
//   //             await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), requestorLogData);

//   //           } catch (error) {
//   //             console.error("Failed to write to historylog:", error);
//   //           }
//   //         }

//   //       } else if (alreadyDeployed) {
//   //         Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);

//   //       } else if (invalidStatus) {
//   //         Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);

//   //       } else if (!found) {
//   //         Alert.alert("Item not found", "No records found for this item on today's date.");
//   //       }

//   //     } else {
//   //       Alert.alert("No data found", "No records found for today in the borrow catalog.");
//   //     }

//   //   } catch (error) {
//   //     console.error("QR Scan Error:", error);
//   //     // Alert.alert("Error", "Invalid or unauthorized QR Code.");
//   //   }

//   //   setTimeout(() => setScanned(false), 1500);
//   // };

//   // const handleBarCodeScanned = async ({ data }) => {
//   //   if (scanned) return;

//   //   setScanned(true);

//   //   try {
//   //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//   //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//   //     if (!decryptedData) throw new Error("Invalid QR Code");

//   //     const parsedData = JSON.parse(decryptedData);
//   //     const { itemName } = parsedData;

//   //     const todayDate = getTodayDate();
//   //     const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
//   //     const querySnapshot = await getDocs(q);

//   //     let found = false;
//   //     let alreadyDeployed = false;
//   //     let invalidStatus = false;
//   //     const borrowedItemsDetails = [];

//   //     let requestorUserId = null;
//   //     let requestorLogData = null;
//   //     let allDeployed = false; // ✅ Moved outside the loop
//   //     let updatedRequestList = null; // Declare in outer scope

//   //     if (!querySnapshot.empty) {
//   //       for (const docSnap of querySnapshot.docs) {
//   //         const data = docSnap.data();
//   //         const borrowedItem = data.requestList.find(
//   //           (item) =>
//   //             item.itemName === itemName &&
//   //             item.selectedItemId === selectedItem.selectedItemId &&
//   //             item.labRoom === selectedItem.labRoom &&
//   //             item.quantity === selectedItem.quantity &&
//   //             item.program === selectedItem.program
//   //         );

//   //         if (borrowedItem) {
//   //           found = true;
//   //           const currentStatus = data.status?.toLowerCase();

//   //           if (currentStatus === "borrowed") {
//   //               updatedRequestList = data.requestList.map((item) => {
//   //               if (item.itemName === itemName) {
//   //                 const currentCount = item.scannedCount || 0;
//   //                 const maxCount = item.quantity || 1;

//   //                 if (currentCount < maxCount) {
//   //                   return {
//   //                     ...item,
//   //                     scannedCount: currentCount + 1,
//   //                   };

//   //                 } else {
//   //                   console.warn("Scan limit reached for", item.itemName);
//   //                   message.warning(`Maximum scans reached for "${item.itemName}".`);
//   //                   return item;
//   //                 }
//   //               }
//   //               return item;
//   //             });

//   //             allDeployed = updatedRequestList.every(item => (item.scannedCount || 0) >= item.quantity);

//   //             await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//   //               requestList: updatedRequestList,
//   //               ...(allDeployed && { status: "Deployed" })
//   //             });

//   //             borrowedItemsDetails.push({
//   //               borrower: data.userName || "Unknown",
//   //               borrowedDate: data.dateRequired,
//   //               timeFrom: data.timeFrom || "00:00",
//   //               timeTo: data.timeTo || "00:00"
//   //             });

//   //             // Store user ID and log data for later historylog write
//   //             requestorUserId = data.accountId;
//   //             requestorLogData = {
//   //               ...data,
//   //               action: "Deployed",
//   //               deployedBy: user.name || "Unknown",
//   //               deployedById: user.id,
//   //               deployedAt: getTodayDate(),
//   //               timestamp: serverTimestamp()
//   //             };

//   //           } else if (currentStatus === "deployed") {
//   //             alreadyDeployed = true;

//   //           } else {
//   //             invalidStatus = true;
//   //           }
//   //         }
//   //       }

//   //       if (borrowedItemsDetails.length > 0) {
//   //         borrowedItemsDetails.sort((a, b) => {
//   //           const [aH, aM] = a.timeFrom.split(":").map(Number);
//   //           const [bH, bM] = b.timeFrom.split(":").map(Number);
//   //           return aH * 60 + aM - (bH * 60 + bM);
//   //         });

//   //         let detailsMessage = `Item: ${itemName}\n\n`;
//   //         borrowedItemsDetails.forEach((detail) => {
//   //           detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
//   //         });

//   //         Alert.alert("Item Deployed", detailsMessage);

//   //         const firstDetail = borrowedItemsDetails[0];
//   //         // await logRequestOrReturn(
//   //         //   user.id,
//   //         //   user.name || "Unknown",
//   //         //   `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom}`
//   //         // );

//   //         const updatedScannedItem = updatedRequestList.find(
//   //           (item) => item.itemName === itemName && item.selectedItemId === selectedItem.selectedItemId
//   //         );

//   //         const scannedCount = updatedScannedItem?.scannedCount || 0;

//   //         console.log("Scanned count after update:", scannedCount);

//   //         await logRequestOrReturn(
//   //           user.id,
//   //           user.name || "Unknown",
//   //           `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom} (Scanned: ${scannedCount})`
//   //         );

//   //         if (allDeployed && requestorUserId && requestorLogData) {
//   //           try {
//   //             console.log("Writing to historylog for:", requestorUserId);
//   //             await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), requestorLogData);

//   //           } catch (error) {
//   //             console.error("Failed to write to historylog:", error);
//   //           }

//   //         } else {
//   //           console.warn("Missing requestorUserId or log data.");
//   //         }

//   //         // 🔄 Update userrequestlog status to 'Deployed'
//   //         try {
//   //           const userRequestQuery = query(
//   //             collection(db, `accounts/${requestorUserId}/userrequestlog`),
//   //             where("dateRequired", "==", getTodayDate())
//   //           );

//   //           const userRequestSnapshot = await getDocs(userRequestQuery);

//   //           userRequestSnapshot.forEach(async (docSnap) => {
//   //             const docData = docSnap.data();
//   //             const hasMatchingItem = docData.requestList?.some(item => item.itemName === itemName);

//   //             if (hasMatchingItem) {
//   //               await updateDoc(doc(db, `accounts/${requestorUserId}/userrequestlog`, docSnap.id), {
//   //                 status: "Deployed"
//   //               });

//   //               console.log("✅ userrequestlog status updated to 'Deployed'");
//   //             }
//   //           });
            
//   //         } catch (err) {
//   //           console.error("❌ Failed to update userrequestlog:", err);
//   //         }

//   //       } else if (alreadyDeployed) {
//   //         Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);

//   //       } else if (invalidStatus) {
//   //         Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);

//   //       } else if (!found) {
//   //         Alert.alert("Item not found", "No records found for this item on today's date.");
//   //       }

//   //     } else {
//   //       Alert.alert("No data found", "No records found for today in the borrow catalog.");
//   //     }

//   //   } catch (error) {
//   //     console.error("QR Scan Error:", error);
//   //     // Alert.alert("Error", "Invalid or unauthorized QR Code.");
//   //   }

//   //   setTimeout(() => setScanned(false), 1500);
//   // };

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;

//     setScanned(true);

//     try {
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//       if (!decryptedData) throw new Error("Invalid QR Code");

//       const parsedData = JSON.parse(decryptedData);
//       const { itemName } = parsedData;

//       const todayDate = getTodayDate();
//       const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
//       const querySnapshot = await getDocs(q);

//       let found = false;
//       let alreadyDeployed = false;
//       let invalidStatus = false;
//       const borrowedItemsDetails = [];

//       let requestorUserId = null;
//       let requestorLogData = null;
//       let allDeployed = false;
//       let updatedRequestList = null;

//       if (!querySnapshot.empty) {
//         for (const docSnap of querySnapshot.docs) {
//           const data = docSnap.data();
//           const borrowedItem = data.requestList.find(
//             (item) =>
//               item.itemName === itemName &&
//               item.selectedItemId === selectedItem.selectedItemId &&
//               item.labRoom === selectedItem.labRoom &&
//               item.quantity === selectedItem.quantity &&
//               item.program === selectedItem.program
//           );

//           if (borrowedItem) {
//             found = true;
//             const currentStatus = data.status?.toLowerCase();

//             if (currentStatus === "borrowed") {
//               updatedRequestList = data.requestList.map((item) => {
//                 if (item.itemName === itemName) {
//                   const currentCount = item.scannedCount || 0;
//                   const maxCount = item.quantity || 1;

//                   if (currentCount < maxCount) {
//                     return {
//                       ...item,
//                       scannedCount: currentCount + 1,
//                     };

//                   } else {
//                     console.warn("Scan limit reached for", item.itemName);
//                     message.warning(`Maximum scans reached for "${item.itemName}".`);
//                     return item;
//                   }
//                 }
//                 return item;
//               });

//               allDeployed = updatedRequestList.every(item => (item.scannedCount || 0) >= item.quantity);

//               await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
//                 requestList: updatedRequestList,
//                 ...(allDeployed && { status: "Deployed" })
//               });

//               borrowedItemsDetails.push({
//                 borrower: data.userName || "Unknown",
//                 borrowedDate: data.dateRequired,
//                 timeFrom: data.timeFrom || "00:00",
//                 timeTo: data.timeTo || "00:00"
//               });

//               requestorUserId = data.accountId;
//               requestorLogData = {
//                 ...data,
//                 action: "Deployed",
//                 deployedBy: user.name || "Unknown",
//                 deployedById: user.id,
//                 deployedAt: getTodayDate(),
//                 timestamp: serverTimestamp()
//               };

//             } else if (currentStatus === "deployed") {
//               alreadyDeployed = true;

//             } else if (currentStatus === "returned") {
//               // ✅ Handle return approval
//               const requestorId = data.accountId;
//               const borrowDocRef = doc(db, "borrowcatalog", docSnap.id);

//               const inventoryId = borrowedItem.selectedItemId;
//               const returnQty = borrowedItem.returnedQuantity || 1; // ✅ SAFER

//               if (inventoryId && !isNaN(returnQty)) {
//                 const inventoryRef = doc(db, "inventory", inventoryId);
//                 const inventorySnap = await getDoc(inventoryRef);

//                 if (inventorySnap.exists()) {
//                   const currentQty = inventorySnap.data().quantity || 0;
//                   await updateDoc(inventoryRef, {
//                     quantity: currentQty + returnQty,
//                   });

//                   console.log(`✅ Inventory updated. Returned ${returnQty} of ${itemName}.`);

//                 } else {
//                   console.warn(`❌ Inventory item not found for ID: ${inventoryId}`);
//                 }
//               }
              
//               await updateDoc(borrowDocRef, { status: "Return Approved" });

//               const userRequestQuery = query(
//                 collection(db, `accounts/${requestorId}/userrequestlog`),
//                 where("dateRequired", "==", data.dateRequired)
//               );

//               const userRequestSnapshot = await getDocs(userRequestQuery);

//               for (const userDoc of userRequestSnapshot.docs) {
//                 const userData = userDoc.data();
//                 const hasMatchingItem = userData.requestList?.some(item => item.itemName === itemName);

//                 if (hasMatchingItem) {
//                   await updateDoc(doc(db, `accounts/${requestorId}/userrequestlog`, userDoc.id), {
//                     status: "Return Approved"
//                   });

//                   await addDoc(collection(db, `accounts/${requestorId}/historylog`), {
//                     ...userData,
//                     action: "Return Approved",
//                     approvedBy: user.name || "Unknown",
//                     approvedById: user.id,
//                     approvedAt: getTodayDate(),
//                     timestamp: serverTimestamp()
//                   });

//                   Alert.alert("Return Approved", `Return of "${itemName}" approved.`);
//                   break;
//                 }
//               }

//               return; // ✅ Exit early to skip rest of the deployment logic

//             } else {
//               invalidStatus = true;
//             }
//           }
//         }

//         if (borrowedItemsDetails.length > 0) {
//           borrowedItemsDetails.sort((a, b) => {
//             const [aH, aM] = a.timeFrom.split(":").map(Number);
//             const [bH, bM] = b.timeFrom.split(":").map(Number);
//             return aH * 60 + aM - (bH * 60 + bM);
//           });

//           let detailsMessage = `Item: ${itemName}\n\n`;
//           borrowedItemsDetails.forEach((detail) => {
//             detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
//           });

//           Alert.alert("Item Deployed", detailsMessage);

//           const firstDetail = borrowedItemsDetails[0];

//           const updatedScannedItem = updatedRequestList.find(
//             (item) => item.itemName === itemName && item.selectedItemId === selectedItem.selectedItemId
//           );

//           const scannedCount = updatedScannedItem?.scannedCount || 0;

//           console.log("Scanned count after update:", scannedCount);

//           await logRequestOrReturn(
//             user.id,
//             user.name || "Unknown",
//             `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom} (Scanned: ${scannedCount})`
//           );

//           if (allDeployed && requestorUserId && requestorLogData) {
//             try {
//               console.log("Writing to historylog for:", requestorUserId);
//               await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), requestorLogData);

//             } catch (error) {
//               console.error("Failed to write to historylog:", error);
//             }

//           } else {
//             console.warn("Missing requestorUserId or log data.");
//           }

//           try {
//             const userRequestQuery = query(
//               collection(db, `accounts/${requestorUserId}/userrequestlog`),
//               where("dateRequired", "==", getTodayDate())
//             );

//             const userRequestSnapshot = await getDocs(userRequestQuery);

//             userRequestSnapshot.forEach(async (docSnap) => {
//               const docData = docSnap.data();
//               const hasMatchingItem = docData.requestList?.some(item => item.itemName === itemName);

//               if (hasMatchingItem) {
//                 await updateDoc(doc(db, `accounts/${requestorUserId}/userrequestlog`, docSnap.id), {
//                   status: "Deployed"
//                 });

//                 console.log("✅ userrequestlog status updated to 'Deployed'");
//               }
//             });
            
//           } catch (err) {
//             console.error("❌ Failed to update userrequestlog:", err);
//           }          

//         } else if (alreadyDeployed) {
//           Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);

//         } else if (invalidStatus) {
//           Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);

//         } else if (!found) {
//           Alert.alert("Item not found", "No records found for this item on today's date.");
//         }

//       } else {
//         Alert.alert("No data found", "No records found for today in the borrow catalog.");
//       }

//     } catch (error) {
//       console.error("QR Scan Error:", error);
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//   return (
//     <View style={styles.container}>
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
//       </CameraView>
//     </View>
//   );
// };

// export default CameraScreen;


// VERSION 2
import React, { useState, useEffect, useRef } from "react"; 
import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from "expo-camera";
import CryptoJS from "crypto-js"; // 🔒 Import crypto-js for decryption
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";
import { useAuth } from '../contexts/AuthContext';
import styles from "../styles/adminStyle/CameraStyle";
import CONFIG from "../config";

const { width, height } = Dimensions.get("window");
const frameSize = width * 0.7;
const SECRET_KEY = CONFIG.SECRET_KEY;

const CameraScreen = ({ onClose, selectedItem }) => {
  const { user } = useAuth();
  const [cameraType, setCameraType] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) {
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
    onClose(); // Call onClose to reset the state and go back
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

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) throw new Error("Invalid QR Code");

      const parsedData = JSON.parse(decryptedData);
      const { itemName } = parsedData;

      const todayDate = getTodayDate();
      const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
      const querySnapshot = await getDocs(q);

      let found = false;
      let alreadyDeployed = false;
      let invalidStatus = false;
      const borrowedItemsDetails = [];

      let requestorUserId = null;
      let requestorLogData = null;
      let allDeployed = false;
      let updatedRequestList = null;

      if (!querySnapshot.empty) {
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const borrowedItem = data.requestList.find(
            (item) =>
              item.itemName === itemName &&
              item.selectedItemId === selectedItem.selectedItemId &&
              item.labRoom === selectedItem.labRoom &&
              item.quantity === selectedItem.quantity &&
              item.program === selectedItem.program
          );

          if (borrowedItem) {
            found = true;
            const currentStatus = data.status?.toLowerCase();

            if (currentStatus === "borrowed") {
              updatedRequestList = data.requestList.map((item) => {
                if (item.itemName === itemName) {
                  const currentCount = item.scannedCount || 0;
                  const maxCount = item.quantity || 1;

                  if (currentCount < maxCount) {
                    return {
                      ...item,
                      scannedCount: currentCount + 1,
                    };

                  } else {
                    console.warn("Scan limit reached for", item.itemName);
                    message.warning(`Maximum scans reached for "${item.itemName}".`);
                    return item;
                  }
                }
                return item;
              });

              allDeployed = updatedRequestList.every(item => (item.scannedCount || 0) >= item.quantity);

              await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
                requestList: updatedRequestList,
                ...(allDeployed && { status: "Deployed" })
              });

              borrowedItemsDetails.push({
                borrower: data.userName || "Unknown",
                borrowedDate: data.dateRequired,
                timeFrom: data.timeFrom || "00:00",
                timeTo: data.timeTo || "00:00"
              });

              requestorUserId = data.accountId;
              requestorLogData = {
                ...data,
                action: "Deployed",
                deployedBy: user.name || "Unknown",
                deployedById: user.id,
                deployedAt: getTodayDate(),
                timestamp: serverTimestamp()
              };

            } else if (currentStatus === "deployed") {
              alreadyDeployed = true;

            } else if (currentStatus === "returned") {
              // ✅ Handle return approval
              const requestorId = data.accountId;
              const borrowDocRef = doc(db, "borrowcatalog", docSnap.id);

              const inventoryId = borrowedItem.selectedItemId;
              const returnQty = borrowedItem.returnedQuantity || 1; // ✅ SAFER

              if (inventoryId && !isNaN(returnQty)) {
                const inventoryRef = doc(db, "inventory", inventoryId);
                const inventorySnap = await getDoc(inventoryRef);

                if (inventorySnap.exists()) {
                  const currentQty = inventorySnap.data().quantity || 0;
                  await updateDoc(inventoryRef, {
                    quantity: currentQty + returnQty,
                  });

                  console.log(`✅ Inventory updated. Returned ${returnQty} of ${itemName}.`);

                  const labRoomId = inventorySnap.data().labRoom; // assuming labRoom stored in inventory doc
                  const itemId = inventorySnap.data().itemId;

                  if (labRoomId && itemId) {
                    const labRoomItemRef = doc(db, "labRoom", labRoomId, "items", itemId);
                    const labRoomItemSnap = await getDoc(labRoomItemRef);

                    if (labRoomItemSnap.exists()) {
                      const currentLabQty = Number(labRoomItemSnap.data().quantity || 0);
                      const newLabQty = currentLabQty + returnQty;

                      await updateDoc(labRoomItemRef, {
                        quantity: newLabQty,
                      });

                      console.log(`🏫 LabRoom item updated: ${currentLabQty} → ${newLabQty} for itemId ${itemId} in labRoom ${labRoomId}`);

                    } else {
                      console.warn(`⚠️ LabRoom item not found for itemId ${itemId} in labRoom ${labRoomId}`);
                    }

                  } else {
                    console.warn(`⚠️ Missing labRoomId or itemId for inventoryId ${inventoryId}`);
                  }

                } else {
                  console.warn(`❌ Inventory item not found for ID: ${inventoryId}`);
                }
              }
              
              await updateDoc(borrowDocRef, { status: "Return Approved" });

              const userRequestQuery = query(
                collection(db, `accounts/${requestorId}/userrequestlog`),
                where("dateRequired", "==", data.dateRequired)
              );

              const userRequestSnapshot = await getDocs(userRequestQuery);

              for (const userDoc of userRequestSnapshot.docs) {
                const userData = userDoc.data();
                const hasMatchingItem = userData.requestList?.some(item => item.itemName === itemName);

                if (hasMatchingItem) {
                  await updateDoc(doc(db, `accounts/${requestorId}/userrequestlog`, userDoc.id), {
                    status: "Return Approved"
                  });

                  await addDoc(collection(db, `accounts/${requestorId}/historylog`), {
                    ...userData,
                    action: "Return Approved",
                    approvedBy: user.name || "Unknown",
                    approvedById: user.id,
                    approvedAt: getTodayDate(),
                    timestamp: serverTimestamp()
                  });

                  Alert.alert("Return Approved", `Return of "${itemName}" approved.`);
                  break;
                }
              }

              return; 

            } else {
              invalidStatus = true;
            }
          }
        }

        if (borrowedItemsDetails.length > 0) {
          borrowedItemsDetails.sort((a, b) => {
            const [aH, aM] = a.timeFrom.split(":").map(Number);
            const [bH, bM] = b.timeFrom.split(":").map(Number);
            return aH * 60 + aM - (bH * 60 + bM);
          });

          let detailsMessage = `Item: ${itemName}\n\n`;
          borrowedItemsDetails.forEach((detail) => {
            detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
          });

          Alert.alert("Item Deployed", detailsMessage);

          const firstDetail = borrowedItemsDetails[0];

          const updatedScannedItem = updatedRequestList.find(
            (item) => item.itemName === itemName && item.selectedItemId === selectedItem.selectedItemId
          );

          const scannedCount = updatedScannedItem?.scannedCount || 0;

          console.log("Scanned count after update:", scannedCount);

          await logRequestOrReturn(
            user.id,
            user.name || "Unknown",
            `Deployed "${itemName}" to ${firstDetail.borrower} in ${selectedItem.labRoom} (Scanned: ${scannedCount})`
          );

          if (allDeployed && requestorUserId && requestorLogData) {
            try {
              console.log("Writing to historylog for:", requestorUserId);
              await addDoc(collection(db, `accounts/${requestorUserId}/historylog`), requestorLogData);

            } catch (error) {
              console.error("Failed to write to historylog:", error);
            }

          } else {
            console.warn("Missing requestorUserId or log data.");
          }

          try {
            const userRequestQuery = query(
              collection(db, `accounts/${requestorUserId}/userrequestlog`),
              where("dateRequired", "==", getTodayDate())
            );

            const userRequestSnapshot = await getDocs(userRequestQuery);

            userRequestSnapshot.forEach(async (docSnap) => {
              const docData = docSnap.data();
              const hasMatchingItem = docData.requestList?.some(item => item.itemName === itemName);

              if (hasMatchingItem) {
                await updateDoc(doc(db, `accounts/${requestorUserId}/userrequestlog`, docSnap.id), {
                  status: "Deployed"
                });

                console.log("✅ userrequestlog status updated to 'Deployed'");
              }
            });
            
          } catch (err) {
            console.error("❌ Failed to update userrequestlog:", err);
          }          

        } else if (alreadyDeployed) {
          Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);

        } else if (invalidStatus) {
          Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);

        } else if (!found) {
          Alert.alert("Item not found", "No records found for this item on today's date.");
        }

      } else {
        Alert.alert("No data found", "No records found for today in the borrow catalog.");
      }

    } catch (error) {
      console.error("QR Scan Error:", error);
    }

    setTimeout(() => setScanned(false), 1500);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButton}>
        <Text style={styles.text}>Go Back</Text>
      </TouchableOpacity>
      
      <CameraView
        style={styles.camera}
        facing={cameraType}
        ref={cameraRef}
        barcodeScannerEnabled={true}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.maskTop} />
          <View style={styles.maskBottom} />
          <View style={[styles.maskLeft, { top: (height - frameSize) / 2, height: frameSize }]} />
          <View style={[styles.maskRight, { top: (height - frameSize) / 2, height: frameSize }]} />

          <View style={styles.scannerFrame}>
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
      </CameraView>
    </View>
  );
};

export default CameraScreen;
