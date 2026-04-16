"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl md:px-8">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-200 ease-in-out"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </Button>
        {title && (
          <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-200 ease-in-out"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-amber-500 text-zinc-950 border-2 border-zinc-950 hover:bg-amber-500">
                3
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifikasi</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-2 flex items-center gap-3 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5 transition-all duration-200 ease-in-out hover:bg-slate-100">
          <Avatar className="h-8 w-8 ring-1 ring-slate-200 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-zinc-950 text-xs font-semibold font-[family-name:var(--font-heading)]">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              Admin
            </p>
            <p className="text-[11px] text-slate-600 leading-tight">
              Direktur
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
