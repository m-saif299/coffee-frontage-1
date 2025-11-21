
import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (role: 'ADMIN' | 'MANAGER', cafeId?: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code === 'admin') {
      onLogin('ADMIN');
      onClose();
    } else if (code.startsWith('cafe-') || code.startsWith('manual-')) {
      // In a real app, we would verify this ID against a backend.
      // Here we assume if it looks like an ID, it is one.
      onLogin('MANAGER', code);
      onClose();
    } else {
      setError('رمز الدخول غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-coffee-100 text-coffee-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-coffee-900">دخول الملاك والإدارة</h2>
          <p className="text-gray-500 text-sm mt-1">أدخل كود الدخول الخاص بالمقهى أو كود المدير</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رمز الدخول / Access Code</label>
            <div className="relative">
              <input 
                type="password" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none dir-ltr"
                placeholder="Enter code..."
              />
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors"
          >
            دخول
          </button>
        </form>
        
        <div className="mt-4 text-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
                للإدارة العامة استخدم الكود: <span className="font-mono font-bold">admin</span>
            </p>
        </div>
      </div>
    </div>
  );
};
