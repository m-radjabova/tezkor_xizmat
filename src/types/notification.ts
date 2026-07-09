export type NotificationType = 'budget' | 'debt' | 'saving' | 'system'

export interface NotificationItem {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType | null
  is_read: boolean
  created_at: string
}

export interface NotificationPayload {
  title: string
  message: string
  type?: NotificationType | null
  is_read?: boolean
}
