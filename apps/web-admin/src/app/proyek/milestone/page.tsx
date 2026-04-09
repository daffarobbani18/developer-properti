"use client";

import { useCallback, useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Project = {
  id: string;
  name: string;
};

type UnitMilestone = {
  id: string;
  status: string;
  template: {
    name: string;
    orderNo: number;
  };
};

type Unit = {
  id: string;
  code: string;
  typeName: string;
  progress: number;
  milestones: UnitMilestone[];
};

const allowedRoles: Role[] = ["DIRECTOR", "PROJECT_MANAGER", "SITE_ENGINEER"];

export default function MilestonePage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProjects = useCallback(async () => {
    const data = await apiRequest<Project[]>("/project/projects");
    setProjects(data);

    if (data.length > 0 && !selectedProject) {
      setSelectedProject(data[0].id);
    }
  }, [selectedProject]);

  const loadUnits = useCallback(async (projectId: string) => {
    if (!projectId) {
      return;
    }
    const data = await apiRequest<Unit[]>(`/project/projects/${projectId}/units`);
    setUnits(data);
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }

    loadProjects().catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat proyek");
    });
  }, [auth, loadProjects]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    loadUnits(selectedProject).catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat unit milestone");
    });
  }, [selectedProject, loadUnits]);

  async function updateMilestone(milestoneId: string, status: string) {
    try {
      await apiRequest(`/project/milestones/${milestoneId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      await loadUnits(selectedProject);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal update milestone");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell
      user={auth.user}
      title="Monitoring Milestone"
      subtitle="Pantau progres unit dan update status milestone konstruksi"
    >
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="controls">
        <select
          value={selectedProject}
          onChange={(event) => {
            setSelectedProject(event.target.value);
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Unit</th>
              <th>Tipe</th>
              <th>Progress</th>
              <th>Milestone</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) =>
              unit.milestones.map((milestone) => (
                <tr key={milestone.id}>
                  <td>{unit.code}</td>
                  <td>{unit.typeName}</td>
                  <td>{unit.progress}%</td>
                  <td>{milestone.template.name}</td>
                  <td>
                    <span className="status-chip">{milestone.status}</span>
                  </td>
                  <td>
                    <div className="controls" style={{ marginBottom: 0 }}>
                      <button type="button" onClick={() => updateMilestone(milestone.id, "IN_PROGRESS")}>
                        On Progress
                      </button>
                      <button type="button" onClick={() => updateMilestone(milestone.id, "COMPLETED")}>
                        Selesai
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
