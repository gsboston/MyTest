import { callbackify } from "util";

function compose(middleware) {
    return function (context, next) {
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

let arr = [
    function (ctx, next) { console.log(1); next(); console.log(2); },
    function (ctx, next) { console.log(3); }
];

let fn = compose(arr);

fn = function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch(i) {
        index = i
        let midFn = middleware[i]
        if (i === middleware.length) midFn = next
        if (!midFn) return Promise.resolve()
        try {
            return Promise.resolve(midFn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

function callback(){
    return fn(ctx).then(handleResponse).catch(onerror);
}

// function compose(context, next) {
//     let index = -1
//     return dispatch(0)
//     function dispatch(i) {
//         if (i <= index) return Promise.reject(new Error('next() called multiple times'))
//         index = i
//         let fn = middleware[i]
//         if (i === middleware.length) fn = next
//         if (!fn) return Promise.resolve()
//         try {
//             return Promise.resolve(fn(context, function next() {
//                 return dispatch(i + 1)
//             }))
//         } catch (err) {
//             return Promise.reject(err)
//         }
//     }
// }

