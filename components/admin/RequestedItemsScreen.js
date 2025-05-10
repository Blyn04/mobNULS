import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig"; // Import Firebase config
import CameraScreen from "./CameraScreen"; // QR scanner component

const RequestedItemsScreen = ({ route }) => {
  const { userName } = route.params; // Get the selected user's name from navigation props
  const [requestedItems, setRequestedItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchRequestedItems = async () => {
      const todayDate = getTodayDate();
      const q = query(collection(db, "borrowcatalog"), where("dateRequired", "==", todayDate));
      const querySnapshot = await getDocs(q);
      const itemsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userName === userName) {
          data.requestList.forEach((item) => {
            itemsData.push(item);
          });
        }
      });

      setRequestedItems(itemsData);
    };

    fetchRequestedItems();
  }, [userName]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowScanner(true); // Show the QR scanner when an item is clicked
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {showScanner ? (
        <CameraScreen item={selectedItem} />
      ) : (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Requested Items for {userName}</Text>
          <FlatList
            data={requestedItems}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item)}>
                <Text style={{ fontSize: 18, marginVertical: 10 }}>{item.itemName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.itemName}
          />
        </>
      )}
    </View>
  );
};

export default RequestedItemsScreen;
