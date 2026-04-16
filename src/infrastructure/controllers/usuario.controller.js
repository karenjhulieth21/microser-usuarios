"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
var common_1 = require("@nestjs/common");
var usuario_mapper_1 = require("../persistence/mappers/usuario.mapper");
var usuario_domain_exception_1 = require("../../domain/exceptions/usuario-domain-exception");
var UsuarioController = function () {
    var _classDecorators = [(0, common_1.Controller)('usuarios')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _crearUsuario_decorators;
    var _actualizarUsuario_decorators;
    var _eliminarUsuario_decorators;
    var _obtenerUsuario_decorators;
    var _listarUsuarios_decorators;
    var UsuarioController = _classThis = /** @class */ (function () {
        function UsuarioController_1(crearUsuarioUseCase, actualizarUsuarioUseCase, eliminarUsuarioUseCase, obtenerUsuarioUseCase, listarUsuariosUseCase) {
            this.crearUsuarioUseCase = (__runInitializers(this, _instanceExtraInitializers), crearUsuarioUseCase);
            this.actualizarUsuarioUseCase = actualizarUsuarioUseCase;
            this.eliminarUsuarioUseCase = eliminarUsuarioUseCase;
            this.obtenerUsuarioUseCase = obtenerUsuarioUseCase;
            this.listarUsuariosUseCase = listarUsuariosUseCase;
            this.mapper = new usuario_mapper_1.UsuarioMapper();
        }
        UsuarioController_1.prototype.crearUsuario = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var id, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.crearUsuarioUseCase.execute(dto)];
                        case 1:
                            id = _a.sent();
                            return [2 /*return*/, { id: id }];
                        case 2:
                            error_1 = _a.sent();
                            if (error_1 instanceof usuario_domain_exception_1.UsuarioDomainException) {
                                throw new common_1.HttpException(error_1.message, common_1.HttpStatus.BAD_REQUEST);
                            }
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsuarioController_1.prototype.actualizarUsuario = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.actualizarUsuarioUseCase.execute({
                                    id: id,
                                    email: dto.email,
                                    firstName: dto.firstName,
                                    lastName: dto.lastName,
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            if (error_2 instanceof usuario_domain_exception_1.UsuarioDomainException) {
                                throw new common_1.HttpException(error_2.message, common_1.HttpStatus.BAD_REQUEST);
                            }
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsuarioController_1.prototype.eliminarUsuario = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.eliminarUsuarioUseCase.execute(id)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            if (error_3 instanceof usuario_domain_exception_1.UsuarioDomainException) {
                                throw new common_1.HttpException(error_3.message, common_1.HttpStatus.NOT_FOUND);
                            }
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsuarioController_1.prototype.obtenerUsuario = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.obtenerUsuarioUseCase.execute(id)];
                        case 1:
                            usuario = _a.sent();
                            return [2 /*return*/, this.mapper.toDTO(usuario)];
                        case 2:
                            error_4 = _a.sent();
                            if (error_4 instanceof usuario_domain_exception_1.UsuarioDomainException) {
                                throw new common_1.HttpException(error_4.message, common_1.HttpStatus.NOT_FOUND);
                            }
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsuarioController_1.prototype.listarUsuarios = function () {
            return __awaiter(this, void 0, void 0, function () {
                var usuarios;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.listarUsuariosUseCase.execute()];
                        case 1:
                            usuarios = _a.sent();
                            return [2 /*return*/, usuarios.map(function (usuario) { return _this.mapper.toDTO(usuario); })];
                    }
                });
            });
        };
        return UsuarioController_1;
    }());
    __setFunctionName(_classThis, "UsuarioController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _crearUsuario_decorators = [(0, common_1.Post)()];
        _actualizarUsuario_decorators = [(0, common_1.Put)(':id')];
        _eliminarUsuario_decorators = [(0, common_1.Delete)(':id')];
        _obtenerUsuario_decorators = [(0, common_1.Get)(':id')];
        _listarUsuarios_decorators = [(0, common_1.Get)()];
        __esDecorate(_classThis, null, _crearUsuario_decorators, { kind: "method", name: "crearUsuario", static: false, private: false, access: { has: function (obj) { return "crearUsuario" in obj; }, get: function (obj) { return obj.crearUsuario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _actualizarUsuario_decorators, { kind: "method", name: "actualizarUsuario", static: false, private: false, access: { has: function (obj) { return "actualizarUsuario" in obj; }, get: function (obj) { return obj.actualizarUsuario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _eliminarUsuario_decorators, { kind: "method", name: "eliminarUsuario", static: false, private: false, access: { has: function (obj) { return "eliminarUsuario" in obj; }, get: function (obj) { return obj.eliminarUsuario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _obtenerUsuario_decorators, { kind: "method", name: "obtenerUsuario", static: false, private: false, access: { has: function (obj) { return "obtenerUsuario" in obj; }, get: function (obj) { return obj.obtenerUsuario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listarUsuarios_decorators, { kind: "method", name: "listarUsuarios", static: false, private: false, access: { has: function (obj) { return "listarUsuarios" in obj; }, get: function (obj) { return obj.listarUsuarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsuarioController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsuarioController = _classThis;
}();
exports.UsuarioController = UsuarioController;
