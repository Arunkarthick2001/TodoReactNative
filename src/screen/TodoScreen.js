import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
// import Icon from 'react-native-vector-icons';
import {Checkbox, IconButton} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {getDatabase, ref, get, set} from 'firebase/database';
import {firebaseApp} from '../../Firebase';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {Image} from '@rneui/themed';
import Nodata from './Nodata';
const TodoScreen = ({route}) => {
  const inputRef = useRef(null);
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [editTodo, setEditTodo] = useState(false);

  const userId = route.params?.data || '';
  const rendertodos = ({item, index}) => {
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
          icon="pencil"
          onPress={() => handleEdit(item.id, item.name)}
        />
        <IconButton icon="trash-can" onPress={() => handleDelete(item.id)} />
      </View>
    );
  };
  const handleAddTodo = async () => {
    inputRef.current.blur();
    const listItems = [
      ...todoList,
      {name: todo, id: Date.now().toString(), checked: false},
    ];
    setTodoList([
      ...todoList,
      {name: todo, id: Date.now().toString(), checked: false},
    ]);
    // console.log(uid);
    const dataRef = ref(database, uid);
    await set(dataRef, listItems)
      .then(() => {
        // console.log("Data written for Add operation");
      })
      .catch(error => {
        console.error('Data written error for Add operation', error);
      });
    setTodo('');
  };
  const handleDelete = async id => {
    // console.log("del");
    const listItems = todoList.filter(item => item.id !== id);
    setTodoList(listItems);
    // console.log(listItems);
    const dataRef = ref(database, uid);
    await set(dataRef, listItems)
      .then(() => {
        // console.log("Data written for Delete operation");
      })
      .catch(error => {
        console.error('Data written error for delete operation', error);
      });
  };
  const handleEdit = (id, name) => {
    setEditTodo(true);
    // console.log(todoList);
    inputRef.current.focus();
    setTodo(name);
    const listItems = todoList.filter(item => item.id !== id);
    const newTodoList = [...listItems];
    console.log(newTodoList);
    setTodoList(newTodoList);
  };
  const handleCheck = async item => {
    const listItems = todoList.filter(items => items.id !== item.id);
    const newTodoList = [
      ...listItems,
      {id: item.id, name: item.name, checked: !item.checked},
    ];
    setTodoList(newTodoList);
    const dataRef = ref(database, uid);
    await set(dataRef, newTodoList)
      .then(() => {
        // console.log("Data written for Check operation");
      })
      .catch(error => {
        console.error('Data written error for check operation', error);
      });
  };
  const addDatabase = async () => {
    // console.log("call");
    const dataRef = ref(database, uid);
    await set(dataRef, todoList)
      .then(() => {
        // console.log("Data written for Delete operation");
      })
      .catch(error => {
        console.error('Data written error for delete operation', error);
      });
  };
  const database = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);
  async function fetchData(dat) {
    console.log(dat);
    const dataRef = ref(database, uid);
    get(dataRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          //   console.log("Data: ", data);
          setTodoList(data);
        } else {
          //   console.log("No data available");
        }
      })
      .catch(error => {
        console.error('Error getting data:', error);
      });
  }
  const [uid, setUid] = useState(userId);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
        fetchData(user.uid);
        // localStorage.setItem("uid", JSON.stringify(user.uid));
      } else {
      }
    });
  }, []);
  return (
    <View style={{marginHorizontal: 16}}>
      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          fontSize: 20,
          fontWeight: 700,
        }}>
        TodoList
      </Text>
      <TextInput
        ref={inputRef}
        style={{
          borderWidth: 2,
          borderColor: 'blue',
          borderRadius: 10,
          paddingHorizontal: 16,
          paddingVertical: 8,
          color: 'black',
        }}
        placeholder="Add Your task here"
        value={todo}
        onChangeText={userText => setTodo(userText)}
        onSubmitEditing={handleAddTodo}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          paddingHorizontal: 16,
          marginVertical: 10,
          paddingVertical: 5,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={handleAddTodo}>
        {editTodo ? (
          <Text
            style={{
              alignContent: 'center',
              fontSize: 30,
              color: 'white',
              fontWeight: 'bold',
            }}>
            Save
          </Text>
        ) : (
          <Text
            style={{
              alignContent: 'center',
              fontSize: 30,
              color: 'white',
              fontWeight: 'bold',
            }}>
            Add
          </Text>
        )}
      </TouchableOpacity>
      {todoList.length != 0 ? (
        <FlatList data={todoList} renderItem={rendertodos}></FlatList>
      ) : (
        <View style={{alignContent: 'center', alignItems: 'center'}}>
          <Nodata />
        </View>
      )}
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({});
