import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { CryptoState } from '../../CryptoContext'
import { Avatar, Button } from '@material-ui/core'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { numberWithCommas } from '../CoinsTable'
import { AiFillDelete } from 'react-icons/ai'
import { doc, setDoc } from 'firebase/firestore'

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'antonio',
    fontSize: 22,
  },
  profile: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    height: '92%',
  },
  picture: {
    width: 40,
    height: 40,
    cursor: 'pointer',
    backgroundColor: 'aquamarine',
    objectFit: 'contain',
  },
  logout: {
    height: '5%',
    width: '100%',
    backgroundColor: 'aquamarine',
    marginTop: 20,
  },
  favorites: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    overflow: 'scroll',
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'aquamarine',
    boxShadow: '0 0 3px black',
  },
})

export default function UserSidebar() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    right: false,
  })

  const { user, setAlert, favoriteslist, coins, symbol } = CryptoState()

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const removeFromFavoriteslist = async (coin) => {
    const coinRef = doc(db, 'favoriteslist', user.uid)
    try {
      await setDoc(
        coinRef,
        { coins: favoriteslist.filter((wish) => wish !== coin?.id) },
        { merge: true },
      )

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Favorites !`,
        type: 'success',
      })
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      })
    }
  }

  const logout = () => {
    signOut(auth)

    setAlert({
      open: true,
      type: 'success',
      message: 'Successfully logged out !',
    })

    toggleDrawer()
  }

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: 'pointer',
              backgroundColor: 'aquamarine',
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar>
                  <img
                    className={classes.picture}
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                  />
                </Avatar>
                <span
                  style={{
                    width: '100%',
                    fontSize: '25',
                    textAlign: 'center',
                    fontWeight: 'bolder',
                    wordWrap: 'break-word',
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.favorites}>
                  <span
                    style={{
                      fontSize: '1.6rem',
                      textShadow: '1 1 5px black',
                      color: 'red',
                    }}
                  >
                    My Favorites
                  </span>
                  {coins.map((coin) => {
                    if (favoriteslist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <img src={coin.image} height="40" />
                          <span>{coin.name}</span>
                          <span style={{ display: 'flex', gap: 8 }}></span>
                          {symbol}
                          {numberWithCommas(coin.current_price.toFixed(2))}
                          <AiFillDelete
                            style={{ cursor: 'pointer' }}
                            fontSize="20"
                            onClick={() => removeFromFavoriteslist(coin)}
                          />
                        </div>
                      )
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}
