
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { Wrench, CarFront } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Obtener todos los vehículos
  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  // Obtener los 5 mantenimientos más recientes
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

  // Obtener nombre del vehículo según su ID
  const obtenerNombreVehiculo = (vehiculoId: string) => {
    const vehiculo = vehiculos.find(
      (v) => v.id === vehiculoId
    );

    return vehiculo
      ? `${vehiculo.marca} ${vehiculo.modelo}`
      : 'Vehículo';
  };

  return (
    <View
      style={[
        commonStyles.containerScreen,
        { paddingTop: insets.top + espaciado.sm },
      ]}
    >
      {/* Encabezado de mantenimientos */}
      <View style={commonStyles.homeSeccionHeader}>
        <View style={commonStyles.homeTituloFila}>
          <Wrench
            size={21}
            color={colores.primario}
            strokeWidth={2}
          />

          <Text style={commonStyles.homeSeccionTitulo}>
            Mantenimientos Recientes
          </Text>
        </View>
      </View>

      {/* Lista de mantenimientos */}
      <View style={commonStyles.homeListaContainer}>
        {mantenimientosRecientes.length === 0 ? (
          <View
            style={[
              commonStyles.surface,
              commonStyles.homeEmptyBox,
            ]}
          >
            <Text style={commonStyles.homeEmptyTexto}>
              No hay mantenimientos registrados recientemente.
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
                style={[
                  commonStyles.surface,
                  commonStyles.homeCardRecent,
                ]}
                onPress={() => {
                  navigation.getParent()?.navigate(
                    'HistorialMantenimientoScreen',
                    {
                      vehiculoId: item.vehiculoId,
                      vehiculoNombre: obtenerNombreVehiculo(
                        item.vehiculoId
                      ),
                    }
                  );
                }}
              >
                {/* Vehículo y fecha */}
                <View style={commonStyles.homeCardHeader}>
                  <View style={commonStyles.homeVehiculoFila}>
                    <CarFront
                      size={17}
                      color={colores.primario}
                      strokeWidth={2}
                    />

                    <Text
                      style={commonStyles.homeVehiculoNombre}
                      numberOfLines={1}
                    >
                      {obtenerNombreVehiculo(item.vehiculoId)}
                    </Text>
                  </View>

                  <Text style={commonStyles.homeFecha}>
                    {item.fecha ||
                      new Date().toLocaleDateString()}
                  </Text>
                </View>

                {/* Tipo de mantenimiento */}
                <Text style={commonStyles.homeTipoMantenimiento}>
                  {item.tipo ||
                    item.titulo ||
                    'Mantenimiento General'}
                </Text>

                {/* Descripción */}
                <Text
                  style={commonStyles.homeDescripcion}
                  numberOfLines={2}
                >
                  {item.descripcion ||
                    item.notas ||
                    'Sin detalle registrado.'}
                </Text>

                {/* Kilometraje y costo */}
                <View style={commonStyles.homeCardFooter}>
                  <Text style={commonStyles.homeFooterItem}>
                    Km:{' '}
                    <Text style={commonStyles.homeBold}>
                      {(
                        item.kilometrajeRealiz ??
                        item.kilometrajeActual ??
                        0
                      ).toLocaleString()}{' '}
                      km
                    </Text>
                  </Text>

                  {item.costo ? (
                    <Text style={commonStyles.homeFooterItem}>
                      Costo:{' '}
                      <Text style={commonStyles.homeBold}>
                        ${item.costo}
                      </Text>
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
