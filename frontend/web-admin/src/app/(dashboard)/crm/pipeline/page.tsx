"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, User, Home } from "lucide-react";
import {
  dummyLeads,
  leadStatusLabel,
  leadStatusColor,
  sourceLabel,
  formatTanggal,
  type Lead,
  type LeadStatus,
} from "@/lib/crm-data";

const pipelineColumns: LeadStatus[] = [
  "baru",
  "follow-up",
  "survey",
  "negosiasi",
  "booking",
  "spk",
];

const columnAccent: Record<LeadStatus, string> = {
  baru: "border-t-slate-400",
  "follow-up": "border-t-blue-500",
  survey: "border-t-violet-500",
  negosiasi: "border-t-amber-500",
  booking: "border-t-emerald-500",
  spk: "border-t-green-600",
};

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const getColumnLeads = (status: LeadStatus) =>
    leads.filter((l) => l.status === status);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStatus: LeadStatus) => {
    if (!draggedLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === draggedLead.id ? { ...l, status: targetStatus } : l
      )
    );
    setDraggedLead(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">CRM — Pipeline</h1>

        {/* Pipeline Info */}
        <div className="mb-6">
        <p className="text-sm text-slate-500">
          Drag & drop kartu untuk memindahkan leads antar tahap pipeline.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
        {pipelineColumns.map((status) => {
          const columnLeads = getColumnLeads(status);
          return (
            <div
              key={status}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              {/* Column Header */}
              <div
                className={`rounded-t-xl bg-white/80 backdrop-blur-md border border-slate-200/50 border-t-[3px] ${columnAccent[status]} px-4 py-3 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {leadStatusLabel[status]}
                  </h3>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-600">
                    {columnLeads.length}
                  </span>
                </div>
              </div>

              {/* Column Body */}
              <div className="mt-0 rounded-b-xl bg-slate-50/50 border border-t-0 border-slate-200/30 p-2 min-h-[400px] space-y-2">
                {columnLeads.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-xs text-slate-400">
                    Tidak ada leads
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-grab active:cursor-grabbing rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300/50 hover:-translate-y-0.5 ${
                        draggedLead?.id === lead.id
                          ? "opacity-50 scale-95"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-slate-900 leading-tight">
                          {lead.nama}
                        </p>
                        <Badge
                          className={`text-[10px] font-medium rounded-md ${leadStatusColor[lead.status]} border-0 shrink-0`}
                        >
                          {leadStatusLabel[lead.status]}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Home className="h-3 w-3 shrink-0" />
                          <span>{lead.minatUnit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{lead.telepon}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <User className="h-3 w-3 shrink-0" />
                          <span>{lead.salesPIC}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {sourceLabel[lead.sumber]}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTanggal(lead.tanggalMasuk)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-slate-200/50 rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">
              Detail Lead
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedLead.nama}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedLead.id}</p>
                </div>
                <Badge
                  className={`text-xs font-medium rounded-md ${leadStatusColor[selectedLead.status]} border-0`}
                >
                  {leadStatusLabel[selectedLead.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Telepon</p>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedLead.telepon}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedLead.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Sumber</p>
                  <p className="text-sm font-medium text-slate-700">
                    {sourceLabel[selectedLead.sumber]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Minat</p>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedLead.minatUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Sales</p>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedLead.salesPIC}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatTanggal(selectedLead.tanggalMasuk)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50/80 border border-slate-200/40 p-4">
                <p className="text-xs text-slate-400 mb-1">Catatan</p>
                <p className="text-sm text-slate-700">
                  {selectedLead.catatanTerakhir}
                </p>
              </div>

              {/* Quick status move */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">Pindah ke:</span>
                {pipelineColumns
                  .filter((s) => s !== selectedLead.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setLeads((prev) =>
                          prev.map((l) =>
                            l.id === selectedLead.id
                              ? { ...l, status: s }
                              : l
                          )
                        );
                        setSelectedLead(null);
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all duration-200 hover:shadow-sm ${leadStatusColor[s]}`}
                    >
                      {leadStatusLabel[s]}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
