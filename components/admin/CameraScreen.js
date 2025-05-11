// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import CryptoJS from "crypto-js"; // 🔒 Import crypto-js for decryption
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig"; // Import your Firebase config
// import styles from "../styles/adminStyle/CameraStyle";
// import CONFIG from "../config";

// const { width, height } = Dimensions.get("window");
// const frameSize = width * 0.7;
// const SECRET_KEY = CONFIG.SECRET_KEY;

// const CameraScreen = ({ navigation }) => {
//   const [cameraType, setCameraType] = useState("back");
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const scanLinePosition = useRef(new Animated.Value(0)).current;

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

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;

//     setScanned(true);

//     try {
//       // 🔓 Decrypt QR Code Data
//       const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
//       const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//       if (!decryptedData) {
//         throw new Error("Invalid QR Code");
//       }

//       const parsedData = JSON.parse(decryptedData);
//       const { itemName } = parsedData; // Extract itemName from QR code

//       // Query Firestore to find all records where the item was borrowed
//       const q = query(collection(db, "borrowcatalog"));

//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const borrowedItemsDetails = [];

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
          
//           // Check if the item exists in the request list
//           const borrowedItem = data.requestList.find(
//             (item) => item.itemName === itemName
//           );

//           if (borrowedItem) {
//             const borrower = data.userName || "Unknown"; // Assuming userName is the borrower name
//             const borrowedDate = data.dateRequired;
            
//             // Extract time from the top level (not inside requestList)
//             const timeFrom = data.timeFrom || "N/A";
//             const timeTo = data.timeTo || "N/A";

//             borrowedItemsDetails.push({
//               borrower,
//               borrowedDate,
//               timeFrom,
//               timeTo
//             });
//           }
//         });

//         if (borrowedItemsDetails.length > 0) {
//           let detailsMessage = `Item: ${itemName}\n\n`;

//           borrowedItemsDetails.forEach((detail, index) => {
//             detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
//           });

//           Alert.alert("Item Borrowed", detailsMessage);
//         } else {
//           Alert.alert("Item not found", "No records found for this item.");
//         }
//       } else {
//         Alert.alert("No data found", "No records in the borrow catalog.");
//       }

//     } catch (error) {
//       Alert.alert("Error", "Invalid or unauthorized QR Code.");
//     }

//     setTimeout(() => setScanned(false), 1500);
//   };

//   return (
//     <View style={styles.container}>
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

import React, { useState, useEffect, useRef } from "react"; 
import { View, Text, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from "expo-camera";
import CryptoJS from "crypto-js"; // 🔒 Import crypto-js for decryption
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";
import styles from "../styles/adminStyle/CameraStyle";
import CONFIG from "../config";

const { width, height } = Dimensions.get("window");
const frameSize = width * 0.7;
const SECRET_KEY = CONFIG.SECRET_KEY;

const CameraScreen = ({ onClose }) => {
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

  // const handleBarCodeScanned = async ({ data }) => {
  //   if (scanned) return;

  //   setScanned(true);

  //   try {
  //     // 🔓 Decrypt QR Code Data
  //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  //     if (!decryptedData) {
  //       throw new Error("Invalid QR Code");
  //     }

  //     const parsedData = JSON.parse(decryptedData);
  //     const { itemName } = parsedData; // Extract itemName from QR code

  //     // Get today's date to filter the borrow catalog
  //     const todayDate = getTodayDate();

  //     // Query Firestore to find all records where the item was borrowed today
  //     const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));

  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       const borrowedItemsDetails = [];

  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data();

  //         // Check if the item exists in the request list
  //         const borrowedItem = data.requestList.find(
  //           (item) => item.itemName === itemName
  //         );

  //         // if (borrowedItem) {
  //         //   const borrower = data.userName || "Unknown"; // Assuming userName is the borrower name
  //         //   const borrowedDate = data.dateRequired;

  //         //   // Extract time from the top level (not inside requestList)
  //         //   const timeFrom = data.timeFrom || "00:00";
  //         //   const timeTo = data.timeTo || "00:00";

  //         //   borrowedItemsDetails.push({
  //         //     borrower,
  //         //     borrowedDate,
  //         //     timeFrom,
  //         //     timeTo
  //         //   });
  //         // }

  //         if (borrowedItem) {
  //           const borrower = data.userName || "Unknown";
  //           const borrowedDate = data.dateRequired;
  //           const timeFrom = data.timeFrom || "00:00";
  //           const timeTo = data.timeTo || "00:00";

  //           // ✅ Update the item status to "deployed"
  //           const updatedRequestList = data.requestList.map((item) =>
  //             item.itemName === itemName ? { ...item, status: "deployed" } : item
  //           );

  //           // Update the document in Firestore
  //           await updateDoc(doc(db, "borrowcatalog", doc.id), {
  //             requestList: updatedRequestList
  //           });

  //           borrowedItemsDetails.push({
  //             borrower,
  //             borrowedDate,
  //             timeFrom,
  //             timeTo
  //           });
  //         }
  //       });

  //       if (borrowedItemsDetails.length > 0) {
  //         // Sort borrowed items by timeFrom
  //         borrowedItemsDetails.sort((a, b) => {
  //           const [aHours, aMinutes] = a.timeFrom.split(":").map(Number);
  //           const [bHours, bMinutes] = b.timeFrom.split(":").map(Number);

  //           const aTotalMinutes = aHours * 60 + aMinutes;
  //           const bTotalMinutes = bHours * 60 + bMinutes;

  //           return aTotalMinutes - bTotalMinutes; // Sort ascending
  //         });

  //         let detailsMessage = `Item: ${itemName}\n\n`;

  //         borrowedItemsDetails.forEach((detail) => {
  //           detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
  //         });

  //         Alert.alert("Item Borrowed Today", detailsMessage);

  //       } else {
  //         Alert.alert("Item not found", "No records found for this item on today's date.");
  //       }
        
  //     } else {
  //       Alert.alert("No data found", "No records found for today in the borrow catalog.");
  //     }

  //   } catch (error) {
  //     Alert.alert("Error", "Invalid or unauthorized QR Code.");
  //   }

  //   setTimeout(() => setScanned(false), 1500);
  // };

  // const handleBarCodeScanned = async ({ data }) => {
  //   if (scanned) return;

  //   setScanned(true);

  //   try {
  //     // 🔓 Decrypt QR Code Data
  //     const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  //     if (!decryptedData) {
  //       throw new Error("Invalid QR Code");
  //     }

  //     const parsedData = JSON.parse(decryptedData);
  //     const { itemName } = parsedData; // Extract itemName from QR code

  //     // Get today's date to filter the borrow catalog
  //     const todayDate = getTodayDate();

  //     // Query Firestore to find all records where the item was borrowed today
  //     const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));

  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       const borrowedItemsDetails = [];

  //       for (const docSnap of querySnapshot.docs) {
  //         const data = docSnap.data();

  //         // Check if the item exists in the request list
  //         const borrowedItem = data.requestList.find(
  //           (item) => item.itemName === itemName
  //         );

  //         if (borrowedItem) {
  //           const borrower = data.userName || "Unknown";
  //           const borrowedDate = data.dateRequired;
  //           const timeFrom = data.timeFrom || "00:00";
  //           const timeTo = data.timeTo || "00:00";

  //           // ✅ Update the item status to "deployed"
  //           const updatedRequestList = data.requestList.map((item) =>
  //             item.itemName === itemName ? { ...item, status: "deployed" } : item
  //           );

  //           // Update the document in Firestore
  //           await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
  //             requestList: updatedRequestList,
  //             status: "Deployed" // update root-level status
  //           });

  //           borrowedItemsDetails.push({
  //             borrower,
  //             borrowedDate,
  //             timeFrom,
  //             timeTo
  //           });
  //         }
  //       }

  //       if (borrowedItemsDetails.length > 0) {
  //         // Sort borrowed items by timeFrom
  //         borrowedItemsDetails.sort((a, b) => {
  //           const [aHours, aMinutes] = a.timeFrom.split(":").map(Number);
  //           const [bHours, bMinutes] = b.timeFrom.split(":").map(Number);

  //           const aTotalMinutes = aHours * 60 + aMinutes;
  //           const bTotalMinutes = bHours * 60 + bMinutes;

  //           return aTotalMinutes - bTotalMinutes; // Sort ascending
  //         });

  //         let detailsMessage = `Item: ${itemName}\n\n`;

  //         borrowedItemsDetails.forEach((detail) => {
  //           detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
  //         });

  //         Alert.alert("Item Borrowed Today", detailsMessage);

  //       } else {
  //         Alert.alert("Item not found", "No records found for this item on today's date.");
  //       }

  //     } else {
  //       Alert.alert("No data found", "No records found for today in the borrow catalog.");
  //     }

  //   } catch (error) {
  //     Alert.alert("Error", "Invalid or unauthorized QR Code.");
  //   }

  //   setTimeout(() => setScanned(false), 1500);
  // };

  const handleBarCodeScanned = async ({ data }) => {
  if (scanned) return;

  setScanned(true);

  try {
    // 🔓 Decrypt QR Code Data
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Invalid QR Code");
    }

    const parsedData = JSON.parse(decryptedData);
    const { itemName } = parsedData; // Extract itemName from QR code

    // Get today's date to filter the borrow catalog
    const todayDate = getTodayDate();

    // Query Firestore to find all records where the item was borrowed today
    const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const borrowedItemsDetails = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        // Check if the item exists in the request list
        const borrowedItem = data.requestList.find(
          (item) => item.itemName === itemName
        );

        if (borrowedItem) {
          const borrower = data.userName || "Unknown";
          const borrowedDate = data.dateRequired;
          const timeFrom = data.timeFrom || "00:00";
          const timeTo = data.timeTo || "00:00";

          const currentStatus = borrowedItem.status?.toLowerCase();

          if (currentStatus === "borrowed") {
            // ✅ Update the item status to "deployed"
            const updatedRequestList = data.requestList.map((item) =>
              item.itemName === itemName ? { ...item, status: "deployed" } : item
            );

            // Update the document in Firestore
            await updateDoc(doc(db, "borrowcatalog", docSnap.id), {
              requestList: updatedRequestList,
              status: "Deployed" // update root-level status
            });

            borrowedItemsDetails.push({
              borrower,
              borrowedDate,
              timeFrom,
              timeTo
            });

          } else if (currentStatus === "deployed") {
            Alert.alert("Already Deployed", `Item "${itemName}" has already been deployed.`);
          } else {
            Alert.alert("Invalid Status", `Item "${itemName}" is not currently in a 'Borrowed' status.`);
          }
        }
      }

      if (borrowedItemsDetails.length > 0) {
        // Sort borrowed items by timeFrom
        borrowedItemsDetails.sort((a, b) => {
          const [aHours, aMinutes] = a.timeFrom.split(":").map(Number);
          const [bHours, bMinutes] = b.timeFrom.split(":").map(Number);

          const aTotalMinutes = aHours * 60 + aMinutes;
          const bTotalMinutes = bHours * 60 + bMinutes;

          return aTotalMinutes - bTotalMinutes; // Sort ascending
        });

        let detailsMessage = `Item: ${itemName}\n\n`;

        borrowedItemsDetails.forEach((detail) => {
          detailsMessage += `Requestor: ${detail.borrower}\nDate: ${detail.borrowedDate}\nTime: ${detail.timeFrom} - ${detail.timeTo}\n\n`;
        });

        Alert.alert("Item Borrowed Today", detailsMessage);

      } else {
        Alert.alert("Item not found", "No records found for this item on today's date.");
      }

    } else {
      Alert.alert("No data found", "No records found for today in the borrow catalog.");
    }

  } catch (error) {
    Alert.alert("Error", "Invalid or unauthorized QR Code.");
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
