import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Modal, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig'; 
import { useAuth } from '../contexts/AuthContext'; 
import styles from '../styles/admin2Style/ActivityLogStyle'; 

const ActivityLogScreen = () => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        if (!user?.uid) throw new Error("User ID not found");

        const activityRef = collection(db, `accounts/${user.uid}/activitylog`);
        const querySnapshot = await getDocs(activityRef);

        const logs = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          const logDate =
            data.cancelledAt?.toDate?.() ||
            data.timestamp?.toDate?.() ||
            new Date();

          return {
            key: doc.id || index.toString(),
            date: logDate.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            action: data.status === 'CANCELLED' ? 'Cancelled a request' : data.action || 'Modified a request',
            by: data.userName || 'Unknown User',
            fullData: data,
          };
        });

        logs.sort((a, b) => {
          const dateA = new Date(a.fullData.timestamp?.toDate?.() || a.fullData.cancelledAt?.toDate?.() || 0);
          const dateB = new Date(b.fullData.timestamp?.toDate?.() || b.fullData.cancelledAt?.toDate?.() || 0);
          return dateB - dateA;
        });

        setActivityData(logs);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      }
    };

    fetchActivityLogs();
  }, [user]);

  const filteredData = activityData.filter(
    (item) =>
      item.date.includes(searchQuery) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogPress = (log) => {
    setSelectedLog(log.fullData);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLogPress(item)} style={styles.itemContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.action}>{item.action}</Text>
      <Text style={styles.by}>{item.by}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Activity Log</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text style={styles.emptyText}>No activity found.</Text>}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Details</Text>
            {selectedLog && (
              <>
                <Text style={styles.modalText}>Action: {selectedLog.action || 'N/A'}</Text>
                <Text style={styles.modalText}>By: {selectedLog.userName || 'N/A'}</Text>
                <Text style={styles.modalText}>
                  Date: {(selectedLog.timestamp?.toDate?.() || selectedLog.cancelledAt?.toDate?.() || new Date()).toLocaleString()}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ActivityLogScreen;
