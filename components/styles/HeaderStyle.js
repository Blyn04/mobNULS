import { StatusBar, StyleSheet } from 'react-native';
import Header from '../Header';

export default StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, 
    backgroundColor: '#395a7f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 15,
    elevation: 4, // Adds shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingTop: StatusBar.currentHeight+5,
  },
  
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  headerText: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  subtitle: {
    fontSize: 14,
    color: '#ddd',
  },

  profileButton: {
    padding: 5,
  },

  menuButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  
});
