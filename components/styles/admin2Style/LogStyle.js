import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },

  table: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  tableHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    backgroundColor: '#00796B',
    color: 'white',
    paddingVertical: 5,
  },

  tableCell: {
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  tableRowEven: {
    backgroundColor: 'white',
  },

  tableRowOdd: {
    backgroundColor: '#f2f2f2',
  },

  viewButton: {
    backgroundColor: '#00796B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  viewButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: '#00796B',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  helpButton: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
  },

  helpText: {
    textDecorationLine: 'underline',
    color: 'blue',
    fontSize: 16,
  },
});
