import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {firebaseApp} from '../../Firebase';
import {getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [userId, setUserId] = useState('arunkarthick3002@gmail.com');
  const [userPassword, setUserPassword] = useState('Arun@123');
  const firebaseAuth = getAuth(firebaseApp);
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        // Check if the user is already logged in
        const storedIsLogin = await AsyncStorage.getItem('isLogin');
        // console.log(storedIsLogin);
        if (storedIsLogin) {
          navigation.navigate('Home', {data: storedIsLogin});
        } else {
          // alert('Session expired. Kindly login again');
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      }
    };

    checkLoginState();
  }, []);
  const onLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        userId,
        userPassword,
      );
      const user = userCredential.user;
      console.log(user.uid);
      navigation.navigate('Home', {data: user.uid});
      setUserId('');
      setUserPassword('');
      AsyncStorage.setItem('isLogin', user.uid);
    } catch (error) {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    }
  };
  const onSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        userId,
        userPassword,
      );
      // Signed up
      const user = userCredential.user;
      navigation.navigate('Home', {data: user.uid});
      setUserId('');
      setUserPassword('');
      console.log(user.uid, 'USER');
    } catch (error) {
      alert(error.message);
    }
  };
  const [login, setLogin] = useState(true);

  const onSwitch = () => {
    setLogin(!login); // Toggle the login state
  };
  const inputRef = useRef(null);

  return (
    <View>
      {login ? (
        <View style={styles.container}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontWeight: '700',
              color: 'black',
            }}>
            Login
          </Text>
          <Text style={styles.label}>Userid</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={userText => setUserId(userText)}
            placeholder="userid"
            ref={inputRef}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={userPassword}
            onChangeText={userPass => setUserPassword(userPass)}
            placeholder="Password"
          />
          <Button
            disabled={!userId || !userPassword}
            onPress={onLogin}
            title="Login"
          />

          <TouchableOpacity onPress={onSwitch}>
            <Text>
              <Text> Don't have an account </Text>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                click here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontWeight: '700',
              color: 'black',
            }}>
            Signup
          </Text>
          <Text style={styles.label}>UserId</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={userText => setUserId(userText)}
            placeholder="userid"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={userPassword}
            onChangeText={userPass => setUserPassword(userPass)}
            placeholder="Password"
          />
          <Button
            disabled={!userId || !userPassword}
            onPress={onSignup}
            title="SignUp"
          />
          <TouchableOpacity onPress={onSwitch}>
            <Text>
              <Text> Already have an account </Text>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                click here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignContent: 'center',
    justifyContent: 'center',
    top: 0,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: 'skyblue',
    borderWidth: 3,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    color: 'black',
  },
});
