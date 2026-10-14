import React, { forwardRef, useState, type ComponentRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useStyles, useTheme, type ThemeContextType } from '../../hook/hooks';
import { tipografia } from '../../theme/variables';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    container: { gap: t.espaciado.xs }, // .container
    label: {
      ...tipografia.small,
      fontFamily: 'Inter-SemiBold',
      color: t.colores.texto,
    },
    input: {
      height: 40,
      paddingHorizontal: t.espaciado.md,
      paddingVertical: 0,
      backgroundColor: t.colores.superficie, // --card (igual que commonStyles.input)
      color: t.colores.texto,
      borderWidth: 1,
      borderColor: t.colores.borde, // --input
      borderRadius: t.layout.radius,
      fontFamily: tipografia.small.fontFamily,
      fontSize: tipografia.small.fontSize,
    },
    focused: { borderColor: t.colores.primario }, // :focus → --ring
    error: { borderColor: t.colores.peligro }, // .error
    message: {
      fontFamily: tipografia.small.fontFamily,
      fontSize: 12,
      lineHeight: 16,
      color: t.colores.peligro,
    },
  });

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  ({ label, error, onFocus, onBlur, style, ...props }, ref) => {
    const estilos = useStyles(makeStyles);
    const { colores } = useTheme();
    const [enfocado, setEnfocado] = useState(false);

    return (
      <View style={estilos.container}>
        {label && <Text style={estilos.label}>{label}</Text>}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colores.gris} // ::placeholder → --muted-foreground
          {...props}
          onFocus={(e) => { setEnfocado(true); onFocus?.(e); }}
          onBlur={(e) => { setEnfocado(false); onBlur?.(e); }}
          style={[estilos.input, enfocado && estilos.focused, !!error && estilos.error, style]}
        />
        {error && <Text style={estilos.message}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';
