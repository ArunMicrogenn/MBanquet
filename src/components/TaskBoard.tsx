import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, MoreVertical, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  bookingRef: string;
  assignee: string;
  status: 'pending' | 'completed';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

const mockTasks: Task[] = [
  { id: '1', title: 'Setup Chairs (500 pax)', bookingRef: 'BK-2026-001', assignee: 'Rajesh', status: 'pending', dueDate: 'Today, 2:00 PM', priority: 'High' },
  { id: '2', title: 'Confirm Catering Menu', bookingRef: 'BK-2026-002', assignee: 'Priya', status: 'completed', dueDate: 'Yesterday', priority: 'Medium' },
  { id: '3', title: 'Audio/Visual Check', bookingRef: 'BK-2026-003', assignee: 'Amit', status: 'pending', dueDate: 'Tomorrow, 10:00 AM', priority: 'Low' },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskBooking, setNewTaskBooking] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Unassigned');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      bookingRef: newTaskBooking || 'Internal',
      assignee: newTaskAssignee,
      status: 'pending',
      dueDate: 'No Date',
      priority: newTaskPriority
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskBooking('');
    setNewTaskAssignee('Unassigned');
    setNewTaskPriority('Medium');
  };

  return (
    <div className="h-full bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Operational Tasks</h3>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {tasks.filter(t => t.status === 'pending').length} Pending
        </div>
      </div>
      
      <div className="p-3 border-b border-slate-100 bg-slate-50">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Add new task..." 
            value={newTaskTitle}
            onChange={(e: any) => setNewTaskTitle(e.target.value)}
            className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-400"
          />
          <input 
            type="text" 
            placeholder="Booking Ref" 
            value={newTaskBooking}
            onChange={(e: any) => setNewTaskBooking(e.target.value)}
            className="w-24 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-400"
          />
          <select 
            className="w-24 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-400 bg-white"
            onChange={(e: any) => setNewTaskAssignee(e.target.value)}
            value={newTaskAssignee}
          >
            <option value="Unassigned">Assign</option>
            <option value="Rajesh">Rajesh</option>
            <option value="Priya">Priya</option>
            <option value="Amit">Amit</option>
            <option value="John">John</option>
          </select>
          <select 
            className="w-20 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-400 bg-white"
            onChange={(e: any) => setNewTaskPriority(e.target.value)}
            value={newTaskPriority}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors">
            <Plus size={16} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-start gap-3 p-3 border rounded-lg transition-colors group ${task.status === 'completed' ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
              <button 
                onClick={() => handleToggleStatus(task.id)}
                className={`mt-0.5 flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
              >
                {task.status === 'completed' ? <CheckCircle size={18} /> : <Circle size={18} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {task.priority || 'Medium'}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    {task.bookingRef}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Assignee: <span className="font-medium text-slate-700">{task.assignee}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    • Due: {task.dueDate}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No tasks added yet. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
