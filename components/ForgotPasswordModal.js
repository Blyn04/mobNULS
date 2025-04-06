import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Text, Button, HelperText } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../backend/firebase/FirebaseConfig';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../backend/firebase/FirebaseConfig'; // Import Firestore db
import styles from './styles/ForgotPasswordStyle';

export default function ForgotPasswordModal({ visible, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      setSuccess('');
      return;
    }

    try {
      const usersCollection = collection(db, 'users'); 
      const emailQuery = query(usersCollection, where('email', '==', email.trim()));
      const querySnapshot = await getDocs(emailQuery);

      if (querySnapshot.empty) {
        setError('This email is not registered.');
        setSuccess('');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset link sent! Check your email.');
      setError('');
      setEmail('');

    } catch (error) {
      console.error('Forgot Password Error:', error.message);
      setError('Failed to send reset link. Check your email.');
      setSuccess('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Forgot Password</Text>
          <Text style={styles.modalText}>Enter your email to receive a reset link.</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />
          
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
          
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <Button mode="contained" onPress={handleForgotPassword} style={styles.modalButton}>
            Send Reset Link
          </Button>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
