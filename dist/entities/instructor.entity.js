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
exports.Instructor = void 0;
const typeorm_1 = require("typeorm");
const encargado_entity_1 = require("./encargado.entity");
const permiso_instructor_entity_1 = require("./permiso-instructor.entity");
const permiso_material_entity_1 = require("./permiso-material.entity");
let Instructor = class Instructor {
};
exports.Instructor = Instructor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Instructor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Instructor.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Instructor.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_senati', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Instructor.prototype, "idSenati", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Instructor.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion', type: 'timestamp' }),
    __metadata("design:type", Date)
], Instructor.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => encargado_entity_1.Encargado, (encargado) => encargado.instructores),
    (0, typeorm_1.JoinColumn)({ name: 'encargado_id' }) // Nombre de la columna FK en la tabla
    ,
    __metadata("design:type", encargado_entity_1.Encargado)
], Instructor.prototype, "encargado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_instructor_entity_1.PermisoInstructor, (permiso) => permiso.instructor),
    __metadata("design:type", Array)
], Instructor.prototype, "permisos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_material_entity_1.PermisoMaterial, (permiso) => permiso.instructor),
    __metadata("design:type", Array)
], Instructor.prototype, "permisosMateriales", void 0);
exports.Instructor = Instructor = __decorate([
    (0, typeorm_1.Entity)('instructores') // Nombre exacto de la tabla en la base de datos
], Instructor);
