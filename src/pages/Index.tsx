import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTaskTitle.trim(),
        completed: false
      }]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editingTask && editTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...task, title: editTitle.trim() } : task
      ));
      setEditingTask(null);
      setEditTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Tracker</h1>
          <p className="text-gray-600 mt-2">Добро пожаловать! Управляйте своими задачами эффективно</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Add Task Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Введите новую задачу..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1"
              />
              <Button 
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-6"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить задачу
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="CheckCircle" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Пока нет задач</p>
                <p className="text-gray-400">Добавьте первую задачу, чтобы начать!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="hover:scale-110 transition-transform duration-200"
                      >
                        <Icon 
                          name={task.completed ? "CheckCircle" : "Circle"} 
                          size={20} 
                          className={task.completed ? "text-green-600" : "text-gray-400"} 
                        />
                      </button>
                      <span 
                        className={`flex-1 ${
                          task.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog open={editingTask?.id === task.id} onOpenChange={(open) => !open && setEditingTask(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(task)}
                            className="hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Редактировать задачу</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                              placeholder="Название задачи"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setEditingTask(null)}>
                                Отмена
                              </Button>
                              <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700">
                                Сохранить
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                  <div className="text-gray-600">Всего задач</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.completed).length}
                  </div>
                  <div className="text-gray-600">Выполнено</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {tasks.filter(t => !t.completed).length}
                  </div>
                  <div className="text-gray-600">Осталось</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;