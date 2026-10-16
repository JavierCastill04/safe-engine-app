import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck } from 'lucide-react-native';

import { auth } from '@/config/firebase';
import { commonStyles, colores, espaciado } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type RegisterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavigationProp>();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const registrarUsuario = async () => {
    setError('');

    if (!nombre.trim() || !correo.trim() || !contrasena || !confirmarContrasena) {
      setError('Completa todos los campos.');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        correo.trim().toLowerCase(),
        contrasena
      );

      await updateProfile(credencial.user, {
        displayName: nombre.trim(),
      });

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta se ha creado correctamente.'
      );
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este correo ya está registrado.');
          break;
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido.');
          break;
        case 'auth/weak-password':
          setError('La contraseña es demasiado débil.');
          break;
        case 'auth/network-request-failed':
          setError('No se pudo conectar. Revisa tu conexión a Internet.');
          break;
        default:
          setError('No se pudo crear la cuenta. Inténtalo nuevamente.');
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
          {/* Tarjeta de Registro */}
          <View style={[commonStyles.surface, { padding: espaciado.xl, width: '100%' }]}>
            
            <View style={{ alignItems: 'center', marginBottom: espaciado.md }}>
              <ShieldCheck size={48} color={colores.enfasis} strokeWidth={2.2} />
              <Text style={[commonStyles.title, { marginTop: espaciado.xs, textAlign: 'center' }]}>
                Crear cuenta
              </Text>
              <Text style={[commonStyles.secondaryText, { textAlign: 'center' }]}>
                Regístrate para comenzar con Safe Engine
              </Text>
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Nombre completo</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Tu nombre"
                placeholderTextColor={colores.gris}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
              />
            </View>

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
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Contraseña</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colores.gris}
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Confirmar contraseña</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor={colores.gris}
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
                secureTextEntry
              />
            </View>

            {error ? (
              <Text style={commonStyles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity
              style={[commonStyles.button, { marginTop: espaciado.md }]}
              onPress={registrarUsuario}
              disabled={cargando}
              accessibilityRole="button"
            >
              {cargando ? (
                <ActivityIndicator color={colores.blanco} />
              ) : (
                <Text style={commonStyles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: espaciado.md, alignItems: 'center' }}
              accessibilityRole="button"
            >
              <Text style={commonStyles.secondaryText}>
                ¿Ya tienes una cuenta? <Text style={{ color: colores.primario, fontWeight: 'bold' }}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}