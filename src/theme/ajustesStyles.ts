
import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { espaciado } from './espaciado';

export const ajustesStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: espaciado.xl + 24,
  },

  seccionBox: {
    padding: espaciado.md,
    borderRadius: 12,
    marginBottom: espaciado.md,
  },

  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    lineHeight: 24,
    marginBottom: espaciado.sm,
  },

  seccionSubtitulo: {
    fontSize: 13,
    color: colores.textoSecundario,
    lineHeight: 20,
    marginBottom: espaciado.md,
  },

  opcionesRow: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },

  btnTema: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  btnTemaOscuro: {
    backgroundColor: '#0F172A',
  },

  btnTemaAzul: {
    backgroundColor: '#1E3A8A',
  },

  btnTemaActivo: {
    borderColor: colores.primario,
  },

  accionesContainer: {
    gap: espaciado.sm,
  },

  btnBorrarMantenimientos: {
    backgroundColor: '#D97706',
    minHeight: 52,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnBorrar: {
    backgroundColor: '#DC2626',
    minHeight: 52,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCerrarSesion: {
    backgroundColor: '#B91C1C',
    minHeight: 52,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    paddingHorizontal: espaciado.md,
  },

  btnCerrarSesionTexto: {
    color: colores.blanco,
    fontSize: 15,
    fontWeight: '700',
  },
});
