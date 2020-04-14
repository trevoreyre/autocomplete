import React, { useEffect, useRef } from 'react'
// import { Autocomplete as AutocompleteWC } from '@trevoreyre/autocomplete/Autocomplete.js'
import AutocompleteWC from '@trevoreyre/autocomplete/Autocomplete.js'
import { defaultFilter } from '@trevoreyre/autocomplete/util/index.js'
import { Provider } from './Context.js'
if (!customElements.get('autocomplete-root')) {
  customElements.define('autocomplete-root', AutocompleteWC)
}

// const Autocomplete = props => {
//   const { id, children, disableFilter, filter: filterProp, ...other } = props
//   const filter = disableFilter ? () => true : filterProp

//   const element = useRef(null)
//   useEffect(() => {
//     element.current.addEventListener('keydown', handleKeydown)

//     return () => {
//       element.current.removeEventListener('keydown', handleKeydown)
//     }
//   }, [])

//   const handleKeydown = event => {
//     console.log('handleKeydown', event)
//   }

//   return (
//     <Provider filter={filter}>
//       <autocomplete-root
//         ref={element}
//         id={id}
//         disable-filter={disableFilter}
//         {...other}
//       >
//         {children}
//       </autocomplete-root>
//     </Provider>
//   )
// }

const Autocomplete = props => {
  const {
    id,
    children,
    disableFilter = false,
    filter = defaultFilter,
    ...other
  } = props

  const ref = useRef(null)
  useEffect(() => {
    ref.current.filter = filter
    ref.current.disableFilter = disableFilter
    ref.current.addEventListener('keydown', handleKeydown)

    return () => {
      ref.current.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const handleKeydown = event => {
    console.log('handleKeydown', event)
  }

  return (
    <autocomplete-root ref={ref} id={id} {...other}>
      {children}
    </autocomplete-root>
  )
}

export default Autocomplete
