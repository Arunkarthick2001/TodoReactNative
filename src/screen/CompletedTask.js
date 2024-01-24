import {View, Text, FlatList, ScrollView} from 'react-native';
import React from 'react';

import {Checkbox, IconButton} from 'react-native-paper';
const CompletedTask = ({data, handleCheck, handleDelete}) => {
  const rendertodos = ({item}) => {
    return (
      <View
        style={{
          backfaceVisibility: 'visible',
          backgroundColor: 'skyblue',
          padding: 10,
          marginTop: 8,
          borderRadius: 5,
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Checkbox
          uncheckedColor="red"
          status={item.checked ? 'checked' : 'unchecked'}
          onPress={() => handleCheck(item)}></Checkbox>
        <Text
          style={
            !item.checked
              ? {
                  fontSize: 22,
                  fontWeight: 700,
                  flex: 1,
                  color: 'black',
                }
              : {
                  textDecorationLine: 'line-through',
                  color: 'grey',
                  fontSize: 22,
                  fontWeight: 700,
                  flex: 1,
                }
          }>
          {item.name}
        </Text>

        <IconButton
          icon="trash-can"
          onPress={() => handleDelete(item.id, item.checked)}
        />
      </View>
    );
  };
  return (
    <View>
      {data.length ? (
        <ScrollView>
          {data.map(item => (
            <View
              key={item.id}
              style={{
                backfaceVisibility: 'visible',
                backgroundColor: 'skyblue',
                padding: 10,
                marginTop: 8,
                borderRadius: 5,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Checkbox
                uncheckedColor="red"
                status={item.checked ? 'checked' : 'unchecked'}
                onPress={() => handleCheck(item)}></Checkbox>
              <Text
                style={
                  !item.checked
                    ? {
                        fontSize: 22,
                        fontWeight: 700,
                        flex: 1,
                        color: 'black',
                      }
                    : {
                        textDecorationLine: 'line-through',
                        color: 'grey',
                        fontSize: 22,
                        fontWeight: 700,
                        flex: 1,
                      }
                }>
                {item.name}
              </Text>

              <IconButton
                icon="trash-can"
                onPress={() => handleDelete(item.id, item.checked)}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Text style={{fontSize: 20}}>No completed task 🫤</Text>
        </View>
      )}
    </View>
  );
};

export default CompletedTask;
