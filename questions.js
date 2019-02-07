const inquirer = require('inquirer')
const db = require('@z-todo/db')
const chalk = require('chalk')

function newTodo () {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'todo',
        message: 'What do you have TODO ? ',
        validate: input => !input ? 'You must have something TODO...' : true
      },
      {
        type: 'confirm',
        name: 'complete',
        message: 'Is this TODO already complete ?',
        default: false
      }
    ])
    .then(db.add)
}

function showTodo () {
  const todos = db.getAll()

  return inquirer
    .prompt(
      {
        type: 'checkbox',
        name: 'completed',
        message: 'Here is what is left TODO :',
        choices: todos.map(todo => {
          return {
            name: todo.todo,
            checked: todo.complete,
            value: todo.id
          }
        })
      }
    )
    .then(answer => {
      return db.override(todos.map(todo => {
        todo.complete = answer.completed.includes(todo.id)
        return todo
      }))
    })
}

function editTodo () {
  const todos = db.getAll()

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Which TODO do you want to edit ?',
        choices: todos.map(todo => {
          return {
            name: todo.todo,
            value: todo.id
          }
        })
      },
      {
        type: 'input',
        name: 'todo',
        message: 'What do you have TODO ? ',
        default: prompted => (todos.find(todo => todo.id === prompted.id) || {}).todo,
        validate: input => !input ? 'You must have something TODO...' : true
      },
      {
        type: 'confirm',
        name: 'complete',
        message: 'Is this TODO already complete ?',
        default: prompted => (todos.find(todo => todo.id === prompted.id) || {}).complete,
      }
    ])
    .then(answers => {
      return db.update(answers)
    })
}

function deleteTodo () {
  const todos = db.getAll()

  return inquirer
    .prompt(
      {
        type: 'checkbox',
        name: 'deleted',
        message: 'Never see those TODO again :',
        choices: todos.map(todo => {
          return {
            name: todo.todo,
            value: todo.id
          }
        })
      }
    )
    .then(answer => {
      db.override(todos.filter(todo => !answer.deleted.includes(todo.id)))
    })
}

function ask () {
  return inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want TODO now ?',
      choices: ['show', 'new', 'edit', 'delete', 'help', 'quit']
    })
    .then(answer => {
      switch (answer.action) {
        case 'show':
          return showTodo()
          break
        case 'new':
          return newTodo()
          break
        case 'edit':
          return editTodo()
          break
        case 'delete':
          return deleteTodo()
          break
        case 'help':
          console.log(chalk.yellow('\n------------\n'))
          return help()
          break
        case 'quit':
        console.log(chalk.yellow('\n------------\n'))
        console.log(chalk.magenta('See you soon with more things TODO!'))
          process.exit()
      }
    })
    .then(() => console.log(chalk.yellow('\n------------\n')))
}

function help () {
  console.log([
    '',
    chalk.inverse.bold('Welcome to z-todo-cli, where there are often things TODO.'),
    '',
    chalk.bold('Usage :'),
    ' '+chalk.green.bold('>_')+' todo',
    '     interactive mode',
    '',
    ' '+chalk.green.bold('>_')+' todo '+chalk.cyan('<command>'),
    '     '+chalk.cyan('show')+'    : display the todo list',
    '     '+chalk.cyan('new')+'     : create a new todo to the list',
    '     '+chalk.cyan('edit')+'    : edit a todo of the list',
    '     '+chalk.cyan('delete')+'  : delete a todo from the list',
    '     '+chalk.cyan('help')+'    : display this help',
    ''
  ].join('\n'))
}

module.exports = {
  showTodo,
  newTodo,
  editTodo,
  deleteTodo,
  help,
  ask
}
