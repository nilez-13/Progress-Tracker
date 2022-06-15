import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const initial = ["Walk dog", "Sweep floors", "Do homework"];

export default function App() {
  const [todos, setTodos] = useState(initial);

  return (
    <TransitionGroup component="ul">
      {todos.map((todo) => (
        <CSSTransition key={todo} timeout={700} classNames="item">
          <li>
            {todo}{" "}
            <button
              onClick={() => {
                setTodos(todos.filter((t) => t !== todo));
              }}
            >
              Delete
            </button>
          </li>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
