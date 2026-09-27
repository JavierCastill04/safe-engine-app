import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { espaciado } from './espaciado';
import { tipografia } from './tipografia';
import { layout } from './layout';

export const commonStyles = StyleSheet.create({
    containerScreen: {
        flex: 1,
        backgroundColor: colores.fondo,
        paddingHorizontal: espaciado.xl,
        paddingVertical: espaciado.md,
    },

    surface: {
        backgroundColor: colores.superficie,
        borderRadius: layout.radius,
    },

    title: {
        ...tipografia.title,
        color: colores.blanco,
        marginBottom: espaciado.md,
    },

    subtitle: {
        ...tipografia.subtitle,
        color: colores.blanco,
        marginTop: espaciado.xl,
        marginBottom: espaciado.md,
        textAlign: 'center',
    },

    heading: {
        ...tipografia.heading,
        color: colores.texto,
        marginBottom: espaciado.sm,
    },

    text: {
        ...tipografia.body,
        color: colores.blanco,
    },

    secondaryText: {
        ...tipografia.body,
        color: colores.gris,
    },

    button: {
        backgroundColor: colores.primario,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        ...tipografia.body,
        fontWeight: '700',
        color: colores.blanco,
        textAlign: 'center',
    },

    cardButton: {
        flex: 1,
        backgroundColor: colores.primario,
        borderRadius: layout.radius,
        paddingVertical: espaciado.sm,
        paddingHorizontal: espaciado.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardButtonContainter: {
        flexDirection: 'row',
        gap: espaciado.sm,
        paddingTop: espaciado.xl,
    },

    input: {
        ...tipografia.body,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        backgroundColor: colores.superficie,
        color: colores.texto,
    },

    inputView: {
        marginVertical: espaciado.sm,
    },

    card: {
        backgroundColor: colores.secundario,
        padding: espaciado.xl,
        marginBottom: espaciado.md,
        borderRadius: layout.radius,
        borderLeftWidth: 4,
        borderLeftColor: colores.enfasis,
    },

    cardTitle: {
        ...tipografia.heading,
        color: colores.blanco,
        marginBottom: espaciado.sm,
    },

    floatingButton: {
        position: 'absolute',
        right: espaciado.xl,
        bottom: espaciado.xl,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colores.enfasis,
        borderWidth: 2,
        borderColor: colores.blanco,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: espaciado.lg,
    },

    modal: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: colores.superficie,
        borderRadius: layout.radius,
        padding: espaciado.xl,
    },

    label: {
        ...tipografia.small,
        fontWeight: '600',
        color: colores.texto,
        marginBottom: espaciado.xs,
    },

    labelBlack: {
        ...tipografia.small,
        fontWeight: '600',
        color: colores.negro,
        marginBottom: espaciado.xs,
    },

    modalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
        marginTop: espaciado.lg,
    },

    modalButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colores.primario,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        justifyContent: 'center',
    },

    modalButtonCancelar: {
        flex: 3,
        backgroundColor: colores.rojo,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalButtonCancelarText: {
        ...tipografia.body,
        fontWeight: '700',
        color: colores.blanco,
    },

    errorText: {
        ...tipografia.small,
        color: colores.rojo,
        marginTop: 4,
    },

    errorInput: {
        borderColor: colores.rojo,
    },
});