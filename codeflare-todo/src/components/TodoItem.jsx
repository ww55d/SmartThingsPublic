import React from 'react'
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns'
import { getCategoryColor, formatCost } from '../store'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DragHandle({ listeners, attributes }) {
  return (
    <button
      className="drag-handle flex-shrink-0 w-8 h-10 flex items-center justify-center text-gray-300 hover:text-gray-500 rounded-lg hover:bg-gray-50 touch-none"
      {...listeners}
      {...attributes}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="9" cy="5" r="1.5" />
        <circle cx="15" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="15" cy="19" r="1.5" />
      </svg>
    </button>
  )
}

function formatDueDate(dateStr) {
  if (!dateStr) return null
  const date = parseISO(dateStr)
  if (isToday(date)) return { text: 'Today', className: 'text-orange-600 font-medium' }
  if (isTomorrow(date)) return { text: 'Tomorrow', className: 'text-blue-600' }
  if (isPast(date)) return { text: format(date, 'MMM d'), className: 'text-red-600 font-medium' }
  return { text: format(date, 'MMM d'), className: 'text-gray-500' }
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete, showDragHandle, showProject, projectName }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: !showDragHandle })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const catColor = getCategoryColor(todo.category)
  const due = formatDueDate(todo.dueDate)
  const createdDate = todo.createdAt ? format(parseISO(todo.createdAt), 'MMM d') : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`todo-item group flex items-center gap-2 sm:gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm ${
        isDragging ? 'dragging opacity-50' : ''
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
      {showDragHandle && <DragHandle listeners={listeners} attributes={attributes} />}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-orange-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {todo.title}
          </span>
          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-md ${catColor.bg} ${catColor.text}`}>
            {todo.category}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {due && (
            <span className={`text-xs ${due.className} flex items-center gap-1`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {due.text}
            </span>
          )}
          <span className="text-xs text-gray-400">Added {createdDate}</span>
          {todo.partner && (
            <span className="text-xs text-indigo-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {todo.partner}
            </span>
          )}
          <span className="text-xs text-green-700 font-medium">{formatCost(todo.costTier)}</span>
          <span className="text-xs text-gray-400">{todo.estimatedHours}h</span>
          {showProject && projectName && (
            <span className="text-xs text-purple-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {projectName}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-orange-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
