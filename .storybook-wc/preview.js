import Autocomplete from '../packages/autocomplete/Autocomplete.js'
import AutocompleteInput from '../packages/autocomplete/AutocompleteInput.js'
import AutocompleteList from '../packages/autocomplete/AutocompleteList.js'
import AutocompleteOption from '../packages/autocomplete/AutocompleteOption.js'
import { countries } from './data.js'
import '../packages/style.css'
import './style.css'

customElements.define('autocomplete-root', Autocomplete)
customElements.define('autocomplete-input', AutocompleteInput)
customElements.define('autocomplete-list', AutocompleteList)
customElements.define('autocomplete-option', AutocompleteOption)
window.countries = countries
