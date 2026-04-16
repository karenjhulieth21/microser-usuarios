"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioMapper = void 0;
var base_mapper_1 = require("./base-mapper");
var usuario_aggregate_1 = require("../../domain/aggregates/usuario.aggregate");
var email_1 = require("../../domain/value-objects/email");
var name_1 = require("../../domain/value-objects/name");
var UsuarioMapper = /** @class */ (function (_super) {
    __extends(UsuarioMapper, _super);
    function UsuarioMapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UsuarioMapper.prototype.toPersistence = function (domain) {
        return {
            id: domain['_id'],
            email: domain.Email.value,
            firstName: domain.Nombre.firstName,
            lastName: domain.Nombre.lastName,
            creadoEn: domain.CreadoEn,
            actualizadoEn: domain.ActualizadoEn,
        };
    };
    UsuarioMapper.prototype.toDomain = function (raw) {
        return usuario_aggregate_1.Usuario.reconstruct({
            id: raw.id,
            email: new email_1.Email({ value: raw.email }),
            nombre: new name_1.Name({
                firstName: raw.firstName,
                lastName: raw.lastName,
            }),
            creadoEn: raw.creadoEn,
            actualizadoEn: raw.actualizadoEn,
        });
    };
    UsuarioMapper.prototype.toDTO = function (domain) {
        return {
            id: domain['_id'],
            email: domain.Email.value,
            nombre: domain.Nombre.firstName,
            apellido: domain.Nombre.lastName,
            creadoEn: domain.CreadoEn,
            actualizadoEn: domain.ActualizadoEn,
        };
    };
    return UsuarioMapper;
}(base_mapper_1.Mapper));
exports.UsuarioMapper = UsuarioMapper;
