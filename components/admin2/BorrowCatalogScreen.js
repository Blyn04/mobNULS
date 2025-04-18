import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../backend/firebase/FirebaseConfig";
import styles from "../styles/admin2Style/BorrowCatalogStyle";
import ApprovedRequestModal from "../customs/ApprovedRequestModal";

const BorrowCatalogScreen = () => {
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const borrowCatalogCollection = collection(db, "borrowcatalog");
        const snapshot = await getDocs(borrowCatalogCollection);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();

          const requestedItems = Array.isArray(d.requestList)
            ? d.requestList.map((item) => ({
                itemId: item.itemIdFromInventory,
                itemName: item.itemName,
                quantity: item.quantity,
                category: item.category,
                condition: item.condition,
                department: item.department,
                labRoom: item.labRoom,
              }))
            : [];

          return {
            id: doc.id,
            timestamp: d.timestamp || null,
            requestor: d.userName || "N/A",
            userName: d.userName || "N/A",
            approvedBy: d.approvedBy || "N/A",
            reason: d.reason || "N/A",
            dateRequired: d.dateRequired || "N/A",
            timeFrom: d.timeFrom || "N/A",
            timeTo: d.timeTo || "N/A",
            courseDescription: d.courseDescription || "N/A",
            courseCode: d.courseCode || "N/A",
            program: d.program || "N/A",
            room: d.room || "N/A",
            requestList: d.requestList || [],
            requestedItems,
            status: d.status || "Pending",
          };
        });

        const sortedData = data.sort((a, b) => {
          if (a.timestamp && b.timestamp) {
            const timeA = a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000;
            const timeB = b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000;
            return timeB - timeA;
          }
          return 0;
        });

        setCatalog(sortedData);
      } catch (err) {
        console.error("Error fetching borrow catalog:", err);
      }
    };

    fetchCatalogData();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleViewDetails = (item) => {
    setSelectedRequest(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      if (timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      const date = new Date(timestamp);
      if (isNaN(date)) return "N/A";
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  const filteredCatalog = catalog.filter((item) =>
    item.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dateRequired.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.requestor}>{item.requestor}</Text>
      <Text style={styles.description}>{item.courseDescription}</Text>
      <Text style={styles.dateRequired}>Date: {item.dateRequired}</Text>
      <Text
        style={[
          styles.status,
          item.status === "Approved" ? styles.approved : styles.pending,
        ]}
      >
        {item.status}
      </Text>
      <TouchableOpacity onPress={() => handleViewDetails(item)}>
        <Text style={styles.viewLink}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      <Button title="Clear" onPress={() => setSearchQuery("")} />

      <FlatList
        data={filteredCatalog}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <ApprovedRequestModal
          isVisible={isModalVisible}
          onClose={handleCancel}
          request={selectedRequest}
          formatDate={formatDate}
        />
      </Modal>
    </View>
  );
};

export default BorrowCatalogScreen;
