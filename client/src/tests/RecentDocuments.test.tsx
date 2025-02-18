/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import RecentDocuments from '../components/RecentDocuments'
import { HistoryService } from '../api/services/history.service'

describe('RecentDocuments Component', () => {
  beforeAll(() => {
    // Mock the HistoryService.getHistory to return a couple of history items.
    vi.spyOn(HistoryService, 'getHistory').mockResolvedValue([
      { id: 'doc1', title: 'Document 1', timestamp: Date.now() },
      { id: 'doc2', title: 'Document 2', timestamp: Date.now() - 1000 },
    ])
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders and displays fetched recent documents', async () => {
    const onDocumentSelect = vi.fn()
    render(<RecentDocuments onDocumentSelect={onDocumentSelect} selectedDocumentId="" />)

    // Verify the loading state is initially shown.
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for the history items to be rendered.
    await waitFor(() => {
      expect(screen.getByText('Document 1')).toBeInTheDocument()
      expect(screen.getByText('Document 2')).toBeInTheDocument()
    })
  })
}) 