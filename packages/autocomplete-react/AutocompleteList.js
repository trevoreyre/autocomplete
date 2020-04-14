import React, { useEffect, useRef } from 'react'
// import { AutocompleteList as AutocompleteListWC } from '@trevoreyre/autocomplete/AutocompleteList.js'
import AutocompleteListWC from '@trevoreyre/autocomplete/AutocompleteList.js'
import { useAutocomplete } from './Context'

if (!customElements.get('autocomplete-list')) {
  customElements.define('autocomplete-list', AutocompleteListWC)
}

// const AutocompleteList = (props = {}) => {
//   const { children, hidden = false, id, role, ...other } = props

//   const { expanded } = useAutocomplete()
//   const ref = useRef(null)

//   useEffect(() => {
//     ref.current.hidden = hidden || !expanded
//   }, [expanded, hidden])

//   return (
//     <autocomplete-list ref={ref} id={id} role={role} {...other}>
//       {children}
//     </autocomplete-list>
//   )
// }

const AutocompleteList = (props = {}) => {
  const { children, hidden = false, id, role, ...other } = props

  const ref = useRef(null)
  useEffect(() => {
    ref.current.hidden = hidden
  }, [hidden])

  return (
    <autocomplete-list ref={ref} id={id} role={role} {...other}>
      {children}
    </autocomplete-list>
  )
}

export default AutocompleteList
