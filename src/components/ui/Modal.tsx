import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView, Modal as RNModal, Platform, Pressable,
  ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native'; 
import { useStyles, useTheme, type ThemeContextType } from '../../hook/hooks';
import { sombras, tipografia } from '../../theme/variables';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onInteractOutside?: () => void; 
  onEscapeKeyDown?: () => void;  
  closeDisabled?: boolean;
  interactionDisabled?: boolean;
  style?: StyleProp<ViewStyle>;   
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: t.espaciado.lg, 
    },
    content: {
      width: '100%',
      maxWidth: 850,
      maxHeight: '100%', 
      backgroundColor: t.colores.superficie, 
      borderWidth: 1,
      borderColor: t.colores.borde,
      borderRadius: t.layout.radiusXl,
      padding: t.espaciado.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20, 
    },
    title: {
      ...tipografia.heading,
      fontSize: 20, 
      color: t.colores.texto,
      flexShrink: 1,
    },
    close: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: t.layout.radius,
    },
    disabled: { opacity: 0.5 },
  });

export function Modal({
  open, onOpenChange, title, children,
  onInteractOutside, onEscapeKeyDown,
  closeDisabled = false, interactionDisabled = false, style,
}: ModalProps) {
  const estilos = useStyles(makeStyles);
  const { colores } = useTheme();
  const bloqueado = closeDisabled || interactionDisabled;

  return (
    <RNModal
      transparent
      visible={open}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => { if (!bloqueado) onEscapeKeyDown?.(); }} 
    >
      <KeyboardAvoidingView
        style={estilos.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessible={false}
          onPress={() => { if (!bloqueado) onInteractOutside?.(); }}
        />

        <View style={[estilos.content, style]} accessibilityViewIsModal>
          <View style={estilos.header}>
            <Text style={estilos.title} accessibilityRole="header">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              disabled={bloqueado}
              onPress={() => onOpenChange(false)}
              style={({ pressed }) => [
                estilos.close,
                pressed && { backgroundColor: colores.secundario }, 
                bloqueado && estilos.disabled,
              ]}
            >
              {({ pressed }) => (
                <X size={20} color={pressed ? colores.texto : colores.gris} />
              )}
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View pointerEvents={interactionDisabled ? 'none' : 'auto'}>{children}</View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
