import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
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

storiesOf('Autocomplete Vue', module)
  .add('Default', () => ({
    components: { Autocomplete },
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
  }))
  .add('Default results', () => ({
    components: { Autocomplete },
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
  }))
  .add('Advanced search', () => ({
    components: { Autocomplete },
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
  }))
  .add('Submit event', () => ({
    components: { Autocomplete },
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
  }))
  .add('Custom class', () => ({
    components: { Autocomplete },
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
  }))
  .add('Custom events', () => ({
    components: { Autocomplete },
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
  }))
  .add('Auto select', () => ({
    components: { Autocomplete },
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
  }))
  .add('Default value', () => ({
    components: { Autocomplete },
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
  }))
  .add('Result slot', () => ({
    components: { Autocomplete },
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
  }))
  .add('Default slot (full control)', () => ({
    components: { Autocomplete, CustomInput },
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
  }))
  .add('Try some chinese', () => ({
    components: { Autocomplete },
    template: `
      <Autocomplete
        aria-label="按地名搜索美食"
        placeholder="按地名搜索美食，试试‘重庆’"
        :search="search"
      />
    `,
    methods: {
      search: input => {
        if (input.length < 1) {
          return []
        }
        return foods.filter(food => {
          return food.includes(input)
        })
      },
    },
  }))
  .add('Try some japanese', () => ({
    components: { Autocomplete },
    template: `
      <Autocomplete
        aria-label="グルメ検索"
        placeholder="グルメ検索，試してみる‘サクラ’"
        :search="search"
      />
    `,
    methods: {
      search: input => {
        if (input.length < 1) {
          return []
        }
        return sushis.filter(food => {
          return food.includes(input)
        })
      },
    },
  }))
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
const foods = [
  '重庆小面',
  '重庆火锅',
  '陕西肉夹馍',
  '陕西臊子面',
  '黄山烧饼',
  '四川麻辣烫',
  '湖南木桶饭',
]
// I don't know what thess world means, use "aaa" tigger
const sushis = ['きょう', 'あす', 'サクラ', 'やま', '亜亜']
