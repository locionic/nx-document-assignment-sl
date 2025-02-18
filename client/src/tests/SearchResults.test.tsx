/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import SearchResults from '../components/SearchResults'
import { SearchService } from '../api/services/search.service'

describe('SearchResults Component', () => {
  beforeAll(() => {
    // Mock the SearchService.search to return two fake results.
    vi.spyOn(SearchService, 'search').mockImplementation(async (query: string) => {
      return [
        { id: 'doc1', title: 'Doc 1', snippet: 'Snippet from Doc 1' },
        { id: 'doc2', title: 'Doc 2', snippet: 'Snippet from Doc 2' },
      ]
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders search results based on query and handles selection', async () => {
    const onDocumentSelect = vi.fn()
    const onClose = vi.fn()
    render(
      <SearchResults query="test" onDocumentSelect={onDocumentSelect} onClose={onClose} />
    )

    // Wait for the component to render the search results header.
    await waitFor(() => {
      expect(screen.getByText(/Search Results/i)).toBeInTheDocument()
    })

    // Check that both result titles are rendered.
    expect(screen.getByText('Doc 1')).toBeInTheDocument()
    expect(screen.getByText('Doc 2')).toBeInTheDocument()

    // Simulate clicking on one of the results.
    fireEvent.click(screen.getByText('Doc 1'))
    expect(onDocumentSelect).toHaveBeenCalledWith('doc1')
    expect(onClose).toHaveBeenCalled()
  })
}) 