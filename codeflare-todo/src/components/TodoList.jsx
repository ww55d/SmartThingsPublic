import React from 'react'
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { formatCost } from '../store'
import TodoItem from './TodoItem'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

function groupTodos(todos, groupBy, projects) {
  if (groupBy === 'none') return [{ key: 'all', label: null, items: todos }]

  const groups = {}
  todos.forEach(todo => {
    let key
    switch (groupBy) {
      case 'category':
        key = todo.category || 'Uncategorized'
        break
      case 'partner':
        key = todo.partner || 'No Partner'
        break
      case 'costTier':
        key = formatCost(todo.costTier)
        break
      case 'dueDate': {
        if (!todo.dueDate) {
          key = 'No Due Date'
        } else {
          const d = parseISO(todo.dueDate)
          const now = new Date()
          const weekStart = startOfWeek(now)
          const weekEnd = endOfWeek(now)
          if (d < now && !isWithinInterval(d, { start: weekStart, end: weekEnd })) {
            key = 'Overdue'
          } else if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
            key = 'This Week'
          } else {
            key = format(d, 'MMMM yyyy')
          }
        }
        break
      }
      case 'project': {
        const proj = projects.find(p => p.id === todo.projectId)
        key = proj ? proj.name : 'No Project'
        break
      }
      default:
        key = 'All'
    }
    if (!groups[key]) groups[key] = []
    groups[key].push(todo)
  })

  return Object.entries(groups).map(([key, items]) => ({
    key,
    label: key,
    items,
  }))
}

function sortTodos(todos, sortBy) {
  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      case 'createdAt':
        return (b.createdAt || '').localeCompare(a.createdAt || '')
      case 'category':
        return (a.category || '').localeCompare(b.category || '')
      case 'partner':
        if (!a.partner && !b.partner) return 0
        if (!a.partner) return 1
        if (!b.partner) return -1
        return a.partner.localeCompare(b.partner)
      case 'costTier':
        return b.costTier - a.costTier
      case 'estimatedHours':
        return b.estimatedHours - a.estimatedHours
      case 'title':
        return a.title.localeCompare(b.title)
      case 'order':
      default:
        return a.order - b.order
    }
  })
}

export default function TodoList({
  todos, projects, sortBy, groupBy, showCompleted,
  onToggle, onEdit, onDelete, onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  let filtered = showCompleted ? todos : todos.filter(t => !t.completed)
  let sorted = sortTodos(filtered, sortBy)
  const groups = groupTodos(sorted, groupBy, projects)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    onReorder(active.id, over.id)
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No to-do's yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.key}>
            {group.label && (
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</h3>
                <span className="text-xs text-gray-300">({group.items.length})</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            )}
            <SortableContext items={group.items.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {group.items.map(todo => {
                  const proj = projects.find(p => p.id === todo.projectId)
                  return (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      showDragHandle={sortBy === 'order'}
                      showProject={groupBy !== 'project'}
                      projectName={proj?.name}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}
