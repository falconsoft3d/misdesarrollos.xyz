export interface Project {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  videoUrl?: string | null
  gallery?: string | null
  tags: string
  views: number
  createdAt: Date
  updatedAt: Date
  comments?: Comment[]
}

export interface Comment {
  id: string
  name: string
  email: string
  message: string
  createdAt: Date
  projectId: string
}
