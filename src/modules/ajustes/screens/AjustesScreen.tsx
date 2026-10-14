
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Moon,
  Waves,
  ClipboardX,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import { auth } from '@/config/firebase';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { cambiarTema, type TemaColor } from '@/redux/slices/configSlice';
import { limpiarTodosLosVehiculos } from '@/redux/slices/vehiculoSlice';
import { limpiarTodosLosMantenimientos } from '@/redux/slices/mantenimientoSlice';
import { commonStyles, espaciado } from '@/theme';
import { ajustesStyles as styles } from '@/theme/ajustesStyles';

export default function AjustesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const temaActual = useAppSelector(
    (state) => state.config?.tema || 'oscuro'
  );

  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const handleCambiarTema = (nuevoTema: TemaColor) => {
    dispatch(cambiarTema(nuevoTema));
  };

  const handleBorrarVehiculos = () => {
    if (vehiculos.length === 0) {
      Alert.alert(
        'Sin datos',
        'No hay vehículos registrados para eliminar.'
      );
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar TODOS los vehículos registrados? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar todo',
          style: 'destructive',
          onPress: () => {
            dispatch(limpiarTodosLosVehiculos());
            Alert.alert(
              'Éxito',
              'Todos los datos de vehículos han sido borrados.'
            );
          },
        },
      ]
    );
  };

  const handleBorrarMantenimientos = () => {
    if (mantenimientos.length === 0) {
      Alert.alert(
        'Sin datos',
        'No hay registros de mantenimiento para eliminar.'
      );
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar TODOS los registros de mantenimiento? Los vehículos registrados se mantendrán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, borrar mantenimientos',
          style: 'destructive',
          onPress: () => {
            dispatch(limpiarTodosLosMantenimientos());
            Alert.alert(
              'Éxito',
              'El historial de mantenimientos ha sido vaciado.'
            );
          },
        },
      ]
    );
  };

  const cerrarSesion = async () => {
    if (cerrandoSesion) return;

    setCerrandoSesion(true);

    try {
      await signOut(auth);

    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      Alert.alert(
        'Error',
        'No se pudo cerrar la sesión. Inténtalo nuevamente.'
      );
    } finally {
      setCerrandoSesion(false);
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas cerrar tu sesión de Safe Engine?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: cerrarSesion,
        },
      ]
    );
  };

  return (
    <ScrollView
      style={commonStyles.containerScreen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + espaciado.sm },
      ]}
    >
      {/* SECCIÓN 1: TEMA DE LA APLICACIÓN */}
      <View style={[commonStyles.surface, styles.seccionBox]}>
        <Text style={styles.seccionTitulo}>
          Tema de la aplicación
        </Text>

        <Text style={styles.seccionSubtitulo}>
          Selecciona el esquema de colores principal.
        </Text>

        <View style={styles.opcionesRow}>
          <TouchableOpacity
            style={[
              styles.btnTema,
              styles.btnTemaOscuro,
              temaActual === 'oscuro' && styles.btnTemaActivo,
            ]}
            onPress={() => handleCambiarTema('oscuro')}
            accessibilityRole="button"
            accessibilityLabel="Seleccionar tema oscuro"
            accessibilityState={{
              selected: temaActual === 'oscuro',
            }}
          >
            <Moon color="#FFF" size={23} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnTema,
              styles.btnTemaAzul,
              temaActual === 'azul' && styles.btnTemaActivo,
            ]}
            onPress={() => handleCambiarTema('azul')}
            accessibilityRole="button"
            accessibilityLabel="Seleccionar tema azul marino"
            accessibilityState={{
              selected: temaActual === 'azul',
            }}
          >
            <Waves color="#FFF" size={23} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN 2: PRIVACIDAD Y GESTIÓN DE DATOS */}
      <View style={[commonStyles.surface, styles.seccionBox]}>
        <Text style={styles.seccionTitulo}>
          Privacidad y Datos
        </Text>

        <Text style={styles.seccionSubtitulo}>
          Borra la información registrada si vendiste tus vehículos
          o deseas reiniciar historiales.
        </Text>

        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.btnBorrarMantenimientos}
            onPress={handleBorrarMantenimientos}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Eliminar todos los mantenimientos"
            accessibilityHint="Solicita confirmación antes de borrar los registros de mantenimiento"
          >
            <ClipboardX color="#FFF" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnBorrar}
            onPress={handleBorrarVehiculos}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Eliminar todos los vehículos"
            accessibilityHint="Solicita confirmación antes de borrar todos los vehículos"
          >
            <Trash2 color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN 3: CUENTA */}
      <View style={[commonStyles.surface, styles.seccionBox]}>
        <Text style={styles.seccionTitulo}>
          Cuenta
        </Text>

        <Text style={styles.seccionSubtitulo}>
          Administra tu sesión de Safe Engine.
        </Text>

        <TouchableOpacity
          style={styles.btnCerrarSesion}
          onPress={handleCerrarSesion}
          disabled={cerrandoSesion}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          {cerrandoSesion ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <LogOut color="#FFF" size={21} />
              <Text style={styles.btnCerrarSesionTexto}>
                Cerrar sesión
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

