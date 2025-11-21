import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';
export const LoginModal = ({ onClose, onLogin }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (code === 'admin') {
            onLogin('ADMIN');
            onClose();
        }
        else if (code.startsWith('cafe-') || code.startsWith('manual-')) {
            // In a real app, we would verify this ID against a backend.
            // Here we assume if it looks like an ID, it is one.
            onLogin('MANAGER', code);
            onClose();
        }
        else {
            setError('رمز الدخول غير صحيح');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 left-4 text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 24 }) }), _jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-coffee-100 text-coffee-600 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(Lock, { size: 32 }) }), _jsx("h2", { className: "text-2xl font-bold text-coffee-900", children: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u0644\u0627\u0643 \u0648\u0627\u0644\u0625\u062F\u0627\u0631\u0629" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "\u0623\u062F\u062E\u0644 \u0643\u0648\u062F \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u0645\u0642\u0647\u0649 \u0623\u0648 \u0643\u0648\u062F \u0627\u0644\u0645\u062F\u064A\u0631" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "\u0631\u0645\u0632 \u0627\u0644\u062F\u062E\u0648\u0644 / Access Code" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", value: code, onChange: (e) => setCode(e.target.value), className: "w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none dir-ltr", placeholder: "Enter code..." }), _jsx(KeyRound, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" })] })] }), error && (_jsxs("div", { className: "flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg", children: [_jsx(AlertCircle, { size: 16 }), error] })), _jsx("button", { type: "submit", className: "w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors", children: "\u062F\u062E\u0648\u0644" })] }), _jsx("div", { className: "mt-4 text-center border-t border-gray-100 pt-4", children: _jsxs("p", { className: "text-xs text-gray-400", children: ["\u0644\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0643\u0648\u062F: ", _jsx("span", { className: "font-mono font-bold", children: "admin" })] }) })] }) }));
};
