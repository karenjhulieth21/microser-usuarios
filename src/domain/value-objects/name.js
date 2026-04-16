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
exports.Name = void 0;
var value_object_1 = require("../base-classes/value-object");
var Name = /** @class */ (function (_super) {
    __extends(Name, _super);
    function Name(props) {
        return _super.call(this, props) || this;
    }
    Name.create = function (firstName, lastName) {
        if (!firstName || firstName.trim().length < 2) {
            throw new Error('First name must have at least 2 characters');
        }
        if (!lastName || lastName.trim().length < 2) {
            throw new Error('Last name must have at least 2 characters');
        }
        return new Name({ firstName: firstName, lastName: lastName });
    };
    Object.defineProperty(Name.prototype, "firstName", {
        get: function () {
            return this.props.firstName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Name.prototype, "lastName", {
        get: function () {
            return this.props.lastName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Name.prototype, "fullName", {
        get: function () {
            return "".concat(this.firstName, " ").concat(this.lastName);
        },
        enumerable: false,
        configurable: true
    });
    return Name;
}(value_object_1.ValueObject));
exports.Name = Name;
