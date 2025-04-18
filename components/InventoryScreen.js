import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Modal, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../backend/firebase/FirebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import styles from './styles/InventoryStyle';
import { useAuth } from '../components/contexts/AuthContext';
import { useRequestList } from '../components/contexts/RequestListContext';
import { Calendar } from 'react-native-calendars';
import Header from './Header';

export default function InventoryScreen({ navigation }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { transferToRequestList, requestList } = useRequestList();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [activeInputItemId, setActiveInputItemId] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const [reason, setReason] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [timePickerType, setTimePickerType] = useState('start');
  const [selectedStartTime, setSelectedStartTime] = useState({ hour: '10', minute: '00', period: 'AM' });
  const [selectedEndTime, setSelectedEndTime] = useState({ hour: '3', minute: '00', period: 'PM' });
  const [program, setProgram] = useState('');
  const [room, setRoom] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryCollection = collection(db, 'inventory');
        const inventorySnapshot = await getDocs(inventoryCollection);
        const inventoryList = inventorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setInventoryItems(inventoryList);

        const categoriesList = ['All', ...new Set(inventoryList.map(item => item.type))]; 
        const departmentsList = ['All', ...new Set(inventoryList.map(item => item.department))]; 
        setCategories(categoriesList);
        setDepartments(departmentsList);

      } catch (error) {
        console.error("Error fetching inventory: ", error);
      }
    };

    fetchInventory();
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    const isCategoryMatch = selectedCategory === 'All' || item.type === selectedCategory;
    const isDepartmentMatch = selectedDepartment === 'All' || item.department === selectedDepartment;
    
    return isCategoryMatch && isDepartmentMatch && 
      (item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setQuantity('');
    setReason('');
  };

  const handleInputToggle = (itemId) => {
    if (activeInputItemId === itemId) {
      setActiveInputItemId(null);
      
    } else {
      setActiveInputItemId(itemId);
    }
  };

  const handleQuantityChange = (text, itemId) => {
    if (/^[1-9]\d*$/.test(text) || text === '') {
      setItemQuantities(prev => ({ ...prev, [itemId]: text }));
    }
  };

  const addToList = (item) => {
    const quantity = itemQuantities[item.id];

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const isAlreadyInList = requestList.some(reqItem => reqItem.originalId === item.id);
    if (isAlreadyInList) {
      alert('This item is already in the request list.');
      return;
    }

    transferToRequestList(item, quantity, 'General Use');
    alert('Item added to request list!');
    setActiveInputItemId(null); // hide the input field
  };

  const renderItem = ({ item }) => {
    const isAlreadyInList = requestList.some(reqItem => reqItem.id === item.id);
    const isActive = activeInputItemId === item.id;
  
    return (
      <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.9}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
              <Image style={styles.itemImage} source={require('../assets/favicon.png')} />
            </View>
  
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.itemName}</Text>
              <Text style={styles.itemType}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemType}>Status: {item.status}</Text>
            </View>
  
            <TouchableOpacity
              style={[styles.addButton, isAlreadyInList && styles.disabledButton]}
              onPress={(e) => {
                e.stopPropagation(); 
                handleInputToggle(item.id);
              }}
              disabled={isAlreadyInList}
            >
              <Icon name="plus-circle" size={24} color={isAlreadyInList ? '#ccc' : 'green'} />
            </TouchableOpacity>
          </View>
  
          {isActive && (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={itemQuantities[item.id] || ''}
                onChangeText={(text) => handleQuantityChange(text, item.id)}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => addToList(item)}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };  

  const formatTime = ({ hour, minute, period }) => `${hour}:${minute} ${period}`;

  const convertTo24Hour = ({ hour, minute, period }) => {
    let hours = parseInt(hour);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + parseInt(minute);
  };

  const openTimePicker = (type) => {
    setTimePickerType(type);
    setTimeModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.sectionTitle}>Laboratory Items</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by item name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>

        {!isAdmin && (
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
            style={styles.picker}
          >
            {departments.map((department) => (
              <Picker.Item key={department} label={department} value={department} />
            ))}
          </Picker>
        )}
      </View>

       <TouchableOpacity style={styles.dateButton} onPress={() => setCalendarVisible(true)}>
                <Text style={styles.dateButtonText}>
                  {selectedDate ? `Borrow Date: ${selectedDate}` : 'Pick Borrow Date'}
                </Text>
              </TouchableOpacity>
        
              {calendarVisible && (
                <Calendar
                  onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setCalendarVisible(false);
                  }}
                  markedDates={{ [selectedDate]: { selected: true, selectedColor: '#00796B' } }}
                  minDate={today}
                />
              )}
      
              <View style={styles.timeButtonContainer}>
                <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('start')}>
                    <Text style={styles.timeButtonText}>
                      Start Time: {formatTime(selectedStartTime)}
                    </Text>
                  </TouchableOpacity>
          
                  <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker('end')}>
                    <Text style={styles.timeButtonText}>
                      End Time: {formatTime(selectedEndTime)}
                    </Text>
                  </TouchableOpacity>
              </View>
      
              <View style={styles.programRoomContainer}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={program}
                    onValueChange={(itemValue) => setProgram(itemValue)}
                    style={{ height: 50, fontSize: 5 }} 
                  >
                    <Picker.Item label="Select Program" value="" />
                    <Picker.Item label="SAM - BSMT" value="SAM - BSMT" />
                    <Picker.Item label="SAH - BSN" value="SAH - BSN" />
                    <Picker.Item label="SHS" value="SHS" />
                  </Picker>
                </View>
      
                <TextInput
                  style={styles.roomInput}
                  placeholder="Enter room"
                  value={room}
                  onChangeText={setRoom}
                />
              </View>
      
              <TextInput
                style={styles.reasonInput}
                placeholder="Enter reason for borrowing..."
                value={reason}
                onChangeText={setReason}
                multiline
              />

      <FlatList
        data={filteredItems.length > 0 ? filteredItems : inventoryItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalImageContainer}>
                  <Image style={styles.modalImage} source={require('../assets/favicon.png')} />
                </View>

                <Text style={styles.modalItemName}>{selectedItem?.itemName}</Text>
                <Text style={styles.itemType}>Type: {selectedItem?.type}</Text>
                <Text style={styles.itemType}>Department: {selectedItem?.department}</Text>
                <Text style={styles.itemType}>Category: {selectedItem?.category}</Text>
                <Text style={styles.itemType}>Condition: {selectedItem?.condition}</Text>
                <Text style={styles.itemType}>Usage Type: {selectedItem?.usageType}</Text>
                <Text style={styles.itemType}>Status: {selectedItem?.status}</Text>
                <Text style={styles.itemType}>Available Quantity: {selectedItem?.quantity}</Text>
              </View>
            </TouchableWithoutFeedback> 
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.bottomContainer}>
        <View style={styles.requestAddContainer}>
          {!isAdmin && (
            <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('RequestListScreen')}>
              <Text style={styles.requestButtonText}>Request List</Text>
              {requestList.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{requestList.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('HelpScreen')}>
          <Text style={styles.helpButtonText}>Help (?)</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={timeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTimeModalVisible(false)}>
          <View style={styles.timeModalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.timeModalContent}>
                <Text style={styles.modalTitle}>
                  Select {timePickerType === 'start' ? 'Start' : 'End'} Time
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <ScrollView style={styles.timeScroll}>
                    {[...Array(12).keys()].map((h) => (
                      <TouchableOpacity
                        key={h + 1}
                        onPress={() => {
                          if (timePickerType === 'start') {
                            setSelectedStartTime({ ...selectedStartTime, hour: (h + 1).toString() });
                          } else {
                            setSelectedEndTime({ ...selectedEndTime, hour: (h + 1).toString() });
                          }
                        }}
                      >
                        <Text style={styles.timeText}>{h + 1}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.colon}>:</Text>

                  <ScrollView style={styles.timeScroll}>
                    {['00', '15', '30', '45'].map((m) => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => {
                          if (timePickerType === 'start') {
                            setSelectedStartTime({ ...selectedStartTime, minute: m });
                          } else {
                            setSelectedEndTime({ ...selectedEndTime, minute: m });
                          }
                        }}
                      >
                        <Text style={styles.timeText}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.colon}> </Text>

                  <ScrollView style={styles.timeScroll}>
                    {['AM', 'PM'].map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => {
                          if (timePickerType === 'start') {
                            setSelectedStartTime({ ...selectedStartTime, period: p });
                          } else {
                            setSelectedEndTime({ ...selectedEndTime, period: p });
                          }
                        }}
                      >
                        <Text style={styles.timeText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ScrollView>

                <TouchableOpacity style={styles.okButton} onPress={() => setTimeModalVisible(false)}>
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
