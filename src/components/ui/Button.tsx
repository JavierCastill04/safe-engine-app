import React, { Children, useMemo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { useTheme } from '../../hook/hooks';
import { mezclar } from '../../theme/theme';
import { espaciado, tipografia } from '../../theme/variables';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode; // texto y/o iconos, igual que en la web
};

// .sm / .md / .lg
const tamanos = {
  sm: { height: 32, paddingHorizontal: espaciado.md, fontSize: 14 },
  md: { height: 40, paddingHorizontal: espaciado.lg, fontSize: 14 },
  lg: { height: 48, paddingHorizontal: 20, fontSize: 16 }, // --space-5 = 20
} as const;

export function Button({
  variant = 'primary', size = 'md', fullWidth = false, children, disabled, style, ...rest
}: ButtonProps) {
  const { colores } = useTheme();

  // [fondo, texto, borde?, color al presionar?]  (si no hay "presionado", se oscurece 5%: brightness(.95))
  const v = useMemo(() => {
    const mapa = {
      primary: { bg: colores.primario, fg: colores.textoSobrePrimario },
      secondary: { bg: colores.secundario, fg: colores.texto, border: colores.borde },
      danger: { bg: colores.rojo, fg: colores.blanco },
      success: { bg: colores.exito, fg: colores.negro },
      ghost: { bg: 'transparent', fg: colores.texto, pressed: colores.secundario },
      warning: { bg: '#f59e0b', fg: '#fff', pressed: '#d97706' },
      info: { bg: '#0284c7', fg: '#fff', pressed: '#0369a1' },
      neutral: { bg: '#64748b', fg: '#fff', pressed: '#475569' },
    } as Record<ButtonVariant, { bg: string; fg: string; border?: string; pressed?: string }>;
    const c = mapa[variant];
    return { ...c, pressed: c.pressed ?? mezclar(c.bg, '#000000', 95) };
  }, [variant, colores]);

  const t = tamanos[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      {...rest}
      style={(state) => [
        estilos.button,
        {
          height: t.height,
          paddingHorizontal: t.paddingHorizontal,
          backgroundColor: state.pressed ? v.pressed : v.bg,   // :hover
          borderColor: v.border ?? 'transparent',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',     // .fullWidth / inline-flex
        },
        state.pressed && estilos.active,                        // :active
        disabled && estilos.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {Children.map(children, (hijo) =>
        typeof hijo === 'string' || typeof hijo === 'number' ? (
          <Text numberOfLines={1} style={[estilos.texto, { fontSize: t.fontSize, color: v.fg }]}>
            {hijo}
          </Text>
        ) : (
          hijo // iconos u otros elementos
        )
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    borderWidth: 1,
    borderRadius: 10,
    flexShrink: 0,
  },
  texto: { ...tipografia.button }, // Inter-SemiBold (no hay Medium en tu tipografía)
  active: { transform: [{ translateY: 1 }] },
  disabled: { opacity: 0.5 },
});
