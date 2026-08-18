import React, { useState, useEffect } from 'react'
import { COST_TIERS } from '../store'

export default function TodoForm({ todo, projects, categories, partners, onSave, onCancel }) {
  const isEdit = !!todo

  const [form, setForm] = useState({
    title: '',
    category: categories[0] || '',
    dueDate: '',
    partner: '',
    costTier: 1,
    projectId: '',
    estimatedHours: 1,
  })

  const [newCategory, setNewCategory] = useState('')
  const [newPartner, setNewPartner] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [showNewPartner, setShowNewPartner] = useState(false)

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title,
        category: todo.category,
        dueDate: todo.dueDate || '',
        partner: todo.partner || '',
        costTier: todo.costTier,
        projectId: todo.projectId || '',
        estimatedHours: todo.estimatedHours,
      })
    }
  }, [todo])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      title: form.title.trim(),
      partner: form.partner || null,
      dueDate: form.dueDate || null,
      projectId: form.projectId || null,
    })
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="modal-content bg-white w-full sm:w-[480px] sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit To-Do' : 'New To-Do'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="px-3 py-2 text-xs text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50"
                >
                  + New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category..."
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCategory.trim()) {
                      update('category', newCategory.trim())
                      setNewCategory('')
                      setShowNewCategory(false)
                    }
                  }}
                  className="px-3 py-2 text-xs bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => update('dueDate', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Hours</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.estimatedHours}
                onChange={e => update('estimatedHours', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
            </div>
          </div>

          {/* Partner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
            {!showNewPartner ? (
              <div className="flex gap-2">
                <select
                  value={form.partner}
                  onChange={e => update('partner', e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm bg-white"
                >
                  <option value="">No partner</option>
                  {partners.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewPartner(true)}
                  className="px-3 py-2 text-xs text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50"
                >
                  + New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPartner}
                  onChange={e => setNewPartner(e.target.value)}
                  placeholder="Partner name..."
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPartner.trim()) {
                      update('partner', newPartner.trim())
                      setNewPartner('')
                      setShowNewPartner(false)
                    }
                  }}
                  className="px-3 py-2 text-xs bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPartner(false)}
                  className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Cost Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost: <span className="text-orange-600 font-semibold">{COST_TIERS.find(t => t.value === form.costTier)?.label}</span>
            </label>
            <div className="flex gap-1">
              {COST_TIERS.map(tier => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => update('costTier', tier.value)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                    form.costTier === tier.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={form.projectId}
              onChange={e => update('projectId', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm bg-white"
            >
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors text-sm"
            >
              {isEdit ? 'Update' : 'Add To-Do'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
