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
exports.Encargado = void 0;
const typeorm_1 = require("typeorm");
const instructor_entity_1 = require("./instructor.entity");
const permiso_instructor_entity_1 = require("./permiso-instructor.entity");
const permiso_material_entity_1 = require("./permiso-material.entity");
const permiso_aprendiz_entity_1 = require("./permiso-aprendiz.entity");
let Encargado = class Encargado {
};
exports.Encargado = Encargado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Encargado.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Encargado.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Encargado.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Encargado.prototype, "contrasena", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Encargado.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "fecha_creacion", type: 'timestamp' }),
    __metadata("design:type", Date)
], Encargado.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => instructor_entity_1.Instructor, (instructor) => instructor.encargado),
    __metadata("design:type", Array)
], Encargado.prototype, "instructores", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_instructor_entity_1.PermisoInstructor, (permiso) => permiso.encargado),
    __metadata("design:type", Array)
], Encargado.prototype, "permisosInstructores", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_material_entity_1.PermisoMaterial, (permiso) => permiso.instructor),
    __metadata("design:type", Array)
], Encargado.prototype, "permisosMateriales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_aprendiz_entity_1.PermisoAprendiz, (permiso) => permiso.encargado),
    __metadata("design:type", Array)
], Encargado.prototype, "permisosAprendices", void 0);
exports.Encargado = Encargado = __decorate([
    (0, typeorm_1.Entity)("encargados") // Nombre exacto de la tabla en PostgreSQL
], Encargado);
