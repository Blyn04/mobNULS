import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ApprovedRequestModal = ({ isVisible, onClose, request, formatDate }) => {
  if (!request) return null;

  const {
    userName,
    approvedBy,
    reason,
    dateRequired,
    timeFrom,
    timeTo,
    courseDescription,
    courseCode,
    program,
    room,
    requestedItems,
  } = request;

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.itemDetail}>ID: {item.itemId}</Text>
      <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemDetail}>Department: {item.department}</Text>
      <Text style={styles.itemDetail}>Category: {item.category}</Text>
      <Text style={styles.itemDetail}>Condition: {item.condition}</Text>
      <Text style={styles.itemDetail}>Lab Room: {item.labRoom}</Text>
    </View>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            data={requestedItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={
              <View>
                <Text style={styles.title}>Approved Request Details</Text>

                <View style={styles.section}>
                  <Text style={styles.label}>Requestor:</Text>
                  <Text style={styles.value}>{userName}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Approved By:</Text>
                  <Text style={styles.value}>{approvedBy}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Reason:</Text>
                  <Text style={styles.value}>{reason}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Date Required:</Text>
                  <Text style={styles.value}>{dateRequired}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>
                    {timeFrom} - {timeTo}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Program:</Text>
                  <Text style={styles.value}>{program}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Room:</Text>
                  <Text style={styles.value}>{room}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Course:</Text>
                  <Text style={styles.value}>
                    {courseCode} - {courseDescription}
                  </Text>
                </View>

                <Text style={styles.subTitle}>Requested Items</Text>
              </View>
            }
            ListFooterComponent={
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default ApprovedRequestModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },

  section: {
    marginBottom: 6,
  },

  label: {
    fontWeight: "bold",
  },

  value: {
    marginLeft: 4,
  },

  itemCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  itemDetail: {
    fontSize: 13,
    color: "#444",
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
