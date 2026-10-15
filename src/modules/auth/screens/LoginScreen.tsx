
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { auth } from '../../../config/firebase';
import { commonStyles, colores } from '../../../theme';
import type { RootStackParamList } from '../../../navigation/types';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const iniciarSesion = async () => {
    setError('');

    if (!correo.trim() || !contrasena) {
      setError('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    setCargando(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        correo.trim().toLowerCase(),
        contrasena
      );

      // AppNavigator detectará la sesión de Firebase
      // y mostrará las pantallas principales.
    } catch (err: unknown) {
      const codigo =
        typeof err === 'object' &&
        err !== null &&
        'code' in err
          ? String(err.code)
          : '';

      switch (codigo) {
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido.');
          break;

        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Correo o contraseña incorrectos.');
          break;

        case 'auth/too-many-requests':
          setError('Demasiados intentos. Inténtalo más tarde.');
          break;

        case 'auth/network-request-failed':
          setError('No se pudo conectar. Revisa tu conexión a Internet.');
          break;

        default:
          setError('No se pudo iniciar sesión. Inténtalo nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.containerScreen}>
      <KeyboardAvoidingView
        style={commonStyles.containerScreen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={commonStyles.authScrollContent}
        >
          <Text style={commonStyles.title}>
            Iniciar sesión
          </Text>

          <Text style={commonStyles.secondaryText}>
            Bienvenido a Safe Engine.
            Ingresa tus credenciales para continuar.
          </Text>

          <View style={commonStyles.inputView}>
            <Text style={commonStyles.label}>
              Correo electrónico
            </Text>

            <TextInput
              style={commonStyles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colores.gris}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!cargando}
            />
          </View>

          <View style={commonStyles.inputView}>
            <Text style={commonStyles.label}>
              Contraseña
            </Text>

            <TextInput
              style={commonStyles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={colores.gris}
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
              autoComplete="password"
              editable={!cargando}
            />
          </View>

          {error ? (
            <Text style={commonStyles.errorText}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={commonStyles.button}
            onPress={iniciarSesion}
            disabled={cargando}
            accessibilityRole="button"
          >
            {cargando ? (
              <ActivityIndicator color={colores.blanco} />
            ) : (
              <Text style={commonStyles.buttonText}>
                Iniciar sesión
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={cargando}
            accessibilityRole="button"
          >
            <Text style={commonStyles.secondaryText}>
              ¿No tienes una cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
