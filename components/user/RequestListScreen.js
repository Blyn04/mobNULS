import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../backend/firebase/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/userStyle/RequestListStyle';
import Header from '../Header';

const RequestListScreen = () => {
  const { user } = useAuth();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!user || !user.id) return;
  
    const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
  
    const unsubscribe = onSnapshot(tempRequestRef, (querySnapshot) => {
      const tempRequestList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          selectedItem: {
            value: data.selectedItemId,
            label: data.selectedItemLabel,
          },
        };
      });
  
      setRequestList(tempRequestList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching request list in real-time:', error);
      setLoading(false);
    });
  
    return () => unsubscribe(); // cleanup listener on unmount
  }, [user]);

  const handleRequestNow = () => {
    console.log('Request Now clicked!');
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(String(item.quantity)); // prefill quantity
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setQuantity('');
  };

  const handleQuantityChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setQuantity(numericValue);
  };

  const removeFromList = async (idToDelete) => {
    try {
      const tempRequestRef = collection(db, 'accounts', user.id, 'temporaryRequests');
      const querySnapshot = await getDocs(tempRequestRef);
  
      let foundDocId = null;
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.selectedItemId === idToDelete) {
          foundDocId = docSnap.id;
        }
      });
  
      if (foundDocId) {
        await deleteDoc(doc(db, 'accounts', user.id, 'temporaryRequests', foundDocId));
        console.log(`Item with Firestore doc ID ${foundDocId} removed from Firestore.`);
  
        // Remove from local list
        const updatedList = requestList.filter((item) => item.selectedItemId !== idToDelete);
        setRequestList(updatedList);

      } else {
        console.warn('Item not found in Firestore.');
      }

    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };
  
  const confirmRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from the list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeFromList(item.selectedItemId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.cardTouchable}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.selectedItem?.label}</Text>
          <TouchableOpacity onPress={() => confirmRemoveItem(item)} >
            <Text style={styles.xIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text>Quantity: {item.quantity}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
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
      <Header />

      <View style={styles.tableContainer}>
        <FlatList
          data={requestList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
        />
      </View>

      <TouchableOpacity style={styles.requestButton} onPress={handleRequestNow}>
        <Text style={styles.requestButtonText}>Request Now</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Request Details</Text>

            {selectedItem && (
              <>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Item:</Text> {selectedItem.selectedItem?.label}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Quantity:</Text>
                </Text>

                <TextInput
                  style={styles.inputQuantity}
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                />

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Category:</Text> {selectedItem.category}
                </Text>

                {selectedItem.usageType && (
                  <Text style={styles.modalDetail}>
                    <Text style={styles.bold}>Usage Type:</Text> {selectedItem.usageType}
                  </Text>
                )}

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Item Type:</Text> {selectedItem.type}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Lab Room:</Text> {selectedItem.labRoom}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Condition:</Text> {selectedItem.condition}
                </Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>Department:</Text> {selectedItem.department}
                </Text>
              </>
            )}

            <TouchableOpacity style={styles.requestButtonModal} onPress={closeModal}>
              <Text style={styles.requestButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RequestListScreen;
