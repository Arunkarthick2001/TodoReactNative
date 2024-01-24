import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Alert,
  VirtualizedList,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Checkbox, IconButton} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  onValue,
  off,
  remove,
  update,
} from 'firebase/database';
import {firebaseApp} from '../../Firebase';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import Nodata from './Nodata';
import CompletedTask from './CompletedTask';
import {useNavigation} from '@react-navigation/native';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const TodoScreen = ({route}) => {
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const [todo, setTodo] = useState('');
  const [mainTodo, setMainTodo] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [editTodo, setEditTodo] = useState(false);
  const [editId, setEditId] = useState();
  const [completedTodoList, setCompletedTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = route.params?.data || '';
  const [isRefresh, setIsRefresh] = useState(false);
  const {width, height} = Dimensions.get('window');

  const rendertodos = todoList => {
    return (
      <ScrollView>
        {todoList.length != 0 ? (
          <ScrollView>
            {todoList.map(item => (
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
                  icon="pencil"
                  onPress={() => handleEdit(item.id, item.name)}
                />
                <IconButton
                  icon="trash-can"
                  onPress={() => handleDelete(item.id, item.checked)}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
            <Nodata />
          </View>
        )}
      </ScrollView>
    );
  };
  const handleAddTodo = async () => {
    // setLoading(true);
    console.log('add');
    inputRef.current.blur();
    var newTodo;

    if (!editTodo)
      newTodo = {name: todo, id: Date.now().toString(), checked: false};
    else newTodo = {name: todo, id: editId, checked: false};
    const listItems = [...todoList, newTodo];
    setTodoList(listItems);
    // console.log(await AsyncStorage.getItem('maintodo'));
    setLoading(false);
    setEditId();
    setEditTodo(false);
    setTodo('');
    // console.log(uid);
    const dataRef = ref(database, uid);
    const newRef = child(dataRef, newTodo.id);
    await set(newRef, newTodo)
      .then(() => {
        // console.log('Data written for Add operation');
      })
      .catch(error => {
        console.error('Data written error for Add operation', error);
      });
  };
  const handleDelete = async (id, checked) => {
    const dataRef = ref(database, uid);
    const childNodeRef = child(dataRef, id);
    if (checked === true)
      setCompletedTodoList(completedTodoList.filter(item => item.id !== id));
    else setTodoList(todoList.filter(item => item.id !== id));

    // Remove the child node
    remove(childNodeRef)
      .then(() => {
        // console.log(`Child node with ID ${id} removed successfully`);
      })
      .catch(error => {
        // console.error(`Error removing child node with ID ${nodeId}`, error);
      });
  };
  const handleEdit = (id, name) => {
    setEditTodo(true);
    setEditId(id);
    // console.log(todoList);
    inputRef.current.focus();
    setTodo(name);
    const listItems = mainTodo.filter(item => item.id !== id);
    const newTodoList = [...listItems];
    setMainTodo(listItems);
    AsyncStorage.setItem('maintodo', JSON.stringify(listItems));
    // console.log(newTodoList);
    setTodoList(newTodoList.filter(item => item.checked === false));
  };

  const handleCheck = async item => {
    const dataRef = ref(database, uid);
    const childNodeRef = child(dataRef, item.id);

    // Update the checked value to true
    const updateData = {
      checked: !item.checked,
      id: item.id,
      name: item.name,
    };

    // Perform the update
    update(childNodeRef, updateData)
      .then(() => {
        // console.log(
        //   `Checked value updated to true for data with ID ${item.id}`,
        // );
      })
      .catch(error => {
        console.error(
          // `Error updating checked value for data with ID ${dataId}`,
          error,
        );
      });
  };

  const database = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);
  async function fetchData(dat) {
    // Load data from AsyncStorage
    var MainLocalData = JSON.parse(await AsyncStorage.getItem('maintodo'));
    // console.log('fet', loading);
    if (MainLocalData && (await AsyncStorage.getItem('isData')) === 'true') {
      setLoading(true);
      // console.log('isdata');
      const localData = Object.keys(MainLocalData).map(
        key => MainLocalData[key],
      );

      setMainTodo(MainLocalData);

      const localCompletedItems = localData.filter(
        item => item.checked === true,
      );
      setCompletedTodoList(localCompletedItems);

      const localTodoItems = localData.filter(item => item.checked === false);
      setTodoList(localTodoItems);
      setLoading(false);
    }
    // setLoading(f);
    const dataRef = ref(database, uid);
    const isData = await AsyncStorage.getItem('isData');

    if (isData !== 'true' || isRefresh) {
      setLoading(true);
      // console.log('isdata');

      try {
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
          const mainData = snapshot.val();
          const data = Object.keys(mainData).map(key => mainData[key]);

          // console.log('fetchrefresh', data);

          // Update data in AsyncStorage
          AsyncStorage.setItem('maintodo', JSON.stringify(data));
          AsyncStorage.setItem('isData', 'true');

          // Update state with the fetched data
          setMainTodo(data);

          const completedItems = data.filter(item => item.checked === true);
          setCompletedTodoList(completedItems);

          const todoItems = data.filter(item => item.checked === false);
          setTodoList(todoItems);

          setLoading(false);
          setIsRefresh(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting data:', error);
        setLoading(false);
      }
    }
  }
  const [uid, setUid] = useState(userId);
  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);

        if (state.isConnected === false) {
        } else if (state.isConnected === true) {
          // console.log('connected');
          fetchData();
        }
      }
    });
    setCompletedItems(false);
    onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
        fetchData(user.uid);
        // localStorage.setItem("uid", JSON.stringify(user.uid));
      } else {
      }
    });
    const dataRef = ref(database, uid);
    const listener = onValue(dataRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Update your UI with the new message data

        const dataArray = Object.keys(data)
          .filter(key => key !== 'dummy') // Omit the "dummy" key
          .map(key => data[key]);
        // console.log('hiloo', dataArray);
        AsyncStorage.setItem('maintodo', JSON.stringify(dataArray));
        AsyncStorage.setItem('isData', 'true');
        setMainTodo(dataArray);
        const completedItems = dataArray.filter(item => item.checked === true);
        setCompletedTodoList(completedItems);
        const todoItems = dataArray.filter(item => item.checked === false);
        setTodoList(todoItems);
      } else {
        AsyncStorage.removeItem('maintodo');
        setMainTodo([]);
        setTodoList([]);
        setCompletedTodoList([]);
        // AsyncStorage.removeItem('isData');
      }
    });

    // return () =>
    return () => {
      unsubscribe();
      off(dataRef, listener);
    };
  }, [isConnected]);
  const [completedItems, setCompletedItems] = useState(false);
  const openCompletedTask = () => {
    // console.log('Completed task open');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompletedItems(true);
  };
  const openMyTasks = () => {
    setCompletedItems(false);
  };

  const {height: windowHeight} = Dimensions.get('window');
  return (
    <View style={{marginHorizontal: 3, height: windowHeight - 10}}>
      <View>
        <Header fetchdata={fetchData} setIsRefresh={setIsRefresh}></Header>
        <View style={{alignItems: 'center'}}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="black"
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0, 255, 0, )',
                padding: 500,
              }}
            />
          ) : (
            ''
          )}
        </View>
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
          onPress={() => {
            if (todo.length !== 0) handleAddTodo();
          }}>
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

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={openMyTasks}
            style={
              !completedItems ? styles.completedOpen : styles.completedClose
            }>
            <Text
              style={{
                fontSize: 20,
                textDecorationLine: 'underline',
                color: 'black',
                fontWeight: 700,
              }}>
              My Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openCompletedTask}
            style={
              completedItems ? styles.completedOpen : styles.completedClose
            }>
            <Text
              style={{
                fontSize: 20,
                textDecorationLine: 'underline',
                color: 'black',
                fontWeight: 700,
              }}>
              Completed Tasks
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {!completedItems ? (
        rendertodos(todoList)
      ) : (
        <CompletedTask
          data={completedTodoList}
          uid={uid}
          todoList={todoList}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          setTodoList={setTodoList}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
          handleEdit={handleEdit}></CompletedTask>
      )}
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  completedOpen: {
    alignContent: 'center',
    backgroundColor: '#d9d9d9',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecorationLine: 'underline',
    marginHorizontal: 30,
  },
  completedClose: {
    alignContent: 'center',
    // backgroundColor: '#d9d9d9',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
});
