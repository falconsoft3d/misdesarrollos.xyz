export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  tags: string
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
