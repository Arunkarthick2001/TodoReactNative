import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import {Checkbox, IconButton} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {getDatabase, ref, get, set} from 'firebase/database';
import {firebaseApp} from '../../Firebase';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import Nodata from './Nodata';
import CompletedTask from './CompletedTask';
import {useNavigation} from '@react-navigation/native';
import Header from './Header';
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
    setLoading(true);
    inputRef.current.blur();
    var newTodo;
    if (!editTodo)
      newTodo = {name: todo, id: Date.now().toString(), checked: false};
    else newTodo = {name: todo, id: editId, checked: false};
    const listItems = [...mainTodo, newTodo];

    // console.log(uid);
    const dataRef = ref(database, uid);
    await set(dataRef, listItems)
      .then(() => {
        // console.log("Data written for Add operation");
      })
      .catch(error => {
        console.error('Data written error for Add operation', error);
      });
    setLoading(false);
    setEditId();
    setEditTodo(false);
    setTodoList([...todoList, newTodo]);
    setMainTodo(listItems);
    setTodo('');
  };
  const handleDelete = async (id, checked) => {
    const listItems = mainTodo.filter(item => item.id !== id);
    setMainTodo(listItems);
    setTodoList(listItems.filter(item => item.checked === false));
    setCompletedTodoList(listItems.filter(item => item.checked !== false));
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
    setEditId(id);
    // console.log(todoList);
    inputRef.current.focus();
    setTodo(name);
    const listItems = mainTodo.filter(item => item.id !== id);
    const newTodoList = [...listItems];
    console.log(newTodoList);
    setTodoList(newTodoList);
  };
  const handleEditSave = async () => {
    inputRef.current.blur();
    const listItems = [
      ...todoList,
      {name: todo, id: Date.now().toString(), checked: false},
    ];

    // console.log(uid);
    const dataRef = ref(database, uid);
    await set(dataRef, listItems)
      .then(() => {
        // console.log("Data written for Add operation");
      })
      .catch(error => {
        console.error('Data written error for Add operation', error);
      });
    setTodoList([
      ...todoList,
      {name: todo, id: Date.now().toString(), checked: false},
    ]);
    setTodo('');
  };
  const handleCheck = async item => {
    const listItems = mainTodo.filter(items => items.id !== item.id);
    const newTodoList = [
      ...listItems,
      {id: item.id, name: item.name, checked: !item.checked},
    ];
    setMainTodo(newTodoList);
    setCompletedTodoList(newTodoList.filter(item => item.checked !== false));
    setTodoList(newTodoList.filter(item => item.checked === false));
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
    setLoading(true);
    const dataRef = ref(database, uid);
    get(dataRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // console.log('Data: ', data);
          setMainTodo(data);
          const completedItems = data.filter(item => item.checked === true);
          setCompletedTodoList(completedItems);
          const todoItems = data.filter(item => item.checked === false);
          setTodoList(todoItems);
          setLoading(false);
        } else {
          setLoading(false);

          //   console.log("No data available");
        }
      })
      .catch(error => {
        console.error('Error getting data:', error);
      });
  }
  const [uid, setUid] = useState(userId);
  useEffect(() => {
    setCompletedItems(false);
    setLoading(true);
    onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
        fetchData(user.uid);
        // localStorage.setItem("uid", JSON.stringify(user.uid));
      } else {
      }
    });
  }, []);
  const [completedItems, setCompletedItems] = useState(false);
  const openCompletedTask = () => {
    // console.log('Completed task open');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompletedItems(!completedItems);
  };
  return (
    <View style={{marginHorizontal: 3}}>
      <Header fetchdata={fetchData}></Header>
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
      <TouchableWithoutFeedback
        style={completedItems ? styles.completedOpen : styles.completedClose}>
        <Text
          style={{
            fontSize: 20,
            textDecorationLine: 'underline',
            color: 'black',
            fontWeight: 700,
          }}>
          My tasks
        </Text>
      </TouchableWithoutFeedback>
      {todoList.length != 0 ? (
        <FlatList data={todoList} renderItem={rendertodos}></FlatList>
      ) : (
        <View>
          <Nodata />
        </View>
      )}
      <TouchableOpacity
        onPress={openCompletedTask}
        style={completedItems ? styles.completedOpen : styles.completedClose}>
        <Text style={{fontSize: 20, alignItems: 'flex-start'}}>
          Completed tasks
        </Text>
        <IconButton
          icon={
            !completedItems ? 'arrow-down-drop-circle' : 'arrow-up-drop-circle'
          }
          size={17}></IconButton>
      </TouchableOpacity>
      {completedItems ? (
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
      ) : (
        ''
      )}
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  completedOpen: {
    alignContent: 'center',
    backgroundColor: '#e6e6e6',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedClose: {
    alignContent: 'center',
    backgroundColor: '#d9d9d9',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
