import { renderTodos, getTodoId, clearNewTodoInput } from "./ui";
import { addTodo, getAllTodos, removeTodo, updateTodo } from "./data";
import { capitalize } from "lodash";
import { trim } from "./helpers";

export function onLoadEventHandler() {
  renderTodos(getAllTodos());
}

export function newTodoEventHandler(event) {
  let text = event.target.value;
  text = capitalize(trim(text));
  addTodo({
    id: Date.now(),
    text: text,
    completed: false,
  });
  renderTodos(getAllTodos());
  clearNewTodoInput();
}

export function removeTodoEventHandler(event) {
  const id = getTodoId(event.target);
  removeTodo(id);
  renderTodos(getAllTodos());
}

export function toggleTodoEventListener(event) {
  const id = getTodoId(event.target);
  const isCompleted = event.target.checked;
  updateTodo(id, isCompleted);
  renderTodos(getAllTodos());
}
