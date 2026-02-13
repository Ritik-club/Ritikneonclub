
import React from 'react';

const SupportView: React.FC = () => {
  const whatsappNumber = "6207559408";
  
  const openWhatsApp = () => {
    window.open(`https://wa.me/91${whatsappNumber}`, '_blank');
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("Number copied to clipboard!");
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert("Number copied to clipboard! (Fallback)");
        } else {
          throw new Error("ExecCommand failed");
        }
      } catch (copyErr) {
        console.error("Copy failed", copyErr);
        alert("Unable to copy. Please manually share the number: " + text);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="bg-[#242938] rounded-3xl p-8 text-center border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center text-4xl mb-6 shadow-inner">
          💬
        </div>
        <h2 className="text-2xl font-bold font-orbitron mb-2">Support Center</h2>
        <p className="text-gray-400 text-sm">Need help with your account or prediction? Our team is available 24/7 via WhatsApp.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={openWhatsApp}
          className="w-full bg-[#25D366] py-5 rounded-2xl flex items-center justify-center gap-4 font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          <span className="text-2xl">WhatsApp Support</span>
        </button>
        
        <div className="bg-[#1e2330] rounded-2xl p-6 border border-white/5">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Official Contact</p>
          <div className="flex justify-between items-center bg-[#11131a] p-4 rounded-xl">
             <span className="text-gray-300 font-mono text-lg">+91 {whatsappNumber}</span>
             <button 
                onClick={() => copyToClipboard(whatsappNumber)}
                className="text-[10px] bg-white/5 px-3 py-1 rounded-full font-bold uppercase"
              >
                Copy
              </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
        <h4 className="font-bold text-sm">Common Questions</h4>
        <div className="space-y-2">
           <details className="text-xs text-gray-400 group">
             <summary className="list-none flex justify-between items-center cursor-pointer py-2 border-b border-white/5">
               <span>How to recharge demo balance?</span>
               <span>+</span>
             </summary>
             <p className="py-2 leading-relaxed">You can claim a free demo air-drop in the Wallet section every day.</p>
           </details>
           <details className="text-xs text-gray-400 group">
             <summary className="list-none flex justify-between items-center cursor-pointer py-2 border-b border-white/5">
               <span>Is this real money?</span>
               <span>+</span>
             </summary>
             <p className="py-2 leading-relaxed">No, this platform uses virtual demo coins only. Real money gambling is strictly prohibited.</p>
           </details>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
