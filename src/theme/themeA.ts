// theme.ts  ←  theme.css
// Dos ejes independientes, igual que en la web:
//   modo   (data-mode)  → claro | oscuro   → fondos, superficies, textos, bordes
//   acento (data-theme) → 6 colores         → primario y su texto
export type Modo = 'claro' | 'oscuro';
export type Acento = 'sky' | 'emerald' | 'indigo' | 'violet' | 'rose' | 'amber';

export const MODOS: { id: Modo; nombre: string }[] = [
  { id: 'claro', nombre: 'Claro' },
  { id: 'oscuro', nombre: 'Oscuro' },
];

// [color principal, tono suave, tono más suave]  (los 3 de la vista previa de Ajustes)
export const ACENTOS: { id: Acento; nombre: string; colores: [string, string, string] }[] = [
  { id: 'sky', nombre: 'Celeste', colores: ['#0ea5e9', '#e0f2fe', '#bae6fd'] },
  { id: 'emerald', nombre: 'Esmeralda', colores: ['#10b981', '#d1fae5', '#a7f3d0'] },
  { id: 'indigo', nombre: 'Índigo', colores: ['#6366f1', '#e0e7ff', '#c7d2fe'] },
  { id: 'violet', nombre: 'Violeta', colores: ['#8b5cf6', '#ede9fe', '#ddd6fe'] },
  { id: 'rose', nombre: 'Rosa', colores: ['#f43f5e', '#ffe4e6', '#fecdd3'] },
  { id: 'amber', nombre: 'Ámbar', colores: ['#f59e0b', '#fef3c7', '#fde68a'] },
];

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

// Texto legible (blanco u oscuro) sobre un color de fondo: equivale a --primary-foreground
export function contraste(hex: string): string {
  const { r, g, b } = aRgb(hex);
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminancia = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  return luminancia > 0.3 ? '#0B1220' : '#FFFFFF';
}

// ---------- Colores fijos (iguales en cualquier modo/acento) ----------
const baseColores = {
  enfasis: '#B80101',
  enfasisHover: '#D52A2A',
  claro: '#CFD8D7',
  blanco: '#FAF7F7',
  negro: '#000000',
  rojo: '#B80101',
  azul: '#2F6F9F',
  azulClaro: '#85BAEA',
  error: '#FC570F',
  linea: '#0F3AFC',
};

// ---------- Por modo ----------
const porModo = {
  oscuro: {
    fondo: '#000000',
    superficie: '#1E293B',
    tarjeta: '#42576B',     // fondo de Card / Badge (antes secundario)
    secundario: '#42576B',
    texto: '#FAF7F7',
    textoSecundario: '#CFD8D7',
    borde: '#A7ADB0',
    gris: '#A7ADB0',
    exito: '#34D399',
    advertencia: '#FBBF24',
    peligro: '#F87171',
    info: '#38BDF8',
    badge: {
      purple: '#C084FC', indigo: '#818CF8', blue: '#60A5FA', cyan: '#22D3EE', teal: '#2DD4BF',
      orange: '#FB923C', rose: '#FB7185', pink: '#F472B6', slate: '#94A3B8',
    },
  },
  claro: {
    fondo: '#F4F4F5',
    superficie: '#FFFFFF',
    tarjeta: '#FFFFFF',
    secundario: '#E4E4E7',
    texto: '#18181B',
    textoSecundario: '#52525B',
    borde: '#D4D4D8',
    gris: '#71717A',
    exito: '#059669',
    advertencia: '#D97706',
    peligro: '#DC2626',
    info: '#0284C7',
    badge: {
      purple: '#7C3AED', indigo: '#4F46E5', blue: '#2563EB', cyan: '#0891B2', teal: '#0D9488',
      orange: '#EA580C', rose: '#E11D48', pink: '#DB2777', slate: '#475569',
    },
  },
};

export function getColores(modo: Modo, acento: Acento) {
  const primario = (ACENTOS.find((a) => a.id === acento) ?? ACENTOS[0]).colores[0];
  const m = porModo[modo];
  return {
    ...baseColores,
    ...m,
    primario,
    textoSobrePrimario: contraste(primario),
    textoSobreExito: contraste(m.exito),
  };
}

export type Colores = ReturnType<typeof getColores>;

// Compatibilidad: valor estático (oscuro + celeste). Para código nuevo usa useTheme().colores
export const colores = getColores('oscuro', 'sky');
