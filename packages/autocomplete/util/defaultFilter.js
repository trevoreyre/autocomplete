const defaultFilter = (option, value) => {
  if (!value) {
    return false
  }
  return option.toLowerCase().includes(value.toLowerCase())
}

export default defaultFilter
