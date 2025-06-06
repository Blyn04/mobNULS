// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { ActivityIndicator } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function CustomButton({ 
//   title, 
//   onPress, 
//   disabled = false, 
//   icon, 
//   loading = false 
// }) {
    
//   return (
//     <TouchableOpacity 
//       style={[styles.button, disabled && styles.disabledButton]} 
//       onPress={onPress} 
//       disabled={disabled || loading}
//       activeOpacity={0.7} 
//     >
//       {loading ? (
//         <ActivityIndicator color="#fff" />
//       ) : (
//         <>
//           {icon && <Icon name={icon} size={20} color="white" style={styles.icon} />}
//           <Text style={styles.text}>{title}</Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#6200ee',
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#002075',
//     borderRadius: 10,
//     paddingVertical: 10,
//     marginTop: 10,
//   },
  
//   text: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   icon: {
//     marginRight: 8,
//   },

//   disabledButton: {
//     backgroundColor: '#b0b0b0',
//   },
// });

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomButton({ 
  title, 
  onPress, 
  disabled = false, 
  icon, 
  loading = false 
}) {
    
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabledButton]} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.7} 
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon && <Icon name={icon} size={20} color="white" style={styles.icon} />}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#395a7f',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%'
  },
  
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  icon: {
    marginRight: 8,
  },

  disabledButton: {
    backgroundColor: '#b0b0b0',
  },
});
