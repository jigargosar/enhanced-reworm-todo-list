import React from 'react'
import ReactDOM from 'react-dom'
import { ulid } from 'ulid'
import { Provider as RewormProvider } from 'reworm'
import { Value } from 'react-powerplug'
import { Circle, Box, Flex, Provider, Input, Button, Checkbox } from 'rebass'
import styled, { injectGlobal } from 'styled-components'

import { todos, addTodo, completeTodo, toggleCompleted } from './state'

injectGlobal`
  * { box-sizing: border-box; }
  body { margin: 0; }
`

const Complete = styled(Circle)`
  background: ${p => (p.completed ? '#126BEA' : '#ccc')};

  &:hover {
    cursor: pointer;
    background: #126BEA;
  }
`

const Todo = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid #eee;
  border-radius: 3px;
  color: ${p => (p.completed ? '#126BEA' : '#333')};
`

const TodoList = styled(Box)`
  display: flex;
  flex-direction: column;
`

const AddTodo = () => (
  <Value initial="">
    {({ value, set }) => (
      <Flex m={2} mb={1}>
        <Input
          mr={2}
          placeholder="Type something.."
          value={value}
          onChange={ev => set(ev.target.value)}
        />
        <Button
          onClick={() => {
            addTodo({ id: ulid(), text: value, completed: false })
            set('')
          }}
        >
          Add
        </Button>
      </Flex>
    )}
  </Value>
)

const List = ({ show }) => (
  <TodoList>
    {todos.get(state =>
      state.list.map(
        todo =>
          show(state, todo) && (
            <Todo
              mx={2}
              my={1}
              key={todo.text}
              completed={Boolean(todo.completed)}
            >
              {todo.text}
              <Complete onClick={() => completeTodo(todo)}>✓</Complete>
            </Todo>
          )
      )
    )}
  </TodoList>
)

function App() {
  return (
    <RewormProvider>
      <Provider>
        <AddTodo />
        <List show={(state, todo) => !todo.completed} />
        <List show={(state, todo) => state.showCompleted && todo.completed} />
        {todos.get(
          state =>
            state.list.length > 0 && (
              <Flex m={2} mt={1} alignItems="center">
                <Checkbox
                  checked={Boolean(state.showCompleted)}
                  onChange={toggleCompleted}
                />
                Show completed
              </Flex>
            )
        )}
      </Provider>
    </RewormProvider>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
