import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData.username, loginData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.password_confirm) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const result = await register(registerData);
    
    if (result.success) {
      setError('');
      alert('Usuário registrado com sucesso! Faça login para continuar.');
    } else {
      setError(typeof result.error === 'string' ? result.error : 'Erro ao registrar usuário');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            Lista de Tarefas
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            Gerencie suas tarefas de forma simples e eficiente
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="text-black">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="text-black">Registrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Entrar</CardTitle>
                <CardDescription className="text-black">
                  Entre com suas credenciais para acessar suas tarefas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-black">Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-black">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  <Button type="submit" className="w-full text-black" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Registrar</CardTitle>
                <CardDescription className="text-black">
                  Crie uma nova conta para começar a usar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="text-black">Nome</Label>
                      <Input
                        id="first_name"
                        type="text"
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                        className="text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-black">Sobrenome</Label>
                      <Input
                        id="last_name"
                        type="text"
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                        className="text-black"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg_username" className="text-black">Usuário</Label>
                    <Input
                      id="reg_username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg_password" className="text-black">Senha</Label>
                    <Input
                      id="reg_password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirm" className="text-black">Confirmar Senha</Label>
                    <Input
                      id="password_confirm"
                      type="password"
                      value={registerData.password_confirm}
                      onChange={(e) => setRegisterData({ ...registerData, password_confirm: e.target.value })}
                      required
                      className="text-black"
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;

