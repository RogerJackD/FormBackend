"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermisoAprendiz = void 0;
const typeorm_1 = require("typeorm");
const encargado_entity_1 = require("./encargado.entity");
let PermisoAprendiz = class PermisoAprendiz {
};
exports.PermisoAprendiz = PermisoAprendiz;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermisoAprendiz.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "ocupacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "grupo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "programa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "hora_salida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "hora_retorno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PermisoAprendiz.prototype, "tiempo_permiso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => encargado_entity_1.Encargado, (encargado) => encargado.permisosAprendices),
    (0, typeorm_1.JoinColumn)({ name: 'encargado_id' }),
    __metadata("design:type", encargado_entity_1.Encargado)
], PermisoAprendiz.prototype, "encargado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion', type: 'timestamp' }),
    __metadata("design:type", Date)
], PermisoAprendiz.prototype, "fechaCreacion", void 0);
exports.PermisoAprendiz = PermisoAprendiz = __decorate([
    (0, typeorm_1.Entity)('permiso_aprendices')
], PermisoAprendiz);
