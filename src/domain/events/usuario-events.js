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
exports.UsuarioEliminado = exports.UsuarioActualizado = exports.UsuarioCreado = void 0;
var domain_event_1 = require("../base-classes/domain-event");
var UsuarioCreado = /** @class */ (function (_super) {
    __extends(UsuarioCreado, _super);
    function UsuarioCreado(usuarioId, email, nombre, apellido) {
        var _this = _super.call(this) || this;
        _this.usuarioId = usuarioId;
        _this.email = email;
        _this.nombre = nombre;
        _this.apellido = apellido;
        return _this;
    }
    UsuarioCreado.prototype.getAggregateId = function () {
        return this.usuarioId;
    };
    return UsuarioCreado;
}(domain_event_1.DomainEvent));
exports.UsuarioCreado = UsuarioCreado;
var UsuarioActualizado = /** @class */ (function (_super) {
    __extends(UsuarioActualizado, _super);
    function UsuarioActualizado(usuarioId, email, nombre, apellido) {
        var _this = _super.call(this) || this;
        _this.usuarioId = usuarioId;
        _this.email = email;
        _this.nombre = nombre;
        _this.apellido = apellido;
        return _this;
    }
    UsuarioActualizado.prototype.getAggregateId = function () {
        return this.usuarioId;
    };
    return UsuarioActualizado;
}(domain_event_1.DomainEvent));
exports.UsuarioActualizado = UsuarioActualizado;
var UsuarioEliminado = /** @class */ (function (_super) {
    __extends(UsuarioEliminado, _super);
    function UsuarioEliminado(usuarioId) {
        var _this = _super.call(this) || this;
        _this.usuarioId = usuarioId;
        return _this;
    }
    UsuarioEliminado.prototype.getAggregateId = function () {
        return this.usuarioId;
    };
    return UsuarioEliminado;
}(domain_event_1.DomainEvent));
exports.UsuarioEliminado = UsuarioEliminado;
