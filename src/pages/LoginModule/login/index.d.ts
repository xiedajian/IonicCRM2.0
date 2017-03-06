/**
* Created by gobylcy on 2017/2/7.
*/


interface uxinsdk{
    signin(option: UxinSignInOption, success: UxinSignInOptionSuccessFunction, error: UxinSignInOptionErrorFunction);
}

interface UxinSignInOption {
    callPhone: string;
    moble:string;
}

interface UxinSignInOptionSuccessFunction {
    (result: UxinSignInOptionSuccessResult): void;
}

interface UxinSignInOptionSuccessResult {
    msg: string;
}

interface UxinSignInOptionErrorFunction {
    (any): void;
}

declare var uxinSdk:uxinsdk
    ;