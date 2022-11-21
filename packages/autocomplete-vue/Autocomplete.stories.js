import Vue from 'vue'
import { action } from '@storybook/addon-actions'
import Autocomplete from './Autocomplete.vue'

const CustomInput = Vue.component('CustomInput', {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  template: `
    <input
      style="padding: 32px 32px 32px 48px;"
      :value="value"
      v-on="$listeners"
    />
  `,
})

const search = input => {
  if (input.length < 1) {
    return []
  }
  return countries.filter(country => {
    return country.toLowerCase().startsWith(input.toLowerCase())
  })
}

const wikiUrl = 'https://en.wikipedia.org'
const wikiParams = 'action=query&list=search&format=json&origin=*'
const searchWikipedia = input =>
  new Promise(resolve => {
    const url = `${wikiUrl}/w/api.php?${wikiParams}&srsearch=${encodeURI(
      input
    )}`

    if (input.length < 3) {
      return resolve([])
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(data.query.search)
      })
  })

export default {
  title: 'Autocomplete Vue',
  component: Autocomplete,
}

export const Basic = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
    />
  `,
  methods: {
    search,
  },
})

export const DefaultResults = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
    />
  `,
  methods: {
    search(input) {
      if (input.length < 1) {
        return ['Canada', 'Mexico', 'United Kingdom', 'Russia']
      }
      return countries.filter(country => {
        return country.toLowerCase().startsWith(input.toLowerCase())
      })
    },
  },
})

export const AdvancedSearch = () => ({
  template: `
    <Autocomplete
      aria-label="Search Wikipedia"
      placeholder="Search Wikipedia"
      :search="search"
      :get-result-value="getResultValue"
      @submit="onSubmit"
    />
  `,
  methods: {
    search(input) {
      return searchWikipedia(input)
    },
    getResultValue(result) {
      return result.title
    },
    onSubmit(result) {
      window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`)
    },
  },
})

export const DebouncedSearch = () => ({
  template: `
    <div>
      <p>Search count - {{ searchCount }}</p>
      <Autocomplete
        aria-label="Search Wikipedia"
        placeholder="Search Wikipedia"
        :search="search"
        :get-result-value="getResultValue"
        :debounce-time="500"
        @submit="onSubmit"
      />
    </div>
  `,
  data() {
    return {
      searchCount: 0,
    }
  },
  methods: {
    search(input) {
      this.searchCount += 1
      return searchWikipedia(input)
    },
    getResultValue(result) {
      return result.title
    },
    onSubmit(result) {
      window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`)
    },
  },
})

export const SubmitEvent = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      @submit="onSubmit"
    />
  `,
  methods: {
    search,
    onSubmit(result) {
      alert(`You selected ${result}`)
    },
  },
})

export const UpdateEvent = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      @update="onUpdate"
    />
  `,
  methods: {
    search,
    onUpdate(results, selectedIndex) {
      return action('update')(
        `${results.length} results`,
        `Selected: ${results[selectedIndex] || 'NA'}`
      )
    },
  },
})

export const CustomClass = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      base-class="search"
    />
  `,
  methods: {
    search,
  },
})

export const CustomEvents = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      @input="handleInput"
      @keyup="handleKeyup"
    />
  `,
  methods: {
    search,
    handleInput(event) {
      return action('input')(event)
    },
    handleKeyup(event) {
      return action('keyup')(event)
    },
  },
})

export const AutoSelect = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      auto-select
    />
  `,
  methods: {
    search,
  },
})

export const DefaultValue = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      default-value="United Kingdom"
    />
  `,
  methods: {
    search,
  },
})

export const ResultSlot = () => ({
  template: `
    <Autocomplete
      aria-label="Search Wikipedia"
      placeholder="Search Wikipedia"
      :search="search"
      :get-result-value="getResultValue"
      @submit="onSubmit"
    >
      <template #result="{ result, props }">
        <li
          v-bind="props"
          class="autocomplete-result wiki-result"
        >
          <div class="wiki-title">
            {{ result.title }}
          </div>
          <div class="wiki-snippet" v-html="result.snippet" />
        </li>
      </template>
    </Autocomplete>
  `,
  methods: {
    search(input) {
      return searchWikipedia(input)
    },
    getResultValue(result) {
      return result.title
    },
    onSubmit(result) {
      window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`)
    },
  },
})

export const DefaultSlotFullControl = () => ({
  components: { CustomInput },
  template: `
    <Autocomplete
      placeholder="Search for a country"
      aria-label="Search for a country"
      :search="search"
    >
      <template
        #default="{
          rootProps,
          inputProps,
          inputListeners,
          resultListProps,
          resultListListeners,
          results,
          resultProps
        }"
      >
        <div v-bind="rootProps">
          <CustomInput
            v-bind="inputProps"
            v-on="inputListeners"
            :class="[
              'autocomplete-input',
              { 'autocomplete-input-no-results': noResults },
              { 'autocomplete-input-focused': focused }
            ]"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          <ul
            v-if="noResults"
            class="autocomplete-result-list"
            style="position: absolute; z-index: 1; width: 100%; top: 100%;"
          >
            <li class="autocomplete-result">
              No results found
            </li>
          </ul>
          <ul v-bind="resultListProps" v-on="resultListListeners">
            <li
              v-for="(result, index) in results"
              :key="resultProps[index].id"
              v-bind="resultProps[index]"
            >
              {{ result }}
            </li>
          </ul>
        </div>
      </template>
    </Autocomplete>
  `,
  data() {
    return {
      focused: false,
      value: '',
      results: [],
    }
  },
  computed: {
    noResults() {
      return this.value && this.results.length === 0
    },
  },
  methods: {
    search(input) {
      this.value = input
      this.results = search(input)
      return this.results
    },
    handleFocus() {
      this.focused = true
    },
    handleBlur() {
      this.focused = false
    },
  },
})
DefaultSlotFullControl.story = { name: 'Default Slot (Full Control)' }

export const ResultListLabelString = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      result-list-label="Suggested countries"
    />
  `,
  methods: {
    search,
  },
})

export const ResultListLabelId = () => ({
  template: `
    <Autocomplete
      aria-label="Search for a country"
      placeholder="Search for a country"
      :search="search"
      result-list-label="#root"
    />
  `,
  methods: {
    search,
  },
})

export const SubmitOnEnter = () => ({
  template: `
    <Autocomplete
      aria-label="Search Wikipedia"
      placeholder="Search Wikipedia"
      :search="search"
      :get-result-value="getResultValue"
      @submit="onSubmit"
      submit-on-enter="true"
    />
  `,
  methods: {
    search(input) {
      return searchWikipedia(input)
    },
    getResultValue(result) {
      return result.title
    },
    onSubmit(result) {
      window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`)
    },
  },
})

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua & Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia & Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo Democratic Republic',
  'Costa Rica',
  "Cote D'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea North',
  'Korea South',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestinian State*',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Samoa',
  'San Marino',
  'Sao Tome & Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'St. Kitts & Nevis',
  'St. Lucia',
  'St. Vincent & The Grenadines',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'The Netherlands',
  'The Philippines',
  'Togo',
  'Tonga',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States Of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City (Holy See)',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]
