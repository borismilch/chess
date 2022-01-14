import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'

import { isBlack, getPosition } from '../utils/chess'

const Board: React.FC<{board: any[], turn: string}> = ({board, turn}) => {

  const [currBoadr, setCurrentBoard] = useState<any[]>([])

  useEffect(() => {
    setCurrentBoard(
      turn === 'w' ? board.flat() : board.flat().reverse()
    )
  }, [board, turn])

  return (
    <div className='board'>

      {currBoadr.flat().map((item, i) => (
        <div key={i} className='square'>
          <BoardSquare piece={item} position={getPosition(i, turn)} isBlack={isBlack(i)} />
        </div>
      ))}
      
    </div>
  ) 
}

export default Board
