import { FormEventHandler, useState } from 'react';
import './App.css'

function App() {

  interface Task {
    id: number;
    taskName: string;
    isDone: boolean
  }

  const tasksStored = localStorage.getItem("tasks") ?? "";

  const [showAll, setShowAll] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [tasks, setTasks] = useState<Array<Task>>(tasksStored === "" ? [] : JSON.parse(tasksStored))                           //([...tasksEx]);
  const [inputValue, setInputValue] = useState("");

  let tasksTemp = [...tasks];

  const handleNewTask: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (inputValue) {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
      tasks.unshift({ id: newId, taskName: inputValue.substring(0, 25), isDone: false });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      setInputValue("")
    }
  };

  return (
    <>
      <p className="title">todos</p>
      <div className='todos-content'>
        <form className="new-task" onSubmit={handleNewTask}>
          <input className='input-task' placeholder="What needs to be done"
            value={inputValue} onChange={(event) => { setInputValue(event.target.value) }}
            maxLength={25} />
          <img className="arrow-down" src="\arrow.svg" alt="arrow"></img>
        </form>

        {tasks.map((task, ind) =>
          (showAll || (showActive && !task.isDone) || (!showActive && task.isDone)) &&
          <div className="task" key={task.id}>
            <div className={`task-mark ${task.isDone && "task-mark-done"}`}
              onClick={() => {
                tasksTemp = [...tasks];
                tasksTemp[ind].isDone = !tasks[ind].isDone;
                setTasks(tasksTemp);
                localStorage.setItem("tasks", JSON.stringify(tasksTemp));
              }}>✓</div>
            <p className={`task-name ${task.isDone && "task-name-done"}`}>{task.taskName}</p>
          </div>
        )}

        <div className="footer">
          <p className="footer-left">{tasks.filter(task => !task.isDone).length + " items left"}</p>
          <div className="footer-tasks">
            <p className={`footer-all ${showAll && "footer-item-on"}`}
              onClick={() => setShowAll(true)}>All</p>
            <p className={`footer-active ${!showAll && showActive && "footer-item-on"}`}
              onClick={() => { setShowAll(false); setShowActive(true) }}>Active</p>
            <p className={`footer-completed ${!showAll && !showActive && "footer-item-on"}`}
              onClick={() => { setShowAll(false); setShowActive(false) }}>Completed</p>
          </div>
          <p className="footer-clear"
            onClick={() => {
              setTasks(tasks.filter(task => !task.isDone));
              localStorage.setItem("tasks", JSON.stringify(tasks.filter(task => !task.isDone)));
            }}>Clear completed</p>
        </div>
      </div>
      <div className="bottom-line1"></div>
      <div className="bottom-line2"></div>
    </>
  )
}

export default App
