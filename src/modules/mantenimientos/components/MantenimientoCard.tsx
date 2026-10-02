import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wrench, Calendar, DollarSign, Gauge, Trash2 } from 'lucide-react-native';
import { commonStyles, colores, espaciado } from '@/theme';
import type { Mantenimiento } from '@/types';
import { 
  formatearMoneda, 
  formatearKilometraje, 
  obtenerEtiquetaTipo 
} from '@/modules/mantenimientos/utils/MantenimientosUtils';

interface Props {
  mantenimiento: Mantenimiento;
  onEliminar?: (id: string) => void;
}

export const MantenimientoCard: React.FC<Props> = ({ mantenimiento, onEliminar }) => {
  return (
    <View style={commonStyles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Wrench color={colores.enfasis} size={20} />
          </View>
          {/* Usamos obtenerEtiquetaTipo en lugar del string crudo */}
          <Text style={commonStyles.cardTitle}>
            {obtenerEtiquetaTipo(mantenimiento.tipo)}
          </Text>
        </View>

        {onEliminar && (
          <TouchableOpacity
            onPress={() => onEliminar(mantenimiento.id)}
            style={styles.btnEliminar}
          >
            <Trash2 color={colores.rojo} size={18} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Calendar color={colores.gris} size={16} />
          <Text style={commonStyles.secondaryText}>{mantenimiento.fecha}</Text>
        </View>

        <View style={styles.infoRow}>
          <Gauge color={colores.gris} size={16} />
          <Text style={commonStyles.secondaryText}>
            {formatearKilometraje(mantenimiento.kilometraje)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <DollarSign color={colores.enfasis} size={16} />
          {/* Corregido a formatearMoneda */}
          <Text style={[commonStyles.text, styles.costoText]}>
            {formatearMoneda(mantenimiento.costo)}
          </Text>
        </View>
      </View>

      {mantenimiento.detallesEspecificos && (
        <View style={styles.detallesContainer}>
          {mantenimiento.detallesEspecificos.tipoAceite && (
            <Text style={commonStyles.secondaryText}>
              Aceite: {mantenimiento.detallesEspecificos.tipoAceite}
            </Text>
          )}
          {mantenimiento.detallesEspecificos.presionPSI !== undefined && (
            <Text style={commonStyles.secondaryText}>
              Presión: {mantenimiento.detallesEspecificos.presionPSI} PSI
            </Text>
          )}
          {mantenimiento.detallesEspecificos.voltajeBateria !== undefined && (
            <Text style={commonStyles.secondaryText}>
              Voltaje: {mantenimiento.detallesEspecificos.voltajeBateria}V
            </Text>
          )}
        </View>
      )}

      {mantenimiento.notas ? (
        <Text style={[commonStyles.secondaryText, styles.notasText]}>
          Nota: {mantenimiento.notas}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  iconContainer: {
    backgroundColor: colores.superficie,
    padding: espaciado.xs,
    borderRadius: 6,
  },
  btnEliminar: {
    padding: espaciado.xs,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.md,
    marginVertical: espaciado.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costoText: {
    fontWeight: '700',
  },
  detallesContainer: {
    marginTop: espaciado.sm,
    paddingTop: espaciado.xs,
    borderTopWidth: 1,
    borderTopColor: colores.superficie,
  },
  notasText: {
    fontStyle: 'italic',
    marginTop: espaciado.xs,
  },
});