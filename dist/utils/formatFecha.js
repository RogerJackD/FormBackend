"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatearFecha = formatearFecha;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
// Puedes cambiar la zona horaria según tu región
const ZONA = 'America/Lima';
function formatearFecha(fecha) {
    return (0, dayjs_1.default)(fecha).tz(ZONA).format('DD/MM/YYYY HH:mm:ss');
}
