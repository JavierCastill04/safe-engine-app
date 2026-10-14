export type Tema = 'oscuro' | 'azul';
export const TEMAS: Tema[] = ['oscuro', 'azul'];

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
  // Semánticos (tonos claros para que se lean sobre fondos oscuros)
  exito: '#34D399',
  advertencia: '#FBBF24',
  peligro: '#F87171',
  info: '#38BDF8',
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
  textoSobrePrimario: '#FAF7F7',
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
  // El primario azul es claro: el texto blanco encima tendría poco contraste
  textoSobrePrimario: '#0F172A',
};

// Equivalente a --badge-*-foreground (iguales en ambos temas porque ambos son oscuros)
export const badgeColores = {
  purple: '#C084FC',
  indigo: '#818CF8',
  blue: '#60A5FA',
  cyan: '#22D3EE',
  teal: '#2DD4BF',
  orange: '#FB923C',
  rose: '#FB7185',
  pink: '#F472B6',
  slate: '#94A3B8',
} as const;

export type Colores = typeof coloresOscuros;

// Compatibilidad: valor estático (siempre oscuro). Para código nuevo usa useTheme().colores
export const colores = coloresOscuros;

export const getColores = (tema: Tema): Colores =>
  tema === 'azul' ? coloresAzul : coloresOscuros;

// ---------- Helpers (React Native no soporta color-mix) ----------

const aRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

// color-mix(in srgb, <fg> <pct>%, <bg>)  →  mezclar(fg, bg, pct)
export function mezclar(fg: string, bg: string, pct: number): string {
  const a = aRgb(fg);
  const b = aRgb(bg);
  const p = pct / 100;
  const c = (x: number, y: number) => Math.round(x * p + y * (1 - p));
  return `rgb(${c(a.r, b.r)}, ${c(a.g, b.g)}, ${c(a.b, b.b)})`;
}

// color-mix(in srgb, <fg> <pct>%, transparent)  →  conAlpha(fg, pct)
export function conAlpha(fg: string, pct: number): string {
  const { r, g, b } = aRgb(fg);
  return `rgba(${r}, ${g}, ${b}, ${pct / 100})`;
}
