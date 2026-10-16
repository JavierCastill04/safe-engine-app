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
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '@/config/firebase';
import { commonStyles, colores, espaciado } from '@/theme';

export const RegisterScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!nombre.trim() || !correo.trim() || !contrasenia.trim()) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los datos requeridos.');
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      Alert.alert('Contraseñas diferentes', 'Las contraseñas ingresadas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo.trim(), contrasenia);
      await updateProfile(userCredential.user, { displayName: nombre.trim() });
    } catch (error: any) {
      console.error(error);
      let mensaje = 'Ocurrió un error en el registro. Inténtalo de nuevo.';
      if (error.code === 'auth/email-already-in-use') {
        mensaje = 'Este correo ya se encuentra registrado.';
      } else if (error.code === 'auth/weak-password') {
        mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      }
      Alert.alert('Error de registro', mensaje);
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
      <View style={{ alignItems: 'center', marginBottom: espaciado.md }}>
        {/* Logo actualizado a la ruta exacta de tus assets */}
        <Image
          source={require('@/assets/Cuarta version.jpg')}
          style={{ width: 100, height: 100, borderRadius: 12, marginBottom: espaciado.xs }}
          resizeMode="contain"
        />
        <Text style={[commonStyles.title, { marginBottom: 2 }]}>Safe Engine</Text>
        <Text style={commonStyles.secondaryText}>Crea tu cuenta de gestión</Text>
      </View>

      <View style={[commonStyles.surface, { padding: espaciado.lg, borderRadius: 12, gap: espaciado.sm }]}>
        <Text style={[commonStyles.heading, { fontSize: 18, marginBottom: 4 }]}>Registrarse</Text>

        <View style={commonStyles.inputView}>
          <Text style={commonStyles.label}>Nombre Completo</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colores.fondo, borderRadius: 8, borderWidth: 1, borderColor: colores.borde }}>
            <User size={18} color={colores.gris} style={{ marginLeft: 12 }} />
            <TextInput
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 44 }]}
              placeholder="Juan Pérez"
              placeholderTextColor={colores.gris}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
        </View>

        <View style={commonStyles.inputView}>
          <Text style={commonStyles.label}>Correo Electrónico</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colores.fondo, borderRadius: 8, borderWidth: 1, borderColor: colores.borde }}>
            <Mail size={18} color={colores.gris} style={{ marginLeft: 12 }} />
            <TextInput
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 44 }]}
              placeholder="juan@correo.com"
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
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 44 }]}
              placeholder="Mínimo 6 caracteres"
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

        <View style={commonStyles.inputView}>
          <Text style={commonStyles.label}>Confirmar Contraseña</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colores.fondo, borderRadius: 8, borderWidth: 1, borderColor: colores.borde }}>
            <Lock size={18} color={colores.gris} style={{ marginLeft: 12 }} />
            <TextInput
              style={[commonStyles.input, { flex: 1, borderWidth: 0, height: 44 }]}
              placeholder="Repite tu contraseña"
              placeholderTextColor={colores.gris}
              secureTextEntry={!mostrarContrasenia}
              autoCapitalize="none"
              value={confirmarContrasenia}
              onChangeText={setConfirmarContrasenia}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[commonStyles.button, { marginTop: espaciado.sm, height: 46, justifyContent: 'center' }]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          {cargando ? <ActivityIndicator color={colores.blanco} /> : <Text style={commonStyles.buttonText}>Registrarse</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ alignItems: 'center', marginTop: espaciado.xs }}
        >
          <Text style={{ color: colores.primario, fontWeight: '600', fontSize: 13 }}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;