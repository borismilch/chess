import * as Chess from 'chess.js'
import { DocumentReference, initializeFirestore } from 'firebase/firestore'
import { BehaviorSubject } from 'rxjs'

import { map } from 'rxjs/operators'

import { getDoc, updateDoc } from 'firebase/firestore'

import { auth } from './firebase'
import { fromRef } from 'rxfire/firestore'

let fireRef
let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5'
let member

const chess = new Chess()

export let gameSubject = new BehaviorSubject({
  board: chess.board()
})

export const handleMove = (from, to) => {
  const moves = chess.moves({verbose: true}).filter(m => m.promotion)

  let pendingPromotion 

  if (moves.some(p => `${p.from}: ${p.to}` === `${from}: ${to}`)) {
    pendingPromotion = {from , to, color: moves[0]}
    updateGame(pendingPromotion)
  }

  if (!pendingPromotion) {
    move(from, to)
  }
}

export const initGame = async (firebaseRef) => {

  fireRef = firebaseRef

  if (firebaseRef) {
    const {currentUser} = auth

    const initialGame = await getDoc(firebaseRef).then(data => data.data())

    if (!initialGame) {
      return 'notfound'
    }

    console.log(initialGame)

    const creator = initialGame.member.find(m => m.creator === true)

    if (initialGame.status === "waiting" && creator.uid !== currentUser.uid) {

      const currtUser = {
        uid: currentUser.uid,
        name: localStorage.getItem('userName'),
        piece: creator.piece === 'w' ? "b": "w"
      }

      const updatedMembers = [...initialGame.member, currtUser]

      await updateDoc(firebaseRef, {member: updatedMembers, status: "ready"})
    } else if (!initialGame.member.map(m => m.uid).includes(currentUser.uid) && initialGame.member.length === 2) {
        return 'intruder'
    }

    chess.reset()

    gameSubject = fromRef(firebaseRef)
      .pipe(
        map(gameDoc => {
          const game = gameDoc.data()
          const { pendingPromotion, gameData, ...restOfTheGame } = game
          member = game.member.find(m => m.uid === currentUser.uid)
          const opened = game.member.find(m => m.uid === currentUser.uid)

          if (gameData) {
            chess.load(gameData)
          }

          const isGameOver = chess.game_over()

          return {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            turn: member.piece,
            member,
            result: isGameOver ? getGameResult() : null,
            ...restOfTheGame

          }
        })
      )

  } else {
    gameSubject = new BehaviorSubject()
    updateGame()
  }

  
}

export function move (from, to, promotion) {

  let tempMove = { from, to }

  if (promotion) {
    tempMove.promotion = promotion
  }

  if (fireRef) {

    if (member.piece === chess.turn()) {

      const legalMove = chess.move(tempMove)

      if (legalMove) {
        updateGame()
      }
      
    }

  } else {

    const legalMove = chess.move(tempMove)

    if (legalMove) {
      updateGame()
    }

  }
}

async function updateGame (pendingPromotion, reset) {

  const isGameOver = chess.game_over()

  if (fireRef) {

    const updatedData = {gameData: chess.fen(), pendingPromotion: pendingPromotion || null}
 
    if (reset) {
      updatedData.status = 'over'
    }

    await updateDoc(fireRef, updatedData)

  } else {
    
    const newGame = {
      board: chess.board(),
      pendingPromotion,
      isGameOver,
      turn: chess.turn(),
      result: isGameOver ? getGameResult: null
    }

    gameSubject.next(newGame)

  }

}

export async function resetGame() {
  if (fireRef) {
      await updateGame(null, true)
      chess.reset()
  } else {
      chess.reset()
      updateGame()
  }

}

function getGameResult() {
  if (chess.in_checkmate()) {
      const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
      return `CHECKMATE - WINNER - ${winner}`
  } else if (chess.in_draw()) {
      let reason = '50 - MOVES - RULE'
      if (chess.in_stalemate()) {
          reason = 'STALEMATE'
      } else if (chess.in_threefold_repetition()) {
          reason = 'REPETITION'
      } else if (chess.insufficient_material()) {
          reason = "INSUFFICIENT MATERIAL"
      }
      return `DRAW - ${reason}`
  } else {
      return 'UNKNOWN REASON'
  }
}