"use client"

import { useEffect, useState } from "react"
import { File, Plus, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import { DocumentService } from "@/api/services/document.service"
import { FolderService } from "@/api/services/folder.service"
import { HistoryService } from "@/api/services/history.service"
import type { Document } from '@/../../shared-models/src/index'
import { useToast } from "@/hooks/use-toast"

interface DocumentViewProps {
  folderId: string | null
  documentId: string | null
  onDocumentSelect: (documentId: string) => void
}

export default function DocumentView({ folderId, documentId, onDocumentSelect }: DocumentViewProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [newDoc, setNewDoc] = useState({ title: "", content: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [createError, setCreateError] = useState("")
  const [editingContent, setEditingContent] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setDocuments([])
    onDocumentSelect("")
    if (folderId) {
      loadFolderDocuments()
    }
  }, [folderId])

  useEffect(() => {
    if (documentId) {
      loadDocument()
    }
  }, [documentId])

  const selectedDocument = documents.find((doc) => doc.id === documentId)
  useEffect(() => {
    if (selectedDocument) {
      setEditingContent(selectedDocument.content)
    }
  }, [selectedDocument])

  const loadFolderDocuments = async () => {
    if (!folderId) return
    try {
      setLoading(true)
      const data = await FolderService.getDocumentsByFolder(folderId)
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load folder documents:', error)
      toast({
        title: "Failed to load folder documents",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadDocument = async () => {
    if (!documentId) return
    try {
      setLoading(true)
      const doc = await DocumentService.getDocument(documentId)
      // await HistoryService.addToHistory({
      //   id: doc.id,
      //   title: doc.title
      // })
      if (!documents.find(d => d.id === doc.id)) {
        setDocuments(prev => [...prev, doc])
      }
    } catch (error) {
      console.error('Failed to load document:', error)
      toast({
        title: "Failed to load document",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDocument = async () => {
    if (!newDoc.title.trim() || !newDoc.content.trim()) {
      setCreateError("Both title and content are required.")
      return
    }
    if (!folderId) {
      setCreateError("Folder is missing.")
      return
    }
    try {
      setLoading(true)
      const created = await DocumentService.createDocument({
        title: newDoc.title,
        content: newDoc.content,
        folderId,
      })
      setDocuments(prev => [...prev, created])
      setNewDoc({ title: "", content: "" })
      setIsDialogOpen(false)
      setCreateError("")
    } catch (error: any) {
      setCreateError(error.message || "Failed to create document")
      console.error("Failed to create document:", error)
      toast({
        title: "Failed to create document",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDocument = async (content: string) => {
    if (!documentId) return
    try {
      setLoading(true)
      const updated = await DocumentService.updateDocument(documentId, content)
      setDocuments(prev =>
        prev.map(doc => doc.id === documentId ? updated : doc)
      )
    } catch (error) {
      console.error('Failed to update document:', error)
      toast({
        title: "Failed to update document",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      setLoading(true)
      await DocumentService.deleteDocument(id)
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      if (documentId === id) {
        onDocumentSelect("")
      }
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast({
        title: "Failed to delete document",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const folderDocuments = documents.filter((doc) => doc.folderId === folderId)

  return (
    <Card className="h-[600px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {loading ? "Loading..." : documentId ? selectedDocument?.title : "Documents"}
        </CardTitle>
        {folderId && !documentId && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Document title"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                />
                <Textarea
                  placeholder="Document content (supports Markdown)"
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  className="h-40"
                />
                {createError && (
                  <p className="text-red-500 text-sm mt-2">{createError}</p>
                )}
                <Button onClick={handleCreateDocument} disabled={loading}>
                  Create Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[520px] pr-4">
          {!documentId ? (
            <div className="space-y-2">
              {folderDocuments.map((doc) => (
                <Button
                  key={doc.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onDocumentSelect(doc.id)}
                >
                  <File className="mr-2 h-4 w-4" />
                  {doc.title}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(documentId)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {editMode ? (
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  onBlur={() => handleUpdateDocument(editingContent)}
                  className="min-h-[400px]"
                />
              ) : (
                <article className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedDocument?.content || ""}</ReactMarkdown>
                </article>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

