import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { useTheme } from '../../hook/hooks';
import { badgeColores, conAlpha, mezclar } from '../../theme/theme';
import { espaciado, tipografia } from '../../theme/variables';

export type BadgeVariant =
  | 'default' | 'success' | 'warning' | 'danger' | 'info'
  | 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal'
  | 'orange' | 'rose' | 'pink' | 'slate';

type BadgeProps = Omit<ViewProps, 'children'> & {
  variant?: BadgeVariant;
  children: string | number; // en RN el texto debe ir dentro de <Text>
};

export function Badge({ variant = 'default', children, style, ...rest }: BadgeProps) {
  const { colores } = useTheme();

  const { fondo, texto, borde } = useMemo(() => {
    const base = colores.secundario; // equivalente a var(--card)

    if (variant === 'default') {
      return { fondo: colores.secundario, texto: colores.texto, borde: colores.borde };
    }

    // [color de acento, % de fondo, % de borde]
    const semanticos = {
      success: [colores.exito, 18, 35],
      warning: [colores.advertencia, 18, 35],
      danger: [colores.peligro, 18, 35],
      info: [colores.info, 18, 35],
    } as const;

    const [fg, pctFondo, pctBorde] =
      variant in semanticos
        ? semanticos[variant as keyof typeof semanticos]
        : [badgeColores[variant as keyof typeof badgeColores], variant === 'slate' ? 12 : 14, variant === 'slate' ? 25 : 30];

    return {
      fondo: mezclar(fg, base, pctFondo),
      texto: fg,
      borde: conAlpha(fg, pctBorde),
    };
  }, [variant, colores]);

  return (
    <View {...rest} style={[estilos.badge, { backgroundColor: fondo, borderColor: borde }, style]}>
      <Text style={[estilos.texto, { color: texto }]}>{children}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', // equivalente a inline-flex: no se estira al ancho del padre
    flexDirection: 'row',
    alignItems: 'center',
    height: 24, // 1.5rem
    paddingHorizontal: espaciado.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  texto: {
    ...tipografia.button, // Inter-SemiBold (el peso va en la fuente, no en fontWeight)
    fontSize: 12,
    lineHeight: 16,
  },
});
