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
exports.UsuarioDomainException = void 0;
var domain_exception_1 = require("../base-classes/domain-exception");
var UsuarioDomainException = /** @class */ (function (_super) {
    __extends(UsuarioDomainException, _super);
    function UsuarioDomainException(message, code) {
        if (code === void 0) { code = 'USUARIO_ERROR'; }
        var _this = _super.call(this, message, code) || this;
        Object.setPrototypeOf(_this, UsuarioDomainException.prototype);
        return _this;
    }
    UsuarioDomainException.userNotFound = function (id) {
        return new UsuarioDomainException("Usuario ".concat(id, " no encontrado"), 'USER_NOT_FOUND');
    };
    UsuarioDomainException.userAlreadyExists = function (email) {
        return new UsuarioDomainException("El usuario con email ".concat(email, " ya existe"), 'USER_ALREADY_EXISTS');
    };
    UsuarioDomainException.invalidEmail = function () {
        return new UsuarioDomainException('El email proporcionado no es válido', 'INVALID_EMAIL');
    };
    return UsuarioDomainException;
}(domain_exception_1.DomainException));
exports.UsuarioDomainException = UsuarioDomainException;
