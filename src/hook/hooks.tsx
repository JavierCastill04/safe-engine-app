import React, { createContext, useContext, useMemo } from 'react';
import { StatusBar, StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { getColores, type Acento, type Colores, type Modo } from '../theme/themeA';
import { createReset, type Reset } from '../theme/reset';
import { espaciado, layout, tipografia } from '../theme/variables';

export type ThemeContextType = {
  modo: Modo;
  acento: Acento;
  colores: Colores;
  estilos: Reset;
  espaciado: typeof espaciado;
  layout: typeof layout;
  tipografia: typeof tipografia;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  modo, acento, children,
}: { modo: Modo; acento: Acento; children: React.ReactNode }) {
  const value = useMemo<ThemeContextType>(() => {
    const colores = getColores(modo, acento);
    return { modo, acento, colores, estilos: createReset(colores), espaciado, layout, tipografia };
  }, [modo, acento]);

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar barStyle={modo === 'oscuro' ? 'light-content' : 'dark-content'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
  return context;
}

// Estilos propios de un componente que dependen del tema. Define la fábrica FUERA del componente.
type Estilos = Record<string, ViewStyle | TextStyle | ImageStyle>;
export function useStyles<T extends Estilos>(factory: (t: ThemeContextType) => T): T {
  const t = useTheme();
  return useMemo(() => StyleSheet.create(factory(t)), [t, factory]);
}
