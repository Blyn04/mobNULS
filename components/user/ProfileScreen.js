// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles/userStyle/ProfileStyle';

// export default function ProfileScreen({ route, navigation }) {
//   const { userData } = route.params || {};

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-left" size={30} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//       </View>

//       <View style={styles.profileImageContainer}>
//         <Image 
//           source={require('../../assets/favicon.png')} 
//           style={styles.profileImage} 
//         />
//       </View>

//       <View style={styles.profileDetails}>
//         <Text style={styles.label}>Name</Text>
//         <TextInput 
//           style={styles.input} 
//           value={userData?.name || ''} 
//           editable={false} 
//         />

//         <Text style={styles.label}>Email</Text>
//         <TextInput 
//           style={styles.input} 
//           value={userData?.email || ''} 
//           editable={false}
//           keyboardType="email-address"
//         />

//         <Text style={styles.label}>Role</Text>
//         <TextInput 
//           style={styles.input} 
//           value={userData?.role || ''} 
//           editable={false}
//         />

//         <Text style={styles.label}>Department</Text>
//         <TextInput 
//           style={styles.input} 
//           value={userData?.department || ''} 
//           editable={false}
//         />
//       </View>

//       <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('LoginScreen')}>
//         <Icon name="logout" size={24} color="white" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/userStyle/ProfileStyle';
import { useAuth } from '../contexts/AuthContext';  
import { PaperProvider, Avatar, Title} from 'react-native-paper'; 
import Header from '../Header';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();  

  const capitalizeInitials = (name) =>
    name?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());  

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header/>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
         {user?.photoURL ? (
            <Avatar.Image size={50} source={{ uri: user.photoURL }} />
          ) : (
            <Avatar.Text size={50} label={getInitials(user?.name)} />
          )}
      </View>

      <View style={styles.profileDetails}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={capitalizeInitials(user?.name || '')}
          editable={false}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={user?.email || ''} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={user?.jobTitle || ''} editable={false} />

        <Text style={styles.label}>Department</Text>
        <TextInput style={styles.input} value={user?.department || ''} editable={false} />
      </View>
    </View>
  );
}
