import Cookie from 'universal-cookie'
import firebase from '../firebaseConfig'
import { unSubMeta } from './useUserChanged'
import { useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'

const cookie = new Cookie()

export const useLogout = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const logout = async () => {
    if (unSubMeta) {
      unSubMeta()
    }
    await firebase.auth().signOut()
    dispatch(resetEditedTask())
    dispatch(resetEditedNews())
    queryClient.resetQueries('tasks')
    queryClient.resetQueries('news')
    cookie.remove('token')
  }

  return { logout }
}
