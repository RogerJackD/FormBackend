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
exports.PermisoInstructor = void 0;
const typeorm_1 = require("typeorm");
const instructor_entity_1 = require("./instructor.entity");
const encargado_entity_1 = require("./encargado.entity");
let PermisoInstructor = class PermisoInstructor {
};
exports.PermisoInstructor = PermisoInstructor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermisoInstructor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => instructor_entity_1.Instructor, (instructor) => instructor.permisos),
    (0, typeorm_1.JoinColumn)({ name: 'id_senati', referencedColumnName: 'idSenati' }) // Relación por id_senati
    ,
    __metadata("design:type", instructor_entity_1.Instructor)
], PermisoInstructor.prototype, "instructor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "cargo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "hora_salida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "hora_regreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PermisoInstructor.prototype, "detalle_motivo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => encargado_entity_1.Encargado, (encargado) => encargado.permisosInstructores),
    (0, typeorm_1.JoinColumn)({ name: 'encargado_id' }),
    __metadata("design:type", encargado_entity_1.Encargado)
], PermisoInstructor.prototype, "encargado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion', type: 'timestamp' }),
    __metadata("design:type", Date)
], PermisoInstructor.prototype, "fechaCreacion", void 0);
exports.PermisoInstructor = PermisoInstructor = __decorate([
    (0, typeorm_1.Entity)('permiso_instructores')
], PermisoInstructor);
