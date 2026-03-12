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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm px-4 md:px-8">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden rounded-lg hover:bg-white/90 transition-all duration-200 ease-in-out"
        >
          <Menu className="h-5 w-5 text-slate-600" />
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
              className="relative rounded-lg hover:bg-white/90 transition-all duration-200 ease-in-out"
            >
              <Bell className="h-5 w-5 text-slate-500" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-rose-500 text-white border-2 border-white hover:bg-rose-500">
                3
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifikasi</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-2 flex items-center gap-3 cursor-pointer rounded-xl px-2 py-1.5 transition-all duration-200 ease-in-out hover:bg-white/90">
          <Avatar className="h-8 w-8 ring-1 ring-slate-200/50 shadow-sm">
            <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-semibold font-[family-name:var(--font-heading)]">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              Admin
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Direktur
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
