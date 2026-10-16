import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart3, DollarSign, Wrench, ShieldAlert } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';

export const ReportesScreen = () => {
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  const formatearNumero = (num: number) => {
    return num.toFixed(1).replace(',', '.');
  };

  const costoTotalGlobal = mantenimientos.reduce((acc, m) => acc + (m.costo || 0), 0);

  return (
    <ScrollView style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>Reportes Financieros y Mantenimiento</Text>

      {vehiculos.length === 0 || mantenimientos.length === 0 ? (
        <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
          <BarChart3 size={52} color={colores.gris} />
          <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
            Sin datos suficientes
          </Text>
          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesEstadoVacioDescripcion,
            ]}
          >
            Registra vehículos y mantenimientos para generar resúmenes de costos e historial técnico.
          </Text>
        </View>
      ) : (
        <View style={{ gap: espaciado.md, marginBottom: espaciado.xl }}>
          {/* Tarjeta de Resumen Global */}
          <View style={[commonStyles.surface, { padding: espaciado.md, borderRadius: 10 }]}>
            <Text style={commonStyles.heading}>Resumen General</Text>
            <View style={{ flexDirection: 'row', gap: espaciado.lg, marginTop: espaciado.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <DollarSign size={20} color={colores.primario} />
                <View>
                  <Text style={commonStyles.secondaryText}>Gasto Total</Text>
                  <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>
                    ${formatearNumero(costoTotalGlobal)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Wrench size={20} color={colores.primario} />
                <View>
                  <Text style={commonStyles.secondaryText}>Servicios</Text>
                  <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>
                    {mantenimientos.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Desglose por Vehículo */}
          <Text style={[commonStyles.heading, { marginTop: espaciado.xs }]}>
            Desglose por Vehículo
          </Text>

          {vehiculos.map((v) => {
            const mantenimientosV = mantenimientos.filter((m) => m.vehiculoId === v.id);
            const costoV = mantenimientosV.reduce((acc, m) => acc + (m.costo || 0), 0);

            return (
              <View
                key={v.id}
                style={[
                  commonStyles.surface,
                  { padding: espaciado.md, borderRadius: 8, gap: 6 },
                ]}
              >
                <Text style={{ color: colores.blanco, fontWeight: 'bold', fontSize: 16 }}>
                  {v.marca} {v.modelo} ({v.placa})
                </Text>
                <Text style={commonStyles.secondaryText}>
                  Kilometraje Registrado: {formatearNumero(v.kilometrajeActual)} km
                </Text>
                <Text style={commonStyles.secondaryText}>
                  Servicios Realizados: {mantenimientosV.length}
                </Text>
                <Text
                  style={{
                    color: colores.primario,
                    fontWeight: 'bold',
                    fontSize: 15,
                    marginTop: 2,
                  }}
                >
                  Inversión Total: ${formatearNumero(costoV)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default ReportesScreen;