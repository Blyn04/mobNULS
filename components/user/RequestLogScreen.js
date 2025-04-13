import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { DataTable } from 'react-native-paper';
import styles from '../styles/userStyle/RequestLogStyle';
import Header from '../Header';

const requests = [
  { id: '1', name: 'Syringe', department: 'NURSING', date: '2025-02-23', status: 'Approved', tag: 'INF224', quantity: 10 },
  { id: '2', name: 'Gloves', department: 'NURSING', date: '2025-02-22', status: 'Approved', tag: 'MED223', quantity: 20 },
  { id: '3', name: 'Stethoscope', department: 'NURSING', date: '2025-02-21', status: 'Approved', tag: 'INF225', quantity: 5 },
  { id: '4', name: 'Thermometer', department: 'NURSING', date: '2025-02-20', status: 'Approved', tag: 'MED224', quantity: 15 },
  { id: '5', name: 'Face Mask', department: 'NURSING', date: '2025-02-19', status: 'Approved', tag: 'INF226', quantity: 50 },
  { id: '6', name: 'Alcohol', department: 'NURSING', date: '2025-02-18', status: 'Rejected', tag: 'MED225', quantity: 30 },
  { id: '7', name: 'Bandages', department: 'NURSING', date: '2025-02-17', status: 'Rejected', tag: 'INF227', quantity: 40 },
];

export default function RequestLogScreen() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Requests Log</Text>

        <View style={{ flex: 1 }}>
          <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={styles.tableHeaderText} style={{ flex: 2 }}>Date</DataTable.Title>
            <DataTable.Title textStyle={styles.tableHeaderText} style={{ flex: 2 }}>Action</DataTable.Title>
            <DataTable.Title textStyle={styles.tableHeaderText} style={{ flex: 2 }}>By</DataTable.Title>
          </DataTable.Header>

          {requests.map((item) => (
            <DataTable.Row key={item.id} style={styles.tableRow} onPress={() => openModal(item)}>
              <DataTable.Cell textStyle={styles.tableCell} style={{ flex: 2 }}>{item.date}</DataTable.Cell>
              <DataTable.Cell textStyle={styles.tableCell} style={{ flex: 2 }}>
                <Text style={[styles.viewLinkText, item.status === 'Approved' ? styles.statusApproved : styles.statusRejected]}>
                  {item.status}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell textStyle={styles.tableCell} style={{ flex: 2 }}>{item.department}</DataTable.Cell>
            </DataTable.Row>
          ))}
          </DataTable>
        </View>
      </View>

      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpText}>Help (?)</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { /* prevent modal from closing when content is tapped */ }}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Request Details</Text>
                {selectedRequest && (
                  <>
                    <Text style={styles.modalText}>Item: {selectedRequest.name}</Text>
                    <Text style={styles.modalText}>Department: {selectedRequest.department}</Text>
                    <Text style={styles.modalText}>Date: {selectedRequest.date}</Text>
                    <Text style={styles.modalText}>Tag: {selectedRequest.tag}</Text>
                    <Text style={styles.modalText}>Quantity: {selectedRequest.quantity}</Text>
                    <Text
                      style={[
                        styles.modalText,
                        selectedRequest.status === 'Approved' ? styles.statusApproved : styles.statusRejected,
                      ]}
                    >
                      Status: {selectedRequest.status}
                    </Text>
                  </>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
