import React from 'react'

import { useState } from 'react'
import { firestore, auth } from '../firebase'

import { collection, addDoc, doc, setDoc } from 'firebase/firestore'

import { useHistory } from 'react-router-dom'

const Home = () => {

  const { currentUser } = auth
  const [showModal, setShowModal] = useState(false)
  const history = useHistory()
  const newGameOptions = [
      { label: 'Black pieces', value: 'b' },
      { label: 'White pieces', value: 'w' },
      { label: 'Random', value: 'r' },
  ]

  function handlePlayOnline() {
      setShowModal(true)
  }

  const startOnlineGame = async (startingPiece: string) => {
   const member = {
    uid: currentUser?.uid,
    piece: startingPiece === 'r' ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
    name: localStorage.getItem('userName'),
    creator: true
   }
    const game = {
      status: 'waiting',
      member: [member],
      gameId: Math.random().toString(36).substring(2, 9) + "_ " + Date.now().toString()
    }

    const gameRef = doc(firestore, 'games', game.gameId)

    await setDoc(gameRef, game)

    history.push('/game/' + game.gameId)
 }

  const startPlayLocally = () => {
    history.push('/game/2')
  }

  return (
    <>
    <div className="columns home">
        <div className="column has-background-primary home-columns">
            <button 
              onClick={startPlayLocally.bind(null)}
              className="button is-link">
                Play Locally
            </button>
        </div>
        <div className="column has-background-link home-columns">
            <button className="button is-primary"
                onClick={handlePlayOnline}>
                Play Online
            </button>
        </div>
    </div>
    <div className={`modal ${showModal ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
            <div className="card">
                <div className="card-content">
                    <div className="content">
                        Please Select the piece you want to start
                    </div>

                </div>
                <footer className="card-footer">
                    {newGameOptions.map(({ label, value }) => (
                        <span className="card-footer-item pointer" key={value}
                            onClick={() => startOnlineGame(value)}>
                            {label}
                        </span>
                    ))}
                </footer>
            </div>
        </div>
        <button className="modal-close is-large" onClick={() => setShowModal(false)}></button>
    </div>
</>
  )
}

export default Home
