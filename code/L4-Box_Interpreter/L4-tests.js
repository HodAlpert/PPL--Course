"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var L3_ast_1 = require("./L3-ast");
var L3_ast_2 = require("./L3-ast");
var L3_value_1 = require("./L3-value");
var L4_ast_1 = require("./L4-ast");
var L4_ast_2 = require("./L4-ast");
var L4_env_1 = require("./L4-env");
var L4_eval_1 = require("./L4-eval");
var L4_value_1 = require("./L4-value");
var error_1 = require("./error");
// ========================================================
// TESTS Parser
// Atomic
assert(L3_ast_2.isNumExp(L4_ast_2.parseL4("1")));
assert(L3_ast_2.isBoolExp(L4_ast_2.parseL4("#t")));
assert(L3_ast_2.isVarRef(L4_ast_2.parseL4("x")));
assert(L3_ast_2.isStrExp(L4_ast_2.parseL4('"a"')));
assert(L3_ast_2.isPrimOp(L4_ast_2.parseL4(">")));
assert(L3_ast_2.isPrimOp(L4_ast_2.parseL4("=")));
assert(L3_ast_2.isPrimOp(L4_ast_2.parseL4("string=?")));
assert(L3_ast_2.isPrimOp(L4_ast_2.parseL4("eq?")));
assert(L3_ast_2.isPrimOp(L4_ast_2.parseL4("cons")));
// Program
assert(L4_ast_1.isProgram4(L4_ast_2.parseL4("(L4 (define x 1) (> (+ x 1) (* x x)))")));
// Define
assert(L4_ast_1.isDefineExp4(L4_ast_2.parseL4("(define x 1)")));
{
    var def = L4_ast_2.parseL4("(define x 1)");
    if (L4_ast_1.isDefineExp4(def)) {
        assert(L3_ast_2.isVarDecl(def.var));
        assert(L3_ast_2.isNumExp(def.val));
    }
}
// Application
assert(L4_ast_1.isAppExp4(L4_ast_2.parseL4("(> x 1)")));
assert(L4_ast_1.isAppExp4(L4_ast_2.parseL4("(> (+ x x) (* x x))")));
// L2 - If, Proc
assert(L4_ast_1.isIfExp4(L4_ast_2.parseL4("(if #t 1 2)")));
assert(L4_ast_1.isIfExp4(L4_ast_2.parseL4("(if (< x 2) x 2)")));
assert(L4_ast_1.isProcExp4(L4_ast_2.parseL4("(lambda () 1)")));
assert(L4_ast_1.isProcExp4(L4_ast_2.parseL4("(lambda (x) x x)")));
// L3 - Literal, Let
assert(L4_ast_1.isLetExp4(L4_ast_2.parseL4("(let ((a 1) (b #t)) (if b a (+ a 1)))")));
assert(L4_ast_1.isLitExp4(L4_ast_2.parseL4("'a")));
assert(L4_ast_1.isLitExp4(L4_ast_2.parseL4("'()")));
assert(L4_ast_1.isLitExp4(L4_ast_2.parseL4("'(1)")));
// L3 - Literal, Let
assert(L4_ast_1.isLetExp4(L4_ast_2.parseL4("(let ((a 1) (b #t)) (if b a (+ a 1)))")));
// L4 - letrec
assert(L4_ast_1.isLetrecExp4(L4_ast_2.parseL4("(letrec ((e (lambda (x) x))) (e 2))")));
/*
console.log(parseL4("'a"));
console.log(parseL4("'\"b\""));
console.log(parseL4("'(s \"a\")"));
console.log(parseL4("'()"));
*/
// ========================================================
// Test L4 interpreter
// ========================================================
// TESTS
// Test each data type literals
assert.deepEqual(L4_eval_1.evalParse4("1"), 1);
assert.deepEqual(L4_eval_1.evalParse4("#t"), true);
assert.deepEqual(L4_eval_1.evalParse4("#f"), false);
assert.deepEqual(L4_eval_1.evalParse4("'a"), L3_value_1.makeSymbolSExp("a"));
assert.deepEqual(L4_eval_1.evalParse4('"a"'), "a");
assert.deepEqual(L4_eval_1.evalParse4("'()"), L3_value_1.makeEmptySExp());
assert.deepEqual(L4_eval_1.evalParse4("'(1 2)"), L4_value_1.makeCompoundSExp4([1, 2]));
assert.deepEqual(L4_eval_1.evalParse4("'(1 (2))"), L4_value_1.makeCompoundSExp4([1, L4_value_1.makeCompoundSExp4([2])]));
// Test primitives
/*
;; <prim-op>  ::= + | - | * | / | < | > | = | not |  eq? | string=?
;;                  | cons | car | cdr | list? | number?
;;                  | boolean? | symbol? | string?      ##### L3
*/
assert.deepEqual(L4_eval_1.evalParse4("(+ 1 2)"), 3);
assert.deepEqual(L4_eval_1.evalParse4("(- 2 1)"), 1);
assert.deepEqual(L4_eval_1.evalParse4("(* 2 3)"), 6);
assert.deepEqual(L4_eval_1.evalParse4("(/ 4 2)"), 2);
assert.deepEqual(L4_eval_1.evalParse4("(< 4 2)"), false);
assert.deepEqual(L4_eval_1.evalParse4("(> 4 2)"), true);
assert.deepEqual(L4_eval_1.evalParse4("(= 4 2)"), false);
assert.deepEqual(L4_eval_1.evalParse4("(not #t)"), false);
assert.deepEqual(L4_eval_1.evalParse4("(eq? 'a 'a)"), true);
assert.deepEqual(L4_eval_1.evalParse4('(string=? "a" "a")'), true);
assert.deepEqual(L4_eval_1.evalParse4("(cons 1 '())"), L4_value_1.makeCompoundSExp4([1]));
assert.deepEqual(L4_eval_1.evalParse4("(cons 1 '(2))"), L4_value_1.makeCompoundSExp4([1, 2]));
assert.deepEqual(L4_eval_1.evalParse4("(car '(1 2))"), 1);
assert.deepEqual(L4_eval_1.evalParse4("(cdr '(1 2))"), L4_value_1.makeCompoundSExp4([2]));
assert.deepEqual(L4_eval_1.evalParse4("(cdr '(1))"), L3_value_1.makeEmptySExp());
assert.deepEqual(L4_eval_1.evalParse4("(list? '(1))"), true);
assert.deepEqual(L4_eval_1.evalParse4("(list? '())"), true);
assert.deepEqual(L4_eval_1.evalParse4("(number? 1)"), true);
assert.deepEqual(L4_eval_1.evalParse4("(number? #t)"), false);
assert.deepEqual(L4_eval_1.evalParse4("(boolean? #t)"), true);
assert.deepEqual(L4_eval_1.evalParse4("(boolean? 0)"), false);
assert.deepEqual(L4_eval_1.evalParse4("(symbol? 'a)"), true);
assert.deepEqual(L4_eval_1.evalParse4('(symbol? "a")'), false);
assert.deepEqual(L4_eval_1.evalParse4("(string? 'a)"), false);
assert.deepEqual(L4_eval_1.evalParse4('(string? "a")'), true);
// Test define
assert.deepEqual(L4_eval_1.evalParse4("(L4 (define x 1) (+ x x))"), 2);
assert.deepEqual(L4_eval_1.evalParse4("(L4 (define x 1) (define y (+ x x)) (* y y))"), 4);
// Test if
assert.deepEqual(L4_eval_1.evalParse4('(if (string? "a") 1 2)'), 1);
assert.deepEqual(L4_eval_1.evalParse4('(if (not (string? "a")) 1 2)'), 2);
// Test proc
assert.deepEqual(L4_eval_1.evalParse4("(lambda (x) x)"), L4_value_1.makeClosure4([L3_ast_1.makeVarDecl("x")], [L3_ast_1.makeVarRef("x")], L4_env_1.makeEmptyEnv()));
// Test apply proc
assert.deepEqual(L4_eval_1.evalParse4("((lambda (x) (* x x)) 2)"), 4);
assert.deepEqual(L4_eval_1.evalParse4("(L4 (define square (lambda (x) (* x x))) (square 3))"), 9);
assert.deepEqual(L4_eval_1.evalParse4("(L4 (define f (lambda (x) (if (> x 0) x (- 0 x)))) (f -3))"), 3);
// Recursive procedure = does not work with ExtEnv - requires RecEnv!
// message: 'Error: Bad argument: "var not found f"'
assert(error_1.isError(L4_eval_1.evalParse4("(L4 (define f (lambda (x) (if (= x 0) 1 (* x (f (- x 1)))))) (f 3))")));
// Recursion with letrec
assert.deepEqual(L4_eval_1.evalParse4("\n(letrec ((f (lambda (n) (if (= n 0) 1 (* n (f (- n 1)))))))\n  (f 5))\n"), 120);
// Preserve bound variables
assert.deepEqual(L4_eval_1.evalParse4("\n(L4 (define fact\n        (letrec ((f (lambda (n)\n                      (if (= n 0)\n                          1\n                          (* n (f (- n 1)))))))\n          f))\n    (fact 5))\n"), 120);
// Accidental capture of the z variable if no renaming - works without renaming in env eval.
assert.deepEqual(L4_eval_1.evalParse4("\n(L4\n    (define z (lambda (x) (* x x)))\n    (((lambda (x) (lambda (z) (x z)))\n      (lambda (w) (z w)))\n     2))"), 4);
// Y-combinator
assert.deepEqual(L4_eval_1.evalParse4("\n(L4 (((lambda (f) (f f))\n      (lambda (fact)\n        (lambda (n)\n          (if (= n 0)\n              1\n              (* n ((fact fact) (- n 1)))))))\n     6))"), 720);
// L4 higher order functions
assert.deepEqual(L4_eval_1.evalParse4("\n(L4 (define map\n      (letrec ((map (lambda (f l)\n                      (if (eq? l '())\n                          l\n                          (cons (f (car l)) (map f (cdr l)))))))\n         map))\n    (map (lambda (x) (* x x))\n      '(1 2 3)))"), L4_value_1.makeCompoundSExp4([1, 4, 9]));
assert.deepEqual(L4_eval_1.evalParse4("\n(L4 (define empty? (lambda (x) (eq? x '())))\n    (define filter\n        (letrec ((filter (lambda (pred l)\n                       (if (empty? l)\n                           l\n                           (if (pred (car l))\n                               (cons (car l) (filter pred (cdr l)))\n                               (filter pred (cdr l)))))))\n            filter))\n    (filter (lambda (x) (not (= x 2)))\n        '(1 2 3 2)))"), L4_value_1.makeCompoundSExp4([1, 3]));
assert.deepEqual(L4_eval_1.evalParse4("\n(L4 (define compose (lambda (f g) (lambda (x) (f (g x)))))\n    ((compose not number?) 2))"), false);
//# sourceMappingURL=L4-tests.js.map