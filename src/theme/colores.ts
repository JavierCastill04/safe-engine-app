// theme/colores.ts

const baseColores = {
  enfasis: '#B80101',
  enfasisHover: '#D52A2A',
  claro: '#CFD8D7',
  borde: '#A7ADB0',
  blanco: '#FAF7F7',
  negro: '#000000',
  rojo: '#B80101',
  azul: '#2F6F9F',
  azulClaro: '#85BAEA',
  gris: '#A7ADB0',
  error: '#FC570F',
  linea: '#0F3AFC',
};

// Paleta Tema Oscuro (Negro)
export const coloresOscuros = {
  ...baseColores,
  fondo: '#000000',
  superficie: '#1E293B',
  primario: '#2F6F9F',
  secundario: '#42576B',
  texto: '#FAF7F7',
  textoSecundario: '#CFD8D7',
};

// Paleta Tema Azul Marino
export const coloresAzul = {
  ...baseColores,
  fondo: '#0F172A',
  superficie: '#1E3A8A',
  primario: '#85BAEA',
  secundario: '#2F6F9F',
  texto: '#FAF7F7',
  textoSecundario: '#CFD8D7',
};

// Mantenemos la exportación por defecto para compatibilidad
export const colores = coloresOscuros;

// Función para obtener los colores dinámicamente según el tema activo
export const getColores = (tema: 'oscuro' | 'azul') => {
  return tema === 'azul' ? coloresAzul : coloresOscuros;
};