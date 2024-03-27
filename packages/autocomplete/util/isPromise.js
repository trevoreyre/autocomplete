// Returns true if the value has a "then" function. Adapted from
// https://github.com/graphql/graphql-js/blob/499a75939f70c4863d44149371d6a99d57ff7c35/src/jsutils/isPromise.js
const isPromise = (value) => Boolean(value && typeof value.then === 'function')

export default isPromise
