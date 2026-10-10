import type { Vehiculo, Mantenimiento } from '@/types';

const escaparHTML = (valor: string | number): string =>
  String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const generarHTMLReporte = (
  vehiculos: Vehiculo[],
  mantenimientos: Mantenimiento[]
): string => {
  const fechaGeneracion = new Date().toLocaleDateString('es-SV');

  const seccionesVehiculos = vehiculos.map((vehiculo) => {
    const historial = mantenimientos
      .filter((m) => m.vehiculoId === vehiculo.id)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    const totalGastos = historial.reduce(
      (total, mantenimiento) => total + mantenimiento.costo,
      0
    );

    const filasHistorial = historial.length
      ? historial.map((m) => `
          <tr>
            <td>${escaparHTML(m.fecha)}</td>
            <td>${escaparHTML(m.tipo)}</td>
            <td>${escaparHTML(m.kilometraje.toLocaleString())} km</td>
            <td>$${m.costo.toFixed(2)}</td>
            <td>${escaparHTML(m.notas || m.descripcion || 'Sin observaciones')}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="5">No hay mantenimientos registrados.</td></tr>';

    return `
      <section class="vehiculo">
        <h2>${escaparHTML(vehiculo.marca)} ${escaparHTML(vehiculo.modelo)}</h2>

        <p><strong>Placa:</strong> ${escaparHTML(vehiculo.placa)}</p>
        <p><strong>Año:</strong> ${escaparHTML(vehiculo.anio)}</p>
        <p><strong>Kilometraje actual:</strong>
          ${escaparHTML(vehiculo.kilometrajeActual.toLocaleString())} km
        </p>
        <p><strong>Mantenimientos registrados:</strong> ${historial.length}</p>
        <p><strong>Gasto registrado:</strong> $${totalGastos.toFixed(2)}</p>

        <h3>Historial de mantenimientos</h3>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Kilometraje</th>
              <th>Costo</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${filasHistorial}
          </tbody>
        </table>
      </section>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1e293b;
            padding: 24px;
            font-size: 12px;
          }

          h1 {
            color: #2f6f9f;
            text-align: center;
          }

          h2 {
            color: #2f6f9f;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
          }

          h3 {
            margin-top: 20px;
          }

          .resumen {
            margin: 24px 0;
            padding: 12px;
            background: #f1f5f9;
          }

          .vehiculo {
            margin-top: 28px;
            page-break-inside: avoid;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }

          th, td {
            border: 1px solid #cbd5e1;
            padding: 7px;
            text-align: left;
            overflow-wrap: anywhere;
          }

          th {
            background: #e2e8f0;
          }

          .pie {
            margin-top: 30px;
            color: #64748b;
          }
        </style>
      </head>

      <body>
        <h1>Safe Engine</h1>
        <h2>Reporte de vehículos y mantenimientos</h2>

        <div class="resumen">
          <p><strong>Fecha del reporte:</strong> ${fechaGeneracion}</p>
          <p><strong>Total de vehículos:</strong> ${vehiculos.length}</p>
          <p><strong>Total de mantenimientos:</strong> ${mantenimientos.length}</p>
          <p><strong>Gasto total registrado:</strong>
            $${mantenimientos.reduce((total, m) => total + m.costo, 0).toFixed(2)}
          </p>
        </div>

        ${seccionesVehiculos || '<p>No hay vehículos registrados.</p>'}

        <p class="pie">
          Reporte generado por Safe Engine. Los resultados dependen
          de la información registrada en la aplicación.
        </p>
      </body>
    </html>
  `;
};