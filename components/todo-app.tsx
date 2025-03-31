"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TaskItem from "./task-item"
import type { Task } from "@/types/task"

const COOKIE_NAME = "todo_tasks"

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from cookies on mount
  useEffect(() => {
    const savedTasks = Cookies.get(COOKIE_NAME)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to cookies whenever they change
  useEffect(() => {
    Cookies.set(COOKIE_NAME, JSON.stringify(tasks), { expires: 7 }) // Expires in 7 days
  }, [tasks])

  const [newTaskText, setNewTaskText] = useState("")

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskText("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed))
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const uncompletedTasks = tasks.filter((task) => !task.completed)
  const remainingCount = uncompletedTasks.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Добавить новую задачу..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="flex-1"
          data-testid="new-task-input"
        />
        <Button type="submit" data-testid="add-task-button">
          Добавить
        </Button>
      </form>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" data-testid="all-tab">
            Все
          </TabsTrigger>
          <TabsTrigger value="active" data-testid="active-tab">
            Активные
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="completed-tab">
            Завершенные
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)
          ) : (
            <p className="text-center text-gray-500">Задач пока нет. Добавьте одну выше!</p>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-2">
          {uncompletedTasks.length > 0 ? (
            uncompletedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))
          ) : (
            <p className="text-center text-gray-500">Нет активных задач!</p>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-2">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))
          ) : (
            <p className="text-center text-gray-500">Нет завершенных задач!</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600" data-testid="tasks-remaining">
          {remainingCount} {remainingCount === 1 ? "задача" : "задачи"} осталось
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCompleted}
          disabled={completedTasks.length === 0}
          data-testid="clear-completed-button"
        >
          Очистить завершенные
        </Button>
      </div>
    </div>
  )
}

