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

# Update auth.middleware imports in routes
replace_in_files('src/routes/**/*.ts', '../middlewares/auth.middleware.js', '../../core/middlewares/auth.middleware.js')
replace_in_files('src/routes/upload.route.ts', '../middlewares/auth.middleware.js', '../../core/middlewares/auth.middleware.js')

# Update prisma imports in services & routes
replace_in_files('src/services/**/*.ts', '../database/prisma.js', '../../core/config/prisma.js')
replace_in_files('src/routes/**/*.ts', '../database/prisma.js', '../../core/config/prisma.js')

