const isPromise = value => Boolean(value && typeof value.then === 'function')

export default isPromise
