/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DocumentManager from '../components/DocumentManager'
import { BrowserRouter } from 'react-router-dom'

describe('DocumentManager Component', () => {
  it('renders header and search input', () => {
    render(
      <BrowserRouter>
        <DocumentManager />
      </BrowserRouter>
    )

    // Check for the main header and search input.
    expect(screen.getByText('Document Management System')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search documents...')).toBeInTheDocument()
  })
}) 