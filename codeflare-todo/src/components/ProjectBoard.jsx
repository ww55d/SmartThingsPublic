import React from 'react'
import { format, parseISO } from 'date-fns'
import { getCategoryColor, formatCost } from '../store'
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
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableTimelineItem({ todo, cumulativeHours, maxHours, onToggle, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const catColor = getCategoryColor(todo.category)
  const barWidth = maxHours > 0 ? (todo.estimatedHours / maxHours) * 100 : 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-stretch gap-0 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm overflow-hidden ${
        isDragging ? 'dragging opacity-50 z-50' : ''
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Drag handle - mobile friendly slider */}
      <button
        className="drag-handle flex-shrink-0 w-10 sm:w-8 flex items-center justify-center bg-gray-50 border-r border-gray-100 text-gray-300 hover:text-gray-500 hover:bg-gray-100 touch-none"
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

      {/* Content */}
      <div className="flex-1 p-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors ${
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

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {todo.title}
              </span>
              <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-md ${catColor.bg} ${catColor.text}`}>
                {todo.category}
              </span>
              {todo.partner && (
                <span className="text-xs text-indigo-600 flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {todo.partner}
                </span>
              )}
              <span className="text-xs text-green-700 font-medium">{formatCost(todo.costTier)}</span>
            </div>

            {/* Timeline bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`timeline-bar h-full rounded-full ${
                    todo.completed ? 'bg-green-400' : 'bg-gradient-to-r from-orange-400 to-orange-500'
                  }`}
                  style={{ width: `${Math.max(barWidth, 3)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap w-12 text-right">
                {todo.estimatedHours}h
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span>Starts at hour {cumulativeHours}</span>
              {todo.dueDate && (
                <span>Due {format(parseISO(todo.dueDate), 'MMM d')}</span>
              )}
              <button
                onClick={() => onEdit(todo)}
                className="ml-auto text-gray-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectBoard({ project, todos, onToggle, onEdit, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  const sortedTodos = [...todos].sort((a, b) => a.order - b.order)
  const maxHours = Math.max(...sortedTodos.map(t => t.estimatedHours), 1)
  const totalHours = sortedTodos.reduce((sum, t) => sum + t.estimatedHours, 0)
  const completedHours = sortedTodos.filter(t => t.completed).reduce((sum, t) => sum + t.estimatedHours, 0)
  const completedCount = sortedTodos.filter(t => t.completed).length

  let cumulativeHours = 0

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    onReorder(active.id, over.id)
  }

  return (
    <div>
      {/* Project header with stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{sortedTodos.length}</div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalHours}h</div>
            <div className="text-xs text-gray-500">Total Est.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{completedHours}h</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalHours > 0 ? (completedHours / totalHours) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeline & Order of Operations</h3>
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>

      {/* Sortable timeline list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {sortedTodos.map(todo => {
              const startHour = cumulativeHours
              cumulativeHours += todo.estimatedHours
              return (
                <SortableTimelineItem
                  key={todo.id}
                  todo={todo}
                  cumulativeHours={startHour}
                  maxHours={maxHours}
                  onToggle={onToggle}
                  onEdit={onEdit}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Total timeline */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
        <span className="text-sm text-gray-600">
          Total estimated timeline: <strong className="text-orange-600">{totalHours} hours</strong>
          {totalHours >= 8 && (
            <span className="text-gray-400"> (~{Math.round(totalHours / 8 * 10) / 10} work days)</span>
          )}
        </span>
      </div>
    </div>
  )
}
