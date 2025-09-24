import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';                                                                                                                                                                                                                                                      
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../lib/api.js';

const TodoList = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const task = await tasksAPI.createTask(newTask);
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      const updatedTask = await tasksAPI.updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
      });
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleToggleCompleted = async (id) => {
    try {
      const updatedTask = await tasksAPI.toggleCompleted(id);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await tasksAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const startEdit = (task) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 overflow-auto">
      <div className="max-w-4xl w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0 border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Minhas Tarefas</h1>
            <p className="text-black mt-1">Organize suas atividades diárias</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User size={20} />
              <span>{user?.first_name || user?.username}</span>
            </div>
            <Button variant="outline" className="text-black border-2 border-gray-400" onClick={logout}>
              <LogOut size={16} className="mr-2" color="#000" />
              Sair
            </Button>
          </div>
        </div>

        {/* Add Task Button */}
  <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="border-2 border-gray-400 shadow-md text-black">
                <Plus size={16} className="mr-2" color="#000" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Adicione uma nova tarefa à sua lista
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Digite uma descrição para a tarefa"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Tarefa</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="border-2 border-gray-300 shadow-md">
              <CardContent className="py-8 text-center">
                <p className="text-black">Nenhuma tarefa encontrada. Crie sua primeira tarefa!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className={`border-2 border-gray-300 shadow-md ${task.completed ? 'opacity-75' : ''}`}>
                <CardContent className="py-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleCompleted(task.id)}
                      className={`mt-1 border-2 
                        ${task.completed 
                          ? 'border-green-600 bg-green-100 dark:bg-green-800' 
                          : 'border-gray-400 bg-white dark:bg-zinc-900'} 
                        text-black dark:text-white
                      `}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-black'} break-words`}> 
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-black'} break-words`}>
                          {task.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-black">
                        Criada em: {new Date(task.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-gray-400 text-black"
                        onClick={() => startEdit(task)}
                      >
                        <Edit size={14} color="#000" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-gray-400 text-black"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 size={14} color="#000" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="border-2 border-gray-400">
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
              <DialogDescription>
                Modifique os detalhes da sua tarefa
              </DialogDescription>
            </DialogHeader>
            {editingTask && (
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <Label htmlFor="edit_title">Título</Label>
                  <Input
                    id="edit_title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_description">Descrição (opcional)</Label>
                  <Textarea
                    id="edit_description"
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Digite uma descrição para a tarefa"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoList;

