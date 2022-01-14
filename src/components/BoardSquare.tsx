import React from 'react'
import { Piece as PieceType } from 'chess.js'
import Square from './Square'
import Piece from './Piece'
import Promote from './Promote'

import { useEffect, useState } from 'react'

import { gameSubject } from '../Game'

import {move, handleMove} from '../Game'

import { useDrop } from 'react-dnd'

const BoardSquare: React.FC<{piece: PieceType, isBlack: boolean, position: string}> = ({piece, isBlack, position}) => {

  const [promotion, setPromotion] = useState(null)

  useEffect(() => {
    const subscribe = gameSubject.subscribe(({pendingPromotion}: any) => pendingPromotion && pendingPromotion.to === position ? setPromotion(pendingPromotion) : setPromotion(null))

    return () => subscribe.unsubscribe()
  }, [])

  const [_, drop] = useDrop({
    accept: "piece",
    drop: (item: any) => {
      const [fromPosition] = item.id.split('_')
      handleMove(fromPosition, position)
    }
  })

  return (
    <div className='board-square' ref={drop}>
      <Square isBlack={isBlack} >
        {promotion ? <Promote promotion={promotion} /> : 
         <>
           {piece &&  <Piece piece={piece} position={position} />}
         </>
        }
     
      </Square>
    </div>
  )
}

export default BoardSquare
