import React from 'react'
import Autocomplete from './Autocomplete'
import AutocompleteInput from './AutocompleteInput'
import AutocompleteList from './AutocompleteList'
import AutocompleteOption from './AutocompleteOption'

export default {
  title: 'Autocomplete',
  component: Autocomplete,
}

export const basic = () => (
  <Autocomplete>
    <AutocompleteInput />
    <AutocompleteList>
      {window.countries.map(country => (
        <AutocompleteOption>{country}</AutocompleteOption>
      ))}
    </AutocompleteList>
  </Autocomplete>
)

export const defaultValue = () => (
  <Autocomplete>
    <AutocompleteInput value="aus" />
    <AutocompleteList>
      {window.countries.map(country => (
        <AutocompleteOption>{country}</AutocompleteOption>
      ))}
    </AutocompleteList>
  </Autocomplete>
)

export const customFilter = () => {
  const filter = (option, value) => {
    if (!value) {
      return false
    }
    return option.toLowerCase().startsWith(value.toLowerCase())
  }

  return (
    <Autocomplete filter={filter}>
      <AutocompleteInput />
      <AutocompleteList>
        {window.countries.map(country => (
          <AutocompleteOption>{country}</AutocompleteOption>
        ))}
      </AutocompleteList>
    </Autocomplete>
  )
}

export const disableFilter = () => (
  <Autocomplete disableFilter>
    <AutocompleteInput />
    <AutocompleteList>
      {window.countries.map(country => (
        <AutocompleteOption>{country}</AutocompleteOption>
      ))}
    </AutocompleteList>
  </Autocomplete>
)
