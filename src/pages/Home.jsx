import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icon components
const ListFilterIcon = getIcon('list-filter');
const GridIcon = getIcon('layout-grid');
const FilterIcon = getIcon('filter');
const CheckSquareIcon = getIcon('check-square');
const ClockIcon = getIcon('clock');
const AlertCircleIcon = getIcon('alert-circle');
const InfoIcon = getIcon('info');

// Task priorities
const PRIORITIES = {
  low: { label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-400' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400' }
};

// Task statuses
const STATUSES = {
  'todo': { label: 'To Do', icon: ClockIcon, color: 'text-blue-500' },
  'in-progress': { label: 'In Progress', icon: InfoIcon, color: 'text-orange-500' },
  'completed': { label: 'Completed', icon: CheckSquareIcon, color: 'text-green-500' },
  'blocked': { label: 'Blocked', icon: AlertCircleIcon, color: 'text-red-500' }
};

const Home = () => {
  // State for tasks, view mode, and filters
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'Design new dashboard layout',
        description: 'Create wireframes and mockups for the new analytics dashboard',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        createdAt: new Date().toISOString(),
        tags: ['design', 'ui/ux']
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Add login, registration, and password reset functionality',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
        createdAt: new Date().toISOString(),
        tags: ['backend', 'security']
      },
      {
        id: '3',
        title: 'Fix navigation responsive issues',
        description: 'The navigation menu breaks on mobile devices',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        createdAt: new Date().toISOString(),
        tags: ['frontend', 'bug']
      }
    ];
  });
  
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Add a new task
  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, taskWithId]);
    toast.success("Task added successfully!");
  };
  
  // Update task status
  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    toast.info(`Task status updated to ${STATUSES[newStatus].label}`);
  };
  
  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };
  
  // Filter tasks by priority
  const filteredTasks = filterPriority === 'all' 
    ? tasks 
    : tasks.filter(task => task.priority === filterPriority);
  
  // Group tasks by status for kanban view
  const tasksByStatus = Object.keys(STATUSES).reduce((acc, status) => {
    acc[status] = filteredTasks.filter(task => task.status === status);
    return acc;
  }, {});
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Organize and track your tasks efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View mode toggle */}
            <div className="flex items-center bg-surface-100 dark:bg-surface-800 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md flex items-center gap-1 ${
                  viewMode === 'kanban' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm' 
                    : 'text-surface-500 dark:text-surface-400'
                }`}
              >
                <GridIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Kanban</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md flex items-center gap-1 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm' 
                    : 'text-surface-500 dark:text-surface-400'
                }`}
              >
                <ListFilterIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">List</span>
              </button>
            </div>
            
            {/* Priority filter */}
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="appearance-none bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg py-2 pl-3 pr-8 text-sm"
              >
                <option value="all">All Priorities</option>
                {Object.keys(PRIORITIES).map(priority => (
                  <option key={priority} value={priority}>
                    {PRIORITIES[priority].label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <FilterIcon className="h-4 w-4 text-surface-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MainFeature 
        onAddTask={handleAddTask} 
        priorities={PRIORITIES}
        statuses={STATUSES}
      />
      
      {/* Task Display - Kanban or List View */}
      <div className="mt-8">
        {viewMode === 'kanban' ? (
          // Kanban View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(STATUSES).map(status => {
              const StatusIcon = STATUSES[status].icon;
              
              return (
                <div key={status} className="task-column">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <StatusIcon className={`w-5 h-5 ${STATUSES[status].color}`} />
                    <h3 className="font-medium">{STATUSES[status].label}</h3>
                    <span className="bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-2 py-0.5 rounded-full text-xs">
                      {tasksByStatus[status].length}
                    </span>
                  </div>
                  
                  <div className="task-column-scroll">
                    <AnimatePresence>
                      {tasksByStatus[status].length === 0 ? (
                        <div className="flex items-center justify-center h-24 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
                          <p className="text-surface-500 dark:text-surface-400 text-sm">No tasks</p>
                        </div>
                      ) : (
                        tasksByStatus[status].map(task => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-3"
                          >
                            <div className="task-card group">
                              <div className="flex justify-between mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${PRIORITIES[task.priority].color}`}>
                                  {PRIORITIES[task.priority].label}
                                </span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {Object.keys(STATUSES)
                                    .filter(s => s !== task.status)
                                    .map(s => {
                                      const Icon = STATUSES[s].icon;
                                      return (
                                        <button
                                          key={s}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateStatus(task.id, s);
                                          }}
                                          className={`p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 ${STATUSES[s].color}`}
                                          title={`Move to ${STATUSES[s].label}`}
                                        >
                                          <Icon className="w-3 h-3" />
                                        </button>
                                      );
                                    })}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTask(task.id);
                                    }}
                                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-red-500"
                                    title="Delete task"
                                  >
                                    {getIcon('trash-2') && React.createElement(getIcon('trash-2'), { className: "w-3 h-3" })}
                                  </button>
                                </div>
                              </div>
                              
                              <h4 className="font-medium mb-1">{task.title}</h4>
                              <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-2">
                                {task.description}
                              </p>
                              
                              <div className="flex justify-between mt-auto pt-2 border-t border-surface-100 dark:border-surface-700">
                                <div className="flex flex-wrap gap-1">
                                  {task.tags && task.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center">
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden shadow-card">
            <div className="grid grid-cols-12 bg-surface-100 dark:bg-surface-700 p-4 text-sm font-medium text-surface-600 dark:text-surface-300">
              <div className="col-span-5 md:col-span-4">Task</div>
              <div className="col-span-3 md:col-span-2">Priority</div>
              <div className="hidden md:block md:col-span-2">Status</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <div className="p-6 text-center text-surface-500 dark:text-surface-400">
                    No tasks found matching your filters
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const StatusIcon = STATUSES[task.status].icon;
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-12 p-4 items-center hover:bg-surface-50 dark:hover:bg-surface-700/50"
                      >
                        <div className="col-span-5 md:col-span-4">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                        
                        <div className="col-span-3 md:col-span-2">
                          <span className={`inline-block text-xs px-2 py-1 rounded-full ${PRIORITIES[task.priority].color}`}>
                            {PRIORITIES[task.priority].label}
                          </span>
                        </div>
                        
                        <div className="hidden md:flex md:col-span-2 items-center gap-1 text-sm">
                          <StatusIcon className={`w-4 h-4 ${STATUSES[task.status].color}`} />
                          <span>{STATUSES[task.status].label}</span>
                        </div>
                        
                        <div className="col-span-2 text-sm text-surface-600 dark:text-surface-400">
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </div>
                        
                        <div className="col-span-2 flex space-x-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                            className="text-xs bg-surface-100 dark:bg-surface-700 border-none rounded p-1"
                          >
                            {Object.keys(STATUSES).map(status => (
                              <option key={status} value={status}>
                                {STATUSES[status].label}
                              </option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700 text-red-500"
                            title="Delete task"
                          >
                            {getIcon('trash-2') && React.createElement(getIcon('trash-2'), { className: "w-4 h-4" })}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;