import React, { useState, useEffect, useCallback } from 'react'
import { loadData, saveData, generateId } from './store'
import { createSampleData } from './sampleData'
import Sidebar from './components/Sidebar'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import ProjectBoard from './components/ProjectBoard'

function initData() {
  const saved = loadData()
  if (saved && saved.todos && saved.todos.length > 0) return saved
  return createSampleData()
}

export default function App() {
  const [data, setData] = useState(initData)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Filter/sort state
  const [sortBy, setSortBy] = useState('order')
  const [groupBy, setGroupBy] = useState('none')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPartner, setFilterPartner] = useState('')
  const [filterCost, setFilterCost] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)

  // Persist data
  useEffect(() => {
    saveData(data)
  }, [data])

  // Derive unique categories and partners from data
  const allCategories = [...new Set(data.todos.map(t => t.category).filter(Boolean)), ...data.categories || []]
  const uniqueCategories = [...new Set(allCategories)]
  const allPartners = [...new Set(data.todos.map(t => t.partner).filter(Boolean)), ...data.partners || []]
  const uniquePartners = [...new Set(allPartners)]

  // Get filtered todos
  const getVisibleTodos = useCallback(() => {
    let todos = data.todos

    // Filter by project if selected
    if (selectedProjectId) {
      todos = todos.filter(t => t.projectId === selectedProjectId)
    }

    // Apply filters
    if (filterCategory) {
      todos = todos.filter(t => t.category === filterCategory)
    }
    if (filterPartner) {
      if (filterPartner === '__none__') {
        todos = todos.filter(t => !t.partner)
      } else {
        todos = todos.filter(t => t.partner === filterPartner)
      }
    }
    if (filterCost) {
      todos = todos.filter(t => t.costTier === parseInt(filterCost))
    }

    return todos
  }, [data.todos, selectedProjectId, filterCategory, filterPartner, filterCost])

  // CRUD operations
  const addTodo = (formData) => {
    const maxOrder = data.todos.length > 0 ? Math.max(...data.todos.map(t => t.order)) + 1 : 0
    const newTodo = {
      id: generateId(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      order: maxOrder,
      completed: false,
    }
    const newCategories = formData.category && !uniqueCategories.includes(formData.category)
      ? [...(data.categories || []), formData.category]
      : data.categories
    const newPartners = formData.partner && !uniquePartners.includes(formData.partner)
      ? [...(data.partners || []), formData.partner]
      : data.partners

    setData(prev => ({
      ...prev,
      todos: [...prev.todos, newTodo],
      categories: newCategories,
      partners: newPartners,
    }))
    setShowForm(false)
  }

  const updateTodo = (formData) => {
    const newCategories = formData.category && !uniqueCategories.includes(formData.category)
      ? [...(data.categories || []), formData.category]
      : data.categories
    const newPartners = formData.partner && !uniquePartners.includes(formData.partner)
      ? [...(data.partners || []), formData.partner]
      : data.partners

    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === editingTodo.id ? { ...t, ...formData } : t),
      categories: newCategories,
      partners: newPartners,
    }))
    setEditingTodo(null)
  }

  const deleteTodo = (id) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id),
    }))
  }

  const toggleTodo = (id) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    }))
  }

  const reorderTodos = (activeId, overId) => {
    setData(prev => {
      const todos = [...prev.todos]
      const activeIdx = todos.findIndex(t => t.id === activeId)
      const overIdx = todos.findIndex(t => t.id === overId)
      if (activeIdx === -1 || overIdx === -1) return prev

      const [moved] = todos.splice(activeIdx, 1)
      todos.splice(overIdx, 0, moved)

      // Re-assign order values
      const updated = todos.map((t, i) => ({ ...t, order: i }))
      return { ...prev, todos: updated }
    })
  }

  const addProject = (name) => {
    const newProject = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    }
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const visibleTodos = getVisibleTodos()
  const selectedProject = data.projects.find(p => p.id === selectedProjectId)
  const totalTodos = data.todos.length
  const completedTodos = data.todos.filter(t => t.completed).length

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        projects={data.projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onSelectAll={() => setSelectedProjectId(null)}
        onAddProject={addProject}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {selectedProject ? selectedProject.name : "All To-Do's"}
                </h1>
                <p className="text-xs text-gray-500">
                  {completedTodos}/{totalTodos} completed
                </p>
              </div>
            </div>

            {/* Add button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add To-Do</span>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="px-4 sm:px-6 py-4 max-w-4xl">
          {selectedProject ? (
            /* Project board view with timeline + drag-drop */
            <ProjectBoard
              project={selectedProject}
              todos={visibleTodos}
              onToggle={toggleTodo}
              onEdit={(todo) => setEditingTodo(todo)}
              onReorder={reorderTodos}
            />
          ) : (
            /* All todos list view */
            <>
              <FilterBar
                categories={uniqueCategories}
                partners={uniquePartners}
                sortBy={sortBy}
                setSortBy={setSortBy}
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterPartner={filterPartner}
                setFilterPartner={setFilterPartner}
                filterCost={filterCost}
                setFilterCost={setFilterCost}
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
              />
              <TodoList
                todos={visibleTodos}
                projects={data.projects}
                sortBy={sortBy}
                groupBy={groupBy}
                showCompleted={showCompleted}
                onToggle={toggleTodo}
                onEdit={(todo) => setEditingTodo(todo)}
                onDelete={deleteTodo}
                onReorder={reorderTodos}
              />
            </>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showForm || editingTodo) && (
        <TodoForm
          todo={editingTodo}
          projects={data.projects}
          categories={uniqueCategories}
          partners={uniquePartners}
          onSave={editingTodo ? updateTodo : addTodo}
          onCancel={() => { setShowForm(false); setEditingTodo(null); }}
        />
      )}
    </div>
  )
}
