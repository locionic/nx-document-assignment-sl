"use client"

import { useEffect, useState } from "react"
import { Folder, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FolderService } from "@/api/services/folder.service"
import type { DocumentFolder } from '@/../../shared-models/src/index'
import { DocumentService } from "@/api/services/document.service"

interface FolderViewProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

export default function FolderView({ selectedFolder, onFolderSelect }: FolderViewProps) {
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFolders()
  }, [])

  const loadFolders = async () => {
    try {
      const data = await FolderService.getFolders()
      setFolders(data)
    } catch (error) {
      console.error('Failed to load folders:', error)
    }
  }

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const newFolder = await FolderService.createFolder(newFolderName)
        setFolders([...folders, newFolder])
        setNewFolderName("")
        setIsDialogOpen(false)
      } catch (error) {
        console.error('Failed to create folder:', error)
      }
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      setLoading(true)
      // Get documents in folder first
      const folderDocs = await FolderService.getDocumentsByFolder(folderId)
      const docIds = folderDocs.map(doc => doc.id)
      
      // Delete folder
      await FolderService.deleteFolder(folderId)
      
      // Notify about deleted documents
      documentDeleteListeners.forEach(listener => listener(docIds))
      
      // Update local state
      setFolders(folders.filter(f => f.id !== folderId))
      if (selectedFolder === folderId) {
        onFolderSelect("")
      }
    } catch (error) {
      console.error('Failed to delete folder:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Folders</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={handleCreateFolder}>Create Folder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolder === folder.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onFolderSelect(folder.id)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folder.name}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

