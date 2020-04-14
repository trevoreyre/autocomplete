import React, { useContext, useState } from 'react'
import {
  createDescendantContext,
  DescendantProvider,
  useDescendants,
} from '@reach/descendants'
import { defaultFilter } from '@trevoreyre/autocomplete/util/index.js'

const DescendantContext = createDescendantContext('DescendantContext')

const Context = React.createContext({
  expanded: false,
  filter: () => {},
  setExpanded: () => {},
  setValue: () => {},
  value: '',
})

const Provider = props => {
  const { children, filter = defaultFilter } = props

  const [descendants, setDescendants] = useDescendants()
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState('')
  console.log('descendants:', descendants)

  return (
    <DescendantProvider
      context={DescendantContext}
      items={descendants}
      set={setDescendants}
    >
      <Context.Provider
        value={{
          expanded,
          filter,
          setExpanded,
          setValue,
          value,
        }}
      >
        {children}
      </Context.Provider>
    </DescendantProvider>
  )
}

const useAutocomplete = () => {
  return useContext(Context)
}

export { DescendantContext, Provider, useAutocomplete }
