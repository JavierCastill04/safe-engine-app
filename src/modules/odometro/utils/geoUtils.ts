
const toRad = (value: number) => (value * Math.PI) / 180;

/**
 * Calcula la distancia entre dos coordenadas
 * utilizando la fórmula de Haversine.
 */
export const calcularDistanciaMetros = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const aLimitado = Math.min(1, Math.max(0, a));

  const c =
    2 * Math.atan2(
      Math.sqrt(aLimitado),
      Math.sqrt(1 - aLimitado)
    );

  return R * c;
};

export interface LecturaGps {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
}

export interface ConfiguracionGps {
  distanciaMinimaMetros: number;
  precisionMaximaMetros: number;
  velocidadMaximaKmH: number;
}

const CONFIGURACION_PREDETERMINADA: ConfiguracionGps = {
  distanciaMinimaMetros: 3,
  precisionMaximaMetros: 20,
  velocidadMaximaKmH: 200,
};

/**
 * Comprueba si una lectura GPS tiene datos utilizables.
 */
export const esLecturaGpsConfiable = (
  punto: LecturaGps,
  precisionMaximaMetros = 20
): boolean => {
  if (
    !Number.isFinite(punto.latitude) ||
    !Number.isFinite(punto.longitude) ||
    punto.latitude < -90 ||
    punto.latitude > 90 ||
    punto.longitude < -180 ||
    punto.longitude > 180
  ) {
    return false;
  }

  if (
    punto.accuracy == null ||
    !Number.isFinite(punto.accuracy) ||
    punto.accuracy < 0 ||
    punto.accuracy > precisionMaximaMetros
  ) {
    return false;
  }

  if (
    punto.timestamp == null ||
    !Number.isFinite(punto.timestamp) ||
    punto.timestamp <= 0
  ) {
    return false;
  }

  return true;
};

/**
 * Valida un desplazamiento GPS considerando:
 * - Precisión de ambas lecturas.
 * - Distancia mínima.
 * - Orden temporal.
 * - Velocidad máxima.
 */
export const esMovimientoValido = (
  puntoAnterior: LecturaGps,
  puntoNuevo: LecturaGps,
  config: ConfiguracionGps = CONFIGURACION_PREDETERMINADA
): {
  esValido: boolean;
  distanciaMetros: number;
} => {
  const invalido = {
    esValido: false,
    distanciaMetros: 0,
  };

  if (
    !esLecturaGpsConfiable(
      puntoAnterior,
      config.precisionMaximaMetros
    ) ||
    !esLecturaGpsConfiable(
      puntoNuevo,
      config.precisionMaximaMetros
    )
  ) {
    return invalido;
  }

  const tiempoSegundos =
    (puntoNuevo.timestamp! - puntoAnterior.timestamp!) / 1000;

  if (tiempoSegundos <= 0) {
    return invalido;
  }

  const distancia = calcularDistanciaMetros(
    puntoAnterior.latitude,
    puntoAnterior.longitude,
    puntoNuevo.latitude,
    puntoNuevo.longitude
  );

  if (!Number.isFinite(distancia)) {
    return invalido;
  }

  if (distancia < config.distanciaMinimaMetros) {
    return invalido;
  }

  const velocidadKmH =
    (distancia / tiempoSegundos) * 3.6;

  if (velocidadKmH > config.velocidadMaximaKmH) {
    return invalido;
  }

  return {
    esValido: true,
    distanciaMetros: distancia,
  };
};
