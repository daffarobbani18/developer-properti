import os
import glob

def replace_in_files(pattern, old_str, new_str):
    for filepath in glob.glob(pattern, recursive=True):
        if os.path.isfile(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if old_str in content:
                content = content.replace(old_str, new_str)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

replace_in_files('src/modules/construction/**/*.ts', '../core/config/prisma.js', '../../core/config/prisma.js')
replace_in_files('src/modules/legal/**/*.ts', '../core/config/prisma.js', '../../core/config/prisma.js')
replace_in_files('src/modules/commission/**/*.ts', '../core/config/prisma.js', '../../core/config/prisma.js')

replace_in_files('src/modules/construction/**/*.ts', 'async (tx) =>', 'async (tx: any) =>')
replace_in_files('src/modules/legal/**/*.ts', 'async (tx) =>', 'async (tx: any) =>')
replace_in_files('src/modules/commission/**/*.ts', 'async (tx) =>', 'async (tx: any) =>')

