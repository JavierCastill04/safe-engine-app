import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';


export const HistorialMantenimientoScreen = ({ route, navigation }: any) => {
  const { vehiculoId, vehiculoNombre } = route.params || {};

  // Filtrar los mantenimientos pertenecientes a este vehículo en específico
  const mantenimientos = useAppSelector((state) =>
    state.mantenimientos.mantenimientos.filter((m: any) => m.vehiculoId === vehiculoId)
  );

  return (
    <View style={commonStyles.containerScreen}>
      {/* Botón superior para regresar a Vehículos */}
      <TouchableOpacity 
        style={styles.btnRegresar} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.btnRegresarTexto}>← Regresar a Vehículos</Text>
      </TouchableOpacity>

      <Text style={commonStyles.title}>Historial de Mantenimientos</Text>
      {vehiculoNombre ? (
        <Text style={styles.subtitulo}>Vehículo: {vehiculoNombre}</Text>
      ) : null}

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
          contentContainerStyle={styles.listContainer}
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

              {/* Snapshot del estado del vehículo */}
              <View style={styles.snapshotBox}>
                <Text style={styles.snapshotTitulo}>📌 Datos guardados al registrar:</Text>
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
  );
};

export default HistorialMantenimientoScreen;

const styles = StyleSheet.create({
  btnRegresar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: espaciado.md,
  },
  btnRegresarTexto: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitulo: {
    color: colores.textoSecundario,
    fontSize: 15,
    marginBottom: espaciado.md,
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
  listContainer: {
    gap: espaciado.md,
    paddingBottom: espaciado.xl,
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
});