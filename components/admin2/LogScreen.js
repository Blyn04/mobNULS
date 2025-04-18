import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, FlatList, ScrollView } from "react-native";
import { db } from "../../backend/firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/admin2Style/LogStyle";
import ApprovedRequestModal from "../customs/ApprovedRequestModal";
import Header from '../Header';

const LogScreen = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchRequestLogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requestlog"));
        const logs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp ? formatTimestamp(data.timestamp) : "N/A";

          return {
            id: doc.id,
            date: data.dateRequired ?? "N/A",
            status: data.status ?? "Pending",
            requestor: data.userName ?? "Unknown",
            requestedItems: data.requestList
              ? data.requestList.map((item) => item.itemName).join(", ")
              : "No items",
            requisitionId: doc.id,
            reason: data.reason ?? "No reason provided",
            department: data.requestList?.[0]?.department ?? "N/A",
            approvedBy: data.approvedBy,
            rejectedBy: data.rejectedBy,
            timestamp: timestamp,
            raw: data,
          };
        });

        // Sort logs by timestamp
        const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistoryData(sortedLogs);
      } catch (error) {
        console.error("Error fetching request logs:", error);
      }
    };

    fetchRequestLogs();
  }, []);

  const formatTimestamp = (timestamp) => {
    try {
      const date = timestamp.toDate();
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "N/A";
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRequest(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const filteredData =
    filterStatus === "All"
      ? historyData
      : historyData.filter((item) => item.status === filterStatus);

  return (
    <View style={styles.container}>
      <Header/>

      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => setFilterStatus("All")} />
        <Button title="Approved" onPress={() => setFilterStatus("Approved")} />
        <Button title="Declined" onPress={() => setFilterStatus("Declined")} />
      </View>

      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Timestamp</Text>
            <Text style={styles.tableHeader}>Status</Text>
            <Text style={styles.tableHeader}>Requestor</Text>
            <Text style={styles.tableHeader}>Requested Items</Text>
            <Text style={styles.tableHeader}>Action</Text>
          </View>
          {filteredData.map((item, index) => (
            <View
              key={item.id}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
            >
              <Text style={styles.tableCell}>{item.timestamp}</Text>
              <Text style={styles.tableCell}>{item.status}</Text>
              <Text style={styles.tableCell}>{item.requestor}</Text>
              <Button title="View Details" onPress={() => handleViewDetails(item)} />
            </View>
          ))}
        </View>
      </ScrollView>

      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <ApprovedRequestModal
            request={selectedRequest}
            onClose={closeModal}
          />
        </Modal>
      )}
    </View>
  );
};

export default LogScreen;
