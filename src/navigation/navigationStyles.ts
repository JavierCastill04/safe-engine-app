import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { getColores } from '../theme/colores';
import type { TemaColor } from '../redux/slices/configSlice';

export const getTabScreenOptions = (
  bottomInset: number,
  tema: TemaColor = 'oscuro' // 👈 Recibe el tema seleccionado en Redux
): BottomTabNavigationOptions => {
  // Obtiene la paleta activa (Oscura o Azul)
  const colores = getColores(tema);

  return {
    headerStyle: {
      backgroundColor: colores.fondo, // 👈 Se adapta a #000000 u #0F172A
    },

    headerTintColor: colores.enfasis,

    headerTitleStyle: {
      fontFamily: "Poppins",
      fontSize: 25,
    },

    tabBarActiveTintColor: colores.texto,
    tabBarInactiveTintColor: colores.claro,

    tabBarStyle: {
      backgroundColor: colores.superficie, // 👈 Fondo de la barra inferior adaptado
      height: 65 + bottomInset,
      paddingTop: 5,
      borderTopColor: colores.borde,
    },

    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2,
    },

    tabBarIconStyle: {
      marginTop: 1,
    },
  };
};