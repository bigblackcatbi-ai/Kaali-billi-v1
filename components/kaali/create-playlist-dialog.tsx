'use client'

import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useKaali } from './store'

export function CreatePlaylistDialog({ trigger }: { trigger: ReactNode }) {
  const { createPlaylist, setView } = useKaali()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = createPlaylist(trimmed, description.trim() || undefined)
    setName('')
    setDescription('')
    setOpen(false)
    setView({ kind: 'playlist', id })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create local playlist</DialogTitle>
          <DialogDescription>
            Playlists live inside Kaali Billi and store track references only — no audio is
            copied or streamed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="pl-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="pl-name"
              value={name}
              autoFocus
              placeholder="e.g. Rainy Day Rotation"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
              }}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="pl-desc" className="text-sm font-medium">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="pl-desc"
              value={description}
              placeholder="What's this one about?"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Create playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
