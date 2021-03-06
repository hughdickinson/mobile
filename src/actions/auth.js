import auth from 'panoptes-client/lib/auth'
import store from 'react-native-simple-store'
import { Actions, ActionConst } from 'react-native-router-flux'
import {
  checkIsConnected,
  loadNotificationSettings,
  loadSettings,
  setState,
  setIsFetching
} from '../actions/index'
import { loadUserAvatar, loadUserProjects, syncUserStore } from '../actions/user'

export function getAuthUser() {
  //prevent red screen of death thrown by a console.error in javascript-client
  /* eslint-disable no-console */
  console.reportErrorsAsExceptions = false

  return () => {
    return new Promise ((resolve, reject) => {
      auth.checkCurrent().then ((user) => {
        return resolve(user)
      }).catch(() => {
        return reject()
      })
    })
  }
}

export function signIn(login, password) {
  return dispatch => {
    dispatch(setIsFetching(true))
    dispatch(setState('loadingText', 'Signing In...'))
    dispatch(setState('errorMessage', null))
    dispatch(checkIsConnected()).then(() => {
      auth.signIn({login: login, password: password}).then((user) => {
        user.isGuestUser = false
        dispatch(setState('user', user))

        return Promise.all([
          dispatch(loadUserAvatar()),
          dispatch(loadUserProjects()),
          dispatch(loadNotificationSettings()),
          dispatch(loadSettings()),
        ])
      }).then(() => {
        dispatch(syncUserStore())
        dispatch(setIsFetching(false))
        Actions.ZooniverseApp({type: ActionConst.RESET})  // Go to home screen
      }).catch((error) => {
        dispatch(setState('errorMessage', error.message))
        dispatch(setIsFetching(false))
      })
    }).catch((error) => {
      dispatch(setState('errorMessage', error))
      dispatch(setIsFetching(false))
    })
  }
}

export function register() {
  return (dispatch, getState) => {
    dispatch(setIsFetching(true))
    dispatch(setState('errorMessage', ''))
    const values={
      login: getState().registration.login,
      password: getState().registration.password,
      email: getState().registration.email,
      credited_name: getState().registration.credited_name,
      global_email_communication: getState().registration.global_email_communication,
    }
    dispatch(checkIsConnected()).then(() => {
      auth.register(values).then((user) => {
        user.avatar = {}
        user.isGuestUser = false
        dispatch(setState('user', user))
        dispatch(syncUserStore())
        dispatch(setIsFetching(false))
        Actions.ZooniverseApp({type: ActionConst.RESET})
      }).catch((error) => {
        dispatch(setState('errorMessage', error.message))
        dispatch(setIsFetching(false))
      })
    }).catch((error) => {
      dispatch(setState('errorMessage', error))
      dispatch(setIsFetching(false))
    })
  }
}


export function signOut() {
  return dispatch => {
    store.delete('@zooniverse:user')
    dispatch(setState('user', {}))
    dispatch(setState('errorMessage', null))
    Actions.SignIn()
  }
}

export function continueAsGuest() {
  return dispatch => {
    dispatch(loadNotificationSettings()).then(() => {
      dispatch(loadSettings()),
      dispatch(setState('user.isGuestUser', true))
      dispatch(syncUserStore())
    })
    Actions.ZooniverseApp({type: ActionConst.RESET})
  }
}
