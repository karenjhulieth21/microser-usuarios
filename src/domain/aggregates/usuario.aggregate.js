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
exports.Usuario = void 0;
var entity_1 = require("../base-classes/entity");
var usuario_events_1 = require("../events/usuario-events");
var Usuario = /** @class */ (function (_super) {
    __extends(Usuario, _super);
    function Usuario(props) {
        var _this = _super.call(this, props.id) || this;
        _this.email = props.email;
        _this.nombre = props.nombre;
        _this.creadoEn = props.creadoEn;
        _this.actualizadoEn = props.actualizadoEn;
        return _this;
    }
    Usuario.create = function (id, email, nombre) {
        var usuario = new Usuario({
            id: id,
            email: email,
            nombre: nombre,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        });
        usuario.addDomainEvent(new usuario_events_1.UsuarioCreado(usuario.id, usuario.email.value, usuario.nombre.firstName, usuario.nombre.lastName));
        return usuario;
    };
    Usuario.reconstruct = function (props) {
        return new Usuario(props);
    };
    Usuario.prototype.actualizar = function (email, nombre) {
        this.email = email;
        this.nombre = nombre;
        this.actualizadoEn = new Date();
        this.addDomainEvent(new usuario_events_1.UsuarioActualizado(this.id, this.email.value, this.nombre.firstName, this.nombre.lastName));
    };
    Usuario.prototype.eliminar = function () {
        this.addDomainEvent(new usuario_events_1.UsuarioEliminado(this.id));
    };
    Object.defineProperty(Usuario.prototype, "Email", {
        get: function () {
            return this.email;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Usuario.prototype, "Nombre", {
        get: function () {
            return this.nombre;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Usuario.prototype, "CreadoEn", {
        get: function () {
            return this.creadoEn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Usuario.prototype, "ActualizadoEn", {
        get: function () {
            return this.actualizadoEn;
        },
        enumerable: false,
        configurable: true
    });
    return Usuario;
}(entity_1.Entity));
exports.Usuario = Usuario;
