import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';

export const HistorialMantenimientoScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { vehiculoId, vehiculoNombre } = route.params || {};

  // Obtener mantenimientos con memoización de referencia
  const mantenimientos = useAppSelector(
    (state) =>
      state.mantenimientos.mantenimientos.filter(
        (m: any) => m.vehiculoId === vehiculoId
      ),
    shallowEqual
  );

  return (
    <View style={[commonStyles.containerScreen, { paddingTop: insets.top + espaciado.sm }]}>
      {/* Encabezado Fijo */}
      <Text style={commonStyles.title}>Historial de Mantenimientos</Text>
      {vehiculoNombre ? (
        <Text style={styles.subtitulo}>Vehículo: {vehiculoNombre}</Text>
      ) : null}

      {/* Lista Desplazable con Scrollbar Vertical */}
      <View style={styles.listaContainer}>
        {mantenimientos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTexto}>
              No hay registros de mantenimiento guardados para este vehículo.
            </Text>
          </View>
        ) : (
          <FlatList
            data={mantenimientos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: any }) => (
              <View style={[commonStyles.surface, styles.cardHistorial]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.tipoMantenimiento}>
                    {item.tipo || item.titulo || 'Mantenimiento General'}
                  </Text>
                  <Text style={styles.fecha}>
                    {item.fecha || new Date().toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.descripcion}>
                  {item.descripcion || item.notas || 'Sin detalle registrado.'}
                </Text>

                <View style={styles.snapshotBox}>
                  <Text style={styles.snapshotTitulo}>
                    📌 Datos guardados al registrar:
                  </Text>
                  <Text style={styles.snapshotItem}>
                    • Kilometraje:{' '}
                    <Text style={styles.bold}>
                      {(
                        item.kilometrajeRealiz ??
                        item.kilometrajeActual ??
                        item.kilometraje ??
                        0
                      ).toLocaleString()}{' '}
                      km
                    </Text>
                  </Text>
                  {item.costo ? (
                    <Text style={styles.snapshotItem}>
                      • Costo: <Text style={styles.bold}>${item.costo}</Text>
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Botón Fijo en el Pie de Pantalla */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, espaciado.md) }]}>
        <TouchableOpacity
          style={styles.btnRegresarBottom}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnRegresarTexto}>← Regresar a Vehículos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistorialMantenimientoScreen;

const styles = StyleSheet.create({
  subtitulo: {
    color: colores.textoSecundario,
    fontSize: 15,
    marginBottom: espaciado.sm,
  },
  listaContainer: {
    flex: 1, // Toma todo el espacio vertical disponible para permitir scroll
  },
  listContent: {
    gap: espaciado.md,
    paddingBottom: espaciado.md,
  },
  emptyBox: {
    padding: espaciado.xl,
    alignItems: 'center',
  },
  emptyTexto: {
    color: colores.textoSecundario,
    textAlign: 'center',
    fontSize: 14,
  },
  cardHistorial: {
    padding: espaciado.md,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipoMantenimiento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
  },
  fecha: {
    fontSize: 12,
    color: colores.textoSecundario,
  },
  descripcion: {
    color: colores.texto,
    marginBottom: 10,
  },
  snapshotBox: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colores.primario,
  },
  snapshotTitulo: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  snapshotItem: {
    color: '#E2E8F0',
    fontSize: 13,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomBar: {
    paddingTop: espaciado.sm,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: 'transparent',
  },
  btnRegresarBottom: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRegresarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});