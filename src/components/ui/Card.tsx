import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useStyles, type ThemeContextType } from '../../hook/hooks';
import { sombras } from '../../theme/variables';

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colores.secundario, // --card (igual que commonStyles.card)
      borderWidth: 1,
      borderColor: t.colores.borde,
      borderRadius: t.layout.radiusLg,
      padding: 20, // --space-5
      ...sombras.sm,
    },
  });

export function Card({ style, ...props }: ViewProps) {
  const estilos = useStyles(makeStyles);
  return <View {...props} style={[estilos.card, style]} />;
}
