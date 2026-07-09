export interface Note {
  id: string
  user_id: string
  title: string
  content: string | null
  note_date: string | null
  created_at: string
  updated_at: string
}

export interface NotePayload {
  title: string
  content?: string | null
  note_date?: string | null
}
