import re

with open('src/components/CampaignBuilderView.tsx', 'r') as f:
    content = f.read()

# Add Square to imports
if 'Square' not in content:
    content = content.replace('Mic', 'Mic,\n  Square')

start_idx = content.find("  return (\n    <button")
end_idx = content.find("  );\n};", start_idx) + 4

if start_idx != -1 and end_idx != -1:
    voice_new = """  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
        isListening
          ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-red-500/20"
          : "bg-slate-700/50 text-slate-400 hover:text-white border-slate-600 hover:bg-slate-600 p-1.5"
      }`}
      title={isListening ? "Parar Gravação" : "Falar"}
    >
      {isListening ? (
        <>
          <Square className="h-3 w-3 fill-current" />
          <span>Parar</span>
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );"""
    
    content = content[:start_idx] + voice_new + content[end_idx:]
    with open('src/components/CampaignBuilderView.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
