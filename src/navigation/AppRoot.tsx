import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { useTheme, ThemeProvider,  } from '../hook/hooks';
import { useNavigationTheme } from './Usenavigationtheme';
import AppNavigator from './AppNavigator';
import { useAppSelector } from 'src/redux/hooks';
 
function Navegacion() {
  const navTheme = useNavigationTheme(); // debe estar DENTRO del ThemeProvider
  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function AppRoot() {
  // Valores por defecto: si el estado guardado es de la versión anterior (solo `tema`), no se rompe
  const modo = useAppSelector((s) => s.config?.modo ?? 'oscuro');
  const acento = useAppSelector((s) => s.config?.acento ?? 'sky');
  return (
    <ThemeProvider modo={modo} acento={acento}>
      <Navegacion />
    </ThemeProvider>
  );
}
 