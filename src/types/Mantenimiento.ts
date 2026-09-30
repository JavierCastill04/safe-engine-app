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
  
  // Detalles específicos según tipo de mantenimiento
  detallesEspecificos: {
    // Para 'aceite'
    tipoAceite?: string; // ej. 5W-30 Sintético
    filtroCambiado?: boolean;
    
    // Para 'frenos'
    frenosDelanteros?: boolean;
    frenosTraseros?: boolean;
    
    // Para 'neumaticos'
    presionPSI?: number;
    rotacionRealizada?: boolean;
    
    // Para 'bateria'
    voltajeBateria?: number;
    
    // Para 'general'
    puntosInspeccionados?: number;
  };
}