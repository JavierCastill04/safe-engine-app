import React, { useState } from 'react';
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck } from 'lucide-react-native';

import { auth } from '@/config/firebase';
import { commonStyles, colores, espaciado } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

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
    <View style={commonStyles.containerScreen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={commonStyles.authScrollContent}
        >
          {/* Tarjeta principal de Login */}
          <View style={[commonStyles.surface, { padding: espaciado.xl, width: '100%' }]}>
            
            {/* Logo e Identidad de la App */}
            <View style={{ alignItems: 'center', marginBottom: espaciado.lg }}>
              <ShieldCheck size={56} color={colores.enfasis} strokeWidth={2.2} />
              <Text style={[commonStyles.title, { marginTop: espaciado.sm, textAlign: 'center' }]}>
                Safe Engine
              </Text>
              <Text style={[commonStyles.secondaryText, { textAlign: 'center' }]}>
                Ingresa tus credenciales para continuar
              </Text>
            </View>

            {/* Campos de entrada */}
            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Correo electrónico</Text>
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
              <Text style={commonStyles.label}>Contraseña</Text>
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
              <Text style={commonStyles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity
              style={[commonStyles.button, { marginTop: espaciado.md }]}
              onPress={iniciarSesion}
              disabled={cargando}
              accessibilityRole="button"
            >
              {cargando ? (
                <ActivityIndicator color={colores.blanco} />
              ) : (
                <Text style={commonStyles.buttonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={cargando}
              style={{ marginTop: espaciado.md, alignItems: 'center' }}
              accessibilityRole="button"
            >
              <Text style={commonStyles.secondaryText}>
                ¿No tienes una cuenta? <Text style={{ color: colores.primario, fontWeight: 'bold' }}>Regístrate</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}