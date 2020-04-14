import React, { useEffect, useRef } from 'react'
// import { AutocompleteInput as AutocompleteInputWC } from '@trevoreyre/autocomplete/AutocompleteInput.js'
import AutocompleteInputWC from '@trevoreyre/autocomplete/AutocompleteInput.js'
import { useAutocomplete } from './Context.js'
if (!customElements.get('autocomplete-input')) {
  customElements.define('autocomplete-input', AutocompleteInputWC)
}

// const AutocompleteInput = props => {
//   const {
//     id,
//     list,
//     value = '',
//     role,
//     autocomplete,
//     autocapitalize,
//     autocorrect,
//     onInput,
//     ...other
//   } = props

//   const { setExpanded, setValue, value: valueContext } = useAutocomplete()
//   const ref = useRef(null)
//   useEffect(() => {
//     setValue(value)
//     ref.current.addEventListener('input', handleInput)

//     return () => {
//       ref.current.removeEventListener('input', handleInput)
//     }
//   }, [value])

//   const handleInput = event => {
//     setValue(event.target.value)
//     setExpanded(false)
//     if (onInput) {
//       onInput(event)
//     }
//   }

//   return (
//     <autocomplete-input
//       ref={ref}
//       id={id}
//       list={list}
//       value={valueContext}
//       role={role}
//       autocomplete={autocomplete}
//       autocapitalize={autocapitalize}
//       autocorrect={autocorrect}
//       {...other}
//     ></autocomplete-input>
//   )
// }

const AutocompleteInput = props => {
  const {
    id,
    list,
    value = '',
    role,
    autocomplete,
    autocapitalize,
    autocorrect,
    onInput,
    ...other
  } = props

  const ref = useRef(null)
  useEffect(() => {
    ref.current.addEventListener('input', onInput)

    return () => {
      ref.current.removeEventListener('input', onInput)
    }
  }, [onInput])

  return (
    <autocomplete-input
      ref={ref}
      id={id}
      list={list}
      value={value}
      role={role}
      autocomplete={autocomplete}
      autocapitalize={autocapitalize}
      autocorrect={autocorrect}
      {...other}
    ></autocomplete-input>
  )
}

export default AutocompleteInput
