import {View, Text} from 'react-native';
import React from 'react';
import {Image} from '@rneui/themed';

const Nodata = () => {
  return (
    <View style={{alignContent: 'center', alignItems: 'center', marginTop: 40}}>
      <Text
        style={{
          color: 'black',
          fontSize: 25,
          fontWeight: 'bold',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        No unfinished tasks found 😕
      </Text>
      <Image
        source={{
          uri: 'https://www.stylist.co.uk/images/app/uploads/2021/06/01164914/to-do-list-1680x880.jpg?w=1680&h=880&fit=max&auto=format%2Ccompress',
        }}
        style={{height: 300, width: 250, borderRadius: 10, marginTop: 20}}
      />
    </View>
  );
};

export default Nodata;
