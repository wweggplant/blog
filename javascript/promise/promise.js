try {
  module.exports = Promise
} catch (e) {}

function Promise(executor) {
    var self = this
    self.data = undefined
    self.status = 'pending'
    self.onResolvedCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        setTimeout(function() {
            if (self.status === 'pending'){
                self.data = value
                self.status = 'resolved'
                for (var i = 0; i < self.onResolvedCallbacks.length; i++) {
                    self.onResolvedCallbacks[i](self.data)
                }
            }
        }, 0);
    }
    function reject(reason) {
        setTimeout(function() {
            if (self.status === 'pending'){
                self.data = reason
                self.status = 'rejected'
                for (var i = 0; i < self.onRejectedCallbacks.length; i++) {
                    self.onRejectedCallbacks[i](reason)
                }
            }
        }, 0);
    }
    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}
function promiseResolvle(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }
    var then;
    var isCallThenOrCatch = false;
    if (x instanceof Promise) {
        // 2.3.2
        if (x.status === 'pending'){
            x.then(function(y){
                promiseResolvle(promise2, y, resolve, reject)
            }, reject)
        } else {
            x.then(resolve, reject)
        }
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            then = x.then
            if (typeof then === 'function'){
                then.call(x, function (y) {
                    if (isCallThenOrCatch) return
                    isCallThenOrCatch = true
                    promiseResolvle(promise2, y, resolve, reject)
                }, function (r) {
                    if (isCallThenOrCatch) return
                    isCallThenOrCatch = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (isCallThenOrCatch) return
            isCallThenOrCatch = true
            reject(error)
        }
    } else {
        resolve(x)
    }
}
Promise.prototype.then = function(onFulfilled, onRejected) {
    var self = this
    var promise2;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {return value}
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason }
    if (self.status === 'resolved'){
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function() {
                try {
                    var x = onFulfilled(self.data)
                    promiseResolvle(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error)
                }
            }, 0);
        })
    }
    if (self.status === 'rejected'){
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function() {
                try {
                    var x = onRejected(self.data)
                    promiseResolvle(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error)
                }
            }, 0);
        })
    }
    if (self.status === 'pending'){
        return promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function (value) {
                try {
                    var x = onFulfilled(value)
                    promiseResolvle(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error)
                }
            })
            self.onRejectedCallbacks.push(function (reason) {
                try {
                    var x = onRejected(reason)
                    promiseResolvle(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}