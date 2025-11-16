// Projects data management
export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  startDate: string
  endDate?: string
  budget?: number
  participants: string[] // Startup IDs
  goals: string[]
  progress: number // 0-100
  createdAt: string
  updatedAt: string
}

// Mock data for initial projects
export const projectsData: Project[] = [
  {
    id: "proj-1",
    name: "Programa de Aceleración AgriTech 2024",
    description:
      "Programa intensivo de 3 meses para startups de agricultura inteligente con mentorías, financiación y acceso a mercado.",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    budget: 500000,
    participants: ["Agrosingularity", "Hemav", "Auara"],
    goals: ["Conectar 10 startups con inversores", "Facilitar 5 pilotos comerciales", "Generar €2M en inversión total"],
    progress: 65,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z",
  },
  {
    id: "proj-2",
    name: "Innovación en Proteínas Alternativas",
    description: "Iniciativa de investigación colaborativa para desarrollar nuevas fuentes de proteína sostenible.",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    budget: 750000,
    participants: ["Heura Foods", "Cocuus", "Novameat"],
    goals: ["Desarrollar 3 nuevos productos", "Reducir costos de producción en 30%", "Obtener certificaciones EU"],
    progress: 40,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-03-20T11:15:00Z",
  },
  {
    id: "proj-3",
    name: "Red de Distribución Sostenible",
    description:
      "Creación de una red logística compartida para reducir la huella de carbono en la distribución de alimentos.",
    status: "planning",
    startDate: "2024-05-01",
    budget: 300000,
    participants: ["Auara", "Heura Foods"],
    goals: ["Reducir emisiones en 40%", "Optimizar rutas de distribución", "Integrar 15 startups en la red"],
    progress: 15,
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-03-25T16:45:00Z",
  },
  {
    id: "proj-4",
    name: "Plataforma de Datos Abiertos AgriFood",
    description: "Desarrollo de una plataforma colaborativa para compartir datos del sector agroalimentario español.",
    status: "completed",
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    budget: 200000,
    participants: ["Agrosingularity", "Hemav", "Cocuus"],
    goals: ["Lanzar plataforma MVP", "Integrar datos de 20 startups", "Alcanzar 1000 usuarios activos"],
    progress: 100,
    createdAt: "2023-05-01T10:00:00Z",
    updatedAt: "2024-01-05T12:00:00Z",
  },
]

// Helper functions
export const getProjectById = (id: string): Project | undefined => {
  return projectsData.find((project) => project.id === id)
}

export const getProjectsByStatus = (status: Project["status"]): Project[] => {
  return projectsData.filter((project) => project.status === status)
}

export const getProjectsByParticipant = (startupName: string): Project[] => {
  return projectsData.filter((project) => project.participants.includes(startupName))
}

export const calculateProjectStats = () => {
  return {
    total: projectsData.length,
    active: projectsData.filter((p) => p.status === "active").length,
    completed: projectsData.filter((p) => p.status === "completed").length,
    planning: projectsData.filter((p) => p.status === "planning").length,
    onHold: projectsData.filter((p) => p.status === "on-hold").length,
    totalBudget: projectsData.reduce((sum, p) => sum + (p.budget || 0), 0),
    averageProgress: Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / projectsData.length),
  }
}

export const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "completed":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "planning":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "on-hold":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

export const getStatusLabel = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "Activo"
    case "completed":
      return "Completado"
    case "planning":
      return "Planificación"
    case "on-hold":
      return "En Pausa"
    default:
      return status
  }
}

export const addStartupToProject = (projectId: string, startupName: string): boolean => {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return false

  if (project.participants.includes(startupName)) {
    return false // Already in project
  }

  project.participants.push(startupName)
  project.updatedAt = new Date().toISOString()
  return true
}

export const addStartupsToProject = (projectId: string, startupNames: string[]): boolean => {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return false

  const newStartups = startupNames.filter((name) => !project.participants.includes(name))
  project.participants.push(...newStartups)
  project.updatedAt = new Date().toISOString()
  return true
}
