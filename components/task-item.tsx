"use client"

import { Check, Trash2 } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-md border ${
        task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
      }`}
      data-testid="task-item"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex items-center justify-center w-5 h-5 rounded-full border ${
            task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-gray-400"
          }`}
          data-testid="task-toggle"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>
        <span className={`${task.completed ? "text-gray-500 line-through" : "text-gray-800"}`} data-testid="task-text">
          {task.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        data-testid="task-delete"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

