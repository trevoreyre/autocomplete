// Calculates whether element2 should be above or below element1. Always
// places element2 below unless all of the following:
// 1. There isn't enough visible viewport below to fit element2
// 2. There is more room above element1 than there is below
// 3. Placing elemen2 above 1 won't overflow window
const getRelativePosition = (element1, element2) => {
  const position1 = element1.getBoundingClientRect()
  const position2 = element2.getBoundingClientRect()

  const positionAbove =
    /* 1 */ position1.bottom + position2.height > window.innerHeight &&
    /* 2 */ window.innerHeight - position1.bottom < position1.top &&
    /* 3 */ window.pageYOffset + position1.top - position2.height > 0

  return positionAbove ? 'above' : 'below'
}

export default getRelativePosition
