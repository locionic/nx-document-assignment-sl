"use client"

import { useEffect, useState } from "react"
import { File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchService } from "@/api/services/search.service"

interface SearchResultsProps {
  query: string
  onDocumentSelect: (documentId: string) => void
  onClose: () => void
}

export default function SearchResults({ query, onDocumentSelect, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<Array<{ id: string; title: string; snippet: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      searchDocuments()
    } else {
      setResults([])
    }
  }, [query])

  const searchDocuments = async () => {
    try {
      setLoading(true)
      const data = await SearchService.search(query)
      setResults(data)
    } catch (error) {
      console.error('Failed to search documents:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentSelect = (id: string) => {
    onDocumentSelect(id)
    onClose()
  }

  if (!query.trim()) return null

  return (
    <Card className="absolute top-full left-0 w-full mt-1 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {loading ? "Searching..." : `Search Results (${results.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {results.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleDocumentSelect(result.id)}
              >
                <File className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{result.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {result.snippet}
                  </span>
                </div>
              </Button>
            ))}
            {!loading && results.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                No documents found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 