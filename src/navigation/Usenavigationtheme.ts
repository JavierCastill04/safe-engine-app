
import { useMemo } from 'react';
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { useTheme } from '../hook/hooks';
 
export function useNavigationTheme(): Theme {
  const { colores, modo } = useTheme();
  return useMemo(() => {
    const base = modo === 'oscuro' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colores.primario,
        background: colores.fondo,
        card: colores.superficie,
        text: colores.texto,
        border: colores.borde,
      },
    };
  }, [colores, modo]);
}