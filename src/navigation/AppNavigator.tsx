import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { useAppDispatch } from '../redux/hooks';
import { login, logout } from '../redux/slices/authSlice';
import { auth } from '../config/firebase';

import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import OdometroScreen from '../modules/odometro/screens/OdometroScreen';
import ReportesScreen from '../modules/reportes/screens/ReportesScreen';
import HistorialMantenimientoScreen from '../modules/mantenimientos/screens/HistorialMantenimientosScreen';
import { VehiculoDetalleScreen } from '../modules/vehiculos/screens/VehiculoDetalleScreen'; // 👈 1. Importación agregada
import NotificacionesManager from '../modules/notificaciones/components/NotificacionesManager';

import TabNavigator from './TabNavigator';

import type { RootStackParamList } from './types';
import { commonStyles } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useAppDispatch();

  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const cancelarObservador = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          dispatch(
            login({
              id: firebaseUser.uid,
              nombre: firebaseUser.displayName ?? '',
              telefono: '',
              correo: firebaseUser.email ?? '',
            })
          );

          setUsuarioAutenticado(true);
        } else {
          dispatch(logout());
          setUsuarioAutenticado(false);
        }

        setCargandoSesion(false);
      },
      (error) => {
        console.error('Error al comprobar sesión:', error);
        dispatch(logout());
        setUsuarioAutenticado(false);
        setCargandoSesion(false);
      }
    );

    return cancelarObservador;
  }, [dispatch]);

  if (cargandoSesion) {
    return (
      <View style={commonStyles.authLoadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {usuarioAutenticado && <NotificacionesManager />}

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {usuarioAutenticado ? (
          <Stack.Group navigationKey="usuario">
            <Stack.Screen
              name="TabNavigator"
              component={TabNavigator}
            />
            <Stack.Screen
              name="VehiculoDetalleScreen"
              component={VehiculoDetalleScreen}
            />
            <Stack.Screen
              name="Odometro"
              component={OdometroScreen}
            />
            <Stack.Screen
              name="Reportes"
              component={ReportesScreen}
            />
            <Stack.Screen
              name="HistorialMantenimientoScreen"
              component={HistorialMantenimientoScreen}
            />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="invitado">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </>
  );
}