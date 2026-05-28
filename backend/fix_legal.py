import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('../controllers/legal.controller.js', './legal.controller.js')
    content = content.replace('../core/middlewares/auth.middleware.js', '../../core/middlewares/auth.middleware.js')
    content = content.replace('../core/middlewares/validate.middleware.js', '../../core/middlewares/validate.middleware.js')
    content = content.replace('../dto/legal.dto.js', './dto/legal.dto.js')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/modules/legal/legal.routes.ts')
