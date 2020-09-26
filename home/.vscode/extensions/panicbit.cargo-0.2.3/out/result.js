"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unreachable() {
    throw Error("unreachable");
}
class Result {
    isOk() { return this instanceof Ok; }
    isErr() { return this instanceof Err; }
    map(f) {
        if (this.isOk()) {
            return new Ok(f(this.value));
        }
        else if (this.isErr()) {
            return new Err(this.error);
        }
        else {
            return unreachable();
        }
    }
    mapErr(f) {
        if (this.isOk()) {
            return new Ok(this.value);
        }
        else if (this.isErr()) {
            return new Err(f(this.error));
        }
        else {
            return unreachable();
        }
    }
}
exports.Result = Result;
class Ok extends Result {
    constructor(value) {
        super();
        this.value = value;
    }
}
exports.Ok = Ok;
class Err extends Result {
    constructor(error) {
        super();
        this.error = error;
    }
}
exports.Err = Err;
// export interface Ok<T> {
//     Ok: T;
// }
// export interface Err<E> {
//     Err: E;
// }
// export type Result<T, E> = Ok<T> | Err<E>;
// export default Result;
// export function isOk<T, E>(res: Result<T, E>): res is Ok<T> {
//     return (<Ok<T>>res).Ok !== undefined;
// }
// export function isErr<T, E>(res: Result<T, E>): res is Err<E> {
//     return (<Err<E>>res).Err !== undefined;
// }
//# sourceMappingURL=result.js.map