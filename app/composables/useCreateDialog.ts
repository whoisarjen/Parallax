export function useCreateDialog() {
  const show = useState('create-dialog-visible', () => false)

  return {
    showCreateDialog: show,
    openCreateDialog: () => { show.value = true },
    closeCreateDialog: () => { show.value = false },
  }
}
