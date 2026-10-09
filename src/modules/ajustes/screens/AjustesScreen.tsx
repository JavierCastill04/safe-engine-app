import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { cambiarTema, TemaColor } from '@/redux/slices/configSlice';
import { limpiarTodosLosVehiculos } from '@/redux/slices/vehiculoSlice';
import { limpiarTodosLosMantenimientos } from '@/redux/slices/mantenimientoSlice';
import { commonStyles, colores, espaciado } from '@/theme';

export default function AjustesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const temaActual = useAppSelector((state) => state.config?.tema || 'oscuro');
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  const handleCambiarTema = (nuevoTema: TemaColor) => {
    dispatch(cambiarTema(nuevoTema));
  };

  const handleBorrarVehiculos = () => {
    if (vehiculos.length === 0) {
      Alert.alert('Sin datos', 'No hay vehículos registrados para eliminar.');
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
            Alert.alert('Éxito', 'Todos los datos de vehículos han sido borrados.');
          },
        },
      ]
    );
  };

  const handleBorrarMantenimientos = () => {
    if (mantenimientos.length === 0) {
      Alert.alert('Sin datos', 'No hay registros de mantenimiento para eliminar.');
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
            Alert.alert('Éxito', 'El historial de mantenimientos ha sido vaciado.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[commonStyles.containerScreen, { paddingTop: insets.top + espaciado.sm }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* SECCIÓN 1: TEMA DE LA APLICACIÓN */}
      <View style={[commonStyles.surface, styles.seccionBox]}>
        <Text style={styles.seccionTitulo}>Tema de la aplicación</Text>
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
          >
            <Text style={styles.btnTextoTema}>Oscuro (Negro)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnTema,
              styles.btnTemaAzul,
              temaActual === 'azul' && styles.btnTemaActivo,
            ]}
            onPress={() => handleCambiarTema('azul')}
          >
            <Text style={styles.btnTextoTema}>Azul Marino</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN 2: PRIVACIDAD Y GESTIÓN DE DATOS */}
      <View style={[commonStyles.surface, styles.seccionBox]}>
        <Text style={styles.seccionTitulo}>Privacidad y Datos</Text>
        <Text style={styles.seccionSubtitulo}>
          Borra la información registrada si vendiste tus vehículos o deseas reiniciar historiales.
        </Text>

        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.btnBorrarMantenimientos}
            onPress={handleBorrarMantenimientos}
            activeOpacity={0.8}
          >
            <Text style={styles.btnBorrarTexto}>Eliminar todos los mantenimientos               </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnBorrar}
            onPress={handleBorrarVehiculos}
            activeOpacity={0.8}
          >
            <Text style={styles.btnBorrarTexto}>Eliminar todos los vehículos       </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: espaciado.xl,
  },
  seccionBox: {
    padding: espaciado.md,
    borderRadius: 12,
    marginBottom: espaciado.md,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 4,
  },
  seccionSubtitulo: {
    fontSize: 13,
    color: colores.textoSecundario,
    marginBottom: espaciado.md,
  },
  opcionesRow: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  btnTema: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  btnTemaOscuro: {
    backgroundColor: '#0F172A',
  },
  btnTemaAzul: {
    backgroundColor: '#1E3A8A',
  },
  btnTemaActivo: {
    borderColor: colores.primario,
  },
  btnTextoTema: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  accionesContainer: {
    gap: espaciado.sm,
  },
  btnBorrarMantenimientos: {
    backgroundColor: '#D97706', // Color ámbar/naranja para diferenciar advertencia de mantenimientos
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnBorrar: {
    backgroundColor: '#DC2626', // Color rojo para borrado crítico de vehículos
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnBorrarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});