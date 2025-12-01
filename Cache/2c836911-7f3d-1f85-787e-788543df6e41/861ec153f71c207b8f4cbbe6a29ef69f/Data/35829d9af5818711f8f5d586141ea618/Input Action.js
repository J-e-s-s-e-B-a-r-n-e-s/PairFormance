"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActionType = exports.InputActionComponent = void 0;
var __selfType = requireType("./Input Action");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const RotationInputAction_1 = require("./InputActionTypes/Rotation/RotationInputAction");
const Extensions_1 = require("./Helpers/Extensions");
const ComponentContext_1 = require("./ComponentContext");
const MovementInputAction_1 = require("./InputActionTypes/Movement/MovementInputAction");
const DiscreteInputAction_1 = require("./InputActionTypes/Discrete/DiscreteInputAction");
const ScalarInputAction_1 = require("./InputActionTypes/Scalar/ScalarInputAction");
let InputActionComponent = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InputActionComponent = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.actionType = this.actionType;
            this.movementInput = this.movementInput;
            this.rotationInput = this.rotationInput;
            this.discreteInput = this.discreteInput;
            this.scalarInput = this.scalarInput;
            this.enableTouchBlocking = this.enableTouchBlocking;
            this.printWarns = this.printWarns;
        }
        __initialize() {
            super.__initialize();
            this.actionType = this.actionType;
            this.movementInput = this.movementInput;
            this.rotationInput = this.rotationInput;
            this.discreteInput = this.discreteInput;
            this.scalarInput = this.scalarInput;
            this.enableTouchBlocking = this.enableTouchBlocking;
            this.printWarns = this.printWarns;
        }
        onAwake() {
            this.context = new ComponentContext_1.ComponentContext(this.getSceneObject(), this, this.printWarns);
            if (this.enableTouchBlocking) {
                global.touchSystem.touchBlocking = true;
            }
            this.createDerivedAction();
        }
        createDerivedAction() {
            switch (this.actionType) {
                case UserActionType.Direction:
                    return MovementInputAction_1.MovementInputAction.createFromConfig(this.movementInput, this.context);
                case UserActionType.Rotation:
                    return RotationInputAction_1.RotationInputAction.createFromConfig(this.rotationInput, this.context);
                case UserActionType.Discrete:
                    return DiscreteInputAction_1.DiscreteInputAction.createFromConfig(this.discreteInput, this.context);
                case UserActionType.Scalar:
                    return ScalarInputAction_1.ScalarInputAction.createFromConfig(this.scalarInput, this.context);
                default:
                    (0, Extensions_1.assertNever)(this.actionType, "actionType");
            }
        }
    };
    __setFunctionName(_classThis, "InputActionComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InputActionComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InputActionComponent = _classThis;
})();
exports.InputActionComponent = InputActionComponent;
var UserActionType;
(function (UserActionType) {
    UserActionType[UserActionType["Direction"] = 0] = "Direction";
    UserActionType[UserActionType["Rotation"] = 1] = "Rotation";
    UserActionType[UserActionType["Discrete"] = 2] = "Discrete";
    UserActionType[UserActionType["Scalar"] = 3] = "Scalar";
})(UserActionType || (exports.UserActionType = UserActionType = {}));
//# sourceMappingURL=Input%20Action.js.map