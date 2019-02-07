#!/usr/bin/env node
const chalk = require('chalk')
const {
  showTodo,
  newTodo,
  editTodo,
  deleteTodo,
  help,
  ask
} = require ('./questions')


function _handleError(error) {
  console.log(chalk.red('\n[ERROR]', error))
  return Promise.resolve()
}

function interactive () {
  return ask()
    .catch(_handleError)
    .then(interactive)
}

if (process.argv.length > 3) {
  console.log(chalk.red.bold('Invalid arguments'))
  help()
  process.exit(1)
}

switch (process.argv[2]) {
  case 'show':
    showTodo()
    break
  case 'new':
    newTodo()
    break
  case 'edit':
    editTodo()
    break
  case 'delete':
    deleteTodo()
    break
  case 'help':
    help()
    break
  default:
    interactive()
}
