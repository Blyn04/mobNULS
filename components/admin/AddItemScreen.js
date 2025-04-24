import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../styles/adminStyle/AddItemStyle';

export default function AddItemScreen({ navigation }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const departments = ['MIKMIK', 'NURSING', 'MEDTECH', 'DENTISTRY', 'OPTOMETRY', 'DENTAL HYGIENE'];

  const handleSubmit = () => {
    setModalVisible(true);

    // Reset form fields
    setName('');
    setQuantity('');
    setDepartment('');
    setDescription('');
    setTag('');
    setImageUri(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack(); 
  };

  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);  // Sets the first image selected
      }
    });
  };  
  
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />

        <View style={styles.headerText}>
          <Text style={styles.title}>National University</Text>
          <Text style={styles.subtitle}>Laboratory System</Text>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
          <Icon name="account-circle" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={department}
        onValueChange={(itemValue) => setDepartment(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Department" value="" />
        {departments.map((dept, index) => (
          <Picker.Item key={index} label={dept} value={dept} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Tag"
        value={tag}
        onChangeText={setTag}
      />

      <TouchableOpacity style={styles.addImageButton} onPress={handleImagePick}>
        <Text style={styles.addImageButtonText}>Add Image</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Item</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>Item Added Successfully!</Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={handleCloseModal}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
