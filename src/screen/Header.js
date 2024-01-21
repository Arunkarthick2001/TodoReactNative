import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, IconButton} from 'react-native-paper';
import {signOut} from 'firebase/auth';

const Header = ({fetchdata, setIsRefresh}) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear the user's authentication state
      await AsyncStorage.removeItem('isLogin');
      await AsyncStorage.removeItem('maintodo');
      await AsyncStorage.removeItem('isData');
      // Navigate to the Login screen
      navigation.navigate('Login');
      signOut;
    } catch (error) {
      console.error('Error clearing authentication state:', error);
    }
  };
  const onRefresh = () => {
    fetchdata();
    setIsRefresh(true);
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>TodoList</Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsRefresh(true);
            fetchdata();
          }}>
          <IconButton icon="refresh" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3498db', // Change the color as needed
    borderRadius: 4,
    marginTop: 1,
    marginBottom: 4,
    // flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    // Change the color as needed
  },
  logoutButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    backgroundColor: 'grey',
    padding: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;
