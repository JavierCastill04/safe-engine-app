import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { shallowEqual, useSelector } from 'react-redux';

import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store';
import { commonStyles, colores, espaciado } from '@/theme';

interface Props {
  route: {
    params: {
      vehiculoId: string;
      vehiculoNombre?: string;
    };
  };
}

export const HistorialMantenimientosScreen: React.FC<Props> = ({ route }) => {
  const { vehiculoId, vehiculoNombre } = route.params;
  const [refrescando, setRefrescando] = useState(false);

  // Selección segura y memorizada
  const mantenimientos = useSelector((state: RootState) => {
    const lista = state.mantenimientos?.mantenimientos;
    if (!Array.isArray(lista)) return [];
    return lista.filter((m) => m && m.vehiculoId === vehiculoId);
  }, shallowEqual);

  const alRefrescar = () => {
    setRefrescando(true);
    // Aquí podrías despachar una acción para recargar de Firebase si fuera necesario
    setTimeout(() => {
      setRefrescando(false);
    }, 800);
  };

  const formatearNumero = (num?: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.0';
    return num.toFixed(1).replace(',', '.');
  };

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>
        Historial {vehiculoNombre ? `- ${vehiculoNombre}` : ''}
      </Text>

      {mantenimientos.length === 0 ? (
        <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
          <Wrench size={56} color={colores.gris} />
          <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
            Sin mantenimientos
          </Text>
          <Text style={[commonStyles.secondaryText, commonStyles.notificacionesEstadoVacioDescripcion]}>
            Aún no has registrado ningún mantenimiento o reparación para este vehículo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mantenimientos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: espaciado.md, paddingBottom: espaciado.xl }}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={alRefrescar}
              tintColor={colores.primario}
              colors={[colores.primario]}
            />
          }
          renderItem={({ item }) => {
            const tipoTexto = item.tipo ? String(item.tipo).toUpperCase() : 'GENERAL';
            return (
              <View
                style={[
                  commonStyles.surface,
                  { padding: espaciado.md, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: colores.primario },
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: colores.texto, fontWeight: 'bold', fontSize: 16 }}>
                    {tipoTexto}
                  </Text>
                  <Text style={{ color: colores.textoSecundario, fontSize: 14 }}>
                    {item.fecha || 'Sin fecha'}
                  </Text>
                </View>
                
                <Text style={{ color: colores.textoSecundario, marginBottom: 4 }}>
                  Odómetro: {formatearNumero(item.kilometraje || item.kilometrajeRealiz || 0)} km
                </Text>
                
                <Text style={{ color: colores.primario, fontWeight: 'bold' }}>
                  Costo: \${formatearNumero(item.costo)}
                </Text>

                {(item.notas || item.descripcion) ? (
                  <Text
                    style={{
                      color: colores.textoSecundario,
                      fontStyle: 'italic',
                      marginTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: colores.borde,
                      paddingTop: 8
                    }}
                  >
                    "{item.notas || item.descripcion}"
                  </Text>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default HistorialMantenimientosScreen;