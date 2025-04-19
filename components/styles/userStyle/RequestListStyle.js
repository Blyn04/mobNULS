import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  
  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
