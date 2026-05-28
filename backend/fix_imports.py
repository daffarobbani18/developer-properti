import os
import re

def add_js_extension_to_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find imports matching from "./something" or from "../something"
    # and not already ending in .js
    # re.sub(pattern, repl, string)
    
    # We want to match: import ... from "./path/to/module";
    # We use a regex: (from|import)\s+["'](\.[^"'\n]+)(?<!\.js)["']
    
    new_content = re.sub(r'(from\s+["\'])(\.[^"\'\n]+)(?<!\.js)(["\'])', r'\1\2.js\3', content)
    new_content = re.sub(r'(import\s+["\'])(\.[^"\'\n]+)(?<!\.js)(["\'])', r'\1\2.js\3', new_content)
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts'):
            add_js_extension_to_imports(os.path.join(root, file))
