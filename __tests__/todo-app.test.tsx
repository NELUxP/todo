import { render, screen, fireEvent } from "@testing-library/react"
import TodoApp from "@/components/todo-app"
import "@testing-library/jest-dom"

describe("TodoApp", () => {
  test("should add a new task", () => {
    render(<TodoApp />)

    // Add a new task
    const input = screen.getByTestId("new-task-input")
    const addButton = screen.getByTestId("add-task-button")

    fireEvent.change(input, { target: { value: "Test task" } })
    fireEvent.click(addButton)

    // Check if task was added
    expect(screen.getByTestId("task-text")).toHaveTextContent("Test task")
    expect(screen.getByTestId("tasks-remaining")).toHaveTextContent("1 task remaining")
  })

  test("should toggle task completion status", () => {
    render(<TodoApp />)

    // Add a task
    const input = screen.getByTestId("new-task-input")
    const addButton = screen.getByTestId("add-task-button")

    fireEvent.change(input, { target: { value: "Toggle test" } })
    fireEvent.click(addButton)

    // Toggle task completion
    const toggleButton = screen.getByTestId("task-toggle")
    fireEvent.click(toggleButton)

    // Check if task was marked as completed
    expect(screen.getByTestId("task-text")).toHaveClass("text-gray-500")
    expect(screen.getByTestId("task-text")).toHaveClass("line-through")
    expect(screen.getByTestId("tasks-remaining")).toHaveTextContent("0 tasks remaining")

    // Toggle back to incomplete
    fireEvent.click(toggleButton)
    expect(screen.getByTestId("task-text")).not.toHaveClass("line-through")
    expect(screen.getByTestId("tasks-remaining")).toHaveTextContent("1 task remaining")
  })

  test("should delete a task", () => {
    render(<TodoApp />)

    // Add a task
    const input = screen.getByTestId("new-task-input")
    const addButton = screen.getByTestId("add-task-button")

    fireEvent.change(input, { target: { value: "Delete test" } })
    fireEvent.click(addButton)

    // Delete the task
    const deleteButton = screen.getByTestId("task-delete")
    fireEvent.click(deleteButton)

    // Check if task was deleted
    expect(screen.queryByTestId("task-item")).not.toBeInTheDocument()
    expect(screen.getByTestId("tasks-remaining")).toHaveTextContent("0 tasks remaining")
  })

  test("should filter tasks correctly", () => {
    render(<TodoApp />)

    // Add two tasks
    const input = screen.getByTestId("new-task-input")
    const addButton = screen.getByTestId("add-task-button")

    fireEvent.change(input, { target: { value: "Task 1" } })
    fireEvent.click(addButton)

    fireEvent.change(input, { target: { value: "Task 2" } })
    fireEvent.click(addButton)

    // Complete the first task
    const toggleButtons = screen.getAllByTestId("task-toggle")
    fireEvent.click(toggleButtons[0])

    // Check active tab
    const activeTab = screen.getByTestId("active-tab")
    fireEvent.click(activeTab)

    const taskItems = screen.getAllByTestId("task-item")
    expect(taskItems.length).toBe(1)
    expect(screen.getByTestId("task-text")).toHaveTextContent("Task 2")

    // Check completed tab
    const completedTab = screen.getByTestId("completed-tab")
    fireEvent.click(completedTab)

    expect(screen.getByTestId("task-text")).toHaveTextContent("Task 1")
  })

  test("should clear completed tasks", () => {
    render(<TodoApp />)

    // Add two tasks
    const input = screen.getByTestId("new-task-input")
    const addButton = screen.getByTestId("add-task-button")

    fireEvent.change(input, { target: { value: "Task 1" } })
    fireEvent.click(addButton)

    fireEvent.change(input, { target: { value: "Task 2" } })
    fireEvent.click(addButton)

    // Complete the first task
    const toggleButtons = screen.getAllByTestId("task-toggle")
    fireEvent.click(toggleButtons[0])

    // Clear completed tasks
    const clearButton = screen.getByTestId("clear-completed-button")
    fireEvent.click(clearButton)

    // Check if completed task was removed
    const allTab = screen.getByTestId("all-tab")
    fireEvent.click(allTab)

    const taskItems = screen.getAllByTestId("task-item")
    expect(taskItems.length).toBe(1)
    expect(screen.getByTestId("task-text")).toHaveTextContent("Task 2")
  })
})

