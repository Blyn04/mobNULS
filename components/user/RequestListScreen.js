import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/userStyle/RequestListStyle';

const RequestListScreen = () => {
  const { user } = useAuth();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestList = async () => {
      if (!user || !user.id) return;

      try {
        const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
        const querySnapshot = await getDocs(tempRequestRef);

        const tempRequestList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            selectedItem: {
              value: data.selectedItemId,
              label: data.selectedItemLabel,
            },
          };
        });

        setRequestList(tempRequestList);
        
      } catch (error) {
        console.error('Error fetching request list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestList();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.selectedItem?.label}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Date: {item.selectedDate}</Text>
      <Text>Time: {item.selectedTime}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requestList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
      />
    </View>
  );
};

export default RequestListScreen;
