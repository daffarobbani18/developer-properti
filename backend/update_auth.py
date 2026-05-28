import os

middleware_path = 'd:/Website/developer-properti/backend/src/core/middlewares/auth.middleware.ts'
with open(middleware_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_condition = '''
    // Superadmin bypasses role checks
    if (user.roleName === "Superadmin") {
      return next();
    }

    if (!roles.includes(user.roleName)) {
'''
content = content.replace('if (!roles.includes(user.roleName)) {', new_condition)

with open(middleware_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated auth.middleware.ts")
