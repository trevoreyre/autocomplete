import { createSlice, configureStore } from '@reduxjs/toolkit'

/**
 *  {
 *    'autocomplete-1': {
 *      value: 'hello',
 *      selected: false,
 *      selectedIndex: 1,
 *      selectedOption: 'autocomplete-option-3',
 *      selectType: null,
 *      input: 'autocomplete-input-1',
 *      list: 'autocomplete-list-1',
 *      options: ['autocomplete-option-1', 'autocomplete-option-2', 'autocomplete-option-3'],
 *    },
 *    'autocomplete-list-1': {
 *      expanded: true,
 *    },
 *    'autocomplete-option-1': {
 *      value: 'hello there',
 *      visible: true,
 *    },
 *    'autocomplete-option-2': {
 *      value: 'what it is',
 *      visible: false,
 *    },
 *    'autocomplete-option-3': {
 *      value: 'hello world!',
 *      visible: true,
 *    },
 *    providers: {
 *      'autocomplete-option-1': 'autocomplete-1',
 *      'autocomplete-option-2': 'autocomplete-1',
 *      'autocomplete-option-3': 'autocomplete-1',
 *      'autocomplete-input-1': 'autocomplete-1',
 *      'autocomplete-list-1': 'autocomplete-1',
 *    },
 *  }
 */

const initialState = {
  provider: {
    value: '',
    selected: false,
    selectedIndex: -1,
    selectedOption: null,
    selectType: null,
    input: null,
    list: null,
    options: [],
    filter: () => true,
  },
  list: {
    expanded: false,
  },
  option: {
    value: '',
    visible: true,
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
      let expanded = false

      provider.value = value
      provider.selected = false
      provider.selectedIndex = -1
      provider.selectedOption = null
      provider.selectType = null
      provider.options.forEach(option => {
        const visible = provider.filter(state[option].value, value)
        expanded = expanded || visible
        state[option].visible = visible
      })
      state[provider.list].expanded = expanded
    },
    select(state, action) {
      const { id, providerId, type } = action.payload
      const provider = providerId
        ? state[providerId]
        : state[state.providers[id]]
      const selectedOption = id ? state[id] : state[provider.selectedOption]
      provider.value = selectedOption.value
      provider.selectType = type
      provider.selected = true
      state[provider.list].expanded = false
    },
    selectNext(state, action) {
      const { providerId } = action.payload
      const provider = state[providerId]
      const visibleOptions = provider.options.filter(id => state[id]?.visible)
      const count = visibleOptions.length
      const selectedIndex = (provider.selectedIndex + 1) % count
      provider.selectedIndex = selectedIndex
      provider.selectedOption = visibleOptions[selectedIndex]
      state[provider.list].expanded = count > 0
    },
    selectPrev(state, action) {
      const { providerId } = action.payload
      const provider = state[providerId]
      const visibleOptions = provider.options.filter(id => state[id]?.visible)
      const count = visibleOptions.length
      const selectedIndex =
        (((provider.selectedIndex - 1) % count) + count) % count
      provider.selectedIndex = selectedIndex
      provider.selectedOption = visibleOptions[selectedIndex]
      state[provider.list].expanded = count > 0
    },
    hide(state, action) {
      const { id, providerId } = action.payload
      const provider = providerId
        ? state[providerId]
        : state[state.providers[id]]
      provider.selected = false
      provider.selectedIndex = -1
      provider.selectedOption = null
      provider.selectType = null
      state[provider.list].expanded = false
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
  select,
  selectNext,
  selectPrev,
  hide,
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
  select,
  selectNext,
  selectPrev,
  hide,
  // initializeProvider,
  // setValue,
  // updateList,
  // updateOptions,
  // setSelectedOption,
}
