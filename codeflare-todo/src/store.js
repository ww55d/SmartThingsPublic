const STORAGE_KEY = 'codeflare-todo-data'

const defaultState = {
  todos: [],
  projects: [],
  categories: [],
  partners: [],
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return null
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export const COST_TIERS = [
  { value: 1, label: '$', description: 'Minimal' },
  { value: 2, label: '$$', description: 'Low' },
  { value: 3, label: '$$$', description: 'Medium' },
  { value: 4, label: '$$$$', description: 'High' },
  { value: 5, label: '$$$$$', description: 'Premium' },
]

export const CATEGORY_COLORS = {
  'Drywall': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  'Plumbing': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  'Electrical': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  'Painting': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  'Cabinets': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'Flooring': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  'Appliances': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  'Demolition': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  'General': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
}

export function formatCost(tier) {
  return COST_TIERS.find(t => t.value === tier)?.label || '$'
}
