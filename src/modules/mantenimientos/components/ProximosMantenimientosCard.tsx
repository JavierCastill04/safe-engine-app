// src/modules/mantenimientos/components/ProximosMantenimientosCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';
import { colores, espaciado, commonStyles } from '@/theme';
import type { Mantenimiento, TipoMantenimiento } from '@/types';
import { OpcionesTipoMantenimiento } from '../utils/MantenimientosUtils';
import { calcularProximoMantenimiento } from '../utils/calculoMantenimientos';

interface Props {
  mantenimientos: Mantenimiento[];
  kilometrajeActual: number;
}

const TIPOS_A_EVALUAR: TipoMantenimiento[] = ['aceite', 'frenos', 'neumaticos', 'bateria'];

export const ProximosMantenimientosCard: React.FC<Props> = ({
  mantenimientos,
  kilometrajeActual,
}) => {
  const proximos = TIPOS_A_EVALUAR.map((tipo) =>
    calcularProximoMantenimiento(mantenimientos, tipo, kilometrajeActual)
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  if (proximos.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={commonStyles.text}>No hay registros suficientes para calcular próximos mantenimientos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={commonStyles.heading}>Próximos Mantenimientos</Text>

      {proximos.map((item) => {
        const etiquetaTipo =
          OpcionesTipoMantenimiento?.find((o) => o.value === item.tipo)?.label || item.tipo;

        return (
          <View key={item.tipo} style={styles.row}>
            <View style={styles.infoCol}>
              <View style={styles.headerRow}>
                {item.estado === 'vencido' && <AlertTriangle size={18} color={colores.error || '#e74c3c'} />}
                {item.estado === 'proximo' && <Clock size={18} color="#f39c12" />}
                {item.estado === 'al_dia' && <CheckCircle size={18} color="#2ecc71" />}
                <Text style={styles.tipoText}>{etiquetaTipo}</Text>
              </View>

              <Text style={styles.subtext}>
                Próximo: {item.proximoKilometraje.toLocaleString()} km ({item.proximaFechaEstimada})
              </Text>
            </View>

            <View style={styles.badgeCol}>
              {item.estado === 'vencido' ? (
                <Text style={[styles.badge, styles.badgeVencido]}>Vencido</Text>
              ) : item.estado === 'proximo' ? (
                <Text style={[styles.badge, styles.badgeProximo]}>
                  En {item.kmRestantes} km
                </Text>
              ) : (
                <Text style={[styles.badge, styles.badgeAlDia]}>Al día</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colores.superficie || '#1e1e1e',
    borderRadius: 12,
    padding: espaciado.md,
    marginVertical: espaciado.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: espaciado.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea || '#333',
  },
  infoCol: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipoText: {
    color: colores.texto || '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtext: {
    color: colores.gris || '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  badgeCol: {
    marginLeft: espaciado.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  badgeVencido: {
    backgroundColor: '#rgba(231, 76, 60, 0.2)',
    color: '#e74c3c',
  },
  badgeProximo: {
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    color: '#f39c12',
  },
  badgeAlDia: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#2ecc71',
  },
});