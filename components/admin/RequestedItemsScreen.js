// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../backend/firebase/FirebaseConfig";
// import CameraScreen from "./CameraScreen";
// import styles from "../styles/adminStyle/RequestedItemsStyle";
// import Header from '../Header';

// const getTodayDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = (today.getMonth() + 1).toString().padStart(2, "0");
//   const day = today.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const RequestedItemsScreen = ({ route, navigation }) => {
//   const { userName } = route.params;
//   const [requestedItems, setRequestedItems] = useState([]);
//   const [showScanner, setShowScanner] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     const fetchRequestedItems = async () => {
//       const todayDate = getTodayDate();
//       const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
//       const querySnapshot = await getDocs(q);
//       const itemsData = [];

//       const deployedItemsPromises = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.userName === userName && data.requestList) {
//           data.requestList.forEach((item) => {
//             // Check if the item is already deployed for the user
//             const deployedQuery = query(
//               collection(db, "deployedItems"),
//               where("userName", "==", userName),
//               where("itemName", "==", item.itemName)
//             );

//             deployedItemsPromises.push(
//               getDocs(deployedQuery).then((deployedSnapshot) => {
//                 const isDeployed = !deployedSnapshot.empty; // If item is found in deployedItems, it’s considered deployed
//                 itemsData.push({ ...item, isDeployed });
//               })
//             );
//           });
//         }
//       });

//       // Wait for all deployedItemsPromises to resolve before setting the requested items state
//       await Promise.all(deployedItemsPromises);
//       setRequestedItems(itemsData);
//     };

//     fetchRequestedItems();
//   }, [userName]);

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//     setShowScanner(true);
//   };

//   const handleCloseScanner = () => {
//     setShowScanner(false);
//     setSelectedItem(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Header />
      
//       {showScanner ? (
//         <CameraScreen
//           item={selectedItem}
//           onClose={handleCloseScanner}
//         />
//       ) : (
//         <>
//           <Text style={styles.title}>Requested Items for {userName}</Text>
          
//           <FlatList
//             data={requestedItems}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.itemButton}
//                 onPress={() => handleItemClick(item)}
//               >
//                 <Text style={styles.itemText}>
//                   {item.itemName} {item.isDeployed ? "(Deployed)" : ""}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item, index) => `${item.itemName}-${index}`}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// export default RequestedItemsScreen;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";
import CameraScreen from "./CameraScreen";
import styles from "../styles/adminStyle/RequestedItemsStyle";
import Header from '../Header';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const RequestedItemsScreen = ({ route, navigation }) => {
  const { userName } = route.params;
  const [requestedItems, setRequestedItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
  const todayDate = getTodayDate();
  const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const itemsData = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // if (data.userName === userName && data.requestList) {
      //   const isDeployed = data.status === "Deployed";

      //   data.requestList.forEach((item, index) => {
      //     itemsData.push({
      //       ...item,
      //       isDeployed,
      //       requestId: docSnap.id,
      //       requestIndex: index, // optional, helpful for debug
      //       requestMeta: {
      //         timeFrom: data.timeFrom,
      //         timeTo: data.timeTo,
      //         borrower: data.userName,
      //         dateRequired: data.dateRequired,
      //         status: data.status
      //       }
      //     });
      //   });
      // }
      if (
        data.userName === userName &&
        data.requestList &&
        (data.status === "Deployed" || data.status === "Returned")
      ) {
        data.requestList.forEach((item, index) => {
          itemsData.push({
            ...item,
            requestId: docSnap.id,
            requestIndex: index,
            status: data.status, // Save actual status here
            requestMeta: {
              timeFrom: data.timeFrom,
              timeTo: data.timeTo,
              borrower: data.userName,
              dateRequired: data.dateRequired,
              status: data.status
            }
          });
        });
      }

    });

    setRequestedItems(itemsData);
  });

  return () => unsubscribe(); // Cleanup
}, [userName]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      {showScanner && selectedItem ? (
          <CameraScreen
            selectedItem={selectedItem}
            onClose={handleCloseScanner}
          />
        ) : (
        <>
          <Text style={styles.title}>Requested Items for {userName}</Text>
          <FlatList
            data={requestedItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemButton}
                onPress={() => handleItemClick(item)}
              >
                <Text style={styles.itemText}>
                  {item.itemName} {item.status ? `(${item.status})` : ""}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${item.itemName}-${index}`}
          />
        </>
      )}
    </View>
  );
};

export default RequestedItemsScreen;
