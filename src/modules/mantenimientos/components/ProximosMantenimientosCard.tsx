import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react-native';
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
  const formatearNumero = (num: number) => num.toFixed(1).replace(',', '.');

  if (mantenimientos.length === 0) {
    return (
      <View style={[commonStyles.surface, { padding: espaciado.md, borderRadius: 8 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaciado.sm }}>
          <CheckCircle2 size={20} color={colores.primario} />
          <Text style={commonStyles.heading}>Próximos Mantenimientos</Text>
        </View>
        <Text style={[commonStyles.secondaryText, { marginTop: espaciado.xs }]}>
          No hay mantenimientos programados. Registra el primero para habilitar alertas.
        </Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.surface, { padding: espaciado.md, borderRadius: 8, gap: espaciado.sm }]}>
      <Text style={commonStyles.heading}>Estado y Próximas Revisiones</Text>

      {mantenimientos.map((m) => {
        const kmRealizado = m.kilometraje || m.kilometrajeRealiz || 0;
        const intervalo = m.intervaloKm || 5000;
        const kmLimite = m.siguienteMantenimientoKm || (kmRealizado + intervalo);
        const faltante = kmLimite - kilometrajeActual;
        const esVencido = faltante <= 0;

        return (
          <View
            key={m.id}
            style={{
              padding: espaciado.sm,
              borderRadius: 6,
              backgroundColor: colores.fondo,
              borderLeftWidth: 4,
              borderLeftColor: esVencido ? colores.rojo : colores.primario,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {esVencido ? (
                  <AlertCircle size={16} color={colores.rojo} />
                ) : (
                  <Clock size={16} color={colores.primario} />
                )}
                <Text style={{ color: colores.texto, fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {m.tipo}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: esVencido ? colores.rojo : colores.azulClaro,
                }}
              >
                {esVencido
                  ? `Vencido por ${formatearNumero(Math.abs(faltante))} km`
                  : `Faltan ${formatearNumero(faltante)} km`}
              </Text>
            </View>

            <Text style={{ color: colores.textoSecundario, fontSize: 12, marginTop: 4 }}>
              Límite sugerido: {formatearNumero(kmLimite)} km
            </Text>
          </View>
        );
      })}
    </View>
  );
};