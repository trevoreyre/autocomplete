import { action } from '@storybook/addon-actions'
import Autocomplete from './Autocomplete.js'

const createRoot = () => {
  const root = document.createElement('div')
  root.setAttribute('class', 'autocomplete')
  return root
}

const search = input => {
  if (input.length < 1) {
    return []
  }
  return countries.filter(country => {
    return country.toLowerCase().startsWith(input.toLowerCase())
  })
}
const countrySearchTemplate = `
  <input
    class='autocomplete-input'
    placeholder='Search for a country'
    aria-label='Search for a country'
  >
  <ul class='autocomplete-result-list'></ul>
`

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
const submitWikipedia = result =>
  window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`)
const wikiSearchTemplate = `
  <input
    class='autocomplete-input'
    placeholder='Search Wikipedia'
    aria-label='Search Wikipedia'
  >
  <ul class='autocomplete-result-list'></ul>
`

const getTitle = result => result.title

export default {
  title: 'Autocomplete JS',
  component: Autocomplete,
}

export const Basic = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, { search })
  return root
}

export const DefaultResults = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, {
    search(input) {
      if (input.length < 1) {
        return ['Canada', 'Mexico', 'United Kingdom', 'Russia']
      }
      return countries.filter(country => {
        return country.toLowerCase().startsWith(input.toLowerCase())
      })
    },
  })
  return root
}

export const AdvancedSearch = () => {
  const root = createRoot()
  root.innerHTML = wikiSearchTemplate
  new Autocomplete(root, {
    search: searchWikipedia,
    getResultValue: getTitle,
    onSubmit: submitWikipedia,
  })
  return root
}

export const DebouncedSearch = () => {
  const root = createRoot()
  root.innerHTML = wikiSearchTemplate
  new Autocomplete(root, {
    search: searchWikipedia,
    getResultValue: getTitle,
    onSubmit: submitWikipedia,
    debounceTime: 500,
  })
  return root
}

export const SubmitEvent = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, {
    search,
    onSubmit: result => alert(`You selected ${result}`),
  })
  return root
}

export const UpdateEvent = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, {
    search,
    onUpdate: (results, selectedIndex) => {
      return action('update')(
        `${results.length} results`,
        `Selected: ${results[selectedIndex] || 'NA'}`
      )
    },
  })
  return root
}

export const CustomClass = () => {
  const root = createRoot()
  root.classList.add('search')
  root.innerHTML = `
    <input
      class='search-input'
      placeholder='Search for a country'
      aria-label='Search for a country'
    >
    <ul class='search-result-list'></ul>
  `
  new Autocomplete(root, {
    search,
    baseClass: 'search',
  })
  return root
}

export const CustomEvents = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  const input = root.querySelector('.autocomplete-input')
  input.addEventListener('input', action('input'))
  input.addEventListener('keyup', action('keyup'))
  new Autocomplete(root, { search })
  return root
}

export const AutoSelect = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, { search, autoSelect: true })
  return root
}

export const DefaultValue = () => {
  const root = createRoot()
  root.innerHTML = `
    <input
      class='autocomplete-input'
      placeholder='Search for a country'
      aria-label='Search for a country'
      value='United Kingdom'
    >
    <ul class='autocomplete-result-list'></ul>
  `
  new Autocomplete(root, { search })
  return root
}
export const RenderResultString = () => {
  const root = createRoot()
  root.innerHTML = wikiSearchTemplate
  new Autocomplete(root, {
    search: searchWikipedia,
    getResultValue: getTitle,
    onSubmit: submitWikipedia,
    renderResult: (result, props) => {
      props.class = 'autocomplete-result wiki-result'
      return `
        <li ${props}>
          <div class="wiki-title">
            ${result.title}
          </div>
          <div class="wiki-snippet">
            ${result.snippet}
          </div>
        </li>
      `
    },
  })
  return root
}

export const RenderResultElement = () => {
  const root = createRoot()
  root.innerHTML = wikiSearchTemplate
  new Autocomplete(root, {
    search: searchWikipedia,
    getResultValue: getTitle,
    onSubmit: submitWikipedia,
    renderResult: (result, props) => {
      props.class = 'autocomplete-result wiki-result'
      const item = document.createElement('li')
      Object.keys(props).forEach(key => item.setAttribute(key, props[key]))
      item.innerHTML = `
        <div class="wiki-title">
          ${result.title}
        </div>
        <div class="wiki-snippet">
          ${result.snippet}
        </div>
      `
      return item
    },
  })
  return root
}

export const ResultListLabelString = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, {
    search,
    resultListLabel: 'Suggested countries',
  })
  return root
}

export const ResultListLabelId = () => {
  const root = createRoot()
  root.innerHTML = countrySearchTemplate
  new Autocomplete(root, {
    search,
    resultListLabel: '#root',
  })
  return root
}

export const SubmitOnEnter = () => {
  const root = createRoot()
  root.innerHTML = wikiSearchTemplate
  new Autocomplete(root, {
    search: searchWikipedia,
    getResultValue: getTitle,
    onSubmit: submitWikipedia,
    submitOnEnter: true,
  })
  return root
}

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
