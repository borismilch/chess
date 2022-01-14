import React, { useState } from 'react';
import {IChessBoardPiece} from './models/chess'

import {gameSubject, initGame, resetGame} from './Game'
import { useEffect } from 'react'
import Board from './components/Board'

import { useHistory } from 'react-router-dom';


import { useParams } from 'react-router-dom'
import { firestore } from './firebase'

import { doc } from 'firebase/firestore'

function GameApp() {

  const username = localStorage.getItem('userName')

  const history = useHistory()

  const [board, setBoard] = useState<any[]>([])
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [turn, setTurn] = useState<string>('')
  const [initResult, setInitResult] = useState<any>(null)

  const [game, setGame] = useState<any>({})

  const [status, setStatus] = useState<string>('waiting')

  const [loading, setLoading] = useState<boolean>(true)
  const sharebleLink = window.location.href

  const {id} = useParams<{id: string}>()

  async function copyToClipboard() {
    await navigator.clipboard.writeText(sharebleLink)
  }

  useEffect(() => {

    let subscrider = {unsubscribe: () => {}}

    const start = async () => {

      const res = await initGame(id !== '1' ? doc(firestore, 'games', id) : null)
      setInitResult(res)
      setLoading(false)

      if(!res) {
        subscrider = gameSubject.subscribe((game: any) => {
          setBoard(game.board)
          setIsGameOver(game.isGameOver)
          setResult(game.result)
          setTurn(game.turn)
          setStatus(game.status)
          setGame(game)

          console.log(game, username)
        })
      }

    }

    start()


    return () => subscrider?.unsubscribe()

  }, [id])

  if (loading) {
    return <p>Loading....</p>
  }

  if (initResult === 'notfound') {
    return <p>Not Found</p>
  }

  if (initResult === "intruder") {
    return <p>"Game is full"</p>
  }

  return (
    <div className='app-container'>

      {isGameOver && (
        <>
        <h2 className='vertical-text'>Game Over
          <button onClick={async () => {
            await resetGame()
            history.push('/')
          }}>
            <span className='vertical-text'>
            New Game
            </span>
          </button>
        </h2> 
        </>
      )}

      <div className='board-container'>
       
        {game.member.length === 2 && <span className="tag is-link">{game.member.map((m: any) => m.name).find((n: any) => n !== username)}</span>}
        <Board board={board} turn={turn} />
         <span className="tag is-link">{username}</span>
      </div>

      {result &&  ( <p className='vertical-text'>{result}</p> )}

     { status === 'waiting' && <div className="notification is-link share-game">
        <strong>Share this game to continue</strong>
        <br />
        <br />
        <div className="field has-addons">
          <div className="control is-expanded">
            <input type="text" name="" id="" className="input" readOnly value={sharebleLink} />
          </div>
          <div className="control">
            <button className="button is-info" onClick={copyToClipboard}>Copy</button>
          </div>
        </div>
      </div>}
    
    </div>
  );
}

export default GameApp;
