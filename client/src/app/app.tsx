import { BrowserRouter } from "react-router-dom"
import DocumentManager from "../components/DocumentManager"
import { ThemeProvider } from "../components/theme-provider"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <main className="min-h-screen bg-background">
          <DocumentManager />
        </main>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App