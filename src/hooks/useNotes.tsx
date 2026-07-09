import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Note, NotePayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const NOTES_QUERY_KEY = ['notes']

async function getNotesRequest() {
  const { data } = await apiClient.get<Note[]>('/notes/')
  return data
}

async function createNoteRequest(payload: NotePayload) {
  const { data } = await apiClient.post<Note>('/notes/', payload)
  return data
}

async function updateNoteRequest(id: string, payload: Partial<NotePayload>) {
  const { data } = await apiClient.patch<Note>(`/notes/${id}`, payload)
  return data
}

async function deleteNoteRequest(id: string) {
  await apiClient.delete(`/notes/${id}`)
}

export function useNotes() {
  const queryClient = useQueryClient()

  const notesQuery = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: getNotesRequest,
  })

  const createMutation = useMutation({
    mutationFn: createNoteRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.note_created'))
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.note_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NotePayload> }) => updateNoteRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.note_updated'))
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.note_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNoteRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.note_deleted'))
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.note_delete_failed')))
    },
  })

  return {
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading,
    isFetching: notesQuery.isFetching,
    createNote: createMutation.mutate,
    updateNote: updateMutation.mutate,
    deleteNote: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
