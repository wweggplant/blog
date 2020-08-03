
全局对象
shouldTrack activeEffect 

targetMap<target, DepMap>

DepMap<target, dep> 

dep<Set<ReactiveEffect>>

ReactiveEffect = interface ReactiveEffect<T = any> {
    (): T
    _isEffect: true
    id: number
    active: boolean
    raw: () => T
    deps: Array<Dep>
    options: ReactiveEffectOptions
}

export interface ReactiveEffectOptions {
    lazy?: boolean
    scheduler?: (job: ReactiveEffect) => void
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    onStop?: () => void
}


function effect() {
    // 生成一个effect 函数,可以执行如 effect(() => (dummy = getNum()))里面的函数
    // 维护调用堆栈, 1. 清空当前effect的依赖, 2. 修改activeEffect 3 执行完成后,重置activeEffect
}
function track() {
    // 维护
}

function trigger() {

}