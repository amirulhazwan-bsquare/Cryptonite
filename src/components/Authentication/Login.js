import React from 'react'
import { useState } from 'react'
import { Box, TextField, Button } from '@material-ui/core'
import { CryptoState } from '../../CryptoContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAlert } = CryptoState()

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: 'Please fill in all the fields',
        type: 'error',
      })
      return
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setAlert({
        open: true,
        message: `Login Successful. Welcome ${result.user.email}`,
        type: 'success',
      })
      handleClose()
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      })
      return
    }
  }

  return (
    <Box
      p={3}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <TextField
        variant="outlined"
        type="email"
        label="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      ></TextField>
      <TextField
        variant="outlined"
        type="password"
        label="Enter your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      ></TextField>
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: 'aquamarine' }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  )
}

export default Login
