import { createSlice, configureStore } from '@reduxjs/toolkit'

/**
 *  {
 *    'autocomplete-1': {
 *      value: 'hello',
 *      input: 'autocomplete-input-1',
 *      list: 'autocomplete-list-1',
 *      options: ['autocomplete-option-1', 'autocomplete-option-2'],
 *    },
 *    'autocomplete-option-1': {
 *      value: 'hello there',
 *      hidden: true,
 *    },
 *    'autocomplete-option-2': {
 *      value: 'what it is',
 *      hidden: false,
 *    },
 *    providers: {
 *      'autocomplete-option-1': 'autocomplete-1',
 *      'autocomplete-option-2': 'autocomplete-1',
 *      'autocomplete-input-1': 'autocomplete-1',
 *      'autocomplete-list-1': 'autocomplete-1',
 *    },
 *  }
 */

const initialState = {
  provider: {
    value: '',
    input: '',
    list: '',
    options: [],
    filter: () => true,
  },
  list: {
    visible: false,
  },
  option: {
    value: '',
    visible: false,
  },
}

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState: {
    providers: {},
  },
  reducers: {
    initialize(state, action) {
      const { id, type, value, filter } = action.payload
      state[id] = { ...initialState[type], value, filter }
    },
    register(state, action) {
      const { id, type, providerId } = action.payload
      state.providers[id] = providerId
      if (type === 'option') {
        state[providerId].options.push(id)
      } else {
        state[providerId][type] = id
      }
    },
    input(state, action) {
      const { id, value } = action.payload
      const provider = state[state.providers[id]]
      let isListVisible = false

      provider.value = value
      provider.options.forEach(option => {
        const visible = provider.filter(state[option].value, value)
        isListVisible = isListVisible || visible
        state[option].visible = visible
      })
      state[provider.list].visible = isListVisible
    },
    // initializeProvider(state, action) {
    //   const { providerId, filterFn } = action.payload
    //   state[providerId] = state[providerId] || {}
    //   state[providerId].filterFn = filterFn
    // },
    // setValue(state, action) {
    //   const { id, value } = action.payload
    //   const providerId = state[id]
    //   state[providerId] = state[providerId] || {}
    //   state[providerId].value = value
    // },
    // updateList(state, action) {
    //   const { id, value } = action.payload
    //   state[id] = value
    // },
    // updateOptions(state, action) {
    //   const { options } = action.payload
    //   options.forEach(({ id, value }) => {
    //     state[id] = {
    //       value,
    //       selected: false,
    //     }
    //   })
    // },
    // setSelectedOption(state, action) {
    //   const { id, lastId } = action.payload
    //   const lastOption = state[lastId]
    //   if (lastOption) {
    //     lastOption.selected = false
    //   }
    //   const option = state[id]
    //   option.selected = true
    // },
  },
})

const store = configureStore({
  reducer: autocompleteSlice.reducer,
})

const {
  initialize,
  register,
  input,
  // initializeProvider,
  // setValue,
  // updateList,
  // updateOptions,
  // setSelectedOption,
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
  register,
  input,
  // initializeProvider,
  // setValue,
  // updateList,
  // updateOptions,
  // setSelectedOption,
}
