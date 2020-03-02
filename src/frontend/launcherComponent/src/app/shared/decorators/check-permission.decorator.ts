export function CheckPermission(): MethodDecorator {
    return function (target: Function, key: string, descriptor: any) {
        descriptor.value = function (...args: any[]) {
            return console.log('test');
        };
    };
}
