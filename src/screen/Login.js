import React, {useRef, useState} from 'react';
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

const Login = ({navigation}) => {
  const [userId, setUserId] = useState('arunkarthick3002@gmail.com');
  const [userPassword, setUserPassword] = useState('Arun@123');
  const firebaseAuth = getAuth(firebaseApp);

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
      alert('signup error');
    }
  };
  const [login, setLogin] = useState(true);

  const onSwitch = () => {
    console.log('onwitch');
    setLogin(!login); // Toggle the login state
  };
  const inputRef = useRef(null);
  const Login = () => {
    return (
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
        <Text>
          Already have an account{' '}
          <TouchableOpacity onPress={onSwitch}>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
              click here
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  };

  const Signup = () => {
    return (
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
        <Text>
          Already have an account{' '}
          <TouchableOpacity onPress={onSwitch}>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
              click here
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  };

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
          <Text>
            Already have an account{' '}
            <TouchableOpacity onPress={onSwitch}>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                click here
              </Text>
            </TouchableOpacity>
          </Text>
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
          <Text>
            Already have an account{' '}
            <TouchableOpacity onPress={onSwitch}>
              <Text
                style={{
                  color: 'blue',
                  textDecorationLine: 'underline',
                  textAlignVertical: 'center',
                }}>
                click here
              </Text>
            </TouchableOpacity>
          </Text>
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
