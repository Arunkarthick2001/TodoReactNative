import {View, Text} from 'react-native';
import React from 'react';
import {Image} from '@rneui/themed';

const Nodata = () => {
  return (
    <View>
      <Text style={{color: 'black', fontSize: 30, fontWeight: 'bold'}}>
        No listItems Found
      </Text>
      <Image
        source={{
          uri: 'https://www.stylist.co.uk/images/app/uploads/2021/06/01164914/to-do-list-1680x880.jpg?w=1680&h=880&fit=max&auto=format%2Ccompress',
        }}
        style={{
          width: '100%',
          height: '70%',
          borderRadius: 20,
          shadowColor: 'black',
          shadowOpacity: 0.9,
          marginVertical: 20,
          marginTop: 60,
        }}
      />
    </View>
  );
};

export default Nodata;
