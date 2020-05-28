const defaultFilter = (option, value) => {
  return option.toLowerCase().includes(value.toLowerCase())
}

export default defaultFilter
