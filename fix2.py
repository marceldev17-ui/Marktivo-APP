import re

with open('src/components/CreativeStudioView.tsx', 'r') as f:
    content = f.read()

# Pattern for the bad duplicate />
pattern = r'(\s+className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500")\n\s+/>\n\s+<p className="text-\[10px\] text-amber-500/80 mt-1\.5 ml-1 font-medium">\{dynamicLabels\.styleTip\}</p>\n\s+/>'
content = re.sub(pattern, r'\1\n                />', content)

with open('src/components/CreativeStudioView.tsx', 'w') as f:
    f.write(content)
