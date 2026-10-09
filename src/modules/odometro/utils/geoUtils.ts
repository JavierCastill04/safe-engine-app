// geoUtils.ts

const toRad = (value: number) => (value * Math.PI) / 180;

/**
 * Calcula la distancia en metros usando la fórmula de Haversine
 */
export const calcularDistanciaMetros = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface LecturaGps {
  latitude: number;
  longitude: number;
  accuracy?: number | null; // Precisión en metros entregada por expo-location
  timestamp?: number;
}

/**
 * Valida si un desplazamiento GPS es real considerando precisión y umbrales de ruido
 */
export const esMovimientoValido = (
  puntoAnterior: LecturaGps,
  puntoNuevo: LecturaGps,
  config = {
    distanciaMinimaMetros: 4,  // Evita el ruido/deriva cuando estás estático
    precisionMaximaMetros: 20, // Ignora muestras con GPS impreciso
    velocidadMaximaKmH: 220,  // Filtra lecturas aberrantes (saltos del GPS)
  }
): { esValido: boolean; distanciaMetros: number } => {
  // 1. Filtrar si la precisión del GPS reportada es muy mala
  if (
    puntoNuevo.accuracy &&
    puntoNuevo.accuracy > config.precisionMaximaMetros
  ) {
    return { esValido: false, distanciaMetros: 0 };
  }

  // 2. Calcular la distancia usando Haversine
  const distancia = calcularDistanciaMetros(
    puntoAnterior.latitude,
    puntoAnterior.longitude,
    puntoNuevo.latitude,
    puntoNuevo.longitude
  );

  // 3. Filtrar ruido si la distancia es menor al umbral mínimo (evita que el contador suba solo)
  if (distancia < config.distanciaMinimaMetros) {
    return { esValido: false, distanciaMetros: 0 };
  }

  // 4. Validar velocidad máxima física para evitar "saltos"
  if (puntoAnterior.timestamp && puntoNuevo.timestamp) {
    const tiempoSegundos = (puntoNuevo.timestamp - puntoAnterior.timestamp) / 1000;
    if (tiempoSegundos > 0) {
      const velocidadMps = distancia / tiempoSegundos; // metros por segundo
      const velocidadKmH = velocidadMps * 3.6;

      if (velocidadKmH > config.velocidadMaximaKmH) {
        return { esValido: false, distanciaMetros: 0 };
      }
    }
  }

  return { esValido: true, distanciaMetros: distancia };
};