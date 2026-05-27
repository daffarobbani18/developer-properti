import os

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

files_to_update = [
    'dashboard/[role]/page.tsx',
    'proyek/page.tsx',
    'inventory/page.tsx',
    'supervisor/page.tsx',
    'sales/page.tsx',
    'finance/page.tsx',
    'legal/page.tsx'
]

for relative_path in files_to_update:
    fp = os.path.join(base, relative_path)
    if not os.path.exists(fp):
        continue
        
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We will do targeted replacements for each file since the variable names vary slightly
    
    if relative_path == 'dashboard/[role]/page.tsx':
        old_block = '''          return (
            <div key={stat.label} className="stat-card group">
              <div className="mb-3 flex items-start justify-between">
                <div className={icon-wrapper h-10 w-10 }>
                  <Icon weight="duotone" size={20} />
                </div>
                {stat.trend && (
                  <div className={stat.trendUp ? 'badge-trend-up' : 'badge-trend-down'}>
                    {stat.trendUp ? <TrendUp weight="bold" size={12} /> : <TrendDown weight="bold" size={12} />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
            </div>
          );'''
          
        new_block = '''          return (
            <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                  {stat.trend && (
                    <div className={lex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md }>
                      {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              </div>
              <div className={icon-wrapper h-14 w-14 shrink-0 }>
                <Icon weight="duotone" size={28} />
              </div>
            </div>
          );'''
        content = content.replace(old_block, new_block)

    elif relative_path == 'proyek/page.tsx':
        old_block = '''          <div key={stat.label} className="stat-card group">
            <div className="mb-3 flex items-start justify-between">
              <div className={icon-wrapper h-10 w-10 }>
                <stat.icon weight="duotone" size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
            {"progress" in stat && stat.progress !== undefined && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                  style={{ width: ${stat.progress}% }}
                />
              </div>
            )}
            {!("progress" in stat) && (
              <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
            )}
          </div>'''
          
        new_block = '''          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
              {"progress" in stat && stat.progress !== undefined ? (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: ${stat.progress}% }}
                  />
                </div>
              ) : (
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              )}
            </div>
            <div className={icon-wrapper h-14 w-14 shrink-0 }>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>'''
        content = content.replace(old_block, new_block)

    elif relative_path == 'inventory/page.tsx':
        old_block = '''          <div key={idx} className="stat-card group">
            <div className="mb-3 flex items-start justify-between">
              <div className={icon-wrapper h-10 w-10 }>
                <stat.icon weight="duotone" size={20} />
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <h3 className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</h3>
          </div>'''
          
        new_block = '''          <div key={idx} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className={icon-wrapper h-14 w-14 shrink-0 }>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>'''
        content = content.replace(old_block, new_block)
        
    elif relative_path == 'supervisor/page.tsx':
        old_block = '''          <div key={stat.label} className="stat-card group">
            <div className="mb-3 flex items-start justify-between">
              <div className={icon-wrapper h-10 w-10 }>
                <stat.icon weight="duotone" size={20} />
              </div>
              <div className={stat.trendUp ? 'badge-trend-up' : 'badge-trend-down'}>
                {stat.trendUp ? <TrendUp weight="bold" size={12} /> : <TrendDown weight="bold" size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>'''
          
        new_block = '''          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                <div className={lex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md }>
                  {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                  {stat.trend}
                </div>
              </div>
              <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
            </div>
            <div className={icon-wrapper h-14 w-14 shrink-0 }>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>'''
        content = content.replace(old_block, new_block)
        
    elif relative_path == 'sales/page.tsx':
        old_block = '''          <div key={stat.label} className="stat-card group">
            <div className="mb-3 flex items-start justify-between">
              <div
                className={icon-wrapper h-10 w-10 }
              >
                <stat.icon weight="duotone" size={20} />
              </div>
              <div className={stat.trendUp ? "badge-trend-up" : "badge-trend-down"}>
                {stat.trendUp ? <TrendUp weight="bold" size={12} /> : <TrendDown weight="bold" size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>'''
          
        new_block = '''          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                <div className={lex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md }>
                  {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                  {stat.trend}
                </div>
              </div>
              <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
            </div>
            <div className={icon-wrapper h-14 w-14 shrink-0 }>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>'''
        content = content.replace(old_block, new_block)
        
    elif relative_path == 'legal/page.tsx':
        old_block = '''            <div key={stat.label} className="stat-card group">
              <div className="mb-3 flex items-start justify-between">
                <div className="mb-4"><div className={icon-wrapper h-10 w-10 }>
                  <stat.icon weight="duotone" size={20} />
                </div></div>
                <div className={stat.trendUp ? 'badge-trend-up' : 'badge-trend-down'}>
                  {stat.trendUp ? <TrendUp weight="bold" size={12} /> : <TrendDown weight="bold" size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
            </div>'''
            
        new_block = '''            <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                  <div className={lex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md }>
                    {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              </div>
              <div className={icon-wrapper h-14 w-14 shrink-0 }>
                <stat.icon weight="duotone" size={28} />
              </div>
            </div>'''
        content = content.replace(old_block, new_block)
        
    elif relative_path == 'finance/page.tsx':
        old_block = '''          <div key={stat.label} className="stat-card group">
            <div className="mb-3 flex items-start justify-between">
              <div className={icon-wrapper h-10 w-10 }>
                <stat.icon weight="duotone" size={20} />
              </div>
              <div className={stat.trendUp ? 'badge-trend-up' : 'badge-trend-down'}>
                {stat.trendUp ? <TrendUp weight="bold" size={12} /> : <TrendDown weight="bold" size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
          </div>'''
          
        new_block = '''          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
                <div className={lex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md }>
                  {stat.trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                  {stat.trend}
                </div>
              </div>
              <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
            </div>
            <div className={icon-wrapper h-14 w-14 shrink-0 }>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>'''
        content = content.replace(old_block, new_block)

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {relative_path}")