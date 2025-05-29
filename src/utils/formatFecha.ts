import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Puedes cambiar la zona horaria según tu región
const ZONA = 'America/Lima';

export function formatearFecha(fecha: Date): string {
  return dayjs(fecha).tz(ZONA).format('DD/MM/YYYY HH:mm:ss');
}