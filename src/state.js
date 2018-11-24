import { create } from 'reworm'
import produce from 'immer'

export const todos = create({
  showCompleted: false,
  list: []
})

export const addTodo = item =>
  todos.set(
    produce(state => {
      state.list.push(item)
    })
  )

export const completeTodo = todo => {
  todos.set(
    produce(state => {
      const item = state.list.find(item => item.id === todo.id)
      item.completed = !!!item.completed
    })
  )
}

export const toggleCompleted = () => {
  todos.set(
    produce(state => {
      state.showCompleted = !state.showCompleted
    })
  )
}
