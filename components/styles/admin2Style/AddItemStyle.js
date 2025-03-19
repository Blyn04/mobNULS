import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  headerText: {
    alignItems: 'center',
    flex: 1,
  },

  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  subtitle: {
    color: 'white',
    fontSize: 14,
  },

  profileButton: {
    padding: 5,
  },

  // Add Item Styles
  input: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  picker: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  addImageButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },

  addImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },

  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  closeModalButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },

  closeModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Back Button Positioning
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});
