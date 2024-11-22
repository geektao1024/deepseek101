'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Key, AlertCircle } from 'lucide-react';

export function AuthWrapper({ children }) {
  const [authState, setAuthState] = useState({
    showReauthDialog: false,
    password: '',
    error: '',
    attempts: 0
  });
  const router = useRouter();

  // 检查认证状态
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      
      if (!data.isLoggedIn) {
        setAuthState(prev => ({
          ...prev,
          showReauthDialog: true,
          error: data.expired ? '会话已过期，请重新验证身份' : ''
        }));
      }
    } catch (error) {
      console.error('认证检查失败:', error);
    }
  };

  // 定期检查认证状态
  useEffect(() => {
    const interval = setInterval(checkAuth, 60000); // 每分钟检查一次
    return () => clearInterval(interval);
  }, []);

  // 处理重新认证
  const handleReauth = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authState.password }),
      });

      if (response.ok) {
        setAuthState({
          showReauthDialog: false,
          password: '',
          error: '',
          attempts: 0
        });
      } else {
        const newAttempts = authState.attempts + 1;
        if (newAttempts >= 3) {
          router.push('/');
        } else {
          setAuthState(prev => ({
            ...prev,
            error: `密码错误，还剩 ${3 - newAttempts} 次尝试机会`,
            password: '',
            attempts: newAttempts
          }));
        }
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: '认证失败，请稍后重试',
        password: ''
      }));
    }
  };

  return (
    <>
      {children}

      {/* 重新认证对话框 */}
      <Dialog 
        open={authState.showReauthDialog}
        onOpenChange={(open) => {
          if (!open) {
            router.push('/');
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="text-center space-y-2">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle className="text-xl">
                会话已过期
              </DialogTitle>
              <p className="text-sm text-gray-500">
                为了保护您的账户安全，请重新验证身份
              </p>
            </div>
          </DialogHeader>

          <form onSubmit={handleReauth} className="space-y-4 py-4">
            {authState.error && (
              <Alert variant="destructive" className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {authState.error}
              </Alert>
            )}

            <div className="relative">
              <Input
                type="password"
                value={authState.password}
                onChange={(e) => setAuthState(prev => ({ ...prev, password: e.target.value }))}
                placeholder="请输入管理密码"
                className="pl-10"
                autoFocus
              />
              <Key className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <DialogFooter className="sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/')}
              >
                返回首页
              </Button>
              <Button type="submit">
                验证身份
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 