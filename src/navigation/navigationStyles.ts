
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { Colores } from '../theme/theme';
 
// Ahora recibe la paleta ya resuelta (modo + acento) en vez del nombre del tema.
// Sale de useTheme().colores, así que no depende de Redux ni de getColores aquí.
export const getTabScreenOptions = (
  bottomInset: number,
  colores: Colores
): BottomTabNavigationOptions => ({
  headerStyle: {
    backgroundColor: colores.fondo, // oscuro: #000000 · claro: #F4F4F5
  },
 
  headerTintColor: colores.enfasis,
 
  headerTitleStyle: {
    fontFamily: 'Poppins',
    fontSize: 25,
  },
 
  tabBarActiveTintColor: colores.texto, // (opcional) colores.primario para que se vea el acento elegido
  tabBarInactiveTintColor: colores.textoSecundario, // antes colores.claro: casi invisible en modo claro
 
  tabBarStyle: {
    backgroundColor: colores.superficie,
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
});
 