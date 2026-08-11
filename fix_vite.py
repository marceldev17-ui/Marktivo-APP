with open('vite.config.ts', 'r') as f:
    content = f.read()

content = content.replace('    },\n  };\n});', '    },\n    build: {\n      chunkSizeWarningLimit: 2000,\n    },\n  };\n});')

with open('vite.config.ts', 'w') as f:
    f.write(content)
