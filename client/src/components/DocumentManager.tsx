"use client"

import { useState } from "react"
import { Folder, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import FolderView from "@/components/FolderView"
import DocumentView from "@/components/DocumentView"
import RecentDocuments from "@/components/RecentDocuments"
import SearchResults from "@/components/SearchResults"
import { HistoryService } from "@/api/services/history.service"

export default function DocumentManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<string | null>("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearchFocus = () => {
    setShowSearchResults(true)
  }

  const handleSearchBlur = () => {
    // Delay hiding search results to allow clicking on them
    setTimeout(() => setShowSearchResults(false), 200)
  }

  const handleDocumentSelect = async (documentId: string) => {
    setSelectedDocument(documentId)
    setSearchQuery("") // Clear search when document is selected
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Document Management System</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-8"
              />
              {showSearchResults && (
                <SearchResults
                  query={searchQuery}
                  onDocumentSelect={handleDocumentSelect}
                  onClose={() => setShowSearchResults(false)}
                />
              )}
            </div>
            <Button variant="default">
              <Folder className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
        </header>

        <Separator />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <FolderView
              selectedFolder={selectedFolder}
              onFolderSelect={setSelectedFolder}
            />
          </div>
          <div className="col-span-6">
            <DocumentView
              folderId={selectedFolder}
              documentId={selectedDocument}
              onDocumentSelect={setSelectedDocument}
            />
          </div>
          <div className="col-span-3">
            <RecentDocuments 
              onDocumentSelect={handleDocumentSelect}
              selectedDocumentId={selectedDocument}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

