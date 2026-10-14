
import type { TipoMantenimiento, Mantenimiento } from '@/types';

export interface IntervaloMantenimiento {
  kilometros: number;
  meses: number;
}

export const INTERVALOS_MANTENIMIENTO: Record<
  TipoMantenimiento,
  IntervaloMantenimiento
> = {
  aceite: { kilometros: 5000, meses: 6 },
  frenos: { kilometros: 20000, meses: 12 },
  neumaticos: { kilometros: 10000, meses: 6 },
  bateria: { kilometros: 40000, meses: 24 },
  general: { kilometros: 10000, meses: 12 },
};

export interface ProximoMantenimiento {
  tipo: TipoMantenimiento;
  ultimoKilometraje: number;
  ultimaFecha: string;
  proximoKilometraje: number;
  proximaFechaEstimada: string;
  kmRestantes: number;
  diasRestantes: number;
  estado: 'al_dia' | 'proximo' | 'vencido';
  vencidoPorFecha: boolean;
  vencidoPorKilometraje: boolean;
}

// Interpreta fechas YYYY-MM-DD sin desplazarlas por zona horaria.
const convertirFecha = (valor: string): Date | null => {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);

  if (!coincidencia) return null;

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);

  const fecha = new Date(0);
  fecha.setFullYear(anio, mes - 1, dia);
  fecha.setHours(0, 0, 0, 0);

  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  return fecha;
};

const formatearFecha = (fecha: Date): string => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
};

// Evita que fechas como 31 de agosto salten a octubre.
const sumarMeses = (fecha: Date, meses: number): Date => {
  const resultado = new Date(fecha);
  const diaOriginal = resultado.getDate();

  resultado.setDate(1);
  resultado.setMonth(resultado.getMonth() + meses);

  const ultimoDiaMes = new Date(
    resultado.getFullYear(),
    resultado.getMonth() + 1,
    0
  ).getDate();

  resultado.setDate(Math.min(diaOriginal, ultimoDiaMes));

  return resultado;
};

// Compara días calendario, evitando diferencias por horario de verano.
const numeroDia = (fecha: Date): number =>
  Math.floor(
    Date.UTC(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate()
    ) / 86400000
  );

export const calcularProximoMantenimiento = (
  mantenimientosVehiculo: Mantenimiento[],
  tipo: TipoMantenimiento,
  kilometrajeActualVehiculo: number
): ProximoMantenimiento | null => {
  const mantenimientosTipo = mantenimientosVehiculo
    .filter((mantenimiento) => mantenimiento.tipo === tipo)
    .map((mantenimiento) => ({
      mantenimiento,
      fecha: convertirFecha(mantenimiento.fecha),
    }))
    .filter(
      (registro): registro is {
        mantenimiento: Mantenimiento;
        fecha: Date;
      } => registro.fecha !== null
    )
    .sort(
      (a, b) => b.fecha.getTime() - a.fecha.getTime()
    );

  if (mantenimientosTipo.length === 0) {
    return null;
  }

  const ultimo = mantenimientosTipo[0].mantenimiento;
  const fechaUltimo = mantenimientosTipo[0].fecha;
  const intervalo = INTERVALOS_MANTENIMIENTO[tipo];

  if (
    !Number.isFinite(ultimo.kilometraje) ||
    !Number.isFinite(kilometrajeActualVehiculo)
  ) {
    return null;
  }

  // Cálculo por kilometraje
  const proximoKilometraje =
    ultimo.kilometraje + intervalo.kilometros;

  const kmRestantes =
    proximoKilometraje - kilometrajeActualVehiculo;

  // Cálculo por fecha
  const proximaFecha = sumarMeses(
    fechaUltimo,
    intervalo.meses
  );

  const hoy = new Date();

  const diasRestantes =
    numeroDia(proximaFecha) - numeroDia(hoy);

  // Determinar por qué corresponde el mantenimiento
  const vencidoPorFecha = diasRestantes <= 0;
  const vencidoPorKilometraje = kmRestantes <= 0;

  let estado: ProximoMantenimiento['estado'] = 'al_dia';

  if (vencidoPorFecha || vencidoPorKilometraje) {
    estado = 'vencido';
  } else if (
    diasRestantes <= 15 ||
    kmRestantes <= 1000
  ) {
    estado = 'proximo';
  }

  return {
    tipo,
    ultimoKilometraje: ultimo.kilometraje,
    ultimaFecha: ultimo.fecha,
    proximoKilometraje,
    proximaFechaEstimada: formatearFecha(proximaFecha),
    kmRestantes,
    diasRestantes,
    estado,
    vencidoPorFecha,
    vencidoPorKilometraje,
  };
};
