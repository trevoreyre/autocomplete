import React, { useEffect, useRef } from 'react'
import { useDescendant } from '@reach/descendants'
// import { AutocompleteOption as AutocompleteOptionWC } from '@trevoreyre/autocomplete/AutocompleteOption'
import AutocompleteOptionWC from '@trevoreyre/autocomplete/AutocompleteOption'
import { DescendantContext, useAutocomplete } from './Context.js'

if (!customElements.get('autocomplete-option')) {
  customElements.define('autocomplete-option', AutocompleteOptionWC)
}

// const AutocompleteOption = props => {
//   const {
//     id,
//     value,
//     hidden = false,
//     'aria-selected': ariaSelected,
//     role,
//     children,
//     ...other
//   } = props

//   const ref = useRef(null)
//   const { filter, setExpanded, value: valueContext } = useAutocomplete()
//   const isHidden = hidden || !filter(value || children, valueContext)
//   const index = useDescendant({
//     context: DescendantContext,
//     ref: ref.current,
//   })

//   useEffect(() => {
//     ref.current.hidden = isHidden
//     if (!isHidden) {
//       setExpanded(true)
//     }
//   }, [isHidden, valueContext])

//   return (
//     <autocomplete-option
//       ref={ref}
//       id={id}
//       value={value}
//       aria-selected={ariaSelected}
//       role={role}
//       {...other}
//     >
//       {index} - {children}
//     </autocomplete-option>
//   )
// }

const AutocompleteOption = props => {
  const {
    id,
    value,
    hidden = false,
    'aria-selected': ariaSelected,
    role,
    children,
    ...other
  } = props

  const ref = useRef(null)
  useEffect(() => {
    ref.current.hidden = hidden
  }, [hidden])

  return (
    <autocomplete-option
      ref={ref}
      id={id}
      value={value}
      aria-selected={ariaSelected}
      role={role}
      {...other}
    >
      {children}
    </autocomplete-option>
  )
}

export default AutocompleteOption
