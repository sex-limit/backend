import { User } from '@prisma/client'

export interface CreatePlanOptions {
  user: User
  title: string
  content: string
}
