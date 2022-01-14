import React from 'react'
import { Piece as PieceType } from 'chess.js'

import {useDrag, DragPreviewImage} from 'react-dnd'

import {images} from '../utils/images'

const Piece: React.FC<{piece: PieceType, position: string}> = ({piece: {type, color}, position}) => {

  const [{isDragging}, drug, preview ] = useDrag({
    item: {type: "piece", id: (position + "_" + type + '_' + color)},
    type: "piece",
    collect: monitor => ({isDragging: !!monitor.isDragging()})

  })

  return (
    <>
      <DragPreviewImage connect={preview} src={images[(type + '_' + color)]} />

      <div className='piece-container' ref={drug} style={{opacity: isDragging ? 0 : 1 }}>
       <img src={images[(type + '_' + color)]} className='piece' />
      </div>
    </>

  )
}

export default Piece
