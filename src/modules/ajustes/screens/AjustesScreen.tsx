import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View,  TouchableOpacity, ActivityIndicator, Text} from 'react-native';
import { Check, ClipboardX, Sun, Trash2 } from 'lucide-react-native';
import {
  Moon,
  Waves,
  ClipboardX,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import { auth } from '@/config/firebase';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { cambiarAcento, cambiarModo } from '@/redux/slices/AjustesSliceE';
import { limpiarTodosLosVehiculos } from '@/redux/slices/vehiculoSlice';
import { limpiarTodosLosMantenimientos } from '@/redux/slices/mantenimientoSlice';
import { useStyles, useTheme, type ThemeContextType } from '@/hook/hooks';
import { ACENTOS, MODOS, conAlpha, type Modo } from '@/theme/themeA';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

const PREVIEW = {
  claro: { fondo: '#ffffff', borde: '#e5e7eb', lateral: '#f3f4f6', barra: '#d1d5db', barra2: '#e5e7eb' },
  oscuro: { fondo: '#171717', borde: '#404040', lateral: '#262626', barra: '#525252', barra2: '#404040' },
} as const;

function VistaPrevia({ tipo }: { tipo: Modo }) {
  const p = PREVIEW[tipo];
  return (
    <View
      style={{
        flexDirection: 'row', width: '100%', height: 58, overflow: 'hidden',
        borderWidth: 1, borderColor: p.borde, borderRadius: 10, backgroundColor: p.fondo,
      }}
    >
      <View style={{ width: '30%', borderRightWidth: 1, borderRightColor: p.borde, backgroundColor: p.lateral }} />
      <View style={{ flex: 1, gap: 6, padding: 8 }}>
        <View style={{ height: 5, borderRadius: 4, backgroundColor: p.barra }} />
        <View style={{ height: 5, width: '45%', borderRadius: 4, backgroundColor: p.barra2 }} />
      </View>
    </View>
  );
}

export default function AjustesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { modo, acento, colores, estilos, espaciado } = useTheme();
  const s = useStyles(makeStyles);

  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const temaActual = useAppSelector(
    (state) => state.config?.tema || 'oscuro'
  );

  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const Marca = () => (
    <View style={s.marca}>
      <Check size={12} color={colores.textoSobrePrimario} />
    </View>
  );

  const handleBorrarVehiculos = () => {
    if (vehiculos.length === 0) {
      Alert.alert(
        'Sin datos',
        'No hay vehículos registrados para eliminar.'
      );
      return;
    }
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar TODOS los vehículos registrados? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar todo',
          style: 'destructive',
          onPress: () => {
            dispatch(limpiarTodosLosVehiculos());
            Alert.alert(
              'Éxito',
              'Todos los datos de vehículos han sido borrados.'
            );
          },
        },
      ]
    );
  };

  const handleBorrarMantenimientos = () => {
    if (mantenimientos.length === 0) {
      Alert.alert(
        'Sin datos',
        'No hay registros de mantenimiento para eliminar.'
      );
      return;
    }
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar TODOS los registros de mantenimiento? Los vehículos registrados se mantendrán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, borrar mantenimientos',
          style: 'destructive',
          onPress: () => {
            dispatch(limpiarTodosLosMantenimientos());
            Alert.alert(
              'Éxito',
              'El historial de mantenimientos ha sido vaciado.'
            );
          },
        },
      ]
    );
  };

  const cerrarSesion = async () => {
    if (cerrandoSesion) return;

    setCerrandoSesion(true);

    try {
      await signOut(auth);

    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      Alert.alert(
        'Error',
        'No se pudo cerrar la sesión. Inténtalo nuevamente.'
      );
    } finally {
      setCerrandoSesion(false);
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas cerrar tu sesión de Safe Engine?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: cerrarSesion,
        },
      ]
    );
  };

 return (
    <ScrollView
      style={[
        estilos.containerScreen,
        { paddingTop: insets.top + espaciado.sm },
      ]}
      contentContainerStyle={s.scrollContent}
    >
      {/* SECCIÓN 1: APARIENCIA */}
      <Card style={s.seccion}>
        <View style={s.encabezado}>
          <View style={s.icono}>
            <Sun size={18} color={colores.primario} />
          </View>

          <View style={{ flex: 1 }}>
            <Text variant="heading">Apariencia</Text>
            <Text variant="small" secundario>
              Tema y paleta de colores de la aplicación.
            </Text>
          </View>
        </View>

        <Text variant="small" style={s.etiqueta}>
          Modo de visualización
        </Text>

        <Text variant="small" secundario style={s.ayuda}>
          Selecciona cómo quieres visualizar la aplicación.
        </Text>

        <View style={s.modos}>
          {MODOS.map((item) => {
            const seleccionado = modo === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => dispatch(cambiarModo(item.id))}
                accessibilityRole="button"
                accessibilityLabel={`Modo ${item.nombre}`}
                accessibilityState={{ selected: seleccionado }}
                style={[
                  s.opcion,
                  s.opcionModo,
                  seleccionado && s.opcionSeleccionada,
                ]}
              >
                <VistaPrevia tipo={item.id} />
                <Text style={s.nombreOpcion}>
                  {item.nombre}
                </Text>
                {seleccionado && <Marca />}
              </Pressable>
            );
          })}
        </View>

        <View style={s.divisor} />

        <Text variant="small" style={s.etiqueta}>
          Paleta de colores
        </Text>

        <Text variant="small" secundario style={s.ayuda}>
          Selecciona el color principal utilizado por la aplicación.
        </Text>

        <View style={s.paleta}>
          {ACENTOS.map((item) => {
            const seleccionado = acento === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => dispatch(cambiarAcento(item.id))}
                accessibilityRole="button"
                accessibilityLabel={`Paleta ${item.nombre}`}
                accessibilityState={{ selected: seleccionado }}
                style={[
                  s.opcion,
                  s.opcionPaleta,
                  seleccionado && s.opcionSeleccionada,
                ]}
              >
                <View style={s.muestras}>
                  {item.colores.map((c) => (
                    <View
                      key={c}
                      style={[
                        s.muestra,
                        { backgroundColor: c },
                      ]}
                    />
                  ))}
                </View>

                <Text style={s.nombreOpcion}>
                  {item.nombre}
                </Text>

                {seleccionado && <Marca />}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* SECCIÓN 2: PRIVACIDAD Y DATOS */}
      <Card style={s.seccion}>
        <Text variant="heading">
          Privacidad y Datos
        </Text>

        <Text variant="small" secundario style={s.ayuda}>
          Borra la información registrada si vendiste tus vehículos
          o deseas reiniciar historiales.
        </Text>

        <View style={s.acciones}>
          <Button
            variant="warning"
            size="lg"
            fullWidth
            onPress={handleBorrarMantenimientos}
            accessibilityLabel="Eliminar todos los mantenimientos"
            accessibilityHint="Solicita confirmación antes de borrar los registros de mantenimiento"
          >
            <ClipboardX color="#FFF" size={24} />
            <Text style={{ color: '#FFF' }}>
              Borrar mantenimientos
            </Text>
          </Button>

          <Button
            variant="danger"
            size="lg"
            fullWidth
            onPress={handleBorrarVehiculos}
            accessibilityLabel="Eliminar todos los vehículos"
            accessibilityHint="Solicita confirmación antes de borrar todos los vehículos"
          >
            <Trash2 color="#FFF" size={24} />
            <Text style={{ color: '#FFF' }}>
              Borrar vehículos
            </Text>
          </Button>
        </View>
      </Card>

      {/* SECCIÓN 3: CUENTA */}
      <Card style={s.seccion}>
        <Text variant="heading">Cuenta</Text>

        <Text variant="small" secundario style={s.ayuda}>
          Administra tu sesión de Safe Engine.
        </Text>

        <TouchableOpacity
          style={s.btnCerrarSesion}
          onPress={handleCerrarSesion}
          disabled={cerrandoSesion}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          {cerrandoSesion ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <LogOut color="#FFF" size={21} />
              <Text style={s.btnCerrarSesionTexto}>
                Cerrar sesión
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    scrollContent: { paddingBottom: t.espaciado.xl + 24 },
    seccion: { marginBottom: t.espaciado.md },
    encabezado: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.espaciado.md,
      paddingBottom: t.espaciado.lg,
      marginBottom: t.espaciado.lg,
      borderBottomWidth: 1,
      borderBottomColor: t.colores.borde,
    },
    icono: {
      width: 38,
      height: 38,
      borderRadius: t.layout.radius,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: conAlpha(t.colores.primario, 15), // --accent
    },
    etiqueta: { fontFamily: 'Inter-SemiBold' },
    ayuda: { marginTop: 2, marginBottom: t.espaciado.md },
    divisor: { height: 1, backgroundColor: t.colores.borde, marginVertical: t.espaciado.lg },

    opcion: {
      position: 'relative',
      borderWidth: 2,
      borderColor: t.colores.borde,
      borderRadius: t.layout.radius,
      backgroundColor: t.colores.fondo,
      padding: t.espaciado.md,
    },
    opcionSeleccionada: { borderColor: t.colores.primario },
    nombreOpcion: { fontFamily: 'Inter-SemiBold', fontSize: 12, lineHeight: 16 },
    marca: {
      position: 'absolute',
      right: 8,
      bottom: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colores.primario,
    },
    modos: { flexDirection: 'row', gap: t.espaciado.md },
    opcionModo: { flex: 1, alignItems: 'center', gap: t.espaciado.sm },
    paleta: { flexDirection: 'row', flexWrap: 'wrap', gap: t.espaciado.md },
    opcionPaleta: { flexGrow: 1, flexBasis: '30%', minWidth: 0 },
    muestras: { flexDirection: 'row', gap: 4, marginBottom: t.espaciado.sm },
    muestra: { flex: 1, height: 18, borderRadius: 999 },

    acciones: { gap: t.espaciado.sm, marginTop: t.espaciado.lg },
  });
