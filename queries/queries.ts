import { gql } from 'graphql-request'

// GET_NEWS すべてのNewsを取得
export const GET_NEWS = gql`
  query GetNews {
    news {
      id
      content
      created_at
    }
  }
`
// CREATE_NEWS 新しいNewsを作成
export const CREATE_NEWS = gql`
  mutation CreateNews($content: String!) {
    insert_news_one(object: { content: $content }) {
      id
      content
      created_at
    }
  }
`
// CREATE_NEWS Newsのcontentを更新
export const UPDATE_NEWS = gql`
  mutation UpdateNews($id: uuid!, $content: String!) {
    update_news_by_pk(pk_columns: { id: $id }, _set: { content: $content }) {
      id
      content
      created_at
    }
  }
`
// DELETE_NEWS Newsを削除
export const DELETE_NEWS = gql`
  mutation DeleteNews($id: uuid!) {
    delete_news_by_pk(id: $id) {
      id
      content
    }
  }
`

// GET_TASKS すべてのTaskを取得
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      created_at
      user_id
    }
  }
`
// CREATE_TASK 新しいTaskを作成
export const CREATE_TASK = gql`
  mutation CreateTask($title: String!) {
    insert_tasks_one(object: { title: $title }) {
      id
      title
      created_at
      user_id
    }
  }
`
// UPDATE_TAKS Taskのtitleを更新
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: uuid!, $title: String!) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
      created_at
      user_id
    }
  }
`
// DELETE_TASK Taskを削除
export const DELETE_TASK = gql`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
      title
    }
  }
`
