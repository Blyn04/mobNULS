import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/admin2Style/PendingRequestStyle';
import Header from '../Header';

export default function PendingRequestScreen() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // const fetchPendingRequests = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'userrequests'));
  //     const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setPendingRequests(data);

  //   } catch (error) {
  //     console.error('Error fetching pending requests:', error);
  //   }
  // };

  const fetchPendingRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'userrequests'));
      const fetched = [];
  
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
  
        const enrichedItems = await Promise.all(
          (data.filteredMergedData || []).map(async (item) => {
            const inventoryId = item.selectedItemId || item.selectedItem?.value;
            let itemId = 'N/A';
  
            if (inventoryId) {
              try {
                const invDoc = await getDoc(doc(db, 'inventory', inventoryId));
                if (invDoc.exists()) {
                  itemId = invDoc.data().itemId || 'N/A';
                }
              } catch (err) {
                console.error(`Error fetching inventory item ${inventoryId}:`, err);
              }
            }
  
            return {
              ...item,
              itemIdFromInventory: itemId,
            };
          })
        );
  
        fetched.push({
          id: docSnap.id,
          ...data,
          filteredMergedData: enrichedItems,
        });
      }
  
      setPendingRequests(fetched);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleApprove = async (request) => {
    try {
      const requestRef = doc(db, 'userrequests', request.id);
      await updateDoc(requestRef, { status: 'Approved' });
      Alert.alert('Success', 'Request approved.');
      fetchPendingRequests();

    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a reason.');
      return;
    }

    try {
      const requestRef = doc(db, 'userrequests', selectedRequest.id);
      await updateDoc(requestRef, {
        status: 'Rejected',
        reason: rejectReason,
      });
      setIsRejectModalVisible(false);
      setRejectReason('');
      setSelectedRequest(null);
      Alert.alert('Rejected', 'Request has been rejected.');
      fetchPendingRequests();

    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => { setSelectedRequest(item); setViewModalVisible(true); }}>
        <Card.Content>
          <Text style={styles.name}>{index + 1}. Requestor: {item.userName || 'N/A'}</Text>
          <Text style={styles.request}>Room: {item.room}</Text>
          <Text style={styles.reason}>Course Code: {item.courseCode}</Text>
          <Text style={styles.reason}>Course Description: {item.courseDescription}</Text>
          <Text style={styles.date}>
            Requisition Date: {item.timestamp ? item.timestamp.toDate().toLocaleString() : 'N/A'}
          </Text>
          <Text style={styles.date}>Required Date: {item.dateRequired}</Text>
          <Text style={[styles[item.status?.toLowerCase() || 'pending']]}>{item.status || 'Pending'}</Text>
        </Card.Content>
      </TouchableOpacity>
  
      <View style={styles.cardButtonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleApprove(item)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Pending Requests</Text>
      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Modal
        visible={isRejectModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRejectModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Reason</Text>
            <TextInput
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Please provide a reason for rejection"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                onPress={handleRejectSubmit}
                style={[styles.button, styles.approveButton]}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsRejectModalVisible(false)}
                style={[styles.button, styles.rejectButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setViewModalVisible(false)}
          style={styles.modalContainer}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Request Details</Text>
            {selectedRequest && (
              <>
                <Text style={styles.modalText}>Name: {selectedRequest.userName || 'N/A'}</Text>
                <Text style={styles.modalText}>Program: {selectedRequest.program}</Text>
                <Text style={styles.modalText}>Room: {selectedRequest.room}</Text>
                <Text style={styles.modalText}>Reason: {selectedRequest.reason}</Text>
                <Text style={styles.modalText}>Time Needed: {selectedRequest.timeFrom} - {selectedRequest.timeTo}</Text>
                <Text style={styles.modalText}>Date Required: {selectedRequest.dateRequired || 'N/A'}</Text>
                <Text style={styles.modalText}>Requested On: {selectedRequest.timestamp?.toDate().toLocaleString() || 'N/A'}</Text>
                <Text style={styles.modalText}>Status: {selectedRequest.status || 'Pending'}</Text>
                <Text style={styles.modalText}>Reason: {selectedRequest.reason}</Text>

                <Text style={[styles.modalTitle, { marginTop: 10 }]}>Requested Items:</Text>

                <ScrollView horizontal>
                  <View>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableCell}>Item ID</Text>
                      <Text style={styles.tableCell}>Item</Text>
                      <Text style={styles.tableCell}>Qty</Text> 
                      <Text style={styles.tableCell}>Category</Text>
                    </View>
                    {selectedRequest.filteredMergedData?.map((item, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.itemIdFromInventory}</Text>
                        <Text style={styles.tableCell}>{item.itemName}</Text>
                        <Text style={styles.tableCell}>{item.quantity}</Text>
                        <Text style={styles.tableCell}>{item.category}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setViewModalVisible(false)}
                  style={[styles.button, { marginTop: 15 }]}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}
