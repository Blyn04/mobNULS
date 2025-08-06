// VERSION 1
// import React, { useState, useEffect, useRef } from 'react';
// import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableOpacity, UIManager, LayoutAnimation, StatusBar, Image, BackHandler } from 'react-native';
// import { Input, Text, Icon } from 'react-native-elements';
// import { TextInput, Card, HelperText, Menu, Provider, Button, Checkbox  } from 'react-native-paper';
// import { useAuth } from '../components/contexts/AuthContext';
// import { db, auth } from '../backend/firebase/FirebaseConfig';
// import { collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp, Timestamp, setDoc, doc } from 'firebase/firestore';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
// import styles from './styles/LoginStyle';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import CustomButton from './customs/CustomButton';
// import ForgotPasswordModal from './ForgotPasswordModal';
// import TermsModal from './customs/TermsModal';
// import {Animated} from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


// export default function LoginScreen({navigation}) {
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [signUpEmail, setSignUpEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signUpPassword, setSignUpPassword] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [secureTextEntry, setSecureTextEntry] = useState(true);
//   const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
//   const [isSignup, setIsSignup] = useState(null);
//   const [employeeID, setEmployeeID] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [jobTitle, setJobTitle] = useState('');
//   const [department, setDepartment] = useState('');
//   const [jobMenuVisible, setJobMenuVisible] = useState(false);
//   const [deptMenuVisible, setDeptMenuVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [isTermsModalVisible, setTermsModalVisible] = useState(false);

//   const [isLoginSignup, setIsLoginSignup] = useState(false)
//   const nameBorderAnim = useRef(new Animated.Value(0)).current;
// const emailBorderAnim = useRef(new Animated.Value(0)).current;
// const employeeIDBorderAnim = useRef(new Animated.Value(0)).current;
// const passwordBorderAnim = useRef(new Animated.Value(0)).current;
// const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

//   const [focusStates, setFocusStates] = useState({
//   name: false,
//   email: false,
//   employeeID: false,
//   password: false,
//   confirmPassword: false,
// });


// const handleFocus = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: true }));
//   animateBorder(field, 1);
// };

// const handleBlur = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: false }));
//   animateBorder(field, 0);
// };

// const animateBorder = (field, toValue) => {
//   let animRef = null;

//   switch (field) {
//     case 'name': animRef = nameBorderAnim; break;
//     case 'email': animRef = emailBorderAnim; break;
//     case 'employeeID': animRef = employeeIDBorderAnim; break;
//     case 'password': animRef = passwordBorderAnim; break;
//     case 'confirmPassword': animRef = confirmPasswordBorderAnim; break;
//   }

//   if (animRef) {
//     Animated.timing(animRef, {
//       toValue,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }
// };


// const nameBorderColor = nameBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const emailBorderColor = emailBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const employeeIDBorderColor = employeeIDBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const passwordBorderColor = passwordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });



//   const jobOptions = ['Dean', 'Laboratory Custodian', 'Faculty'];
//   const deptOptions = ['Medical Technology', 'Nursing', 'Dentistry', 'Optometry'];




//   const handleLogin = async () => {
    
//       if (!email || !password) {
//         setError('Please enter both email and password');
//         return;
//       }
    
//       setError('');
//       setLoading(true);
    
//       try {
//         const usersRef = collection(db, "accounts");
//         const q = query(usersRef, where("email", "==", email));
//         const querySnapshot = await getDocs(q);
    
//         let userDoc, userData, isSuperAdmin = false;
    
//         // First check regular accounts
//         if (!querySnapshot.empty) {
//           userDoc = querySnapshot.docs[0];
//           userData = userDoc.data();
  
//         } else {
//           // Then check if it's a super-admin
//           const superAdminRef = collection(db, "super-admin");
//           const superAdminQuery = query(superAdminRef, where("email", "==", email));
//           const superAdminSnapshot = await getDocs(superAdminQuery);
    
//           if (!superAdminSnapshot.empty) {
//             userDoc = superAdminSnapshot.docs[0];
//             userData = userDoc.data();
//             isSuperAdmin = true;
//           }
//         }
    
//         if (!userData) {
//           setError("User not found. Please contact admin.");
//           setLoading(false);
//           return;
//         }
    
//         if (userData.disabled) {
//           setError("Your account has been disabled.");
//           await signOut(auth);
//           setLoading(false);
//           return;
//         }
    
//         // If password not set yet (new user)
//         if (!isSuperAdmin && !userData.uid) {
//           setError("Password not set. Please login through website first.");
//           setLoading(false);
//           return;
//         }
    
//         // Block check
//         if (userData.isBlocked && userData.blockedUntil) {
//           const now = Timestamp.now().toMillis();
//           const blockedUntil = userData.blockedUntil.toMillis();
    
//           if (now < blockedUntil) {
//             const remainingTime = Math.ceil((blockedUntil - now) / 1000);
//             setError(`Account is blocked. Try again after ${remainingTime} seconds.`);
//             setLoading(false);
//             return;
  
//           } else {
//             await updateDoc(userDoc.ref, {
//               isBlocked: false,
//               loginAttempts: 0,
//               blockedUntil: null,
//             });
  
//             console.log("Account unblocked.");
//           }
//         }
    
//         if (isSuperAdmin) {
//           if (userData.password === password) {
//             await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             login({ ...userData, id: userDoc.id, role: "Super Admin" });
    
//             navigation.replace("SuperAdminDashboard");
    
//           } else {
//             const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             if (newAttempts >= 4) {
//               const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//               await updateDoc(userDoc.ref, {
//                 isBlocked: true,
//                 blockedUntil: Timestamp.fromMillis(unblockTime),
//               });
    
//               setError("Account blocked for 30 minutes.");
  
//             } else {
//               await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//               setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             }
    
//             setLoading(false);
//             return;
//           }
    
//         } else {
//           // ✅ Firebase Auth login for regular users/admins
//           try {
//             await signInWithEmailAndPassword(auth, email, password);
//             await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             const role = (userData.role || "user").toLowerCase();
//             login({ ...userData, id: userDoc.id });

//             console.log("Login Succesfull!")
    
//             await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//               action: "User Logged In (Mobile)",
//               userName: userData.name || "User",
//               timestamp: serverTimestamp(),
              
//             });
    
//             switch (role) {
//               case "admin1":
//               case "admin2":
//               case "admin":
//                 navigation.replace("Admin");
//                 console.log("Login Succesfull!")
//                 break;
  
//               case "super-user":
//                 navigation.replace("Admin");
//                 console.log("Login Succesfull!")
//                 break;
  
//               case "user":
//                 navigation.replace('User')
//                 console.log("Login Succesfull!")
//                 break;
  
//               default:
//                 setError("Unknown role. Contact admin.");
//             }
    
//           } catch (authError) {
//             // console.error("Auth login failed:", authError.message);
    
//             const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             if (newAttempts >= 4) {
//               const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//               await updateDoc(userDoc.ref, {
//                 isBlocked: true,
//                 blockedUntil: Timestamp.fromMillis(unblockTime),
//               });
    
//               setError("Account blocked after 4 failed attempts.");
              
//             } else {
//               await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//               setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             }
    
//             setLoading(false);
//             return;
//           }
//         }
    
//       } catch (error) {
//         console.error("Login error:", error);
//         setError("Unexpected error. Try again.");
  
//       } finally {
//         setLoading(false);
//       }
//     };

//     const sendEmail = async (email, name) => {
//       try {
//         const response = await fetch('https://sendemail-guopzbbmca-uc.a.run.app', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             to: email.trim().toLowerCase(),
//             subject: 'Account Registration - Pending Approval',
//             text: `Hi ${name},\n\nThank you for registering. Your account is now pending approval from the ITSO.\n\nRegards,\nNU MOA ITSO Team`,
//             html: `<p>Hi ${name},</p><p>Thank you for registering. Your account is now <strong>pending approval</strong> from the ITSO.</p><p>Regards,<br>NU MOA ITSO Team</p>`,
//           }),
//         });
    
//         const result = await response.json();
    
//         if (result.success) {
//           console.log('✅ Email sent successfully!');

//         } else {
//           console.log('❌ Email failed:', result.error);
//         }

//       } catch (error) {
//         console.error('❌ Error sending email:', error);
//       }
//     };   

//     const handleSignup = async () => {
//         setLoading(true);
      
//         // Use individual state variables instead of signUpData
//         const email = signUpEmail;
//         const employeeId = employeeID;
//         const password = signUpPassword;
      
//         // Step 1: Validate email domain
//         const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//         const emailDomain = email.split("@")[1];
      
//         if (!validDomains.includes(emailDomain)) {
//           setError("Invalid email domain. Only @nu-moa.edu.ph and @students.nu-moa.edu.ph are allowed.");
//           setLoading(false);
//           return;
//         }
      
//         // Step 2: Password match check
//         if (password !== confirmPassword) {
//           setError("Passwords do not match.");
//           setLoading(false);
//           return;
//         }

//         if (!agreedToTerms) {
//           setError("You must agree to the Terms and Conditions.");
//           setLoading(false);
//           return;
//         }        
    
//         // Step 4: Validate employee ID format (e.g. 12-3456)
//         const employeeIdPattern = /^\d{2}-\d{4}$/;
//         if (!employeeIdPattern.test(employeeId.trim())) {
//           setError("Invalid employee ID format. Please use ##-#### format.");
//           setLoading(false);
//           return;
//         }
    
//         try {
//           // Step 4: Check if employeeId or email exists
//           const [employeePendingSnap, employeeAccountSnap, emailPendingSnap, emailAccountSnap] = await Promise.all([
//             getDocs(query(collection(db, "pendingaccounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "accounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "pendingaccounts"), where("email", "==", email.trim().toLowerCase()))),
//             getDocs(query(collection(db, "accounts"), where("email", "==", email.trim().toLowerCase()))),
//           ]);
      
//           if (!employeePendingSnap.empty || !employeeAccountSnap.empty) {
//             setError("This employee ID is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           if (!emailPendingSnap.empty || !emailAccountSnap.empty) {
//             setError("This email is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//           const firebaseUser = userCredential.user;
      
//           let role = "user";
//           if (jobTitle.toLowerCase() === "dean") role = "admin";
//           else if (jobTitle.toLowerCase().includes("custodian")) role = "super-user";
      
//           const sanitizedData = {
//             name: name.trim(),
//             email: email.trim().toLowerCase(),
//             employeeId: employeeId.trim().replace(/[^\d-]/g, ""),
//             jobTitle,
//             department,
//             role,
//             createdAt: serverTimestamp(),
//             status: "pending",
//             // uid: firebaseUser.uid,
//           };
      
//           await addDoc(collection(db, "pendingaccounts"), sanitizedData);

//           sendEmail(email, name);      
      
//           setModalMessage("Successfully Registered! Please check your email. Your account is pending ITSO approval.");
//           setIsModalVisible(true);
      
//           // Reset state variables
//           setName("");
//           setSignUpEmail("");
//           setEmployeeID("");
//           setSignUpPassword("");
//           setConfirmPassword("");
//           setJobTitle("");
//           setDepartment("");
//           setError("");
      
//         } catch (error) {
//           console.error("Sign up error:", error.message);
//           if (error.code === "auth/email-already-in-use") {
//             setError("Email already in use.");
    
//           } else {
//             setError("Failed to create account. Try again.");
//           }
    
//         } finally {
//           setLoading(false);
//         }
//       };  


//   return (
   
//     <View style={[styles.container, {paddingBottom: !isLoginSignup ? 16: 0}]}>
//       <StatusBar
//                 translucent
//                 backgroundColor="transparent"
//                 barStyle="dark-content" // or 'light-content' depending on your design
//               />
      
//       {!isLoginSignup && (
//         <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/login_pic.png')} style={{height: '45%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Hello!</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>

//              <View style={styles.buttonContainer}>
//               <Text style={{color: 'gray', marginTop: -30}}>Sign in to continue</Text>
//           <TouchableOpacity style={{width: '100%',backgroundColor: '#395a7f', justifyContent: 'center', borderRadius: 30, padding: 10, paddingVertical: 13}}
//             onPress={()=> setIsLoginSignup(true)}
//             >
//             <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 700}}>Login</Text>
//           </TouchableOpacity>


//           <TouchableOpacity style={{width: '100%',backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 30, padding: 10, borderWidth: 3, borderColor: '#395a7f'}}
//           onPress={() => {setIsLoginSignup(true), setIsSignup(true)}}
//           >
//             <Text style={{textAlign: 'center', color: '#395a7f', fontSize: 18, fontWeight: 700}}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>

//           <Text style={{position: 'absolute', bottom: 10, color: 'gray'}}>Powered by OnePixel</Text>
//           </View>
           
//         </View>
//       )}
    
    


//           {isLoginSignup && (
//             <>
// <KeyboardAvoidingView
//     style={{ flex: 1}}
//     keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//   >
//             <KeyboardAwareScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//         extraScrollHeight={0}
//         enableOnAndroid={true}
//         enableAutomaticScroll={true}
//       >

//             {/* Sign Up Inputs */}  
//             {isSignup 
//             && (
              
              
//               <View style={[styles.inner, {padding: 20}]}>
//                 <View style={{alignItems: 'center', paddingTop: 30, paddingBottom: 25, borderBottomWidth: 2, marginBottom: 25, borderColor: '#395a7f'}}>
//                   <Text style={{textAlign: 'center', color: 'black', fontSize: 28, fontWeight: 700}}>Signing Up</Text>
//                 </View>

//                 <Text style={styles.label}>Full Name:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: nameBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="Enter Full Name"
//                   value={name}
//                   onChangeText={setName}
//                   mode="outlined"
//                   onFocus={() => handleFocus('name')}
//                 onBlur={() => handleBlur('name')}
//                 inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//               </Animated.View>
                
//                 <Text style={styles.label}>Email:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="Enter Email Address (NU account)"
//                   value={signUpEmail}
//                   onChangeText={setSignUpEmail}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                    onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                   inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 {signUpEmail.length > 0 && !signUpEmail.includes('@') ? (
//                 <HelperText type="error" style={{ marginTop: '-25', marginBottom: '10'}}>Enter a valid email address.</HelperText>
//                     ) : null}
//               </Animated.View>


//                 <Text style={styles.label}>Employee ID:<Text style={{color:'red'}}>*</Text></Text>

//                 <Animated.View style={[styles.animatedInputContainer, { borderColor: employeeIDBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="e.g., 30-0912"
//                   value={employeeID}
//                   onChangeText={(text) => {
//                     const cleaned = text.replace(/\D/g, "");
//                     let formatted = cleaned;
//                     if (cleaned.length > 2) {
//                       formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`;
//                     }
//                     setEmployeeID(formatted);
//                   }}
//                   keyboardType="numeric"
//                   maxLength={7}
//                   mode="outlined"s
//                   onFocus={() => handleFocus('employeeID')}
//                 onBlur={() => handleBlur('employeeID')}
//                   inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 </Animated.View>

//                 {/* Job Title Menu */}
//               <Text style={styles.label}>Select Job Title/Department<Text style={{color:'red'}}>*</Text></Text>
//               <View style={styles.menucontainer}>
//               <Menu
//                 visible={jobMenuVisible}
//                 onDismiss={() => setJobMenuVisible(false)}
//                 statusBarHeight={50}
//                 type='elevated'
//                 anchor={
//                   <Button
//                   mode="outlined"
//                   onPress={() => setJobMenuVisible(true)}
//                     style={{
//                     borderWidth: 2,
//                     borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 50,
//                     justifyContent: 'center',
//                     backgroundColor: '#6e9fc1',
//                     maxWidth: 140
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}
//                 >
//                   {jobTitle || 'Job Title'}
//                 </Button>
                
//                 }
//               >
//                 {jobOptions.map(option => (
//                   <Menu.Item key={option} onPress={() => { setJobTitle(option); setJobMenuVisible(false); }} title={option} />
//                 ))}
//               </Menu>

//               <Menu
//                 visible={deptMenuVisible}
//                 onDismiss={() => setDeptMenuVisible(false)}
//                 anchor={
//                   <Button mode="outlined" onPress={() => setDeptMenuVisible(true)} 
//                   style={{
//                     borderWidth: 2,
//                     borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 50,
//                     justifyContent: 'center',
//                     backgroundColor: '#6e9fc1',
//                     maxWidth: 140
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}>
//                     {department || 'Department'}
//                   </Button>
//                 }
//               >
//                 {deptOptions.map(option => (
//                   <Menu.Item key={option} onPress={() => { setDepartment(option); setDeptMenuVisible(false); }} title={option}/>
//                 ))}
//               </Menu>
//               </View>
                

//                 {/* Password Inputs */}
//                 <Text style={styles.label}>Password:<Text style={{color:'red'}}>*</Text></Text>
//                   <Animated.View style={[styles.animatedInputContainer, { borderColor: passwordBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="Password"
//                   leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                   rightIcon={
//                     <Icon
//                       type="material"
//                       name={secureTextEntry ? 'visibility' : 'visibility-off'}
//                       color="#9CA3AF"
//                       onPress={() => setSecureTextEntry(!secureTextEntry)}
//                     />
//                   }
//                   value={signUpPassword}
//                   onChangeText={setSignUpPassword}
//                   secureTextEntry={secureTextEntry}
//                   onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                   inputContainerStyle={[styles.inputContainer]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 </Animated.View>


//                 <Text style={styles.label}>Confirm Password:<Text style={{color:'red'}}>*</Text></Text>
                
//                  <Animated.View style={[styles.animatedInputContainer, { borderColor: confirmPasswordBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="confirm password"
//                   leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                   rightIcon={
//                     <Icon
//                       type="material"
//                       name={secureTextEntry ? 'visibility' : 'visibility-off'}
//                       color="#9CA3AF"
//                       onPress={() => setSecureTextEntry(!secureTextEntry)}
//                     />
//                   }
//                   value={confirmPassword}
//                   onChangeText={setConfirmPassword}
//                   secureTextEntry={secureTextEntry}
//                  onFocus={() => handleFocus('confirmPassword')}
//                   onBlur={() => handleBlur('confirmPassword')}
//                   inputContainerStyle={[styles.inputContainer]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 </Animated.View>

//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
//                   <Checkbox
//                     status={agreedToTerms ? 'checked' : 'unchecked'}
//                     onPress={() => setAgreedToTerms(!agreedToTerms)}
//                   />
//                   <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
//                     <Text style={{ color: '#007BFF', textDecorationLine: 'underline' }}>
//                       View Terms and Conditions
//                     </Text>
//                   </TouchableOpacity>

                    
                  

//                   <TermsModal
//                     visible={isTermsModalVisible}
//                     onClose={() => setTermsModalVisible(false)}
//                   />
//                 </View>

//                 <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       styles.loginButton,
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
//                   <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
             
//               </View>
//             )}

//             {!isSignup && (
//                 <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/login_pic.png')} style={{height: '30%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Login</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>
//             {/* <Text style={{alignSelf: 'flex-start', marginLeft: 10, color: 'gray', marginBottom: 5}}>Login to your account</Text> */}

//             <View style={{width: '100%', paddingHorizontal: 10}}>
//             <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
//               <Input
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                 inputContainerStyle={styles.inputContainer} // removes underline
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
//               />
              
//             </Animated.View>

//             <Animated.View style={[styles.animatedInputContainer, { borderColor: passwordBorderColor, width: '100%'}]}>
//               <Input
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 secureTextEntry={!showPassword}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                 rightIcon={
//                   <Icon
//                     type="material"
//                     name={showPassword ? 'visibility' : 'visibility-off'}
//                     color="#9CA3AF"
//                     onPress={() => setShowPassword(!showPassword)}
//                   />
//                 }
//               />
//             </Animated.View>

//             {error ? <Text style={styles.error}>{error}</Text> : null}

//                 <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
//                 <Text style={styles.forgotPassword}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                   <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       styles.loginButton,
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
            
//             </View>
  

                

//            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
                   
//           </View>

//               </View>
//             )}

//           <ForgotPasswordModal
//             visible={isForgotPasswordVisible}
//             onClose={() => setForgotPasswordVisible(false)}
//           />
          
//         </KeyboardAwareScrollView>
//         </KeyboardAvoidingView>
//             </>
//           )}
// </View>
//   );
// }

// VERSION 2
// import React, { useState, useEffect, useRef } from 'react';
// import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableOpacity, UIManager, LayoutAnimation, StatusBar, Image, BackHandler, Alert } from 'react-native';
// import { Input, Text, Icon } from 'react-native-elements';
// import { TextInput, Card, HelperText, Menu, Provider, Button, Checkbox  } from 'react-native-paper';
// import { useAuth } from '../components/contexts/AuthContext';
// import { db, auth } from '../backend/firebase/FirebaseConfig';
// import { collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp, Timestamp, setDoc, doc, onSnapshot } from 'firebase/firestore';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
// import styles from './styles/LoginStyle';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import CustomButton from './customs/CustomButton';
// import ForgotPasswordModal from './ForgotPasswordModal';
// import TermsModal from './customs/TermsModal';
// import {Animated} from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// export default function LoginScreen({navigation}) {
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [signUpEmail, setSignUpEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signUpPassword, setSignUpPassword] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [secureTextEntry, setSecureTextEntry] = useState(true);
//   const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
//   const [isSignup, setIsSignup] = useState(null);
//   const [employeeID, setEmployeeID] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [jobTitle, setJobTitle] = useState('');
//   const [department, setDepartment] = useState('');
//   const [jobMenuVisible, setJobMenuVisible] = useState(false);
//   const [deptMenuVisible, setDeptMenuVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [isTermsModalVisible, setTermsModalVisible] = useState(false);
//   const [deptOptions, setDeptOptions] = useState([]);
//   const [departmentsAll, setDepartmentsAll] = useState([]);
//   const [isLoginSignup, setIsLoginSignup] = useState(false)
//   const [emailError, setEmailError] = useState('');
//   const nameBorderAnim = useRef(new Animated.Value(0)).current;
//   const emailBorderAnim = useRef(new Animated.Value(0)).current;
//   const employeeIDBorderAnim = useRef(new Animated.Value(0)).current;
//   const passwordBorderAnim = useRef(new Animated.Value(0)).current;
//   const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

//   const [focusStates, setFocusStates] = useState({
//   name: false,
//   email: false,
//   employeeID: false,
//   password: false,
//   confirmPassword: false,
// });

// useEffect(() => {
//   const unsubscribe = onSnapshot(
//     collection(db, "departments"),
//     (snapshot) => {
//       const depts = snapshot.docs
//         .map((doc) => doc.data().name)
//         .sort((a, b) => a.localeCompare(b));
//       setDepartmentsAll(depts);
//     },
//     (error) => {
//       console.error("Error fetching departments:", error);
//     }
//   );

//   return () => unsubscribe();
// }, []);

// useEffect(() => {
//   if (!jobTitle) {
//     setDeptOptions([]);
//     return;
//   }

//   if (jobTitle === "Faculty") {
//     setDeptOptions(departmentsAll); 

//   } else if (jobTitle === "Program Chair") {
//     setDeptOptions(departmentsAll.filter((dept) => dept !== "SHS"));

//   } else if (jobTitle === "Dean") {
//     setDeptOptions(["SAH", "SAS", "SOO", "SOD"]); 
    
//   } else {
//     setDeptOptions([]); // default
//   }

//   setDepartment(""); 
// }, [jobTitle, departmentsAll]);

// const handleFocus = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: true }));
//   animateBorder(field, 1);
// };

// const handleBlur = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: false }));
//   animateBorder(field, 0);
// };

// const animateBorder = (field, toValue) => {
//   let animRef = null;

//   switch (field) {
//     case 'name': animRef = nameBorderAnim; break;
//     case 'email': animRef = emailBorderAnim; break;
//     case 'employeeID': animRef = employeeIDBorderAnim; break;
//     case 'password': animRef = passwordBorderAnim; break;
//     case 'confirmPassword': animRef = confirmPasswordBorderAnim; break;
//   }

//   if (animRef) {
//     Animated.timing(animRef, {
//       toValue,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }
// };


// const nameBorderColor = nameBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const emailBorderColor = emailBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const employeeIDBorderColor = employeeIDBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const passwordBorderColor = passwordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

//   const jobOptions = ['Dean', 'Program Chair', 'Laboratory Custodian', 'Faculty'];
//   // const deptOptions = ['Medical Technology', 'Nursing', 'Dentistry', 'Optometry'];

//   // const handleLogin = async () => {
    
//   //     if (!email || !password) {
//   //       setError('Please enter both email and password');
//   //       return;
//   //     }
    
//   //     setError('');
//   //     setLoading(true);
    
//   //     try {
//   //       const usersRef = collection(db, "accounts");
//   //       const q = query(usersRef, where("email", "==", email));
//   //       const querySnapshot = await getDocs(q);
    
//   //       let userDoc, userData, isSuperAdmin = false;
    
//   //       // First check regular accounts
//   //       if (!querySnapshot.empty) {
//   //         userDoc = querySnapshot.docs[0];
//   //         userData = userDoc.data();
  
//   //       } else {
//   //         // Then check if it's a super-admin
//   //         const superAdminRef = collection(db, "super-admin");
//   //         const superAdminQuery = query(superAdminRef, where("email", "==", email));
//   //         const superAdminSnapshot = await getDocs(superAdminQuery);
    
//   //         if (!superAdminSnapshot.empty) {
//   //           userDoc = superAdminSnapshot.docs[0];
//   //           userData = userDoc.data();
//   //           isSuperAdmin = true;
//   //         }
//   //       }
    
//   //       if (!userData) {
//   //         setError("User not found. Please contact admin.");
//   //         setLoading(false);
//   //         return;
//   //       }
    
//   //       if (userData.disabled) {
//   //         setError("Your account has been disabled.");
//   //         await signOut(auth);
//   //         setLoading(false);
//   //         return;
//   //       }
    
//   //       // If password not set yet (new user)
//   //       if (!isSuperAdmin && !userData.uid) {
//   //         setError("Password not set. Please login through website first.");
//   //         setLoading(false);
//   //         return;
//   //       }
    
//   //       // Block check
//   //       // if (userData.isBlocked && userData.blockedUntil) {
//   //       //   const now = Timestamp.now().toMillis();
//   //       //   const blockedUntil = userData.blockedUntil.toMillis();
    
//   //       //   if (now < blockedUntil) {
//   //       //     const remainingTime = Math.ceil((blockedUntil - now) / 1000);
//   //       //     setError(`Account is blocked. Try again after ${remainingTime} seconds.`);
//   //       //     setLoading(false);
//   //       //     return;
  
//   //       //   } else {
//   //       //     await updateDoc(userDoc.ref, {
//   //       //       isBlocked: false,
//   //       //       loginAttempts: 0,
//   //       //       blockedUntil: null,
//   //       //     });
  
//   //       //     console.log("Account unblocked.");
//   //       //   }
//   //       // }
    
//   //       if (isSuperAdmin) {
//   //         if (userData.password === password) {
//   //           await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//   //           login({ ...userData, id: userDoc.id, role: "Super Admin" });
    
//   //           navigation.replace("SuperAdminDashboard");
    
//   //         } else {
//   //           // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//   //           // if (newAttempts >= 4) {
//   //           //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//   //           //   await updateDoc(userDoc.ref, {
//   //           //     isBlocked: true,
//   //           //     blockedUntil: Timestamp.fromMillis(unblockTime),
//   //           //   });
    
//   //           //   setError("Account blocked for 30 minutes.");
  
//   //           // } else {
//   //           //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//   //           //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//   //           // }
            
//   //           setError(`Invalid password.`);
//   //           setLoading(false);
//   //           return;
//   //         }
    
//   //       } else {
//   //         // ✅ Firebase Auth login for regular users/admins
//   //         try {
//   //           await signInWithEmailAndPassword(auth, email, password);
//   //           await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//   //           const role = (userData.role || "user").toLowerCase();
//   //           login({ ...userData, id: userDoc.id });

//   //           console.log("Login Succesfull!")
    
//   //           await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//   //             action: "User Logged In (Mobile)",
//   //             userName: userData.name || "User",
//   //             timestamp: serverTimestamp(),
              
//   //           });
    
//   //           switch (role) {
//   //             case "admin1":
//   //             case "admin2":
//   //             case "admin":
//   //               navigation.replace("Admin");
//   //               console.log("Login Succesfull!")
//   //               break;
  

//   //             case "super-user":
//   //               navigation.replace("Super-User");
//   //               console.log("Login Succesfull!")
//   //               break;
  
//   //             case "user":
//   //               navigation.replace('User')
//   //               console.log("Login Succesfull!")
//   //               break;
  
//   //             default:
//   //               setError("Unknown role. Contact admin.");
//   //           }
    
//   //         } catch (authError) {
//   //           // console.error("Auth login failed:", authError.message);
    
//   //           // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//   //           // if (newAttempts >= 4) {
//   //           //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//   //           //   await updateDoc(userDoc.ref, {
//   //           //     isBlocked: true,
//   //           //     blockedUntil: Timestamp.fromMillis(unblockTime),
//   //           //   });
    
//   //           //   setError("Account blocked after 4 failed attempts.");
              
//   //           // } else {
//   //           //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//   //           //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//   //           // }
    
//   //           setError(`Invalid password.`);
//   //           setLoading(false);
//   //           return;
//   //         }
//   //       }
    
//   //     } catch (error) {
//   //       console.error("Login error:", error);
//   //       setError("Unexpected error. Try again.");
  
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//     const handleLogin = async () => {
    
//       if (!email || !password) {
//         setError('Please enter both email and password');
//         return;
//       }
    
//       setError('');
//       setLoading(true);
    
//       try {
//         const usersRef = collection(db, "accounts");
//         const q = query(usersRef, where("email", "==", email));
//         const querySnapshot = await getDocs(q);
    
//         let userDoc, userData, isSuperAdmin = false;
    
//         // First check regular accounts
//         if (!querySnapshot.empty) {
//           userDoc = querySnapshot.docs[0];
//           userData = userDoc.data();
  
//         } else {
//           // Then check if it's a super-admin
//           const superAdminRef = collection(db, "super-admin");
//           const superAdminQuery = query(superAdminRef, where("email", "==", email));
//           const superAdminSnapshot = await getDocs(superAdminQuery);
    
//           if (!superAdminSnapshot.empty) {
//             userDoc = superAdminSnapshot.docs[0];
//             userData = userDoc.data();
//             isSuperAdmin = true;
//           }
//         }
    
//         if (!userData) {
//           setError("User not found. Please contact admin.");
//           setLoading(false);
//           return;
//         }
    
//         if (userData.disabled) {
//           setError("Your account has been disabled.");
//           await signOut(auth);
//           setLoading(false);
//           return;
//         }
    
//         // If password not set yet (new user)
//         if (!isSuperAdmin && !userData.uid) {
//           setError("Password not set. Please login through website first.");
//           setLoading(false);
//           return;
//         }
    
//         // Block check
//         // if (userData.isBlocked && userData.blockedUntil) {
//         //   const now = Timestamp.now().toMillis();
//         //   const blockedUntil = userData.blockedUntil.toMillis();
    
//         //   if (now < blockedUntil) {
//         //     const remainingTime = Math.ceil((blockedUntil - now) / 1000);
//         //     setError(`Account is blocked. Try again after ${remainingTime} seconds.`);
//         //     setLoading(false);
//         //     return;
  
//         //   } else {
//         //     await updateDoc(userDoc.ref, {
//         //       isBlocked: false,
//         //       loginAttempts: 0,
//         //       blockedUntil: null,
//         //     });
  
//         //     console.log("Account unblocked.");
//         //   }
//         // }
    
//         if (isSuperAdmin) {
//           if (userData.password === password) {
//             await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             login({ ...userData, id: userDoc.id, role: "Super Admin" });
    
//             navigation.replace("SuperAdminDashboard");
    
//           } else {
//             // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             // if (newAttempts >= 4) {
//             //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//             //   await updateDoc(userDoc.ref, {
//             //     isBlocked: true,
//             //     blockedUntil: Timestamp.fromMillis(unblockTime),
//             //   });
    
//             //   setError("Account blocked for 30 minutes.");
  
//             // } else {
//             //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//             //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             // }
            
//             setError(`Invalid password.`);
//             setLoading(false);
//             return;
//           }
    
//         } else {
//           // ✅ Firebase Auth login for regular users/admins
//           try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const signedInUser = userCredential.user;
            
//             // await signInWithEmailAndPassword(auth, email, password);
//             // await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             // const role = (userData.role || "user").toLowerCase();
//             // login({ ...userData, id: userDoc.id });

//             // console.log("Login Succesfull!")
    
//             // await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//             //   action: "User Logged In (Mobile)",
//             //   userName: userData.name || "User",
//             //   timestamp: serverTimestamp(),
              
//             // });

//             // 🔁 Force reload to ensure latest email verification status
//             await signedInUser.reload();
//             const refreshedUser = auth.currentUser;

//             if (!refreshedUser || !refreshedUser.emailVerified) {
//               await signOut(auth);
//               setError("Please verify your email before logging in.");
//               setLoading(false);
//               return;
//             }

//             await updateDoc(userDoc.ref, { loginAttempts: 0 });

//             const role = (userData.role || "user").toLowerCase();
//             login({ ...userData, id: userDoc.id });

//             console.log("Login Successful!");

//             await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//               action: "User Logged In (Mobile)",
//               userName: userData.name || "User",
//               timestamp: serverTimestamp(),
//             });

//             // try {
//             //   const token = await registerForPushNotificationsAsync(userDoc.id);
//             //   if (token) {
//             //     console.log("✅ Push token registered and saved.");
                
//             //   } else {
//             //     console.log("⚠️ Push token registration failed or permission denied.");
//             //   }

//             // } catch (err) {
//             //   console.error("🔥 Push token registration crashed:", err.message);
//             // }

//              // ✅ Register for push notifications ONCE
//             try {
//               const token = await registerForPushNotificationsAsync(userDoc.id, role); // ⬅️ Pass role here
//               if (token) {
//                 console.log("✅ Push token registered and saved.");

//               } else {
//                 console.log("⚠️ Push token registration failed or permission denied.");
//               }

//             } catch (err) {
//               console.error("🔥 Push token registration crashed:", err.message);
//             }
    
//             switch (role) {
//               case "admin1":
//               case "admin2":
//               case "admin":
//                 // try {
//                 //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
//                 //   console.log("Push token registered.");
                  
//                 // } catch (e) {
//                 //   console.log("Push token registration failed:", e);
//                 // }

//                 navigation.replace("Admin");
//                 console.log("Login Succesfull!")
//                 break;
  

//               case "super-user":
//                 // try {
//                 //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
//                 //   console.log("Push token registered.");
                  
//                 // } catch (e) {
//                 //   console.log("Push token registration failed:", e);
//                 // }

//                 navigation.replace("Super-User");
//                 console.log("Login Succesfull!")
//                 break;
  
//               case "user":
//                 navigation.replace('User')
//                 console.log("Login Succesfull!")
//                 break;
  
//               default:
//                 setError("Unknown role. Contact admin.");
//             }
    
//           } catch (authError) {
//             // console.error("Auth login failed:", authError.message);
    
//             // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             // if (newAttempts >= 4) {
//             //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//             //   await updateDoc(userDoc.ref, {
//             //     isBlocked: true,
//             //     blockedUntil: Timestamp.fromMillis(unblockTime),
//             //   });
    
//             //   setError("Account blocked after 4 failed attempts.");
              
//             // } else {
//             //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//             //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             // }
    
//             setError(`Invalid password.`);
//             setLoading(false);
//             return;
//           }
//         }
    
//       } catch (error) {
//         console.error("Login error:", error);
//         setError("Unexpected error. Try again.");
  
//       } finally {
//         setLoading(false);
//       }
//     };

//     const sendEmail = async (email, name) => {
//       try {
//         const response = await fetch('https://sendemail-guopzbbmca-uc.a.run.app', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             to: email.trim().toLowerCase(),
//             subject: 'Account Registration - Pending Approval',
//             text: `Hi ${name},\n\nThank you for registering. Your account is now pending approval from the ITSO.\n\nRegards,\nNU MOA ITSO Team`,
//             html: `<p>Hi ${name},</p><p>Thank you for registering. Your account is now <strong>pending approval</strong> from the ITSO.</p><p>Regards,<br>NU MOA ITSO Team</p>`,
//           }),
//         });
    
//         const result = await response.json();
    
//         if (result.success) {
//           console.log('✅ Email sent successfully!');

//         } else {
//           console.log('❌ Email failed:', result.error);
//         }

//       } catch (error) {
//         console.error('❌ Error sending email:', error);
//       }
//     };   

//     const handleSignup = async () => {
//         setLoading(true);
      
//         // Use individual state variables instead of signUpData
//         const email = signUpEmail;
//         const employeeId = employeeID;
//         const password = signUpPassword;
      
//         // Step 1: Validate email domain
//         const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//         const emailDomain = email.split("@")[1];
      
//         if (!validDomains.includes(emailDomain)) {
//           setError("Invalid email domain. Only @nu-moa.edu.ph and @students.nu-moa.edu.ph are allowed.");
//           setLoading(false);
//           return;
//         }
      
//         // Step 2: Password match check
//         // if (password !== confirmPassword) {
//         //   setError("Passwords do not match.");
//         //   setLoading(false);
//         //   return;
//         // }

//         if (!agreedToTerms) {
//           setError("You must agree to the Terms and Conditions.");
//           setLoading(false);
//           return;
//         }        
    
//         // Step 4: Validate employee ID format (e.g. 12-3456)
//         const employeeIdPattern = /^\d{2}-\d{4}$/;
//         if (!employeeIdPattern.test(employeeId.trim())) {
//           setError("Invalid employee ID format. Please use ##-#### format.");
//           setLoading(false);
//           return;
//         }
    
//         try {
//           // Step 4: Check if employeeId or email exists
//           const [employeePendingSnap, employeeAccountSnap, emailPendingSnap, emailAccountSnap] = await Promise.all([
//             getDocs(query(collection(db, "pendingaccounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "accounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "pendingaccounts"), where("email", "==", email.trim().toLowerCase()))),
//             getDocs(query(collection(db, "accounts"), where("email", "==", email.trim().toLowerCase()))),
//           ]);
      
//           if (!employeePendingSnap.empty || !employeeAccountSnap.empty) {
//             setError("This employee ID is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           if (!emailPendingSnap.empty || !emailAccountSnap.empty) {
//             setError("This email is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//           // const firebaseUser = userCredential.user;
      
//           // let role = "user";
//           // if (jobTitle.toLowerCase() === "dean") {
//           //   role = "admin";

//           // } else if (jobTitle.toLowerCase() === "program chair") {
//           //   role = "admin";

//           // } else if (jobTitle.toLowerCase().includes("custodian")) {
//           //   role = "super-user";

//           // } else if (jobTitle.toLowerCase() === "faculty") {
//           //   role = "user";
//           // }

//            let role = "user";

//           if (jobTitle.toLowerCase() === "dean") {
//             if (department.toLowerCase() === "sah") {
//               role = "admin";

//             } else {
//               role = "user";
//             }

//           } else if (jobTitle.toLowerCase() === "program chair") {
//             role = "admin";

//           } else if (jobTitle.toLowerCase().includes("custodian")) {
//             role = "super-user";

//           } else if (jobTitle.toLowerCase() === "faculty") {
//             role = "user";
//           }
      
//           const sanitizedData = {
//             name: name.trim(),
//             email: email.trim().toLowerCase(),
//             employeeId: employeeId.trim().replace(/[^\d-]/g, ""),
//             jobTitle,
//             department,
//             role,
//             createdAt: serverTimestamp(),
//             status: "pending",
//             // uid: firebaseUser.uid,
//           };
      
//           await addDoc(collection(db, "pendingaccounts"), sanitizedData);

//           sendEmail(email, name);      
      
//           setModalMessage("Successfully Registered! Please check your email. Your account is pending ITSO approval.");
//           setIsModalVisible(true);
      
//           // Reset state variables
//           setName("");
//           setSignUpEmail("");
//           setEmployeeID("");
//           setSignUpPassword("");
//           setConfirmPassword("");
//           setJobTitle("");
//           setDepartment("");
//           setError("");

//           Alert.alert("Sign Up Succesfull!");
      
//         } catch (error) {
//           console.error("Sign up error:", error.message);
//           if (error.code === "auth/email-already-in-use") {
//             setError("Email already in use.");
    
//           } else {
//             setError("Failed to create account. Try again.");
//           }
    
//         } finally {
//           setLoading(false);
//         }
//       };  


//   return (
   
//     <View style={[styles.container, {paddingBottom: !isLoginSignup ? 16: 0}]}>
//       <StatusBar
//                 translucent
//                 backgroundColor="transparent"
//                 barStyle="dark-content" // or 'light-content' depending on your design
//               />
      
//       {!isLoginSignup && (
//         <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/login_pic.png')} style={{height: '45%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Hello!</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>

//              <View style={styles.buttonContainer}>
//               <Text style={{color: 'gray', marginTop: -30}}>Sign in to continue</Text>
//           <TouchableOpacity style={{width: '100%',backgroundColor: '#395a7f', justifyContent: 'center', borderRadius: 30, padding: 10, paddingVertical: 13}}
//             onPress={()=> setIsLoginSignup(true)}
//             >
//             <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 700}}>Login</Text>
//           </TouchableOpacity>


//           <TouchableOpacity style={{width: '100%',backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 30, padding: 10, borderWidth: 3, borderColor: '#395a7f'}}
//           onPress={() => {setIsLoginSignup(true), setIsSignup(true)}}
//           >
//             <Text style={{textAlign: 'center', color: '#395a7f', fontSize: 18, fontWeight: 700}}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>

//           <Text style={{position: 'absolute', bottom: 10, color: 'gray'}}>Powered by OnePixel</Text>
//           </View>
           
//         </View>
//       )}

//           {isLoginSignup && (
//             <>
//             <KeyboardAvoidingView
//               style={{ flex: 1}}
//               keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
//               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             >
//                 <KeyboardAwareScrollView
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.scrollContainer}
//                   keyboardShouldPersistTaps="handled"
//                   extraScrollHeight={0}
//                   enableOnAndroid={true}
//                   enableAutomaticScroll={true}
//                 >

//             {/* Sign Up Inputs */}  
//             {isSignup 
//             && (
              
//               <View style={[styles.inner, {padding: 20}]}>
//                 <View style={{alignItems: 'center', paddingTop: 30, paddingBottom: 25, borderBottomWidth: 2, marginBottom: 25, borderColor: '#395a7f'}}>
//                   <Text style={{textAlign: 'center', color: 'black', fontSize: 28, fontWeight: 700}}>Signing Up</Text>
//                 </View>

//                 <Text style={styles.label}>Full Name:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: nameBorderColor, width: '100%' }]}>
//                 {/* <Input
//                   placeholder="Enter Full Name"
//                   value={name}
//                   onChangeText={setName}
//                   mode="outlined"
//                   onFocus={() => handleFocus('name')}
//                 onBlur={() => handleBlur('name')}
//                 inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 /> */}

//                 <Input
//                   placeholder="Enter Full Name"
//                   value={name}
//                   onChangeText={(text) => {
//                     let formatted = text.replace(/[^a-zA-Z\s]/g, ""); // allow only letters and spaces

//                     // Capitalize the first letter of each word
//                     formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

//                     setName(formatted);
//                   }}
//                   mode="outlined"
//                   onFocus={() => handleFocus('name')}
//                   onBlur={() => handleBlur('name')}
//                   inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]} // removes underline
//                   inputStyle={styles.inputText}
//                 />
//               </Animated.View>
                
//                 <Text style={styles.label}>Email:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
//                 {/* <Input
//                   placeholder="Enter Email Address (NU account)"
//                   value={signUpEmail}
//                   onChangeText={(text) => {
//                     setSignUpEmail(text);

//                     const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//                     const parts = text.split("@");
//                     const domain = parts.length > 1 ? parts[1] : "";

//                     if (!validDomains.includes(domain)) {
//                       setEmailError("Only @nu-moa.edu.ph or @students.nu-moa.edu.ph emails are allowed.");
//                     } else {
//                       setEmailError('');
//                     }
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                    onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                   inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 /> */}

//                 <Input
//                   placeholder="Enter Email Address (NU account)"
//                   value={signUpEmail}
//                   onChangeText={(text) => {
//                     const cleanedText = text.replace(/\s/g, "");
//                     setSignUpEmail(cleanedText);

//                     const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//                     const parts = cleanedText.split("@");
//                     const domain = parts.length > 1 ? parts[1] : "";

//                     if (!validDomains.includes(domain)) {
//                       setEmailError("Only @nu-moa.edu.ph or @students.nu-moa.edu.ph emails are allowed.");
//                     } else {
//                       setEmailError("");
//                     }
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   onFocus={() => handleFocus('email')}
//                   onBlur={() => handleBlur('email')}
//                   inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]}
//                   inputStyle={styles.inputText}
//                 />

//                 {/* {signUpEmail.length > 0 && !signUpEmail.includes('@') ? (
//                 <HelperText type="error" style={{ marginTop: '-25', marginBottom: '10'}}>Enter a valid email address.</HelperText>
//                     ) : null} */}
//                     {emailError !== '' && (
//                       <HelperText type="error" style={{ marginTop: -10, marginBottom: 10 }}>
//                         {emailError}
//                       </HelperText>
//                     )}
//               </Animated.View>


//                 <Text style={styles.label}>Employee ID:<Text style={{color:'red'}}>*</Text></Text>

//                 <Animated.View style={[styles.animatedInputContainer, { borderColor: employeeIDBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="e.g., 30-0912"
//                   value={employeeID}
//                   onChangeText={(text) => {
//                     const cleaned = text.replace(/\D/g, "");
//                     let formatted = cleaned;
//                     if (cleaned.length > 2) {
//                       formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`;
//                     }
//                     setEmployeeID(formatted);
//                   }}
//                   keyboardType="numeric"
//                   maxLength={7}
//                   mode="outlined"s
//                   onFocus={() => handleFocus('employeeID')}
//                 onBlur={() => handleBlur('employeeID')}
//                   inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 </Animated.View>

//                 {/* Job Title Menu */}
//               <Text style={styles.label}>Select Job Title/Department<Text style={{color:'red'}}>*</Text></Text>
//               <View style={styles.menucontainer}>
//               <Menu
//                 visible={jobMenuVisible}
//                 onDismiss={() => setJobMenuVisible(false)}
//                 statusBarHeight={50}
//                 type='elevated'
//                 anchor={
//                   <Button
//                   mode="outlined"
//                   onPress={() => setJobMenuVisible(true)}
//                     style={{
//                     borderWidth: 2,
//                     borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 50,
//                     justifyContent: 'center',
//                     backgroundColor: '#6e9fc1',
//                     maxWidth: 140
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}
//                 >
//                   {jobTitle || 'Job Title'}
//                 </Button>
                
//                 }
//               >
//                 {jobOptions.map(option => (
//                   // <Menu.Item key={option} onPress={() => { setJobTitle(option); setJobMenuVisible(false); }} title={option} />
//                   <Menu.Item
//                     key={option}
//                     onPress={() => {
//                       setJobTitle(option);
//                       setJobMenuVisible(false);
//                     }}
//                     title={option}
//                   />
//                 ))}
//               </Menu>

//               <Menu
//                 visible={deptMenuVisible}
//                 onDismiss={() => setDeptMenuVisible(false)}
//                 anchor={
//                   <Button mode="outlined" onPress={() => setDeptMenuVisible(true)} 
//                   style={{
//                     borderWidth: 2,
//                     borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 50,
//                     justifyContent: 'center',
//                     backgroundColor: '#6e9fc1',
//                     maxWidth: 140
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}>
//                     {department || 'Department'}
//                   </Button>
//                 }
//               >
//                 {/* {deptOptions.map(option => (
//                   <Menu.Item key={option} onPress={() => { setDepartment(option); setDeptMenuVisible(false); }} title={option}/>
//                 ))} */}
//                 {deptOptions.map(option => (
//                   <Menu.Item
//                     key={option}
//                     onPress={() => {
//                       setDepartment(option);
//                       setDeptMenuVisible(false);
//                     }}
//                     title={option}
//                   />
//                 ))}
//               </Menu>
//               </View>
                
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
//                   <Checkbox
//                     status={agreedToTerms ? 'checked' : 'unchecked'}
//                     onPress={() => setAgreedToTerms(!agreedToTerms)}
//                   />
//                   <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
//                     <Text style={{ color: '#007BFF', textDecorationLine: 'underline' }}>
//                       View Terms and Conditions
//                     </Text>
//                   </TouchableOpacity>

                    
                  

//                   <TermsModal
//                     visible={isTermsModalVisible}
//                     onClose={() => setTermsModalVisible(false)}
//                   />
//                 </View>

//                 <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       styles.loginButton,
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
//                   <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
             
//               </View>
//             )}

//             {!isSignup && (
//                 <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/login_pic.png')} style={{height: '30%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Login</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>
//             {/* <Text style={{alignSelf: 'flex-start', marginLeft: 10, color: 'gray', marginBottom: 5}}>Login to your account</Text> */}

//             <View style={{width: '100%', paddingHorizontal: 10}}>
//             <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
//               {/* <Input
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                 inputContainerStyle={styles.inputContainer} 
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
//               /> */}

//               <Input
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
//                 onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
//               />
              
//             </Animated.View>

//             <Animated.View style={[styles.animatedInputContainer, { borderColor: passwordBorderColor, width: '100%'}]}>
//               {/* <Input
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 secureTextEntry={!showPassword}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                 rightIcon={
//                   <Icon
//                     type="material"
//                     name={showPassword ? 'visibility' : 'visibility-off'}
//                     color="#9CA3AF"
//                     onPress={() => setShowPassword(!showPassword)}
//                   />
//                 }
//               /> */}

//               <Input
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 secureTextEntry={!showPassword}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                 rightIcon={
//                   <Icon
//                     type="material"
//                     name={showPassword ? 'visibility' : 'visibility-off'}
//                     color="#9CA3AF"
//                     onPress={() => setShowPassword(!showPassword)}
//                   />
//                 }
//               />
//             </Animated.View>

//             {error ? <Text style={styles.error}>{error}</Text> : null}

//                 <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
//                 <Text style={styles.forgotPassword}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                   <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       styles.loginButton,
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
            
//             </View>
  

                

//            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
                   
//           </View>

//               </View>
//             )}
//           <ForgotPasswordModal
//             visible={isForgotPasswordVisible}
//             onClose={() => setForgotPasswordVisible(false)}
//           />
          
//         </KeyboardAwareScrollView>
//         </KeyboardAvoidingView>
//             </>
//           )}

// </View>
//   );
// }



// VERSION 3
// import React, { useState, useEffect, useRef } from 'react';
// import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableOpacity, UIManager, LayoutAnimation, StatusBar, Image, BackHandler, Alert } from 'react-native';
// import { Input, Text, Icon } from 'react-native-elements';
// import { TextInput, Card, HelperText, Menu, Provider, Button, Checkbox  } from 'react-native-paper';
// import { useAuth } from '../components/contexts/AuthContext';
// import { db, auth } from '../backend/firebase/FirebaseConfig';
// import { collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp, Timestamp, setDoc, doc, onSnapshot } from 'firebase/firestore';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
// import styles from './styles/LoginStyle';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import CustomButton from './customs/CustomButton';
// import ForgotPasswordModal from './ForgotPasswordModal';
// import TermsModal from './customs/TermsModal';
// import {Animated} from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { registerForPushNotificationsAsync } from '../utils/RegisterPushToken';
// import { color } from 'react-native-elements/dist/helpers';

// export default function LoginScreen({navigation}) {
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [signUpEmail, setSignUpEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signUpPassword, setSignUpPassword] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [secureTextEntry, setSecureTextEntry] = useState(true);
//   const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
//   const [isSignup, setIsSignup] = useState(null);
//   const [employeeID, setEmployeeID] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [jobTitle, setJobTitle] = useState('');
//   const [department, setDepartment] = useState('');
//   const [jobMenuVisible, setJobMenuVisible] = useState(false);
//   const [deptMenuVisible, setDeptMenuVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [isTermsModalVisible, setTermsModalVisible] = useState(false);
//   const [deptOptions, setDeptOptions] = useState([]);
//   const [departmentsAll, setDepartmentsAll] = useState([]);
//   const [isLoginSignup, setIsLoginSignup] = useState(false)
//   const [emailError, setEmailError] = useState('');
//   const nameBorderAnim = useRef(new Animated.Value(0)).current;
//   const emailBorderAnim = useRef(new Animated.Value(0)).current;
//   const employeeIDBorderAnim = useRef(new Animated.Value(0)).current;
//   const passwordBorderAnim = useRef(new Animated.Value(0)).current;
//   const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

//   const [focusStates, setFocusStates] = useState({
//   name: false,
//   email: false,
//   employeeID: false,
//   password: false,
//   confirmPassword: false,
// });

// useEffect(() => {
//   const unsubscribe = onSnapshot(
//     collection(db, "departments"),
//     (snapshot) => {
//       const depts = snapshot.docs
//         .map((doc) => doc.data().name)
//         .sort((a, b) => a.localeCompare(b));
//       setDepartmentsAll(depts);
//     },
//     (error) => {
//       console.error("Error fetching departments:", error);
//     }
//   );

//   return () => unsubscribe();
// }, []);

// useEffect(() => {
//   if (!jobTitle) {
//     setDeptOptions([]);
//     return;
//   }

//   if (jobTitle === "Faculty") {
//     setDeptOptions(departmentsAll); 

//   } else if (jobTitle === "Program Chair") {
//     setDeptOptions(departmentsAll.filter((dept) => dept !== "SHS"));

//   } else if (jobTitle === "Dean") {
//     setDeptOptions(["SAH", "SAS", "SOO", "SOD"]); 
    
//   } else {
//     setDeptOptions([]); // default
//   }

//   setDepartment(""); 
// }, [jobTitle, departmentsAll]);

// const handleFocus = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: true }));
//   animateBorder(field, 1);
// };

// const handleBlur = (field) => {
//   setFocusStates((prev) => ({ ...prev, [field]: false }));
//   animateBorder(field, 0);
// };

// const animateBorder = (field, toValue) => {
//   let animRef = null;

//   switch (field) {
//     case 'name': animRef = nameBorderAnim; break;
//     case 'email': animRef = emailBorderAnim; break;
//     case 'employeeID': animRef = employeeIDBorderAnim; break;
//     case 'password': animRef = passwordBorderAnim; break;
//     case 'confirmPassword': animRef = confirmPasswordBorderAnim; break;
//   }

//   if (animRef) {
//     Animated.timing(animRef, {
//       toValue,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }
// };


// const nameBorderColor = nameBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const emailBorderColor = emailBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const employeeIDBorderColor = employeeIDBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const passwordBorderColor = passwordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

// const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['#ccc', '#395a7f']
// });

//   const jobOptions = ['Dean', 'Program Chair', 'Laboratory Custodian', 'Faculty'];
//   // const deptOptions = ['Medical Technology', 'Nursing', 'Dentistry', 'Optometry'];

//   const handleLogin = async () => {
    
//       if (!email || !password) {
//         setError('Please enter both email and password');
//         return;
//       }
    
//       setError('');
//       setLoading(true);
    
//       try {
//         const usersRef = collection(db, "accounts");
//         const q = query(usersRef, where("email", "==", email));
//         const querySnapshot = await getDocs(q);
    
//         let userDoc, userData, isSuperAdmin = false;
    
//         // First check regular accounts
//         if (!querySnapshot.empty) {
//           userDoc = querySnapshot.docs[0];
//           userData = userDoc.data();
  
//         } else {
//           // Then check if it's a super-admin
//           const superAdminRef = collection(db, "super-admin");
//           const superAdminQuery = query(superAdminRef, where("email", "==", email));
//           const superAdminSnapshot = await getDocs(superAdminQuery);
    
//           if (!superAdminSnapshot.empty) {
//             userDoc = superAdminSnapshot.docs[0];
//             userData = userDoc.data();
//             isSuperAdmin = true;
//           }
//         }
    
//         if (!userData) {
//           setError("User not found. Please contact admin.");
//           setLoading(false);
//           return;
//         }
    
//         if (userData.disabled) {
//           setError("Your account has been disabled.");
//           await signOut(auth);
//           setLoading(false);
//           return;
//         }
    
//         // If password not set yet (new user)
//         if (!isSuperAdmin && !userData.uid) {
//           setError("Password not set. Please login through website first.");
//           setLoading(false);
//           return;
//         }
    
//         // Block check
//         // if (userData.isBlocked && userData.blockedUntil) {
//         //   const now = Timestamp.now().toMillis();
//         //   const blockedUntil = userData.blockedUntil.toMillis();
    
//         //   if (now < blockedUntil) {
//         //     const remainingTime = Math.ceil((blockedUntil - now) / 1000);
//         //     setError(`Account is blocked. Try again after ${remainingTime} seconds.`);
//         //     setLoading(false);
//         //     return;
  
//         //   } else {
//         //     await updateDoc(userDoc.ref, {
//         //       isBlocked: false,
//         //       loginAttempts: 0,
//         //       blockedUntil: null,
//         //     });
  
//         //     console.log("Account unblocked.");
//         //   }
//         // }
    
//         if (isSuperAdmin) {
//           if (userData.password === password) {
//             await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             login({ ...userData, id: userDoc.id, role: "Super Admin" });
    
//             navigation.replace("SuperAdminDashboard");
    
//           } else {
//             // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             // if (newAttempts >= 4) {
//             //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//             //   await updateDoc(userDoc.ref, {
//             //     isBlocked: true,
//             //     blockedUntil: Timestamp.fromMillis(unblockTime),
//             //   });
    
//             //   setError("Account blocked for 30 minutes.");
  
//             // } else {
//             //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//             //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             // }
            
//             setError(`Invalid password.`);
//             setLoading(false);
//             return;
//           }
    
//         } else {
//           // ✅ Firebase Auth login for regular users/admins
//           try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const signedInUser = userCredential.user;
            
//             // await signInWithEmailAndPassword(auth, email, password);
//             // await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
//             // const role = (userData.role || "user").toLowerCase();
//             // login({ ...userData, id: userDoc.id });

//             // console.log("Login Succesfull!")
    
//             // await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//             //   action: "User Logged In (Mobile)",
//             //   userName: userData.name || "User",
//             //   timestamp: serverTimestamp(),
              
//             // });

//             // 🔁 Force reload to ensure latest email verification status
//             await signedInUser.reload();
//             const refreshedUser = auth.currentUser;

//             if (!refreshedUser || !refreshedUser.emailVerified) {
//               await signOut(auth);
//               setError("Please verify your email before logging in.");
//               setLoading(false);
//               return;
//             }

//             await updateDoc(userDoc.ref, { loginAttempts: 0 });

//             const role = (userData.role || "user").toLowerCase();
//             login({ ...userData, id: userDoc.id });

//             console.log("Login Successful!");

//             await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
//               action: "User Logged In (Mobile)",
//               userName: userData.name || "User",
//               timestamp: serverTimestamp(),
//             });

//             // try {
//             //   const token = await registerForPushNotificationsAsync(userDoc.id);
//             //   if (token) {
//             //     console.log("✅ Push token registered and saved.");

//             //   } else {
//             //     console.log("⚠️ Push token registration failed or permission denied.");
//             //   }

//             // } catch (err) {
//             //   console.error("🔥 Push token registration crashed:", err.message);
//             // }

//             // ✅ Register for push notifications ONCE
//             try {
//               const token = await registerForPushNotificationsAsync(userDoc.id, role); // ⬅️ Pass role here
//               if (token) {
//                 console.log("✅ Push token registered and saved.");

//               } else {
//                 console.log("⚠️ Push token registration failed or permission denied.");
//               }

//             } catch (err) {
//               console.error("🔥 Push token registration crashed:", err.message);
//             }
    
//             switch (role) {
//               case "admin1":
//               case "admin2":
//               case "admin":
//                 // try {
//                 //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
//                 //   console.log("Push token registered.");

//                 // } catch (e) {
//                 //   console.log("Push token registration failed:", e);
//                 // }

//                 navigation.replace("Admin");
//                 console.log("Login Successful!");
//                 break;

//               case "super-user":
//                 // try {
//                 //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
//                 //   console.log("Push token registered.");
                  
//                 // } catch (e) {
//                 //   console.log("Push token registration failed:", e);
//                 // }

//                 navigation.replace("Super-User");
//                 console.log("Login Succesfull!")
//                 break;
  
//               case "user":
//                 navigation.replace('User')
//                 console.log("Login Succesfull!")
//                 break;
  
//               default:
//                 setError("Unknown role. Contact admin.");
//             }
    
//           } catch (authError) {
//             // console.error("Auth login failed:", authError.message);
    
//             // const newAttempts = (userData.loginAttempts || 0) + 1;
    
//             // if (newAttempts >= 4) {
//             //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
//             //   await updateDoc(userDoc.ref, {
//             //     isBlocked: true,
//             //     blockedUntil: Timestamp.fromMillis(unblockTime),
//             //   });
    
//             //   setError("Account blocked after 4 failed attempts.");
              
//             // } else {
//             //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
//             //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
//             // }
    
//             setError(`Invalid password.`);
//             setLoading(false);
//             return;
//           }
//         }
    
//       } catch (error) {
//         console.error("Login error:", error);
//         setError("Unexpected error. Try again.");
  
//       } finally {
//         setLoading(false);
//       }
//     };

//     const sendEmail = async (email, name) => {
//       try {
//         const response = await fetch('https://webnuls.onrender.com/send-email', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             to: email.trim().toLowerCase(),
//             subject: 'Account Registration - Pending Approval',
//             text: `Hi ${name},\n\nThank you for registering. Your account is now pending approval from the ITSO.\n\nRegards,\nNU MOA NULS Team`,
//             html: `<p>Hi ${name},</p><p>Thank you for registering. Your account is now <strong>pending approval</strong> from the NULS.</p><p>Regards,<br>NU MOA NULS Team</p>`,
//           }),
//         });

//         const result = await response.json();
//         if (result.success) {
//           console.log('✅ Email sent successfully!');
          
//         } else {
//           console.error('❌ Email failed:', result.error);
//         }
        
//       } catch (err) {
//         console.error('❌ Error sending email:', err.message);
//       }
//     };

//     const handleSignup = async () => {
//         setLoading(true);
      
//         // Use individual state variables instead of signUpData
//         const email = signUpEmail;
//         const employeeId = employeeID;
//         const password = signUpPassword;
      
//         // Step 1: Validate email domain
//         const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//         const emailDomain = email.split("@")[1];
      
//         if (!validDomains.includes(emailDomain)) {
//           setError("Invalid email domain. Only @nu-moa.edu.ph and @students.nu-moa.edu.ph are allowed.");
//           setLoading(false);
//           return;
//         }
      
//         // Step 2: Password match check
//         // if (password !== confirmPassword) {
//         //   setError("Passwords do not match.");
//         //   setLoading(false);
//         //   return;
//         // }

//         if (!agreedToTerms) {
//           setError("You must agree to the Terms and Conditions.");
//           setLoading(false);
//           return;
//         }        
    
//         // Step 4: Validate employee ID format (e.g. 12-3456)
//         const employeeIdPattern = /^\d{2}-\d{4}$/;
//         if (!employeeIdPattern.test(employeeId.trim())) {
//           setError("Invalid employee ID format. Please use ##-#### format.");
//           setLoading(false);
//           return;
//         }
    
//         try {
//           // Step 4: Check if employeeId or email exists
//           const [employeePendingSnap, employeeAccountSnap, emailPendingSnap, emailAccountSnap] = await Promise.all([
//             getDocs(query(collection(db, "pendingaccounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "accounts"), where("employeeId", "==", employeeId.trim()))),
//             getDocs(query(collection(db, "pendingaccounts"), where("email", "==", email.trim().toLowerCase()))),
//             getDocs(query(collection(db, "accounts"), where("email", "==", email.trim().toLowerCase()))),
//           ]);
      
//           if (!employeePendingSnap.empty || !employeeAccountSnap.empty) {
//             setError("This employee ID is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           if (!emailPendingSnap.empty || !emailAccountSnap.empty) {
//             setError("This email is already registered.");
//             setLoading(false);
//             return;
//           }
      
//           // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//           // const firebaseUser = userCredential.user;
      
//           // let role = "user";
//           // if (jobTitle.toLowerCase() === "dean") {
//           //   role = "admin";

//           // } else if (jobTitle.toLowerCase() === "program chair") {
//           //   role = "admin";

//           // } else if (jobTitle.toLowerCase().includes("custodian")) {
//           //   role = "super-user";

//           // } else if (jobTitle.toLowerCase() === "faculty") {
//           //   role = "user";
//           // }

//           let role = "user";

//           if (jobTitle.toLowerCase() === "dean") {
//             if (department.toLowerCase() === "sah") {
//               role = "admin";

//             } else {
//               role = "user";
//             }

//           } else if (jobTitle.toLowerCase() === "program chair") {
//             role = "admin";

//           } else if (jobTitle.toLowerCase().includes("custodian")) {
//             role = "super-user";

//           } else if (jobTitle.toLowerCase() === "faculty") {
//             role = "user";
//           }

//           const sanitizedData = {
//             name: name.trim(),
//             email: email.trim().toLowerCase(),
//             employeeId: employeeId.trim().replace(/[^\d-]/g, ""),
//             jobTitle,
//             department,
//             role,
//             createdAt: serverTimestamp(),
//             status: "pending",
//             // uid: firebaseUser.uid,
//           };
      
//           await addDoc(collection(db, "pendingaccounts"), sanitizedData);

//           sendEmail(email, name);      
      
//           setModalMessage("Successfully Registered! Please check your email. Your account is pending ITSO approval.");
//           setIsModalVisible(true);
      
//           // Reset state variables
//           setName("");
//           setSignUpEmail("");
//           setEmployeeID("");
//           setSignUpPassword("");
//           setConfirmPassword("");
//           setJobTitle("");
//           setDepartment("");
//           setError("");

//           Alert.alert("Sign Up Succesfull!");
      
//         } catch (error) {
//           console.error("Sign up error:", error.message);
//           if (error.code === "auth/email-already-in-use") {
//             setError("Email already in use.");
    
//           } else {
//             setError("Failed to create account. Try again.");
//           }
    
//         } finally {
//           setLoading(false);
//         }
//       };  


//   return (
   
//     <View style={[styles.container, {paddingBottom: !isLoginSignup ? 16: 0}]}>
//       <StatusBar
//                 translucent
//                 backgroundColor="transparent"
//                 barStyle="dark-content" // or 'light-content' depending on your design
//               />
      
//       {!isLoginSignup && (
//         <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/NULS_LOGO.png')} style={{height: '45%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Hello!</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>

//              <View style={styles.buttonContainer}>
//               <Text style={{color: 'gray', marginTop: -30}}>Sign in to continue</Text>
//           <TouchableOpacity style={{width: '100%',backgroundColor: '#134b5f', justifyContent: 'center', borderRadius: 30, padding: 10, paddingVertical: 13}}
//             onPress={()=> setIsLoginSignup(true)}
//             >
//             <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 700}}>Login</Text>
//           </TouchableOpacity>


//           <TouchableOpacity style={{width: '100%',backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 30, padding: 10, borderWidth: 3, borderColor: '#134b5f'}}
//           onPress={() => {setIsLoginSignup(true), setIsSignup(true)}}
//           >
//             <Text style={{textAlign: 'center', color: '#395a7f', fontSize: 18, fontWeight: 700}}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>

//           </View>
           
//         </View>
//       )}

//           {isLoginSignup && (
//             <>
//             <KeyboardAvoidingView
//               style={{ flex: 1}}
//               keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
//               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             >
//                 <KeyboardAwareScrollView
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={styles.scrollContainer}
//                   keyboardShouldPersistTaps="handled"
//                   extraScrollHeight={0}
//                   enableOnAndroid={true}
//                   enableAutomaticScroll={true}
//                 >

//             {/* Sign Up Inputs */}  
//             {isSignup 
//             && (
              
//               <View style={[styles.inner, {padding: 20}]}>
//                 <View style={{alignItems: 'center', paddingTop: 30, paddingBottom: 20, borderBottomWidth: 2, marginBottom: 25, borderColor: '#e9ecee'}}>
//                   <Text style={{textAlign: 'center', color: 'black', fontSize: 28, fontWeight: 700}}>Signing Up</Text>
//                   <Text style={{color: 'gray', marginTop: 5}}>Create your own account.</Text>
//                 </View>

//                 <Text style={styles.label}>Full Name:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: nameBorderColor, width: '100%' }]}>


//                 <Input
//                   placeholder="Enter Full Name"
//                   value={name}
//                   onChangeText={(text) => {
//                     let formatted = text.replace(/[^a-zA-Z\s]/g, ""); // allow only letters and spaces

//                     // Capitalize the first letter of each word
//                     formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

//                     setName(formatted);
//                   }}
//                   mode="outlined"
//                   onFocus={() => handleFocus('name')}
//                   onBlur={() => handleBlur('name')}
//                   inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]} // removes underline
//                   inputStyle={styles.inputText}
//                 />
//               </Animated.View>
                
//                 <Text style={styles.label}>Email:<Text style={{color:'red'}}>*</Text></Text>
//               <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>


//                 <Input
//                   placeholder="Enter Email Address (NU account)"
//                   value={signUpEmail}
//                   onChangeText={(text) => {
//                     const cleanedText = text.replace(/\s/g, "");
//                     setSignUpEmail(cleanedText);

//                     const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
//                     const parts = cleanedText.split("@");
//                     const domain = parts.length > 1 ? parts[1] : "";

//                     if (!validDomains.includes(domain)) {
//                       setEmailError("Only @nu-moa.edu.ph or @students.nu-moa.edu.ph emails are allowed.");
//                     } else {
//                       setEmailError("");
//                     }
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   onFocus={() => handleFocus('email')}
//                   onBlur={() => handleBlur('email')}
//                   inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]}
//                   inputStyle={styles.inputText}
//                 />

//                 {/* {signUpEmail.length > 0 && !signUpEmail.includes('@') ? (
//                 <HelperText type="error" style={{ marginTop: '-25', marginBottom: '10'}}>Enter a valid email address.</HelperText>
//                     ) : null} */}
//                     {emailError !== '' && (
//                       <HelperText type="error" style={{ marginTop: -10, marginBottom: 10 }}>
//                         {emailError}
//                       </HelperText>
//                     )}
//               </Animated.View>


//                 <Text style={styles.label}>Employee ID:<Text style={{color:'red'}}>*</Text></Text>

//                 <Animated.View style={[styles.animatedInputContainer, { borderColor: employeeIDBorderColor, width: '100%' }]}>
//                 <Input
//                   placeholder="e.g., 30-0912"
//                   value={employeeID}
//                   onChangeText={(text) => {
//                     const cleaned = text.replace(/\D/g, "");
//                     let formatted = cleaned;
//                     if (cleaned.length > 2) {
//                       formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`;
//                     }
//                     setEmployeeID(formatted);
//                   }}
//                   keyboardType="numeric"
//                   maxLength={7}
//                   mode="outlined"s
//                   onFocus={() => handleFocus('employeeID')}
//                 onBlur={() => handleBlur('employeeID')}
//                   inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
//                 inputStyle={styles.inputText}
//                 />
//                 </Animated.View>

//                 {/* Job Title Menu */}
//               <Text style={styles.label}>Select Job Title<Text style={{color:'red'}}>*</Text></Text>
//               {/* <View style={styles.menucontainer}> */}
//               <Menu
//                 visible={jobMenuVisible}
//                 onDismiss={() => setJobMenuVisible(false)}
//                 statusBarHeight={50}
//                 type='elevated'
//                 anchor={
//                   <Button
//                   mode="outlined"
//                   onPress={() => setJobMenuVisible(true)}
//                     style={{
//                     // borderWidth: 2,
//                     // borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 45,
//                     justifyContent: 'center',
//                     backgroundColor: '#1e7898',
           
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}
//                 >
//                   {jobTitle || 'Job Title'}
//                 </Button>
                
//                 }
//               >
//                 {jobOptions.map(option => (
//                   // <Menu.Item key={option} onPress={() => { setJobTitle(option); setJobMenuVisible(false); }} title={option} />
//                   <Menu.Item
//                     key={option}
//                     onPress={() => {
//                       setJobTitle(option);
//                       setJobMenuVisible(false);
//                     }}
//                     title={option}
//                   />
//                 ))}
//               </Menu>

// <Text style={styles.label}>Select Department:<Text style={{color:'red'}}>*</Text></Text>
//               <Menu
//                 visible={deptMenuVisible}
//                 onDismiss={() => setDeptMenuVisible(false)}
//                 anchor={
//                   <Button mode="outlined" onPress={() => setDeptMenuVisible(true)} 
//                   style={{
//                     // borderWidth: 2,
//                     // borderColor: '#395a7f',
//                     borderRadius: 8,
//                     marginBottom: 10,
//                     height: 45,
//                     justifyContent: 'center',
//                     backgroundColor: '#1e7898',
                
//                   }}
//                   labelStyle={{
//                     fontSize: 14,
//                     color: '#fff', // Darker text
//                   }}>
//                     {department || 'Department'}
//                   </Button>
//                 }
//               >
//                 {/* {deptOptions.map(option => (
//                   <Menu.Item key={option} onPress={() => { setDepartment(option); setDeptMenuVisible(false); }} title={option}/>
//                 ))} */}
//                 {deptOptions.map(option => (
//                   <Menu.Item
//                     key={option}
//                     onPress={() => {
//                       setDepartment(option);
//                       setDeptMenuVisible(false);
//                     }}
//                     title={option}
//                   />
//                 ))}
//               </Menu>
//               {/* </View> */}
                
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
//                   <Checkbox
//                     status={agreedToTerms ? 'checked' : 'unchecked'}
//                     onPress={() => setAgreedToTerms(!agreedToTerms)}
//                     color='#1e7898'
//                   />
//                   <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
//                     <Text style={{ color: '#007BFF', textDecorationLine: 'underline' }}>
//                       View Terms and Conditions
//                     </Text>
//                   </TouchableOpacity>

                    
                  

//                   <TermsModal
//                     visible={isTermsModalVisible}
//                     onClose={() => setTermsModalVisible(false)}
//                   />
//                 </View>

//                 <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
//                   <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
             
//               </View>
//             )}

//             {!isSignup && (
//                 <View style={styles.inner}>
//           <View style={styles.header}>
//             <Image source={require('./images/NULS_Favicon.png')} style={{height: '30%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
//             <Text style={styles.headerTitle}>Login</Text>
//             <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>
//             {/* <Text style={{alignSelf: 'flex-start', marginLeft: 10, color: 'gray', marginBottom: 5}}>Login to your account</Text> */}

//             <View style={{width: '100%', paddingHorizontal: 10}}>
//             <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
//               {/* <Input
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                 inputContainerStyle={styles.inputContainer} 
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
//               /> */}

//               <Input
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
//                 onFocus={() => handleFocus('email')}
//                 onBlur={() => handleBlur('email')}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
//               />
              
//             </Animated.View>

//             <Animated.View style={[styles.animatedInputContainer, { borderColor: passwordBorderColor, width: '100%'}]}>

//               <Input
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 secureTextEntry={!showPassword}
//                 inputContainerStyle={styles.inputContainer}
//                 inputStyle={styles.inputText}
//                 leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
//                 rightIcon={
//                   <Icon
//                     type="material"
//                     name={showPassword ? 'visibility' : 'visibility-off'}
//                     color="#9CA3AF"
//                     onPress={() => setShowPassword(!showPassword)}
//                   />
//                 }
//               />
//             </Animated.View>

//             {error ? <Text style={styles.error}>{error}</Text> : null}

//                 <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
//                 <Text style={styles.forgotPassword}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                   <CustomButton
//                     title={isSignup ? "Sign Up" : "Login"}
//                     onPress={isSignup ? handleSignup : handleLogin}
//                     icon={isSignup ? "account-plus" : "login"}
//                     loading={loading}
//                     disabled={isSignup && !agreedToTerms}
//                     style={[
//                       styles.loginButton,
//                       !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
//                     ]}
//                     labelStyle={styles.loginButtonText}
//                   />
            
//             </View>
  

                

//            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
//               <Text style={styles.footerText}>
//                 {isSignup
//                   ? "Already have an account? Login"
//                   : `Don't have an account? Sign Up`}
//               </Text>
//             </TouchableOpacity>
                   
//           </View>

//               </View>
//             )}
//           <ForgotPasswordModal
//             visible={isForgotPasswordVisible}
//             onClose={() => setForgotPasswordVisible(false)}
//           />
          
//         </KeyboardAwareScrollView>
//         </KeyboardAvoidingView>
//             </>
//           )}

// </View>
//   );
// }


// VERSION 4
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableOpacity, UIManager, LayoutAnimation, StatusBar, Image, BackHandler, Alert, Modal } from 'react-native';
import { Input, Text, Icon } from 'react-native-elements';
import { TextInput, Card, HelperText, Menu, Provider, Button, Checkbox  } from 'react-native-paper';
import { useAuth } from '../components/contexts/AuthContext';
import { db, auth } from '../backend/firebase/FirebaseConfig';
import { collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp, Timestamp, setDoc, doc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
import styles from './styles/LoginStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from './customs/CustomButton';
import ForgotPasswordModal from './ForgotPasswordModal';
import TermsModal from './customs/TermsModal';
import {Animated} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { registerForPushNotificationsAsync } from '../utils/RegisterPushToken';
import { color } from 'react-native-elements/dist/helpers';

export default function LoginScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [isSignup, setIsSignup] = useState(null);
  const [employeeID, setEmployeeID] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [jobMenuVisible, setJobMenuVisible] = useState(false);
  const [deptMenuVisible, setDeptMenuVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [deptOptions, setDeptOptions] = useState([]);
  const [departmentsAll, setDepartmentsAll] = useState([]);
  const [isLoginSignup, setIsLoginSignup] = useState(false)
  const [emailError, setEmailError] = useState('');
  const nameBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const employeeIDBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;
  const [jobTitleError, setJobTitleError] = useState('');
  const [departmentError, setDepartmentError] = useState('');

  const [focusStates, setFocusStates] = useState({
  name: false,
  email: false,
  employeeID: false,
  password: false,
  confirmPassword: false,
});

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "departments"),
    (snapshot) => {
      const depts = snapshot.docs
        .map((doc) => doc.data().name)
        .sort((a, b) => a.localeCompare(b));
      setDepartmentsAll(depts);
    },
    (error) => {
      console.error("Error fetching departments:", error);
    }
  );

  return () => unsubscribe();
}, []);

// useEffect(() => {
//   if (!jobTitle) {
//     setDeptOptions([]);
//     return;
//   }

//   if (jobTitle === "Faculty") {
//     setDeptOptions(departmentsAll); 

//   } else if (jobTitle === "Program Chair") {
//     setDeptOptions(departmentsAll.filter((dept) => dept !== "SHS"));

//   } else if (jobTitle === "Dean") {
//     setDeptOptions(["SAH", "SAS", "SOO", "SOD"]); 
    
//   } else {
//     setDeptOptions([]); // default
//   }

//   setDepartment(""); 
// }, [jobTitle, departmentsAll]);

useEffect(() => {
  if (!jobTitle) {
    setDeptOptions([]);
    setDepartment("");
    return;
  }

  if (jobTitle === "Faculty") {
    setDeptOptions(departmentsAll);
    setDepartment("");
    
  } else if (jobTitle === "Program Chair") {
    setDeptOptions(departmentsAll.filter((dept) => dept !== "SHS"));
    setDepartment("");

  } else if (jobTitle === "Dean") {
    setDeptOptions(["SAH", "SAS", "SOO", "SOD"]);
    setDepartment("");

  } else if (jobTitle === "Laboratory Custodian") {
    setDeptOptions(["SAH"]);
    setDepartment("SAH");

  } else {
    setDeptOptions([]);
    setDepartment("");
  }
}, [jobTitle, departmentsAll]);

const validateFields = () => {
  let valid = true;

  if (!jobTitle) {
    setJobTitleError('Job Title is required.');
    valid = false;

  } else {
    setJobTitleError('');
  }

  if (!department) {
    setDepartmentError('Department is required.');
    valid = false;

  } else {
    setDepartmentError('');
  }

  return valid;
};

const handleFocus = (field) => {
  setFocusStates((prev) => ({ ...prev, [field]: true }));
  animateBorder(field, 1);
};

const handleBlur = (field) => {
  setFocusStates((prev) => ({ ...prev, [field]: false }));
  animateBorder(field, 0);
};

const animateBorder = (field, toValue) => {
  let animRef = null;

  switch (field) {
    case 'name': animRef = nameBorderAnim; break;
    case 'email': animRef = emailBorderAnim; break;
    case 'employeeID': animRef = employeeIDBorderAnim; break;
    case 'password': animRef = passwordBorderAnim; break;
    case 'confirmPassword': animRef = confirmPasswordBorderAnim; break;
  }

  if (animRef) {
    Animated.timing(animRef, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }
};


const nameBorderColor = nameBorderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['#ccc', '#395a7f']
});

const emailBorderColor = emailBorderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['#ccc', '#395a7f']
});

const employeeIDBorderColor = employeeIDBorderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['#ccc', '#395a7f']
});

const passwordBorderColor = passwordBorderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['#ccc', '#395a7f']
});

const confirmPasswordBorderColor = confirmPasswordBorderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['#ccc', '#395a7f']
});

  const jobOptions = ['Dean', 'Program Chair', 'Laboratory Custodian', 'Faculty'];
  // const deptOptions = ['Medical Technology', 'Nursing', 'Dentistry', 'Optometry'];

  const handleLogin = async () => {
    
      if (!email || !password) {
        setLoginError('Please enter both email and password');
        return;
      }
    
      setLoginError('');
      setLoading(true);
    
      try {
        const usersRef = collection(db, "accounts");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
    
        let userDoc, userData, isSuperAdmin = false;
    
        // First check regular accounts
        if (!querySnapshot.empty) {
          userDoc = querySnapshot.docs[0];
          userData = userDoc.data();
  
        } else {
          // Then check if it's a super-admin
          const superAdminRef = collection(db, "super-admin");
          const superAdminQuery = query(superAdminRef, where("email", "==", email));
          const superAdminSnapshot = await getDocs(superAdminQuery);
    
          if (!superAdminSnapshot.empty) {
            userDoc = superAdminSnapshot.docs[0];
            userData = userDoc.data();
            isSuperAdmin = true;
          }
        }
    
        if (!userData) {
          setLoginError("User not found. Please contact admin.");
          setLoading(false);
          return;
        }
    
        if (userData.disabled) {
          setLoginError("Your account has been disabled.");
          await signOut(auth);
          setLoading(false);
          return;
        }
    
        // If password not set yet (new user)
        if (!isSuperAdmin && !userData.uid) {
          setLoginError("Password not set. Please login through website first.");
          setLoading(false);
          return;
        }
    
        // Block check
        // if (userData.isBlocked && userData.blockedUntil) {
        //   const now = Timestamp.now().toMillis();
        //   const blockedUntil = userData.blockedUntil.toMillis();
    
        //   if (now < blockedUntil) {
        //     const remainingTime = Math.ceil((blockedUntil - now) / 1000);
        //     setError(`Account is blocked. Try again after ${remainingTime} seconds.`);
        //     setLoading(false);
        //     return;
  
        //   } else {
        //     await updateDoc(userDoc.ref, {
        //       isBlocked: false,
        //       loginAttempts: 0,
        //       blockedUntil: null,
        //     });
  
        //     console.log("Account unblocked.");
        //   }
        // }
    
        if (isSuperAdmin) {
          if (userData.password === password) {
            await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
            login({ ...userData, id: userDoc.id, role: "Super Admin" });
    
            navigation.replace("SuperAdminDashboard");
    
          } else {
            // const newAttempts = (userData.loginAttempts || 0) + 1;
    
            // if (newAttempts >= 4) {
            //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
            //   await updateDoc(userDoc.ref, {
            //     isBlocked: true,
            //     blockedUntil: Timestamp.fromMillis(unblockTime),
            //   });
    
            //   setError("Account blocked for 30 minutes.");
  
            // } else {
            //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
            //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
            // }
            
            setLoginError(`Invalid password.`);
            setLoading(false);
            return;
          }
    
        } else {
          // ✅ Firebase Auth login for regular users/admins
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const signedInUser = userCredential.user;
            
            // await signInWithEmailAndPassword(auth, email, password);
            // await updateDoc(userDoc.ref, { loginAttempts: 0 });
    
            // const role = (userData.role || "user").toLowerCase();
            // login({ ...userData, id: userDoc.id });

            // console.log("Login Succesfull!")
    
            // await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
            //   action: "User Logged In (Mobile)",
            //   userName: userData.name || "User",
            //   timestamp: serverTimestamp(),
              
            // });

            // 🔁 Force reload to ensure latest email verification status
            await signedInUser.reload();
            const refreshedUser = auth.currentUser;

            if (!refreshedUser || !refreshedUser.emailVerified) {
              await signOut(auth);
              setLoginError("Please verify your email before logging in.");
              setLoading(false);
              return;
            }

            await updateDoc(userDoc.ref, { loginAttempts: 0 });

            const role = (userData.role || "user").toLowerCase();
            login({ ...userData, id: userDoc.id });

            console.log("Login Successful!");

            await addDoc(collection(db, `accounts/${userDoc.id}/activitylog`), {
              action: "User Logged In (Mobile)",
              userName: userData.name || "User",
              timestamp: serverTimestamp(),
            });


            try {
              const token = await registerForPushNotificationsAsync(userDoc.id, role); // ⬅️ Pass role here
              if (token) {
                console.log("✅ Push token registered and saved.");

              } else {
                console.log("⚠️ Push token registration failed or permission denied.");
              }

            } catch (err) {
              console.error("🔥 Push token registration crashed:", err.message);
            }
    
            switch (role) {
              case "admin1":
              case "admin2":
              case "admin":
                // try {
                //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
                //   console.log("Push token registered.");

                // } catch (e) {
                //   console.log("Push token registration failed:", e);
                // }

                navigation.replace("Admin");
                console.log("Login Successful!");
                break;

              case "super-user":
                // try {
                //   await registerForPushNotificationsAsync(userDoc.id, userData.role);
                //   console.log("Push token registered.");
                  
                // } catch (e) {
                //   console.log("Push token registration failed:", e);
                // }

                navigation.replace("Super-User");
                console.log("Login Succesfull!")
                break;
  
              case "user":
                navigation.replace('User')
                console.log("Login Succesfull!")
                break;
  
              default:
                setLoginError("Unknown role. Contact admin.");
            }
    
          } catch (authError) {
            // console.error("Auth login failed:", authError.message);
    
            // const newAttempts = (userData.loginAttempts || 0) + 1;
    
            // if (newAttempts >= 4) {
            //   const unblockTime = Timestamp.now().toMillis() + 30 * 60 * 1000;
            //   await updateDoc(userDoc.ref, {
            //     isBlocked: true,
            //     blockedUntil: Timestamp.fromMillis(unblockTime),
            //   });
    
            //   setError("Account blocked after 4 failed attempts.");
              
            // } else {
            //   await updateDoc(userDoc.ref, { loginAttempts: newAttempts });
            //   setError(`Invalid password. ${4 - newAttempts} attempts left.`);
            // }
    
            setLoginError(`Invalid password.`);
            setLoading(false);
            return;
          }
        }
    
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("Unexpected error. Try again.");
  
      } finally {
        setLoading(false);
      }
    };

    const sendEmail = async (email, name) => {
      try {
        const response = await fetch('https://webnuls.onrender.com/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email.trim().toLowerCase(),
            subject: 'Account Registration - Pending Approval',
            text: `Hi ${name},\n\nThank you for registering. Your account is now pending approval.\n\nRegards,\nNU MOA NULS Team`,
            html: `<p>Hi ${name},</p><p>Thank you for registering. Your account is now <strong>pending approval</strong> from the NULS.</p><p>Regards,<br>NU MOA NULS Team</p>`,
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log('✅ Email sent successfully!');
          
        } else {
          console.error('❌ Email failed:', result.error);
        }
        
      } catch (err) {
        console.error('❌ Error sending email:', err.message);
      }
    };

    const handleSignup = async () => {
        setLoading(true);
      
        // Use individual state variables instead of signUpData
        const email = signUpEmail;
        const employeeId = employeeID;
        const password = signUpPassword;
      
        // Step 1: Validate email domain
        const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
        const emailDomain = email.split("@")[1];
      
        if (!validDomains.includes(emailDomain)) {
          setError("Invalid email domain. Only @nu-moa.edu.ph and @students.nu-moa.edu.ph are allowed.");
          setLoading(false);
          return;
        }

        // Step 0: Validate required fields
        if (!jobTitle) {
          setError("Job Title is required.");
          setLoading(false);
          return;
        }

        if (!department) {
          setError("Department is required.");
          setLoading(false);
          return;
        }
              
        // Step 2: Password match check
        // if (password !== confirmPassword) {
        //   setError("Passwords do not match.");
        //   setLoading(false);
        //   return;
        // }

        if (!agreedToTerms) {
          setError("You must agree to the Terms and Conditions.");
          setLoading(false);
          return;
        }        
    
        // Step 4: Validate employee ID format (e.g. 12-3456)
        const employeeIdPattern = /^\d{2}-\d{4}$/;
        if (!employeeIdPattern.test(employeeId.trim())) {
          setError("Invalid employee ID format. Please use ##-#### format.");
          setLoading(false);
          return;
        }
    
        try {
          // Step 4: Check if employeeId or email exists
          const [employeePendingSnap, employeeAccountSnap, emailPendingSnap, emailAccountSnap] = await Promise.all([
            getDocs(query(collection(db, "pendingaccounts"), where("employeeId", "==", employeeId.trim()))),
            getDocs(query(collection(db, "accounts"), where("employeeId", "==", employeeId.trim()))),
            getDocs(query(collection(db, "pendingaccounts"), where("email", "==", email.trim().toLowerCase()))),
            getDocs(query(collection(db, "accounts"), where("email", "==", email.trim().toLowerCase()))),
          ]);
      
          if (!employeePendingSnap.empty || !employeeAccountSnap.empty) {
            setError("This employee ID is already registered.");
            setLoading(false);
            return;
          }
      
          if (!emailPendingSnap.empty || !emailAccountSnap.empty) {
            setError("This email is already registered.");
            setLoading(false);
            return;
          }
      
          // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          // const firebaseUser = userCredential.user;
      
          // let role = "user";
          // if (jobTitle.toLowerCase() === "dean") {
          //   role = "admin";

          // } else if (jobTitle.toLowerCase() === "program chair") {
          //   role = "admin";

          // } else if (jobTitle.toLowerCase().includes("custodian")) {
          //   role = "super-user";

          // } else if (jobTitle.toLowerCase() === "faculty") {
          //   role = "user";
          // }

          let role = "user";

          if (jobTitle.toLowerCase() === "dean") {
            if (department.toLowerCase() === "sah") {
              role = "admin";

            } else {
              role = "user";
            }

          } else if (jobTitle.toLowerCase() === "program chair") {
            role = "admin";

          } else if (jobTitle.toLowerCase().includes("custodian")) {
            role = "super-user";

          } else if (jobTitle.toLowerCase() === "faculty") {
            role = "user";
          }

          const sanitizedData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            employeeId: employeeId.trim().replace(/[^\d-]/g, ""),
            jobTitle,
            department,
            role,
            createdAt: serverTimestamp(),
            status: "pending",
            // uid: firebaseUser.uid,
          };
      
          await addDoc(collection(db, "pendingaccounts"), sanitizedData);

          sendEmail(email, name);      
      
          // Reset state variables
          setName("");
          setSignUpEmail("");
          setEmployeeID("");
          setSignUpPassword("");
          setConfirmPassword("");
          setJobTitle("");
          setDepartment("");
          setError("");

          setModalMessage("Successfully Registered! Please check your junk email. Your account is pending approval.");
          setIsModalVisible(true);

          // Alert.alert("Sign Up Succesfull!");
      
        } catch (error) {
          console.error("Sign up error:", error.message);
          if (error.code === "auth/email-already-in-use") {
            setError("Email already in use.");
    
          } else {
            setError("Failed to create account. Try again.");
          }
    
        } finally {
          setLoading(false);
        }
      };  


  return (
   
    <View style={[styles.container, {paddingBottom: !isLoginSignup ? 16: 0}]}>
      <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content" // or 'light-content' depending on your design
              />
      
      {!isLoginSignup && (
        <View style={styles.inner}>
          <View style={styles.header}>
            <Image source={require('./images/NULS_LOGO.png')} style={{height: '45%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
            <Text style={styles.headerTitle}>Hello!</Text>
            <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>

             <View style={styles.buttonContainer}>
              <Text style={{color: 'gray', marginTop: -30}}>Sign in to continue</Text>
          <TouchableOpacity style={{width: '100%',backgroundColor: '#134b5f', justifyContent: 'center', borderRadius: 30, padding: 10, paddingVertical: 13}}
            onPress={()=> setIsLoginSignup(true)}
            >
            <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 700}}>Login</Text>
          </TouchableOpacity>


          <TouchableOpacity style={{width: '100%',backgroundColor: 'transparent', justifyContent: 'center', borderRadius: 30, padding: 10, borderWidth: 3, borderColor: '#134b5f'}}
          onPress={() => {setIsLoginSignup(true), setIsSignup(true)}}
          >
            <Text style={{textAlign: 'center', color: '#134b5f', fontSize: 18, fontWeight: 700}}>Sign Up</Text>
          </TouchableOpacity>
        </View>

          </View>
           
        </View>
      )}

          {isLoginSignup && (
            <>
            <KeyboardAvoidingView
              style={{ flex: 1}}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                  keyboardShouldPersistTaps="handled"
                  extraScrollHeight={0}
                  enableOnAndroid={true}
                  enableAutomaticScroll={true}
                >

            {/* Sign Up Inputs */}  
            {isSignup 
            && (
              
              <View style={[styles.inner, {padding: 20}]}>
                <View style={{alignItems: 'center', paddingTop: 30, paddingBottom: 20, borderBottomWidth: 2, marginBottom: 25, borderColor: '#e9ecee'}}>
                  <Text style={{textAlign: 'center', color: 'black', fontSize: 28, fontWeight: 700}}>Signing Up</Text>
                  <Text style={{color: 'gray', marginTop: 5}}>Create your own account.</Text>
                </View>

                <Text style={styles.label}>Full Name:<Text style={{color:'red'}}>*</Text></Text>
              <Animated.View style={[styles.animatedInputContainer, { borderColor: nameBorderColor, width: '100%' }]}>


                <Input
                  placeholder="Enter Full Name"
                  value={name}
                  onChangeText={(text) => {
                    let formatted = text.replace(/[^a-zA-Z\s]/g, ""); // allow only letters and spaces

                    // Capitalize the first letter of each word
                    formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

                    setName(formatted);
                  }}
                  mode="outlined"
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]} // removes underline
                  inputStyle={styles.inputText}
                />
              </Animated.View>
                
                <Text style={styles.label}>Email:<Text style={{color:'red'}}>*</Text></Text>
              <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>


                <Input
                  placeholder="Enter Email Address (NU account)"
                  value={signUpEmail}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/\s/g, "");
                    setSignUpEmail(cleanedText);

                    const validDomains = ["nu-moa.edu.ph", "students.nu-moa.edu.ph"];
                    const parts = cleanedText.split("@");
                    const domain = parts.length > 1 ? parts[1] : "";

                    if (!validDomains.includes(domain)) {
                      setEmailError("Only @nu-moa.edu.ph or @students.nu-moa.edu.ph emails are allowed.");
                      
                    } else {
                      setEmailError("");
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  inputContainerStyle={[styles.inputContainer, { paddingTop: 3 }]}
                  inputStyle={styles.inputText}
                />

                {/* {signUpEmail.length > 0 && !signUpEmail.includes('@') ? (
                <HelperText type="error" style={{ marginTop: '-25', marginBottom: '10'}}>Enter a valid email address.</HelperText>
                    ) : null} */}
                    {emailError !== '' && (
                      <HelperText type="error" style={{ marginTop: -10, marginBottom: 10 }}>
                        {emailError}
                      </HelperText>
                    )}
              </Animated.View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}
                <Text style={styles.label}>Employee ID:<Text style={{color:'red'}}>*</Text></Text>

                <Animated.View style={[styles.animatedInputContainer, { borderColor: employeeIDBorderColor, width: '100%' }]}>
                <Input
                  placeholder="e.g., 30-0912"
                  value={employeeID}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, "");
                    let formatted = cleaned;
                    if (cleaned.length > 2) {
                      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`;
                    }
                    setEmployeeID(formatted);
                  }}
                  keyboardType="numeric"
                  maxLength={7}
                  mode="outlined"s
                  onFocus={() => handleFocus('employeeID')}
                onBlur={() => handleBlur('employeeID')}
                  inputContainerStyle={[styles.inputContainer, {paddingTop: 3}]} // removes underline
                inputStyle={styles.inputText}
                />
                </Animated.View>

                {/* Job Title Menu */}
              <Text style={styles.label}>Select Job Title<Text style={{color:'red'}}>*</Text></Text>
              {/* <View style={styles.menucontainer}> */}
              <Menu
                visible={jobMenuVisible}
                onDismiss={() => setJobMenuVisible(false)}
                statusBarHeight={50}
                type='elevated'
                anchor={
                  <Button
                  mode="outlined"
                  onPress={() => setJobMenuVisible(true)}
                    style={{
                    // borderWidth: 2,
                    // borderColor: '#395a7f',
                    borderRadius: 8,
                    marginBottom: 10,
                    height: 45,
                    justifyContent: 'center',
                    backgroundColor: '#1e7898',
           
                  }}
                  labelStyle={{
                    fontSize: 14,
                    color: '#fff', // Darker text
                  }}
                >
                  {jobTitle || 'Job Title'}
                </Button>
                
                }
              >
                {jobOptions.map(option => (
                  // <Menu.Item key={option} onPress={() => { setJobTitle(option); setJobMenuVisible(false); }} title={option} />
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setJobTitle(option);
                      setJobMenuVisible(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

            {/* {error !== "" && (
              <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
                {error}
              </Text>
            )} */}

              <Text style={styles.label}>Select Department:<Text style={{color:'red'}}>*</Text></Text>
              <Menu
                visible={deptMenuVisible}
                onDismiss={() => setDeptMenuVisible(false)}
                anchor={
                  // <Button mode="outlined" onPress={() => setDeptMenuVisible(true)} 
                  // style={{
                  //   borderRadius: 8,
                  //   marginBottom: 10,
                  //   height: 45,
                  //   justifyContent: 'center',
                  //   backgroundColor: '#1e7898',
                
                  // }}
                  // labelStyle={{
                  //   fontSize: 14,
                  //   color: '#fff',
                  // }}>
                  //   {department || 'Department'}
                  // </Button>

                  <Button
                    mode="outlined"
                    onPress={() => {
                      if (jobTitle !== "Lab Tech") {
                        setDeptMenuVisible(true);
                      }
                    }}
                    disabled={jobTitle === "Lab Tech"}
                    style={{
                      borderRadius: 8,
                      marginBottom: 10,
                      height: 45,
                      justifyContent: 'center',
                      backgroundColor: jobTitle === "Lab Tech" ? '#ccc' : '#1e7898',
                    }}
                    labelStyle={{
                      fontSize: 14,
                      color: jobTitle === "Lab Tech" ? '#666' : '#fff',
                    }}
                  >
                    {department || 'Department'}
                  </Button>

                }
              >
                {/* {deptOptions.map(option => (
                  <Menu.Item key={option} onPress={() => { setDepartment(option); setDeptMenuVisible(false); }} title={option}/>
                ))} */}
                {deptOptions.map(option => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setDepartment(option);
                      setDeptMenuVisible(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              {error !== "" && (
                <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
                  {error}
                </Text>
              )}


              
              {/* </View> */}
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <Checkbox
                    status={agreedToTerms ? 'checked' : 'unchecked'}
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                    color='#1e7898'
                  />
                  <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                    <Text style={{ color: '#007BFF', textDecorationLine: 'underline' }}>
                      View Terms and Conditions
                    </Text>
                  </TouchableOpacity>

                    
                  

                  <TermsModal
                    visible={isTermsModalVisible}
                    onClose={() => setTermsModalVisible(false)}
                  />
                </View>

                <CustomButton
                    title={"Sign Up"}
                    onPress={handleSignup}
                    icon={"account-plus"}
                    loading={loading}
                    disabled={isSignup && !agreedToTerms}
                    style={[
                      !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
                    ]}
                    labelStyle={styles.loginButtonText}
                  />
                  <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
              <Text style={styles.footerText}>
                {isSignup
                  ? "Already have an account? Login"
                  : `Don't have an account? Sign Up`}
              </Text>
            </TouchableOpacity>
             
              </View>
            )}

            {!isSignup && (
                <View style={styles.inner}>
          <View style={styles.header}>
            <Image source={require('./images/NULS_Favicon.png')} style={{height: '30%', width: '100%',marginBottom: 10}} resizeMode='contain'/>
            <Text style={styles.headerTitle}>Login</Text>
            <Text style={styles.subHeader}>Welcome to NU MOA Laboratory System</Text>
            {/* <Text style={{alignSelf: 'flex-start', marginLeft: 10, color: 'gray', marginBottom: 5}}>Login to your account</Text> */}

            <View style={{width: '100%', paddingHorizontal: 10}}>
            <Animated.View style={[styles.animatedInputContainer, { borderColor: emailBorderColor, width: '100%' }]}>
              {/* <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                inputContainerStyle={styles.inputContainer} 
                inputStyle={styles.inputText}
                leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
              /> */}

              <Input
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={{ type: 'material', name: 'email', color: '#9CA3AF' }}
              />
              
            </Animated.View>

            <Animated.View style={[styles.animatedInputContainer, { borderColor: passwordBorderColor, width: '100%'}]}>

              <Input
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                secureTextEntry={!showPassword}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={{ type: 'material', name: 'lock', color: '#9CA3AF' }}
                rightIcon={
                  <Icon
                    type="material"
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    color="#9CA3AF"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </Animated.View>

            {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

                <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                  <CustomButton
                    title={isSignup ? "Sign Up" : "Login"}
                    onPress={isSignup ? handleSignup : handleLogin}
                    icon={isSignup ? "account-plus" : "login"}
                    loading={loading}
                    disabled={isSignup && !agreedToTerms}
                    style={[
                      styles.loginButton,
                      !agreedToTerms && { backgroundColor: '#ccc' }, // Grey out when disabled
                    ]}
                    labelStyle={styles.loginButtonText}
                  />
            
            </View>
  

                

           <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
              <Text style={styles.footerText}>
                {isSignup
                  ? "Already have an account? Login"
                  : `Don't have an account? Sign Up`}
              </Text>
            </TouchableOpacity>
                   
          </View>

              </View>
            )}
          <ForgotPasswordModal
            visible={isForgotPasswordVisible}
            onClose={() => setForgotPasswordVisible(false)}
          />

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                <Text>{modalMessage}</Text>
                <Button onPress={() => setIsModalVisible(false)}>OK</Button>
              </View>
            </View>
          </Modal>

          
        </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
            </>
          )}

</View>
  );
}


