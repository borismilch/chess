import React from 'react'

const Square: React.FC<{isBlack: boolean}> = ({children, isBlack}) => {

  const bgClass = isBlack ? 'square-black' : 'square-white'


  return (
    <div className={bgClass + ' board-square'}>
      {children}
    </div>
  )
}

export default Square
