export const getXYPosition = (i: number, turn?:string) => {
  const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7)
  const y =
    turn === 'w'
      ? Math.abs(Math.floor(i / 8) - 7)
      : Math.floor(i / 8)
  return { x, y }
}

export const isBlack =  (i: number) => {

  const {x, y} = getXYPosition(i)

  return (x + y) %2 === 1

}

export const getPosition = (i: number, turn: string) => {
  const { x, y } = getXYPosition(i, turn)
  console.log({x, y})
  const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
  return `${letter}${y + 1}`

}