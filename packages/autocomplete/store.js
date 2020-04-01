import { createSlice, configureStore } from '@reduxjs/toolkit'

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState: {},
  reducers: {
    initialize(state, action) {
      const { id, providerId, value } = action.payload
      state[id] = providerId
      if (value) {
        state[providerId] = state[providerId] || {}
        state[providerId].value = value
      }
    },
    initializeProvider(state, action) {
      const { providerId, filterFn } = action.payload
      state[providerId] = state[providerId] || {}
      state[providerId].filterFn = filterFn
    },
    setValue(state, action) {
      const { id, value } = action.payload
      const providerId = state[id]
      state[providerId] = state[providerId] || {}
      state[providerId].value = value
    },
    updateList(state, action) {
      const { id, value } = action.payload
      state[id] = value
    },
    updateOptions(state, action) {
      const { options } = action.payload
      options.forEach(({ id, value }) => {
        state[id] = {
          value,
          selected: false,
        }
      })
    },
    setSelectedOption(state, action) {
      const { id, lastId } = action.payload
      const lastOption = state[lastId]
      if (lastOption) {
        lastOption.selected = false
      }
      const option = state[id]
      option.selected = true
    },
  },
})

const store = configureStore({
  reducer: autocompleteSlice.reducer,
})

const {
  initialize,
  initializeProvider,
  setValue,
  updateList,
  updateOptions,
  setSelectedOption,
} = Object.entries(autocompleteSlice.actions).reduce(
  (actions, [action, actionFn]) => {
    actions[action] = payload => store.dispatch(actionFn(payload))
    return actions
  },
  {}
)

export default store
export {
  initialize,
  initializeProvider,
  setValue,
  updateList,
  updateOptions,
  setSelectedOption,
}
