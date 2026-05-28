import os
import re

def fix_req_params_id(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # req.params.id is used directly in prisma where clauses like:
    # where: { id: req.params.id }
    # This causes TS errors because req.params.id is typed as string | undefined (or string | string[] etc)
    # We can replace req.params.id with String(req.params.id)
    
    new_content = re.sub(r'req\.params\.id', 'String(req.params.id)', content)
    
    # Also in property-types.route.ts, fix 'Unit: true' to 'units: true'
    if 'property-types.route.ts' in filepath:
        new_content = new_content.replace('Unit: true', 'units: true')
        
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src/routes'):
    for file in files:
        if file.endswith('.ts'):
            fix_req_params_id(os.path.join(root, file))
