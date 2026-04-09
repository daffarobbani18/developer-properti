"use client";

import { use } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Users,
  Phone,
  Mail,
  MapPin,
  Plus,
  UserPlus,
} from "lucide-react";
import {
  getProyekById,
  getSiteEngineerByProyek,
} from "@/lib/proyek-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TimPage({ params }: PageProps) {
  const { id } = use(params);
  const proyek = getProyekById(id);
  const engineers = getSiteEngineerByProyek(id);

  if (!proyek) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="clean-glass p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Proyek Tidak Ditemukan
            </h2>
            <Link href="/proyek">
              <Button className="mt-4">Kembali</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/proyek" className="hover:text-blue-600 transition-colors">
            Proyek
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/proyek/${id}/unit`}
            className="hover:text-blue-600 transition-colors"
          >
            {proyek.nama}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Tim Lapangan</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/proyek/${id}/unit`}>
              <Button variant="outline" size="icon" className="clean-glass">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Tim Lapangan
              </h1>
              <p className="text-sm text-slate-600">{proyek.nama}</p>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Site Engineer
          </Button>
        </div>

        {/* Summary */}
        <Card className="clean-glass">
          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {engineers.length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Site Engineer</p>
              </div>
              <div className="h-12 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {engineers.reduce((sum, e) => sum + e.jumlahUnitTugas, 0)}
                </p>
                <p className="text-sm text-slate-600 mt-1">Total Unit Tugas</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Engineer List */}
        {engineers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {engineers.map((engineer) => (
              <Card
                key={engineer.id}
                className="clean-glass hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full h-16 w-16 flex items-center justify-center text-white text-xl font-bold">
                      {engineer.nama.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {engineer.nama}
                      </h3>
                      <p className="text-sm text-slate-600">Site Engineer</p>
                      {engineer.blokTugas && (
                        <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200 border text-xs font-medium rounded-md">
                          <MapPin className="w-3 h-3 mr-1" />
                          Blok {engineer.blokTugas}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {engineer.telepon}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {engineer.email}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-3 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Unit Tugas</span>
                      <span className="text-xl font-bold text-blue-600">
                        {engineer.jumlahUnitTugas}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full clean-glass"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="clean-glass p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">Belum ada Site Engineer ditugaskan.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Site Engineer
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
