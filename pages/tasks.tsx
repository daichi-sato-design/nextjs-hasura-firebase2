import { VFC } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLogout } from '../hooks/useLogout'
import { Layout } from '../components/Layout'
import { ChevronDoubleLeftIcon, LogoutIcon } from '@heroicons/react/solid'
import firebase from '../firebaseConfig'
import { NewsListMemo } from '../components/NewsList'

const Tasks: VFC = () => {
  const router = useRouter()
  const { logout } = useLogout()
  const user = firebase.auth().currentUser

  if (!user) return null
  return (
    <Layout title="tasks">
      <p className="my-3">{user?.email}</p>
      {user['emailVerified'] ? (
        <p>メールアドレス認証済み</p>
      ) : (
        <p>メールアドレス未認証</p>
      )}
      <LogoutIcon
        className="h-5 w-5 my-3 text-blue-500 cursor-pointer"
        onClick={() => {
          logout()
          router.push('/')
        }}
      />

      <p className="mt-10 mb-5 text-blue-500 text-xl font-bold">News Edit</p>
      <NewsListMemo />

      <Link href="/">
        <div className="mt-20 flex items-center cursor-pointer">
          <ChevronDoubleLeftIcon className="h-5 w-5 mx-1 text-blue-500" />
          <span>Back to main page</span>
        </div>
      </Link>
    </Layout>
  )
}

export default Tasks
