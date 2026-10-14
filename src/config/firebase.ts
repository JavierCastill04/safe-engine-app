
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: unknown) {
    const codigo =
      typeof error === 'object' &&
      error !== null &&
      'code' in error
        ? String(error.code)
        : '';

    if (codigo === 'auth/already-initialized') {
      return getAuth(app);
    }

    throw error;
  }
})();

export const db = getFirestore(app);
