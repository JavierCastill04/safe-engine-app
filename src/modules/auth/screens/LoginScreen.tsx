import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/config/firebase';
import { commonStyles, colores, espaciado } from '@/theme';

export const LoginScreen = ({ navigation }: any) => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !contrasenia.trim()) {
      Alert.alert('Campos vacíos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, correo.trim(), contrasenia);
    } catch (error: any) {
      console.error(error);
      let mensaje = 'No se pudo iniciar sesión. Inténtalo de nuevo.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        mensaje = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'El correo electrónico no es válido.';
      }
      Alert.alert('Error', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      style={commonStyles.containerScreen}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginBottom: espaciado.lg }}>
        {/* Logo actualizado a la ruta exacta de tus assets */}
        <Image
          source={require('@/assets/Cuarta version.jpg')}
          style={{ width: 140, height: 140, borderRadius: 16, marginBottom: espaciado.sm }}
          resizeMode="contain"
        />
        <Text style={[commonStyles.title, { marginBottom: 4 }]}>Safe Engine</Text>
        <Text style={commonStyles.secondaryText}>Gestión Inteligente de Mantenimiento</Text>
      </View>

      <View style={[commonStyles.surface, { padding: espaciado.lg, borderRadius: 12, gap: espaciado.md }]}>
        <Text style={[commonStyles.heading, { fontSize: 18, marginBottom: 4 }]}>Iniciar Sesión</Text>

        <View style={commonStyles.inputView}>
          <Text style={commonStyles.label}>Correo Electrónico</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colores.fondo, borderRadius: 8, borderWidth: 1, borderColor: colores.borde }}>
            <Mail size={18} color={colores.gris} style={{ marginLeft: 12 }} />
            <TextInput
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 46 }]}
              placeholder="tu@correo.com"
              placeholderTextColor={colores.gris}
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />
          </View>
        </View>

        <View style={commonStyles.inputView}>
          <Text style={commonStyles.label}>Contraseña</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colores.fondo, borderRadius: 8, borderWidth: 1, borderColor: colores.borde }}>
            <Lock size={18} color={colores.gris} style={{ marginLeft: 12 }} />
            <TextInput
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 46 }]}
              placeholder="••••••••"
              placeholderTextColor={colores.gris}
              secureTextEntry={!mostrarContrasenia}
              autoCapitalize="none"
              value={contrasenia}
              onChangeText={setContrasenia}
            />
            <TouchableOpacity onPress={() => setMostrarContrasenia(!mostrarContrasenia)} style={{ paddingHorizontal: 12 }}>
              {mostrarContrasenia ? <EyeOff size={18} color={colores.gris} /> : <Eye size={18} color={colores.gris} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[commonStyles.button, { marginTop: espaciado.sm, height: 48, justifyContent: 'center' }]}
          onPress={handleLogin}
          disabled={cargando}
        >
          {cargando ? <ActivityIndicator color={colores.blanco} /> : <Text style={commonStyles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{ alignItems: 'center', marginTop: espaciado.xs }}
        >
          <Text style={{ color: colores.primario, fontWeight: '600', fontSize: 13 }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;