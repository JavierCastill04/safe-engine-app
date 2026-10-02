import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Car, Wrench, Gauge } from 'lucide-react-native';
import { commonStyles, colores, espaciado } from '@/theme';
import type { Vehiculo } from '@/types';
import { formatearKilometraje, obtenerNombreCompletoVehiculo } from '../utils/VehiculosUtils';

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
  return (
    <TouchableOpacity
      style={[
        commonStyles.card,
        esSeleccionado && styles.cardSeleccionado,
      ]}
      onPress={() => onSelect && onSelect(vehiculo.id)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Car color={colores.enfasis} size={24} />
        </View>
        <View style={styles.headerText}>
          <Text style={commonStyles.cardTitle}>
            {obtenerNombreCompletoVehiculo(vehiculo)}
          </Text>
          <Text style={commonStyles.secondaryText}>Placa: {vehiculo.placa}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Gauge color={colores.blanco} size={18} />
        <Text style={commonStyles.text}>
          {formatearKilometraje(vehiculo.kilometrajeActual)}
        </Text>
      </View>

      {onRegistrarMantenimiento && (
        <TouchableOpacity
          style={[commonStyles.button, styles.btnAccion]}
          onPress={() => onRegistrarMantenimiento(vehiculo)}
        >
          <Wrench color={colores.blanco} size={16} />
          <Text style={commonStyles.buttonText}>Registrar Mantenimiento</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardSeleccionado: {
    borderLeftColor: colores.primario,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  iconContainer: {
    backgroundColor: colores.superficie,
    padding: espaciado.sm,
    borderRadius: 8,
    marginRight: espaciado.md,
  },
  headerText: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
    marginBottom: espaciado.md,
  },
  btnAccion: {
    flexDirection: 'row',
    gap: espaciado.xs,
    backgroundColor: colores.enfasis,
  },
});