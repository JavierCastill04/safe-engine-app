import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '../../hook/hooks';
import { tipografia } from '../../theme/variables';

type Props = TextProps & {
  variant?: keyof typeof tipografia;
  secundario?: boolean;
};

export function Text({ variant = 'body', secundario, style, ...rest }: Props) {
  const { colores } = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        tipografia[variant],
        { color: secundario ? colores.textoSecundario : colores.texto },
        style,
      ]}
    />
  );
}
