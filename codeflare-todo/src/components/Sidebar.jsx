import React, { useState } from 'react'

export default function Sidebar({ projects, selectedProjectId, onSelectProject, onSelectAll, onAddProject, isOpen, onClose }) {
  const [newProjectName, setNewProjectName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim())
      setNewProjectName('')
      setShowForm(false)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">CodeFlare</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-10">To-Do Manager</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <button
            onClick={() => { onSelectAll(); onClose(); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
              !selectedProjectId
                ? 'bg-orange-50 text-orange-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All To-Do's
            </span>
          </button>

          <div className="mt-4 mb-2 px-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {showForm && (
            <div className="px-2 mb-2">
              <input
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Project name..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                autoFocus
              />
              <div className="flex gap-1 mt-1">
                <button onClick={handleAdd} className="flex-1 px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600">Add</button>
                <button onClick={() => setShowForm(false)} className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200">Cancel</button>
              </div>
            </div>
          )}

          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => { onSelectProject(project.id); onClose(); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${
                selectedProjectId === project.id
                  ? 'bg-orange-50 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {project.name}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
