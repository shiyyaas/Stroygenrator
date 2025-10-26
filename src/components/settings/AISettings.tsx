import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Check, AlertCircle, Sparkles } from 'lucide-react';
import { isAIAvailable, setAIApiKey, clearAIApiKey } from '../../utils/AIStoryGenerator';

export function AISettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKeyLocal] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsConfigured(isAIAvailable());
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setAIApiKey(apiKey.trim());
      setIsConfigured(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleClear = () => {
    clearAIApiKey();
    setApiKeyLocal('');
    setIsConfigured(false);
  };

  return (
    <>
      {/* Settings button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-50 bg-white/80 hover:bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-3 shadow-xl transition-all group"
      >
        <Settings size={20} className="text-slate-700" />
        {isConfigured && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* Settings modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] z-50 bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900">AI Story Settings</h3>
                    <p className="text-sm text-slate-500">Configure AI-powered story generation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Enable AI Story Generation</p>
                    <p className="text-blue-700">
                      Add your OpenAI API key to generate unique, creative stories for each world using GPT-4.
                      Without an API key, the app will use pre-written template stories.
                    </p>
                  </div>
                </div>

                {/* Status */}
                {isConfigured && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <Check size={20} className="text-green-600" />
                    <p className="text-sm text-green-900">AI story generation is active!</p>
                  </div>
                )}

                {/* API Key Input */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-700">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKeyLocal(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500">
                    Your API key is stored locally in your browser and never sent to our servers.
                    Get your key from{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      OpenAI
                    </a>
                  </p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
                    >
                      <Check size={20} className="text-green-600" />
                      <p className="text-sm text-green-900">API key saved successfully!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                  >
                    Save API Key
                  </button>
                  {isConfigured && (
                    <button
                      onClick={handleClear}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* How it works */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-2">How AI stories work:</p>
                  <ul className="text-xs text-slate-500 space-y-1.5">
                    <li className="flex gap-2">
                      <span className="text-purple-500">✓</span>
                      <span>Each world gets a unique, creative story generated by GPT-4</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-500">✓</span>
                      <span>Stories adapt based on the emojis and words you type</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-500">✓</span>
                      <span>Evolution stories describe how worlds merge and transform</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-500">✓</span>
                      <span>Falls back to template stories if API is unavailable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
