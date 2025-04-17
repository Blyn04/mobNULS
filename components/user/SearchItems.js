import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/userStyle/SearchItemsStyle';
import Header from '../Header';
import { db } from '../../backend/firebase/FirebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

export default function SearchItemsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'inventory')); 
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFilteredItems(items);

      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    const filteredData = filteredItems.filter((item) => {
      const description = item.itemName ? item.itemName.toLowerCase() : ''; 
      const category = item.category ? item.category.toLowerCase() : '';
      const location = item.labRoom ? item.labRoom.toLowerCase() : '';
  
      return (
        description.includes(query.toLowerCase()) ||
        category.includes(query.toLowerCase()) ||
        location.includes(query.toLowerCase())
      );
    });
  
    setFilteredItems(filteredData);
  };  

  const handleLongPress = (item) => {
    setHoveredItem(item);
  };

  const closeModal = () => {
    setHoveredItem(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={{ flex: 3 }}>
        <Text style={styles.cellText} numberOfLines={1}>{item.itemName}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cellText}>{item.quantity}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text
          style={[
            styles.status,
            item.status === 'Available' && styles.available,
            item.status === 'Out of Stock' && styles.outOfStock,
            item.status === 'In Use' && styles.inUse,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.cellText}>{item.category}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.content}>
      <Header/>

      <Text style={styles.pageTitle}>Search Items</Text>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items, category, location..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.tableContainer}>
          <View style={styles.tableContainer}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Description</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Qty</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Category</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Location</Text>
            </View>

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={() => (
                <Text style={styles.noResults}>No matching items found.</Text>
              )}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
