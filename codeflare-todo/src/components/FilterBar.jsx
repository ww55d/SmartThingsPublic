import React from 'react'
import { COST_TIERS } from '../store'

export default function FilterBar({
  categories, partners,
  sortBy, setSortBy,
  groupBy, setGroupBy,
  filterCategory, setFilterCategory,
  filterPartner, setFilterPartner,
  filterCost, setFilterCost,
  showCompleted, setShowCompleted,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Sort */}
        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-gray-500">Sort:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="order">Manual Order</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Date Added</option>
            <option value="category">Category</option>
            <option value="partner">Partner</option>
            <option value="costTier">Cost</option>
            <option value="estimatedHours">Est. Time</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Group */}
        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-gray-500">Group:</label>
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="partner">Partner</option>
            <option value="costTier">Cost</option>
            <option value="dueDate">Due Date</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* Filter: Category */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Filter: Partner */}
        <select
          value={filterPartner}
          onChange={e => setFilterPartner(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Partners</option>
          <option value="__none__">No Partner</option>
          {partners.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Filter: Cost */}
        <select
          value={filterCost}
          onChange={e => setFilterCost(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All Costs</option>
          {COST_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* Show completed */}
        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={e => setShowCompleted(e.target.checked)}
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-300"
          />
          Show completed
        </label>
      </div>
    </div>
  )
}
