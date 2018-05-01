"use strict";
// ========================================================
// Value type definition for L4
Object.defineProperty(exports, "__esModule", { value: true });
var L3_ast_1 = require("./L3-ast");
var L3_value_1 = require("./L3-value");
exports.isFunctional = function (x) { return L3_ast_1.isPrimOp(x) || exports.isClosure4(x); };
;
exports.makeClosure4 = function (params, body, env) {
    return ({ tag: "Closure4", params: params, body: body, env: env });
};
exports.isClosure4 = function (x) { return x.tag === "Closure4"; };
;
exports.isSExp4 = function (x) {
    return typeof (x) === 'string' || typeof (x) === 'boolean' || typeof (x) === 'number' ||
        L3_value_1.isSymbolSExp(x) || exports.isCompoundSExp4(x) || L3_value_1.isEmptySExp(x) || L3_ast_1.isPrimOp(x) || exports.isClosure4(x);
};
exports.makeCompoundSExp4 = function (val) {
    return ({ tag: "CompoundSexp4", val: val });
};
exports.isCompoundSExp4 = function (x) { return x.tag === "CompoundSexp4"; };
//# sourceMappingURL=L4-value.js.map