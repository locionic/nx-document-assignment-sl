"use client"

import { useEffect, useState } from "react"
import { Folder, ChevronRight, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FolderService } from "@/api/services/folder.service"
import type { DocumentFolder } from '@/../../shared-models/src/index'
import { DocumentService } from "@/api/services/document.service"
import { useToast } from "@/hooks/use-toast"

interface FolderViewProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

export default function FolderView({ selectedFolder, onFolderSelect }: FolderViewProps) {
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [createFolderError, setCreateFolderError] = useState("")
  const [deleteFolderError, setDeleteFolderError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadFolders()
  }, [])

  const loadFolders = async () => {
    try {
      const data = await FolderService.getFolders()
      setFolders(data)
    } catch (error) {
      console.error("Failed to load folders:", error)
      toast({
        title: "Failed to load folders",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setCreateFolderError("Folder name is required.")
      return
    }
    try {
      setLoading(true)
      const newFolder = await FolderService.createFolder(newFolderName)
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setIsDialogOpen(false)
      setCreateFolderError("")
    } catch (error: any) {
      console.error("Failed to create folder:", error)
      setCreateFolderError(error.message || "Failed to create folder.")
      toast({
        title: "Failed to create folder",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      setLoading(true)
      setDeleteFolderError("")
      
      // Delete folder
      await FolderService.deleteFolder(folderId)
      
      // Update local state
      setFolders(prevFolders => prevFolders.filter(f => f.id !== folderId))
      
      // Clear selected folder if it was deleted
      if (selectedFolder === folderId) {
        onFolderSelect("")
      }
      
      // Close the delete dialog
      setFolderToDelete(null)
      
      // Notify about deleted documents if applicable
      if (typeof DocumentService !== "undefined" && DocumentService.onDocumentsDeleted) {
        // The delete notification can be handled here if needed.
      }
    } catch (error: any) {
      console.error("Failed to delete folder:", error)
      setDeleteFolderError(error.message || "Failed to delete folder.")
      toast({
        title: "Failed to delete folder",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
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
                onChange={(e) => {
                  setNewFolderName(e.target.value)
                  if (createFolderError) setCreateFolderError("")
                }}
              />
              {createFolderError && (
                <p className="text-red-500 text-sm mt-2">{createFolderError}</p>
              )}
              <Button onClick={handleCreateFolder} disabled={loading}>
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center group">
              <Button
                variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                className="flex-1 justify-start"
                onClick={() => onFolderSelect(folder.id)}
              >
                <Folder className="mr-2 h-4 w-4" />
                {folder.name}
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-1"
                onClick={() => setFolderToDelete(folder.id)}
                disabled={loading}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!folderToDelete} onOpenChange={() => { setFolderToDelete(null); setDeleteFolderError("") }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this folder? This will also delete all documents inside the folder.
            </p>
            {deleteFolderError && (
              <p className="text-red-500 text-sm">{deleteFolderError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => { setFolderToDelete(null); setDeleteFolderError("") }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (folderToDelete) {
                    handleDeleteFolder(folderToDelete)
                  }
                }}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

