import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TodoScreen from './src/screen/TodoScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Login from './src/screen/Login';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {useEffect, useState} from 'react';
import {firebaseApp} from './Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-paper';
const Stack = createNativeStackNavigator();
const Logout = () => {
  const navigation = useNavigation();
  const onLogout = () => {
    console.log('loug');
    AsyncStorage.setItem('isLogin', '');
  };
  return (
    <>
      <TouchableOpacity onPress={onLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </>
  );
};
export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const auth = getAuth(firebaseApp);

  const checkAuthState = async () => {
    await onAuthStateChanged(auth, async user => {
      if (user) {
        // User is signed in
        setIsLogin(true);
        try {
          // Save the user's authentication state
          await AsyncStorage.setItem('isLogin', 'true');
        } catch (error) {
          console.error('Error saving authentication state:', error);
        }
      } else {
        // User is signed out
        setIsLogin(false);
        try {
          // Clear the user's authentication state
          await AsyncStorage.removeItem('isLogin');
        } catch (error) {
          console.error('Error clearing authentication state:', error);
        }
        console.log('logged out');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLogin ? 'Home' : 'Login'}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={TodoScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    // paddingTop: Platform.OS === "android" ? 40 : 0,
  },
});
