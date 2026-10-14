import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  useStyles,
  useTheme,
  type ThemeContextType,
} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

import type { Vehiculo } from '@/types';
import {
  formatearKilometraje,
  obtenerNombreCompletoVehiculo,
} from '../utils/VehiculosUtils';

interface VehiculosCardProps {
  vehiculo: Vehiculo;
  esSeleccionado?: boolean;
  onSelect?: (id: string) => void;
  onRegistrarMantenimiento?: (vehiculo: Vehiculo) => void;
}

export const VehiculosCard: React.FC<VehiculosCardProps> = ({
  vehiculo,
  esSeleccionado = false,
  onSelect,
  onRegistrarMantenimiento,
}) => {
  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity
      style={[
        estilos.surface,
        styles.card,
        esSeleccionado && styles.cardSeleccionado,
      ]}
      onPress={() => onSelect?.(vehiculo.id)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected: esSeleccionado }}
      accessibilityLabel={`Vehículo ${obtenerNombreCompletoVehiculo(vehiculo)}`}
    >
      <View style={styles.header}>
        <View style={styles.identificador}>
          <Text style={styles.identificadorTexto}>
            {vehiculo.marca?.substring(0, 1).toUpperCase() || 'V'}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.titulo}>
            {obtenerNombreCompletoVehiculo(vehiculo)}
          </Text>

          <Text style={styles.subtitulo}>
            Placa: {vehiculo.placa || 'Sin placa'}
          </Text>
        </View>

        {esSeleccionado && (
          <View style={styles.estadoSeleccionado}>
            <Text style={styles.estadoTexto}>
              Seleccionado
            </Text>
          </View>
        )}
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoEtiqueta}>
          Kilometraje actual
        </Text>

        <Text style={styles.kilometraje}>
          {formatearKilometraje(vehiculo.kilometrajeActual)}
        </Text>
      </View>
      {onRegistrarMantenimiento && (
        <TouchableOpacity
          style={[
            styles.btnAccion,
            { marginTop: espaciado.md },
          ]}
          onPress={() => onRegistrarMantenimiento(vehiculo)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Registrar mantenimiento de ${obtenerNombreCompletoVehiculo(vehiculo)}`}
        >
          <Text style={styles.btnAccionTexto}>
            Registrar mantenimiento
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    card: {
      padding: t.espaciado.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 35),
      overflow: 'hidden',
    },

    cardSeleccionado: {
      borderColor: t.colores.primario,
      borderLeftWidth: 5,
      backgroundColor: conAlpha(t.colores.primario, 7),
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: t.espaciado.md,
      gap: t.espaciado.sm,
    },

    identificador: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: conAlpha(t.colores.primario, 14),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.primario, 30),
    },

    identificadorTexto: {
      fontSize: 20,
      fontWeight: 'bold',
      color: t.colores.primario,
    },

    headerText: {
      flex: 1,
    },

    titulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: 4,
    },

    subtitulo: {
      fontSize: 12,
      color: t.colores.textoSecundario,
    },

    estadoSeleccionado: {
      paddingHorizontal: t.espaciado.sm,
      paddingVertical: 5,
      borderRadius: 7,
      backgroundColor: conAlpha(t.colores.primario, 15),
    },

    estadoTexto: {
      fontSize: 10,
      fontWeight: 'bold',
      color: t.colores.primario,
    },

    infoBox: {
      padding: t.espaciado.md,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.texto, 5),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 25),
    },

    infoEtiqueta: {
      fontSize: 12,
      color: t.colores.textoSecundario,
      marginBottom: 5,
    },

    kilometraje: {
      fontSize: 18,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    btnAccion: {
      minHeight: 44,
      paddingVertical: 11,
      paddingHorizontal: t.espaciado.md,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colores.primario,
    },

    btnAccionTexto: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });

export default VehiculosCard;