import re

with open('src/components/CreativeStudioView.tsx', 'r') as f:
    content = f.read()

bad_string = r"""className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-\[10px\] text-amber-500/80 mt-1.5 ml-1 font-medium">\{dynamicLabels.styleTip\}</p>"""

good_string = r"""className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500\""""

content = content.replace(bad_string, good_string)

with open('src/components/CreativeStudioView.tsx', 'w') as f:
    f.write(content)
