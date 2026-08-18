import { generateId } from './store'

export function createSampleData() {
  const projectId = generateId()
  const now = new Date().toISOString()
  const today = new Date()

  function daysFromNow(n) {
    const d = new Date(today)
    d.setDate(d.getDate() + n)
    return d.toISOString().split('T')[0]
  }

  function daysAgo(n) {
    const d = new Date(today)
    d.setDate(d.getDate() - n)
    return d.toISOString().split('T')[0]
  }

  const projects = [
    { id: projectId, name: 'Kitchen Remodel', createdAt: daysAgo(30) },
  ]

  const categories = ['Demolition', 'Drywall', 'Plumbing', 'Electrical', 'Painting', 'Cabinets', 'Flooring', 'Appliances']

  const partners = ['Greg', 'Mike']

  const todos = [
    {
      id: generateId(), title: 'Demo old cabinets', category: 'Demolition',
      dueDate: daysAgo(25), createdAt: daysAgo(30), partner: 'Greg',
      costTier: 1, projectId, order: 0, estimatedHours: 6, completed: true,
    },
    {
      id: generateId(), title: 'Demo old flooring', category: 'Demolition',
      dueDate: daysAgo(23), createdAt: daysAgo(30), partner: 'Greg',
      costTier: 1, projectId, order: 1, estimatedHours: 8, completed: true,
    },
    {
      id: generateId(), title: 'Drywall Wall 1', category: 'Drywall',
      dueDate: daysFromNow(2), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 2, projectId, order: 2, estimatedHours: 4, completed: false,
    },
    {
      id: generateId(), title: 'Drywall Wall 2', category: 'Drywall',
      dueDate: daysFromNow(3), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 2, projectId, order: 3, estimatedHours: 4, completed: false,
    },
    {
      id: generateId(), title: 'Drywall Wall 3', category: 'Drywall',
      dueDate: daysFromNow(4), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 2, projectId, order: 4, estimatedHours: 3, completed: false,
    },
    {
      id: generateId(), title: 'Drywall Wall 4', category: 'Drywall',
      dueDate: daysFromNow(5), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 2, projectId, order: 5, estimatedHours: 3, completed: false,
    },
    {
      id: generateId(), title: 'Tape and Mud - Wall 1', category: 'Drywall',
      dueDate: daysFromNow(7), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 1, projectId, order: 6, estimatedHours: 2, completed: false,
    },
    {
      id: generateId(), title: 'Tape and Mud - Wall 2', category: 'Drywall',
      dueDate: daysFromNow(7), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 1, projectId, order: 7, estimatedHours: 2, completed: false,
    },
    {
      id: generateId(), title: 'Tape and Mud - Wall 3', category: 'Drywall',
      dueDate: daysFromNow(8), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 1, projectId, order: 8, estimatedHours: 2, completed: false,
    },
    {
      id: generateId(), title: 'Tape and Mud - Wall 4', category: 'Drywall',
      dueDate: daysFromNow(8), createdAt: daysAgo(14), partner: 'Greg',
      costTier: 1, projectId, order: 9, estimatedHours: 2, completed: false,
    },
    {
      id: generateId(), title: 'Run electrical for outlets', category: 'Electrical',
      dueDate: daysFromNow(10), createdAt: daysAgo(10), partner: 'Mike',
      costTier: 3, projectId, order: 10, estimatedHours: 8, completed: false,
    },
    {
      id: generateId(), title: 'Install under-cabinet lighting wiring', category: 'Electrical',
      dueDate: daysFromNow(12), createdAt: daysAgo(10), partner: 'Mike',
      costTier: 2, projectId, order: 11, estimatedHours: 3, completed: false,
    },
    {
      id: generateId(), title: 'Rough-in sink plumbing', category: 'Plumbing',
      dueDate: daysFromNow(11), createdAt: daysAgo(10), partner: null,
      costTier: 3, projectId, order: 12, estimatedHours: 6, completed: false,
    },
    {
      id: generateId(), title: 'Install dishwasher water line', category: 'Plumbing',
      dueDate: daysFromNow(14), createdAt: daysAgo(7), partner: null,
      costTier: 2, projectId, order: 13, estimatedHours: 3, completed: false,
    },
    {
      id: generateId(), title: 'Prime walls', category: 'Painting',
      dueDate: daysFromNow(15), createdAt: daysAgo(5), partner: null,
      costTier: 1, projectId, order: 14, estimatedHours: 4, completed: false,
    },
    {
      id: generateId(), title: 'Paint walls - 2 coats', category: 'Painting',
      dueDate: daysFromNow(17), createdAt: daysAgo(5), partner: null,
      costTier: 2, projectId, order: 15, estimatedHours: 6, completed: false,
    },
    {
      id: generateId(), title: 'Lay tile flooring', category: 'Flooring',
      dueDate: daysFromNow(22), createdAt: daysAgo(5), partner: 'Greg',
      costTier: 4, projectId, order: 16, estimatedHours: 16, completed: false,
    },
    {
      id: generateId(), title: 'Grout tile', category: 'Flooring',
      dueDate: daysFromNow(24), createdAt: daysAgo(5), partner: 'Greg',
      costTier: 1, projectId, order: 17, estimatedHours: 4, completed: false,
    },
    {
      id: generateId(), title: 'Install cabinets', category: 'Cabinets',
      dueDate: daysFromNow(28), createdAt: daysAgo(3), partner: 'Greg',
      costTier: 4, projectId, order: 18, estimatedHours: 12, completed: false,
    },
    {
      id: generateId(), title: 'Install countertops', category: 'Cabinets',
      dueDate: daysFromNow(32), createdAt: daysAgo(3), partner: null,
      costTier: 5, projectId, order: 19, estimatedHours: 8, completed: false,
    },
    {
      id: generateId(), title: 'Install sink and faucet', category: 'Plumbing',
      dueDate: daysFromNow(34), createdAt: daysAgo(3), partner: null,
      costTier: 3, projectId, order: 20, estimatedHours: 4, completed: false,
    },
    {
      id: generateId(), title: 'Install dishwasher', category: 'Appliances',
      dueDate: daysFromNow(35), createdAt: daysAgo(2), partner: null,
      costTier: 3, projectId, order: 21, estimatedHours: 3, completed: false,
    },
    {
      id: generateId(), title: 'Install range hood', category: 'Appliances',
      dueDate: daysFromNow(35), createdAt: daysAgo(2), partner: null,
      costTier: 2, projectId, order: 22, estimatedHours: 2, completed: false,
    },
    {
      id: generateId(), title: 'Install under-cabinet lights', category: 'Electrical',
      dueDate: daysFromNow(36), createdAt: daysAgo(2), partner: 'Mike',
      costTier: 2, projectId, order: 23, estimatedHours: 2, completed: false,
    },
  ]

  return { todos, projects, categories, partners }
}
