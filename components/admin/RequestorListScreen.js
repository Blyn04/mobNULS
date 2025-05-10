import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
};

const RequestorListScreen = ({ navigation }) => {
  const [requestors, setRequestors] = useState([]);

  console.log("RequestorListScreen loaded");


  useEffect(() => {
    const todayDate = getTodayDate(); // "2025-05-10"
    console.log("Today is:", todayDate);
    Alert.alert("Today's Date", todayDate); // Show alert for debugging

    const q = query(
      collection(db, "borrowcatalog"),
      where("dateRequired", "==", todayDate)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log("Snapshot size:", querySnapshot.size);
        const requestorsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("DOC ID:", doc.id);
          console.log("Full DOC:", JSON.stringify(data));

          if (data.userName && !requestorsData.includes(data.userName)) {
            requestorsData.push(data.userName);
          }
        });

        if (querySnapshot.empty) {
          Alert.alert("No matches", "No documents found with today's date.");
        }

        setRequestors(requestorsData);
      },
      (error) => {
        console.error("onSnapshot error:", error);
        Alert.alert("Error", "There was an issue listening to requestors.");
      }
    );

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleRequestorClick = (userName) => {
    navigation.navigate("RequestedItemsScreen", { userName });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Requestors for Today</Text>

      <FlatList
        data={requestors}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRequestorClick(item)}>
            <Text style={{ fontSize: 18, marginVertical: 10 }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <Text style={{ fontSize: 16, marginTop: 20 }}>No requestors found.</Text>
        }
      />
          <Text style={{ fontSize: 18 }}>Component is rendering</Text>
    </View>
  );
};

export default RequestorListScreen;
