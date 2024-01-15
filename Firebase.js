import {createContext, useContext} from 'react';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {getDatabase, ref, set} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBRogeH9S1s8d-nj0QcFnq2nqVOk3XmpR8',
  authDomain: 'student-database-a9aac.firebaseapp.com',
  projectId: 'student-database-a9aac',
  storageBucket: 'student-database-a9aac.appspot.com',
  messagingSenderId: '158320268396',
  appId: '1:158320268396:web:38a09469dfa1cbcc9a7449',
  measurementId: 'G-555JDK378C',
  databaseURL: 'https://student-database-a9aac-default-rtdb.firebaseio.com/',
};
export const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = props => {
  const signUpUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    // Signed up
    const user = userCredential.user;
    console.log(user, 'USER');
  };
  const signInUser = (email, password, onLogin) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        // console.log(user.isAnonymous);
        onLogin(user);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        onLogin(errorMessage, errorCode);
      });
  };
  const putData = (key, data) => {
    set(ref(db, key), data);
  };
  return (
    <FirebaseContext.Provider value={{signUpUser, putData, signInUser, db}}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
