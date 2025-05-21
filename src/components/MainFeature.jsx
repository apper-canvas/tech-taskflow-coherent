import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Icon components
const PlusIcon = getIcon('plus');
const XIcon = getIcon('x');
const CheckIcon = getIcon('check');
const CalendarIcon = getIcon('calendar');
const AlertCircleIcon = getIcon('alert-circle');
const HashIcon = getIcon('hash');
const ClockIcon = getIcon('clock');
const CircleIcon = getIcon('circle'); 
const ListFilterIcon = getIcon('list-filter');
const EditIcon = getIcon('edit-3');

const MainFeature = ({ onAddTask, priorities, statuses }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentTags, setCurrentTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    tags: []
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
      tags: []
    });
    setCurrentTags([]);
    setFormErrors({});
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setCurrentTags([...currentTags, newTag.trim()]);
      setNewTag('');
    } else if (currentTags.includes(newTag.trim())) {
      toast.warning("This tag already exists!");
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      if (isNaN(selectedDate.getTime())) {
        errors.dueDate = "Invalid date format";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const newTask = {
      ...formData,
      tags: currentTags,
      dueDate: new Date(formData.dueDate).toISOString()
    };
    
    onAddTask(newTask);
    resetForm();
    setIsFormOpen(false);
  };
  
  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ListFilterIcon className="w-5 h-5 text-primary" />
              <span>Task Management</span>
            </h2>
            <p className="text-surface-600 dark:text-surface-400 text-sm">
              Create and organize your tasks efficiently
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center justify-center gap-2 py-2.5"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Task</span>
          </motion.button>
        </div>
        
        <div className="p-6 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/30 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <EditIcon className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Manage Your Tasks</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                Create tasks, assign priorities, set due dates, and track progress all in one place.
                Use the Kanban board or list view to visualize your workflow.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Task Form Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/50 dark:bg-surface-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-lg font-semibold">Create New Task</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Enter task title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircleIcon className="w-3 h-3" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className={`input resize-none ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Describe the task in detail"
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircleIcon className="w-3 h-3" />
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Priority & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="input pr-8 appearance-none cursor-pointer"
                        >
                          {Object.keys(priorities).map(priority => (
                            <option key={priority} value={priority}>
                              {priorities[priority].label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500">
                          <CircleIcon className={`w-4 h-4 ${
                            formData.priority === 'low' ? 'text-green-500' :
                            formData.priority === 'medium' ? 'text-blue-500' :
                            formData.priority === 'high' ? 'text-orange-500' :
                            'text-red-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="input pr-8 appearance-none cursor-pointer"
                        >
                          {Object.keys(statuses).map(status => (
                            <option key={status} value={status}>
                              {statuses[status].label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500">
                          {React.createElement(statuses[formData.status].icon, { 
                            className: `w-4 h-4 ${statuses[formData.status].color}` 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`input pl-9 ${formErrors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="w-4 h-4 text-surface-500" />
                      </div>
                    </div>
                    {formErrors.dueDate && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircleIcon className="w-3 h-3" />
                        {formErrors.dueDate}
                      </p>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">
                      Tags
                    </label>
                    <div className="flex items-center">
                      <div className="relative flex-grow">
                        <input
                          id="newTag"
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="input pl-8"
                          placeholder="Add a tag and press Enter"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <HashIcon className="w-4 h-4 text-surface-500" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 p-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {currentTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <AnimatePresence>
                          {currentTags.map(tag => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="inline-flex items-center bg-primary/10 dark:bg-primary/20 text-primary rounded-full px-2.5 py-1 text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1.5 rounded-full hover:bg-primary/20 p-0.5"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  
                  {/* Estimated Time */}
                  <div>
                    <label htmlFor="estimatedTime" className="block text-sm font-medium mb-1">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-surface-500" />
                        <span>Estimated Completion Time</span>
                      </div>
                    </label>
                    <div className="flex items-center gap-4 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                      {['1h', '2h', '4h', '1d', '2d', '1w'].map(time => (
                        <button
                          key={time}
                          type="button"
                          className="px-3 py-1.5 rounded-md text-sm hover:bg-surface-200 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <CheckIcon className="w-5 h-5" />
                    <span>Create Task</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainFeature;