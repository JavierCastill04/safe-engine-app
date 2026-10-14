import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from "react-native-toast-message";
import AppRoot from '@/navigation/AppRoot'

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppRoot />
      </SafeAreaProvider>
    </Provider>
  );
}