import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import AddTask from './components/AddTask'
import Tasks from './components/Tasks'
import Footer from './components/Footer'
import About from './components/About'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8000/tasks')
    const data = await res.json()
    return data
  }

  //Fetch TASK
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:8000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  //Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'DELETE',
    })
    res.status === 200
      ? setTasks(tasks.filter((task) => task.id !== id))
      : alert('Error deleting this task')
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    console.log(id)
    const taskToToggle = await fetchTask(id)
    console.log(taskToToggle)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    console.log(updTask)
    const res = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'Nothing to see here.'
                )}
              </>
            }
          />

          <Route
            path="/About"
            element={<About />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
