import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle, Clock } from 'lucide-react-native';

import { commonStyles, colores, espaciado } from '@/theme';
import type { Mantenimiento } from '@/types';

interface Props {
  mantenimientos: Mantenimiento[];
  kilometrajeActual: number;
}

export const ProximosMantenimientosCard: React.FC<Props> = ({
  mantenimientos,
  kilometrajeActual,
}) => {
  const formatearNumero = (num?: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.0';
    return num.toFixed(1).replace(',', '.');
  };

  // Filtrar mantenimientos que tengan un próximo kilometraje definido
  const proximos = mantenimientos
    .filter((m) => typeof m.siguienteMantenimientoKm === 'number' && m.siguienteMantenimientoKm > 0)
    .map((m) => {
      const kmFaltantes = (m.siguienteMantenimientoKm || 0) - kilometrajeActual;
      return { ...m, kmFaltantes };
    })
    .sort((a, b) => a.kmFaltantes - b.kmFaltantes)
    .slice(0, 3); // Mostrar solo los 3 más próximos

  if (proximos.length === 0) {
    return (
      <View style={[commonStyles.surface, { padding: espaciado.md, borderRadius: 8, marginTop: espaciado.sm }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Clock size={20} color={colores.gris} />
          <Text style={{ color: colores.textoSecundario, fontWeight: '600' }}>Próximos Servicios</Text>
        </View>
        <Text style={{ color: colores.textoSecundario, marginTop: 8, fontSize: 13 }}>
          No hay servicios programados próximamente.
        </Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.surface, { padding: espaciado.md, borderRadius: 8, marginTop: espaciado.sm }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: espaciado.sm }}>
        <AlertCircle size={20} color={colores.primario} />
        <Text style={{ color: colores.texto, fontWeight: 'bold', fontSize: 16 }}>
          Próximos Servicios
        </Text>
      </View>

      <View style={{ gap: espaciado.sm }}>
        {proximos.map((m) => {
          const esUrgente = m.kmFaltantes <= 500; // Menos de 500km se marca en rojo/alerta
          const tipoTexto = m.tipo ? String(m.tipo).toUpperCase() : 'GENERAL';

          return (
            <View
              key={`prox-${m.id}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: colores.borde,
                paddingBottom: 8,
              }}
            >
              <View>
                <Text style={{ color: colores.texto, fontWeight: '600' }}>
                  {tipoTexto}
                </Text>
                <Text style={{ color: colores.textoSecundario, fontSize: 12 }}>
                  A los {formatearNumero(m.siguienteMantenimientoKm)} km
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    color: esUrgente ? colores.rojo : colores.azulClaro,
                    fontWeight: 'bold',
                  }}
                >
                  {m.kmFaltantes > 0
                    ? `Faltan ${formatearNumero(m.kmFaltantes)} km`
                    : `Vencido por ${formatearNumero(Math.abs(m.kmFaltantes))} km`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};