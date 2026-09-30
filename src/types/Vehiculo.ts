export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  kilometrajeActual: number;
  tipoMantenimientoRequerido?: string;
}
