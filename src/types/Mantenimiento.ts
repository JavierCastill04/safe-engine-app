export type TipoMantenimiento = 
  | 'aceite' 
  | 'frenos' 
  | 'neumaticos' 
  | 'bateria' 
  | 'general';

export interface Mantenimiento {
  id: string;
  vehiculoId: string;
  fecha: string; // ISO String (AAAA-MM-DD)
  kilometraje: number;
  tipo: TipoMantenimiento;
  costo: number;
  notas?: string;
  descripcion?: string;
  kilometrajeRealiz?: number;
  kilometrajeActual?: number;

  // Nuevos campos para cálculo del siguiente mantenimiento
  intervaloKm?: number;            // Distancia hasta el próximo cambio (ej: 5000 km)
  siguienteMantenimientoKm?: number; // (kilometraje al realizar + intervaloKm)
  siguienteMantenimientoFecha?: string; // Fecha límite para mantenimientos por tiempo (ej: Batería)

  detallesEspecificos: {
    tipoAceite?: string;
    filtroCambiado?: boolean;
    frenosDelanteros?: boolean;
    frenosTraseros?: boolean;
    presionPSI?: number;
    rotacionRealizada?: boolean;
    voltajeBateria?: number;
    puntosInspeccionados?: number;
  };
}