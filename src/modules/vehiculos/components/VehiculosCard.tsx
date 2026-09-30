import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Car, Wrench, Gauge } from 'lucide-react-native';
import { colores, tipografia } from '../../../theme';
import { Vehiculo } from '@/types/Vehiculo';
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
      style={[styles.card, esSeleccionado && styles.cardSeleccionado]}
      onPress={() => onSelect && onSelect(vehiculo.id)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Car color={colores.enfasis} size={24} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.titulo}>{obtenerNombreCompletoVehiculo(vehiculo)}</Text>
          <Text style={styles.placa}>Placa: {vehiculo.placa}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Gauge color={colores.claro} size={18} />
        <Text style={styles.infoTexto}>
          Kilometraje: {formatearKilometraje(vehiculo.kilometrajeActual)}
        </Text>
      </View>

      {onRegistrarMantenimiento && (
        <TouchableOpacity
          style={styles.botonAccion}
          onPress={() => onRegistrarMantenimiento(vehiculo)}
        >
          <Wrench color={colores.texto} size={16} />
          <Text style={styles.textoBoton}>Registrar Mantenimiento</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colores.secundario,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSeleccionado: {
    borderColor: colores.enfasis,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: colores.negro,
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  titulo: {
    color: colores.texto,
    fontSize: 16,
    fontWeight: 'bold',
  },
  placa: {
    color: colores.claro,
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTexto: {
    color: colores.claro,
    fontSize: 14,
  },
  botonAccion: {
    backgroundColor: colores.enfasis,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  textoBoton: {
    color: colores.texto,
    fontWeight: '600',
    fontSize: 14,
  },
});