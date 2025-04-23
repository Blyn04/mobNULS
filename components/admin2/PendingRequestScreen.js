import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'userrequests'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingRequests(data);
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
      <Card.Content>
        <Text style={styles.name}>{index + 1}. Requestor: {item.userName || 'N/A'}</Text>
        <Text style={styles.request}>Room: {item.room}</Text>
        <Text style={styles.reason}>Course Code: {item.courseCode}</Text>
        <Text style={styles.reason}>Course Description: {item.courseDescription}</Text>
        <Text style={styles.date}>
          Requisition Date: {item.timestamp ? item.timestamp.toDate().toLocaleString() : 'N/A'}
        </Text>

        <Text style={styles.date}>
          Required Date: {
            item.dateRequired && item.dateRequired.toDate
              ? item.dateRequired.toDate().toLocaleDateString()
              : 'N/A'
          }
        </Text>

        <Text style={[styles[item.status?.toLowerCase() || 'pending']]}>{item.status || 'Pending'}</Text>

        {(!item.status || item.status.toLowerCase() === 'pending') && (
          <View style={styles.buttonContainer}>
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
        )}
      </Card.Content>
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

      {/* Reject Modal */}
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
    </View>
  );
}
