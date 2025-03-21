import { HttpException } from "../../exception/http.exception";

export type ValueErrorReturn<T> = [T, null] | [null, HttpException];
export type ValueErrorReturnPromise<T> = Promise<ValueErrorReturn<T>>;
