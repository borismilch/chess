import React from 'react'
import { images } from '../utils/images'
import Square from './Square'

import { move } from '../Game'

const promotionPieces = ["r", "n", 'b', "q"]

const Promote: React.FC<{promotion: any}> = ({promotion}) => {

  return (
    <div className='board'>

      {promotionPieces.map((p, i) => (
        <div key={i} className='promote-square'>
          <Square isBlack={i % 3 === 0}>

            <div className='piece-container' onClick={() => move(promotion.from, promotion.to, p)}>

              <img
                src={images[`${p}_${promotion.color.color}`]}
                alt="" 
                className='piece cursor-pointer'
              />

            </div>

          </Square>
       
         
        </div>
      ))}
      
    </div>
  )
}

export default Promote
