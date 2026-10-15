
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
} from 'react-native';

import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
} from 'lucide-react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores } from '@/theme';

import NotificacionesCard from '../components/NotificacionesCard';
import { obtenerNotificaciones } from '../utils/NotificacionesUtils';

export default function NotificacionesScreen() {
  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const [actualizacion, setActualizacion] = useState(0);
  const [refrescando, setRefrescando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setActualizacion((valor) => valor + 1);
    }, [])
  );

  const notificaciones = useMemo(
    () => obtenerNotificaciones(vehiculos, mantenimientos),
    [vehiculos, mantenimientos, actualizacion]
  );

  const actualizarNotificaciones = useCallback(() => {
    setRefrescando(true);
    setActualizacion((valor) => valor + 1);
    setRefrescando(false);
  }, []);

  const avisosVencidos = notificaciones.filter(
    (notificacion) => notificacion.estado === 'vencido'
  ).length;

  return (
    <View style={commonStyles.containerScreen}>
      <Text
        style={[
          commonStyles.title,
          commonStyles.notificacionesTitulo,
        ]}
      >

      </Text>

      {/* Introducción */}
      <View
        style={[
          commonStyles.card,
          commonStyles.notificacionesIntroduccion,
        ]}
      >
        <View style={commonStyles.notificacionesIntroduccionEncabezado}>
          <Info color={colores.azulClaro} size={19} />

          <Text style={commonStyles.cardTitle}>
            Estado de tus vehículos
          </Text>
        </View>

        <Text
          style={[
            commonStyles.secondaryText,
            commonStyles.notificacionesDescripcion,
          ]}
        >
          Consulta los próximos servicios y los mantenimientos
          pendientes de tus vehículos.
        </Text>

        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>
            {notificaciones.length}
          </Text>
        </View>
      </View>

      {/* Resumen */}
      <View
        style={[
          commonStyles.card,
          commonStyles.notificacionesResumen,
        ]}
      >
        <View style={commonStyles.notificacionesIconoEncabezado}>
  <Bell color={colores.azulClaro} size={22} />
</View>

        <View style={commonStyles.notificacionesResumenContenido}>
          <Text
            style={[
              commonStyles.text,
              commonStyles.notificacionesResumenTexto,
            ]}
          >
            Avisos pendientes: {notificaciones.length}
          </Text>

          {avisosVencidos > 0 && (
            <View style={commonStyles.notificacionesResumenVencidosFila}>
              <AlertTriangle color={colores.gris} size={16} />

              <Text
                style={[
                  commonStyles.text,
                  commonStyles.notificacionesResumenVencidos,
                ]}
              >
                Mantenimientos vencidos: {avisosVencidos}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Lista de notificaciones */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.notificacionesLista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={actualizarNotificaciones}
          />
        }
      >
        {notificaciones.length === 0 ? (
          <View
            style={[
              commonStyles.card,
              commonStyles.notificacionesEstadoVacio,
            ]}
          >
            <CheckCircle
              color={colores.azulClaro}
              size={30}
            />

            <Text
              style={[
                commonStyles.cardTitle,
                commonStyles.notificacionesEstadoVacioTitulo,
              ]}
            >
              No hay mantenimientos próximos
            </Text>

            <Text
              style={[
                commonStyles.secondaryText,
                commonStyles.notificacionesEstadoVacioDescripcion,
              ]}
            >
              No se encontraron mantenimientos próximos o
              vencidos entre los servicios registrados.
            </Text>
          </View>
        ) : (
          notificaciones.map((notificacion) => (
            <NotificacionesCard
              key={notificacion.id}
              notificacion={notificacion}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
