import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { shallowEqual } from 'react-redux';
import { Wrench, CarFront, ShieldCheck } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores } from '@/theme';

export const HomeScreen = ({ navigation }: any) => {
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  const mantenimientosRecientes = useAppSelector((state) => {
    const lista = [...state.mantenimientos.mantenimientos];
    return lista
      .sort((a: any, b: any) => {
        const fechaA = new Date(a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha || 0).getTime();
        return fechaB - fechaA;
      })
      .slice(0, 5);
  }, shallowEqual);

  const obtenerNombreVehiculo = (vehiculoId: string) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Vehículo';
  };

  const formatearNumero = (num: number) => {
    return num.toFixed(1).replace(',', '.');
  };

  return (
    <View style={commonStyles.containerScreen}>
      <View style={commonStyles.homeSeccionHeader}>
        <View style={commonStyles.homeTituloFila}>
          <Wrench size={21} color={colores.primario} strokeWidth={2} />
          <Text style={commonStyles.homeSeccionTitulo}>Mantenimientos Recientes</Text>
        </View>
      </View>

      <View style={commonStyles.homeListaContainer}>
        {mantenimientosRecientes.length === 0 ? (
          <View style={[commonStyles.surface, commonStyles.homeEmptyBox, { gap: 12 }]}>
            <ShieldCheck size={48} color={colores.gris} />
            <Text style={[commonStyles.heading, { textAlign: 'center' }]}>
              Bienvenido a Safe Engine
            </Text>
            <Text style={commonStyles.homeEmptyTexto}>
              No hay mantenimientos registrados aún. Dirígete a la pestaña de Vehículos para agregar tu primer automóvil y llevar un control detallado.
            </Text>
          </View>
        ) : (
          <FlatList
            data={mantenimientosRecientes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={commonStyles.homeListContent}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[commonStyles.surface, commonStyles.homeCardRecent]}
                onPress={() => {
                  navigation.getParent()?.navigate('HistorialMantenimientoScreen', {
                    vehiculoId: item.vehiculoId,
                    vehiculoNombre: obtenerNombreVehiculo(item.vehiculoId),
                  });
                }}
              >
                <View style={commonStyles.homeCardHeader}>
                  <View style={commonStyles.homeVehiculoFila}>
                    <CarFront size={17} color={colores.primario} strokeWidth={2} />
                    <Text style={commonStyles.homeVehiculoNombre} numberOfLines={1}>
                      {obtenerNombreVehiculo(item.vehiculoId)}
                    </Text>
                  </View>
                  <Text style={commonStyles.homeFecha}>{item.fecha}</Text>
                </View>

                <Text style={commonStyles.homeTipoMantenimiento}>
                  {(item.tipo || 'Mantenimiento General').toUpperCase()}
                </Text>

                <Text style={commonStyles.homeDescripcion} numberOfLines={2}>
                  {item.descripcion || item.notas || 'Sin detalle registrado.'}
                </Text>

                <View style={commonStyles.homeCardFooter}>
                  <Text style={commonStyles.homeFooterItem}>
                    Km:{' '}
                    <Text style={commonStyles.homeBold}>
                      {formatearNumero(item.kilometraje || item.kilometrajeRealiz || 0)} km
                    </Text>
                  </Text>
                  {item.costo ? (
                    <Text style={commonStyles.homeFooterItem}>
                      Costo:{' '}
                      <Text style={commonStyles.homeBold}>\${formatearNumero(item.costo)}</Text>
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;