
import React, { useState } from 'react';
import { generateLuckAvatar } from '../services/geminiService.ts';
import { ImageSize } from '../types.ts';

interface AIGenerationViewProps {
  onAvatarCreated: (url: string) => void;
  onSetLoading: (loading: boolean, message?: string) => void;
}

const AIGenerationView: React.FC<AIGenerationViewProps> = ({ onAvatarCreated, onSetLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
          if (typeof window.aistudio?.openSelectKey === 'function') {
             await window.aistudio.openSelectKey();
          } else {
             alert("Please set up your AI Studio API Key to use this feature.");
             return;
          }
      }
    }

    onSetLoading(true, 'Forging in Meta-Space...');
    const result = await generateLuckAvatar(prompt, size);
    if (result) {
      setGeneratedImg(result);
    } else {
      alert("Generation failed. Check console for errors.");
    }
    onSetLoading(false);
  };

  const handleUseAvatar = () => {
    if (generatedImg) {
      onAvatarCreated(generatedImg);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="glass-morphism rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-3xl -z-10"></div>
        <h2 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Lucky Avatar Forge</h2>
        <p className="text-gray-400 text-xs mt-2">Use Gemini 3 Pro to create your custom winning emblem.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Describe your Luck Shield</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 glass-morphism rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
            placeholder="e.g. A cybernetic dragon breathing neon fire, golden coins in background..."
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                size === s ? 'bg-purple-600 border border-purple-400' : 'bg-white/5 border border-white/5'
              }`}
            >
              {s} Resolution
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-95`}
        >
          Generate AI Emblem
        </button>
      </div>

      {generatedImg && (
        <div className="glass-morphism rounded-3xl p-4 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <img src={generatedImg} alt="AI Result" className="w-full aspect-square rounded-2xl object-cover mb-4 shadow-2xl" />
          <button 
            onClick={handleUseAvatar}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all"
          >
            Apply as My Profile Avatar
          </button>
        </div>
      )}

      <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
        <p className="text-[10px] text-gray-500 leading-relaxed italic text-center">
          Note: This feature requires a Gemini API Key. For high-quality generation, please ensure your project is linked to a billing account.
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-purple-400 underline ml-1">Billing Docs</a>
        </p>
      </div>
    </div>
  );
};

export default AIGenerationView;
