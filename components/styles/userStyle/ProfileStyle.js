// // import { StyleSheet } from 'react-native';

// // export default StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //     padding: 16,
// //   },

// //   header: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     zIndex: 10, // Keeps it above other content
// //     backgroundColor: '#1A4572', // Header background color
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'flex-start',
// //     padding: 10,
// //     elevation: 4, // Adds shadow on Android
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 3,
// //     marginBottom:40,
// //   },

// //   backButton: {
// //     marginRight: 10,
// //   },

// //   headerTitle: {
// //     color: 'white',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },

// //   profileImageContainer: {
// //     alignItems: 'center',
// //     marginTop: 60,
// //   },

// //   profileImage: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     borderWidth: 2,
// //     borderColor: '#00796B',
// //   },

// //   profileDetails: {
// //     marginTop: 20,
// //     paddingHorizontal: 10,
// //   },

// //   label: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //   },

// //   input: {
// //     backgroundColor: 'white',
// //     padding: 10,
// //     borderRadius: 8,
// //     fontSize: 16,
// //     marginTop: 5,
// //     elevation: 2,
// //   },

// //   logoutButton: {
// //     flexDirection: 'row',
// //     backgroundColor: '#D32F2F',
// //     padding: 15,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginTop: 30,
// //   },

// //   logoutText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginLeft: 10,
// //   },
// // });

// import { StatusBar, StyleSheet } from 'react-native';

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e9ecee',
//     padding: 7,
//     gap: 5
//   },  
  
//   profileHeader:{
//     position: 'absolute',
//     backgroundColor: '#fff',
//     flex: 1,
//     paddingTop: StatusBar.currentHeight+15,
//     left: 0,
//     right:0,
//     flexDirection: 'row',
//     paddingBottom: 10,
//     paddingHorizontal: 15,
//     alignItems: 'center',
//     justifyContent:'space-between',
//     borderBottomWidth: 1,
//     borderColor: '#e9ecee'
//   },

//   headerTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },

//   profileImageContainer: {
//     alignItems: 'center',
//     marginBottom: 10,
//     marginTop: 30
//   },

//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#00796B',
//   },

//   secondSection:{
//     height: 'auto',
//     backgroundColor: '#fff',
//     borderRadius: 8, 
//     paddingTop: 8, 
//     paddingBottom: 10, 
//     paddingHorizontal: 10 
//   },

//   profileDetails: {
//     marginTop: 20,
//     paddingHorizontal: 10,
//   },

//   label: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#b5b5b5',
//   },

//   info:{backgroundColor: '#fff', borderRadius: 5,paddingHorizontal: 5, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10},

//   input: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 8,
//     fontSize: 16,
//     marginTop: 5,
//     elevation: 2,
//   },

//   logoutButton: {
//     flexDirection: 'row',
//     backgroundColor: '#D32F2F',
//     padding: 15,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 30,
//   },

//   logoutText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });

import { StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ecee',
    padding: 7,
    gap: 5
  },  
  
  profileHeader:{
    position: 'absolute',
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: StatusBar.currentHeight+15,
    left: 0,
    right:0,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent:'space-between',
    borderBottomWidth: 1,
    borderColor: '#e9ecee'
  },

  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  profileImageContainer: {
    width: 'auto',
    height: 'auto',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
    borderRadius: 50,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00796B',
  },

  secondSection:{
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 8, 
    paddingTop: 8, 
    paddingBottom: 10, 
    paddingHorizontal: 10 
  },

  profileDetails: {
    marginTop: 20,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b5b5b5',
  },

  info:{backgroundColor: '#fff', borderRadius: 5,paddingHorizontal: 5, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10},

  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 5,
    elevation: 2,
  },

  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap:10,
  },

  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
