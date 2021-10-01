import { useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { GraphQLClient } from 'graphql-request'
import Cookie from 'universal-cookie'
import { useDispatch } from 'react-redux'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'

import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  CREATE_NEWS,
  UPDATE_NEWS,
  DELETE_NEWS,
} from '../queries/queries'
import { Task, EditTask, News, EditNews } from '../types/types'

const cookie = new Cookie()
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT

let graphQLClient: GraphQLClient

export const useAppMutate = () => {
  const dispatch = useDispatch()
  // Cacheの更新
  const queryClient = useQueryClient()

  // Cookie('token')が変わると再度実行させる
  useEffect(() => {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
  }, [cookie.get('token')])

  const createTaskMutation = useMutation(
    (title: string) => graphQLClient.request(CREATE_TASK, { title }),
    {
      onSuccess: (res) => {
        // 既存のCache(key: tasks)のを取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          // Cache(key; tasks)の上書き[新しいTaskをCacheに追加]
          queryClient.setQueryData('tasks', [
            ...previousTodos,
            res.insert_tasks_one,
          ])
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      },
    }
  )

  const updateTaskMutation = useMutation(
    (task: EditTask) => graphQLClient.request(UPDATE_TASK, task),
    {
      onSuccess: (res, variables) => {
        // 既存のCache(key: tasks)のを取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          // Cache(key; tasks)の上書き[idが一致したTaskのみCacheを上書き]
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.update_tasks_by_pk : task
            )
          )
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      },
    }
  )

  const deleteTaskMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_TASK, { id }),
    {
      onSuccess: (_, variables) => {
        // 既存のCache(key: tasks)のを取得
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          // Cache(key; tasks)の上書き[idが一致しないものを抽出しCacheを上書き]
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      },
    }
  )

  const createNewsMutation = useMutation(
    (content: string) => graphQLClient.request(CREATE_NEWS, { content }),
    {
      onSuccess: (res) => {
        // 既存のCache(key: news)のを取得
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          // Cache(key; news)の上書き[新しいNewsをCacheに追加]
          queryClient.setQueryData('news', [
            ...previousNews,
            res.insert_news_one,
          ])
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      },
    }
  )

  const updateNewsMutation = useMutation(
    (news: EditNews) => graphQLClient.request(UPDATE_NEWS, news),
    {
      onSuccess: (res, variable) => {
        // 既存のCache(key: news)のを取得
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          // Cache(key; news)の上書き[idが一致したNewsのみCacheを上書き]
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.map((news) =>
              news.id === variable.id ? res.update_news_by_pk : news
            )
          )
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      },
    }
  )

  const deleteNewsMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_NEWS, { id }),
    {
      onSuccess: (_, variable) => {
        // 既存のCache(key: news)のを取得
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          // Cache(key; news)の上書き[idが一致しないものを抽出しCacheを上書き]
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.filter((news) => news.id !== variable)
          )
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      },
    }
  )

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  }
}
