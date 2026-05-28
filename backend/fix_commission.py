import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('../controllers/commission.controller.js', './commission.controller.js')
    content = content.replace('../core/middlewares/auth.middleware.js', '../../core/middlewares/auth.middleware.js')
    content = content.replace('../core/middlewares/validate.middleware.js', '../../core/middlewares/validate.middleware.js')
    content = content.replace('../dtos/commission.dto.js', './dto/commission.dto.js')
    content = content.replace('../dto/commission.dto.js', './dto/commission.dto.js')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/modules/commission/commission.routes.ts')
