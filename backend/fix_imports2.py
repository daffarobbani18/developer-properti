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

replace_in_files('src/routes/**/*.ts', '../../core/middlewares/auth.middleware.js', '../core/middlewares/auth.middleware.js')
replace_in_files('src/routes/upload.route.ts', '../../core/middlewares/auth.middleware.js', '../core/middlewares/auth.middleware.js')
replace_in_files('src/routes/**/*.ts', '../../core/config/prisma.js', '../core/config/prisma.js')
replace_in_files('src/services/**/*.ts', '../../core/config/prisma.js', '../core/config/prisma.js')

