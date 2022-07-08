import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCI_05SB7db4bK32N_oWiyLpJXYm4ivJls',
  authDomain: 'street-bridge-next.firebaseapp.com',
  databaseURL:
    'https://street-bridge-next-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'street-bridge-next',
  storageBucket: 'street-bridge-next.appspot.com',
  messagingSenderId: '704368413819',
  appId: '1:704368413819:web:f54670b0598796f877e6de',
  measurementId: 'G-5NFTCRDXE9',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const analytics = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
