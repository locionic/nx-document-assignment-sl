"use client"

import { useEffect, useState } from "react"
import { File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HistoryService } from "@/api/services/history.service"
import { DocumentService } from "@/api/services/document.service"
import type { DocumentHistoryEntry } from '../../../shared-models/src'

interface RecentDocumentsProps {
  onDocumentSelect: (documentId: string) => void
  selectedDocumentId: string | null
}

export default function RecentDocuments({ onDocumentSelect, selectedDocumentId }: RecentDocumentsProps) {
  const [recentDocs, setRecentDocs] = useState<DocumentHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  console.log("selectedDocumentId", selectedDocumentId)

  useEffect(() => {
    // Initial load: run once on mount
    loadHistory();
  }, []);

  useEffect(() => {

    if (!selectedDocumentId) return;

    loadHistory()
    
    // Subscribe to document deletions
    const unsubscribe = DocumentService.onDocumentsDeleted((deletedIds) => {
      setRecentDocs(current => 
        current.filter(doc => !deletedIds.includes(doc.id))
      );
      if (selectedDocumentId && deletedIds.includes(selectedDocumentId)) {
        onDocumentSelect("");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedDocumentId]);

  const loadHistory = async () => {
    try {
      setLoading(true)
      const history = await HistoryService.getHistory()
      
      // Remove duplicates and sort by timestamp (most recent first)
      const uniqueDocs = history.reduce((acc, current) => {
        const exists = acc.find(doc => doc.id === current.id)
        if (!exists) {
          acc.push(current)
        }
        return acc
      }, [] as DocumentHistoryEntry[])

      // Sort documents: selected document first, then by timestamp
      const sortedDocs = uniqueDocs.sort((a, b) => {
        if (a.id === selectedDocumentId) return -1
        if (b.id === selectedDocumentId) return 1
        return b.timestamp - a.timestamp
      })

      setRecentDocs(sortedDocs)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {loading ? "Loading..." : "Recent Documents"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <Button
                key={doc.id}
                variant={selectedDocumentId === doc.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onDocumentSelect(doc.id)}
              >
                <File className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{doc.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

