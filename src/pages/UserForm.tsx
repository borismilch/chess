import React, { SyntheticEvent, useState } from 'react'

import { signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase'

const UserForm = () => {

  const [name, setName] = useState<string>('')

  const onSubmit  = async (e: SyntheticEvent<HTMLFormElement>) => {

    e.preventDefault()
    localStorage.setItem("userName", name)

    await signInAnonymously(auth, )
  
  }

  return (
    <form onSubmit={onSubmit} className='user-form'>
      <h1>Enter your name </h1>
      <hr/>

      <div className='field'>

        <div className='controll'>

          <input
            type="text" 
            name='name' id="" 
            className='input' 
            placeholder='Nmae' 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />

        </div>
      </div>

      <div className='field'>

        <div className='controll'>

          <button className='button is-success' type='submit'>

            Start

          </button>

        </div>
      </div>

    </form>
  )
}

export default UserForm
