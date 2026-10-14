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
    authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
},
authLoadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colores.fondo,
},

  // NOTIFICACIONES - PANTALLA

  notificacionesTitulo: {
    marginBottom: espaciado.sm,
  },

notificacionesDescripcion: {
  lineHeight: 21,
},

notificacionesIntroduccion: {
  padding: espaciado.md,
  marginBottom: espaciado.md,
  gap: espaciado.sm,
},


notificacionesIntroduccionEncabezado: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: espaciado.sm,
},

notificacionesResumen: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: espaciado.sm,
  padding: espaciado.md,
  marginBottom: espaciado.md,
},

notificacionesResumenContenido: {
  flex: 1,
  justifyContent: 'center',
},

notificacionesResumenTexto: {
  lineHeight: 22,
},

notificacionesResumenVencidosFila: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: espaciado.sm,
  marginTop: espaciado.sm,
},

notificacionesResumenVencidos: {
  flex: 1,
  fontSize: 14,
  fontWeight: '600',
  lineHeight: 20,
},

  notificacionesLista: {
    gap: espaciado.md,
    paddingBottom: espaciado.xl,
  },

  notificacionesEstadoVacio: {
    alignItems: 'center',
    padding: espaciado.lg,
  },

  notificacionesEstadoVacioTitulo: {
    textAlign: 'center',
    marginTop: espaciado.md,
    marginBottom: espaciado.sm,
    lineHeight: 24,
  },

  notificacionesEstadoVacioDescripcion: {
    textAlign: 'center',
    lineHeight: 21,
  },

  // NOTIFICACIONES - TARJETAS

  notificacionesTarjeta: {
    padding: espaciado.md,
  },

  notificacionesEncabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaciado.sm,
  },

  notificacionesIconoEncabezado: {
    paddingTop: 2,
  },

  notificacionesEncabezadoTexto: {
    flex: 1,
  },

  notificacionesTarjetaTitulo: {
    lineHeight: 23,
    marginBottom: 4,
  },

  notificacionesVehiculo: {
    lineHeight: 20,
  },

  notificacionesMensaje: {
    lineHeight: 22,
    marginTop: espaciado.md,
    marginBottom: espaciado.md,
  },

  notificacionesDetalles: {
    gap: espaciado.sm,
  },

  notificacionesDetalleFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaciado.sm,
  },

  notificacionesDetalleTexto: {
    flex: 1,
    lineHeight: 20,
  },
  // NAVEGACIÓN - BARRA SUPERIOR

navigationHeader: {
  backgroundColor: colores.secundario,
},

navigationHeaderTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: colores.blanco,
},

// HOME - PANTALLA PRINCIPAL

homeSeccionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: espaciado.sm,
  marginTop: espaciado.xs,
},

homeTituloFila: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: espaciado.sm,
  flexShrink: 1,
},

homeSeccionTitulo: {
  fontSize: 18,
  fontWeight: 'bold',
  color: colores.texto,
  flexShrink: 1,
},

homeListaContainer: {
  flex: 1,
},

homeListContent: {
  gap: espaciado.md,
  paddingBottom: espaciado.lg,
},

homeEmptyBox: {
  padding: espaciado.xl,
  alignItems: 'center',
  borderRadius: 12,
},

homeEmptyTexto: {
  color: colores.textoSecundario,
  textAlign: 'center',
  fontSize: 14,
},

homeCardRecent: {
  padding: espaciado.md,
  borderRadius: 12,
},

homeCardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: espaciado.xs,
  gap: espaciado.sm,
},

homeVehiculoFila: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: espaciado.xs,
  flex: 1,
},

homeVehiculoNombre: {
  fontSize: 13,
  fontWeight: '600',
  color: colores.primario,
  flexShrink: 1,
},

homeFecha: {
  fontSize: 12,
  color: colores.textoSecundario,
},

homeTipoMantenimiento: {
  fontSize: 16,
  fontWeight: 'bold',
  color: colores.texto,
  marginBottom: espaciado.xs,
},

homeDescripcion: {
  color: colores.textoSecundario,
  fontSize: 13,
  marginBottom: espaciado.sm,
},

homeCardFooter: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: espaciado.md,
  paddingTop: 6,
  borderTopWidth: 1,
  borderTopColor: '#1E293B',
},

homeFooterItem: {
  color: '#94A3B8',
  fontSize: 12,
},

homeBold: {
  color: colores.blanco,
  fontWeight: 'bold',
},

});