
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDlosOL5yCB6bGoG3PLEyYfo_nr-EYo4io',
  authDomain: 'safe-engine-1f167.firebaseapp.com',
  projectId: 'safe-engine-1f167',
  storageBucket: 'safe-engine-1f167.firebasestorage.app',
  messagingSenderId: '380470530477',
  appId: '1:380470530477:web:ffa7874e637065143b9124',
};

export const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
