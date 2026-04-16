"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var Entity = /** @class */ (function () {
    function Entity(id) {
        this.domainEvents = [];
        this._id = id;
    }
    Object.defineProperty(Entity.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "events", {
        get: function () {
            return this.domainEvents;
        },
        enumerable: false,
        configurable: true
    });
    Entity.prototype.addDomainEvent = function (event) {
        this.domainEvents.push(event);
    };
    Entity.prototype.removeDomainEvent = function (event) {
        var index = this.domainEvents.indexOf(event);
        if (index >= 0) {
            this.domainEvents.splice(index, 1);
        }
    };
    Entity.prototype.clearDomainEvents = function () {
        this.domainEvents.length = 0;
    };
    Entity.prototype.equals = function (object) {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        return this._id === object._id;
    };
    return Entity;
}());
exports.Entity = Entity;
