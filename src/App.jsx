import { useState, useEffect, useCallback } from 'react'
import { 
  FileText, 
  Folder, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Trash2,
  Edit3,
  ChevronRight,
  ChevronDown,
  X,
  Pin,
  PinOff,
  Tag,
  Download,
  Layout,
  Type,
  Calendar,
  Clock,
  FileDown,
  Star,
  StarOff,
  Filter,
  XCircle
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState(['General', 'Work', 'Personal'])
  const [activeNote, setActiveNote] = useState(null)
  const [isEditing, setIsEditing] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState({})
  const [viewMode, setViewMode] = useState('edit') // edit, preview, split, canvas
  const [canvasData, setCanvasData] = useState({ cards: [], connections: [] })
  const [selectedTag, setSelectedTag] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [filterPinned, setFilterPinned] = useState(false)
  const [draggedNote, setDraggedNote] = useState(null)
  const [draggedOverFolder, setDraggedOverFolder] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [favoriteNotes, setFavoriteNotes] = useState([])
  const [noteColors, setNoteColors] = useState({})
  const [draggedCard, setDraggedCard] = useState(null)
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0 })
  const [selectedCard, setSelectedCard] = useState(null)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [isCanvasNote, setIsCanvasNote] = useState(false)
  const [draggingConnection, setDraggingConnection] = useState(null)
  const [connectionPoint, setConnectionPoint] = useState(null)
  const [cardColor, setCardColor] = useState('#ffffff')
  const [arrowColor, setArrowColor] = useState('#6366f1')
  const [cardWidth, setCardWidth] = useState(250)
  const [cardHeight, setCardHeight] = useState(200)
  const [contextMenu, setContextMenu] = useState(null)
  const [contextMenuType, setContextMenuType] = useState(null)
  const [resizingCard, setResizingCard] = useState(null)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [initialCardSize, setInitialCardSize] = useState({ width: 0, height: 0 })
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 })

  // Update toolbar state when card is selected
  useEffect(() => {
    if (selectedCard) {
      const card = canvasData.cards.find(c => c.id === selectedCard)
      if (card) {
        setCardColor(card.color || '#ffffff')
        setCardWidth(card.width || 250)
        setCardHeight(card.height || 200)
      }
    }
  }, [selectedCard, canvasData.cards])

  // Load data from localStorage on mount
  useEffect(() => {
    let savedNotes = null
    try {
      savedNotes = localStorage.getItem('notecanvas-notes')
      const savedFolders = localStorage.getItem('notecanvas-folders')
      const savedDarkMode = localStorage.getItem('notecanvas-darkmode')
      
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes))
        } catch (e) {
          console.error('Error loading notes:', e)
        }
      }
      if (savedFolders) {
        try {
          setFolders(JSON.parse(savedFolders))
        } catch (e) {
          console.error('Error loading folders:', e)
        }
      }
      if (savedDarkMode) {
        try {
          setDarkMode(JSON.parse(savedDarkMode))
        } catch (e) {
          console.error('Error loading dark mode:', e)
        }
      }
      
      // Initialize all folders as expanded
      if (savedFolders) {
        try {
          const expanded = {}
          JSON.parse(savedFolders).forEach(f => expanded[f] = true)
          setExpandedFolders(expanded)
        } catch (e) {
          console.error('Error initializing folders:', e)
        }
      }
      
      // Load favorites and note colors
      const savedFavorites = localStorage.getItem('notecanvas-favorites')
      const savedColors = localStorage.getItem('notecanvas-colors')
      if (savedFavorites) {
        try {
          setFavoriteNotes(JSON.parse(savedFavorites))
        } catch (e) {
          console.error('Error loading favorites:', e)
        }
      }
      if (savedColors) {
        try {
          setNoteColors(JSON.parse(savedColors))
        } catch (e) {
          console.error('Error loading colors:', e)
        }
      }
      
      // Load canvas data
      const savedCanvasData = localStorage.getItem('notecanvas-canvas')
      if (savedCanvasData) {
        try {
          setCanvasData(JSON.parse(savedCanvasData))
        } catch (e) {
          console.error('Error loading canvas data:', e)
        }
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e)
    }
    
    // Initialize with welcome note if no notes exist
    if (!savedNotes) {
      const welcomeNote = {
        id: Date.now(),
        title: 'Welcome to NoteCanvas',
        content: `# Welcome to NoteCanvas! 🎨

This is your new **markdown-based note-taking app**. Here are some features to get you started:

## ✨ Features

- **Markdown Support**: Write in markdown with live preview
- **Folder Organization**: Keep your notes organized in folders
- **Tags System**: Add tags to categorize and filter notes
- **Pin Notes**: Pin important notes to the top
- **Split View**: Edit and preview side by side
- **Dark Mode**: Toggle between light and dark themes
- **Search**: Quickly find your notes with filters
- **Templates**: Use pre-made note templates
- **Export**: Download notes as Markdown files
- **Keyboard Shortcuts**: Speed up your workflow
- **Local Storage**: Your notes are saved automatically in your browser

## 🚀 Getting Started

1. Click the **+** button to create a new note
2. Use the sidebar to navigate between folders
3. Toggle between **Edit**, **Preview**, and **Split** modes
4. Add tags to organize your notes
5. Pin important notes for quick access
6. Press **Ctrl+/** to see keyboard shortcuts

## 📝 Markdown Examples

### Text Formatting

- **Bold text** using \`**text**\`
- *Italic text* using \`*text*\`
- ~~Strikethrough~~ using \`~~text~~\`

### Task Lists

- [x] Completed task
- [ ] Pending task

### Tables

| Feature | Status |
|---------|--------|
| Tags | ✅ |
| Pinning | ✅ |
| Split View | ✅ |

### Code

Inline \`code\` or code blocks:

\`\`\`javascript
const greeting = "Hello, NoteCanvas!";
console.log(greeting);
\`\`\`

### Links

[Visit GitHub](https://github.com)

---

Happy note-taking! ✨`,
        folder: 'General',
        tags: ['welcome', 'tutorial'],
        pinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes([welcomeNote])
      setActiveNote(welcomeNote)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('notecanvas-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('notecanvas-folders', JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    localStorage.setItem('notecanvas-darkmode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('notecanvas-favorites', JSON.stringify(favoriteNotes))
  }, [favoriteNotes])

  useEffect(() => {
    localStorage.setItem('notecanvas-colors', JSON.stringify(noteColors))
  }, [noteColors])

  useEffect(() => {
    localStorage.setItem('notecanvas-canvas', JSON.stringify(canvasData))
  }, [canvasData])

  const createNote = (template = null) => {
    const templates = {
      basic: {
        title: 'New Note',
        content: '# New Note\n\nStart writing here...'
      },
      journal: {
        title: 'Journal Entry',
        content: `# Journal Entry\n\n**Date:** ${new Date().toLocaleDateString()}\n**Mood:** \n\n## Thoughts\n\n## Gratitude\n- \n- \n\n## Goals\n- \n- \n`
      },
      canvas: {
        title: 'Canvas Note',
        content: `# Canvas Note 🎨

This is a **Canvas Note** - a visual space to organize your ideas.

## How to Use Canvas Mode

1. Click anywhere on the canvas to create cards
2. Drag cards to reposition them
3. Shift+click two cards to connect them with an arrow
4. Use it for brainstorming, mind mapping, and visual planning

## Canvas Features

- **Infinite canvas space** for your ideas
- **Drag and drop** cards to organize
- **Connect cards** with arrows
- **Visual brainstorming** and planning
- **Mind mapping** capabilities

## Tips

- Use canvas for brainstorming sessions
- Create mind maps for complex topics
- Plan projects visually
- Connect related ideas with arrows

---

Start creating cards on the canvas!`,
        isCanvas: true
      }
    }

    const selectedTemplate = template ? templates[template] : templates.basic
    const newNote = {
      id: Date.now(),
      title: selectedTemplate.title,
      content: selectedTemplate.content,
      folder: folders[0],
      tags: [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCanvas: selectedTemplate.isCanvas || false
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
    setIsEditing(true)
    setShowTemplates(false)
    if (selectedTemplate.isCanvas) {
      setViewMode('canvas')
      setIsCanvasNote(true)
    } else {
      setViewMode('edit')
      setIsCanvasNote(false)
    }
  }

  const updateNote = (field, value) => {
    if (!activeNote) return
    
    const updatedNote = {
      ...activeNote,
      [field]: value,
      updatedAt: new Date().toISOString()
    }
    
    setNotes(notes.map(note => 
      note.id === activeNote.id ? updatedNote : note
    ))
    setActiveNote(updatedNote)
  }

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (activeNote?.id === noteId) {
      setActiveNote(null)
    }
  }

  const selectNote = (note) => {
    setActiveNote(note)
    if (note?.isCanvas) {
      setViewMode('canvas')
      setIsCanvasNote(true)
    } else {
      setViewMode('edit')
      setIsCanvasNote(false)
    }
  }

  const createFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (folderName && !folders.includes(folderName)) {
      setFolders([...folders, folderName])
    }
  }

  const deleteFolder = (folderName) => {
    if (confirm(`Delete folder "${folderName}" and all its notes?`)) {
      setFolders(folders.filter(f => f !== folderName))
      setNotes(notes.filter(note => note.folder !== folderName))
      if (activeNote?.folder === folderName) {
        setActiveNote(null)
      }
    }
  }

  const renameFolder = (oldName) => {
    const newName = prompt('Enter new folder name:', oldName)
    if (newName && newName !== oldName && !folders.includes(newName)) {
      setFolders(folders.map(f => f === oldName ? newName : f))
      setNotes(notes.map(note => 
        note.folder === oldName ? { ...note, folder: newName } : note
      ))
      setExpandedFolders(prev => {
        const newExpanded = { ...prev }
        delete newExpanded[oldName]
        newExpanded[newName] = true
        return newExpanded
      })
    }
  }

  const togglePin = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ))
    if (activeNote?.id === noteId) {
      setActiveNote(prev => ({ ...prev, pinned: !prev.pinned }))
    }
  }

  const addTag = (tag) => {
    if (!activeNote || !tag.trim() || activeNote.tags?.includes(tag.trim())) return
    updateNote('tags', [...(activeNote.tags || []), tag.trim()])
  }

  const removeTag = (tagToRemove) => {
    if (!activeNote) return
    updateNote('tags', activeNote.tags.filter(tag => tag !== tagToRemove))
  }

  const exportNote = () => {
    if (!activeNote) return
    const blob = new Blob([activeNote.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getAllTags = () => {
    const allTags = new Set()
    notes.forEach(note => {
      (note.tags || []).forEach(tag => allTags.add(tag))
    })
    return Array.from(allTags)
  }

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharacterCount = (text) => {
    return text.length
  }

  const duplicateNote = () => {
    if (!activeNote) return
    const duplicatedNote = {
      ...activeNote,
      id: Date.now(),
      title: `${activeNote.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes([duplicatedNote, ...notes])
    setActiveNote(duplicatedNote)
  }

  const toggleFavorite = (noteId) => {
    if (favoriteNotes.includes(noteId)) {
      setFavoriteNotes(favoriteNotes.filter(id => id !== noteId))
    } else {
      setFavoriteNotes([...favoriteNotes, noteId])
    }
  }

  const setNoteColor = (noteId, color) => {
    setNoteColors(prev => ({
      ...prev,
      [noteId]: color
    }))
  }

  const handleDragStart = (e, noteId) => {
    setDraggedNote(noteId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetNoteId) => {
    e.preventDefault()
    if (!draggedNote || draggedNote === targetNoteId) return

    const draggedIndex = notes.findIndex(n => n.id === draggedNote)
    const targetIndex = notes.findIndex(n => n.id === targetNoteId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newNotes = [...notes]
    const [draggedNoteData] = newNotes.splice(draggedIndex, 1)
    newNotes.splice(targetIndex, 0, draggedNoteData)

    setNotes(newNotes)
    setDraggedNote(null)
  }

  const handleFolderDragOver = (e, folder) => {
    e.preventDefault()
    setDraggedOverFolder(folder)
  }

  const handleFolderDrop = (e, folder) => {
    e.preventDefault()
    if (!draggedNote) return

    const noteToMove = notes.find(n => n.id === draggedNote)
    if (!noteToMove || noteToMove.folder === folder) return

    setNotes(notes.map(note =>
      note.id === draggedNote ? { ...note, folder: folder } : note
    ))
    setDraggedNote(null)
    setDraggedOverFolder(null)
  }

  const addCanvasCard = (x, y, content = '', type = 'text', width = 250, height = 200, color = '#ffffff') => {
    const newCard = {
      id: Date.now(),
      x: x,
      y: y,
      width: width,
      height: height,
      content: content || 'New card - click to edit',
      type: type,
      noteId: type === 'note' ? null : null,
      color: color
    }
    setCanvasData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }))
  }

  const addNoteToCanvas = (noteId, x, y, color = '#ffffff') => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    const newCard = {
      id: Date.now(),
      x: x,
      y: y,
      width: 300,
      height: 250,
      content: note.content,
      type: 'note',
      noteId: noteId,
      title: note.title,
      color: color
    }
    setCanvasData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }))
  }

  const addConnection = (fromCardId, toCardId, fromSide = 'right', toSide = 'left', color = '#6366f1') => {
    if (fromCardId === toCardId) return
    
    // Check if connection already exists
    const exists = canvasData.connections.some(
      conn => conn.from === fromCardId && conn.to === toCardId
    )
    if (exists) return

    setCanvasData(prev => ({
      ...prev,
      connections: [...prev.connections, { from: fromCardId, to: toCardId, fromSide, toSide, color, id: Date.now() }]
    }))
  }

  const deleteConnection = (connectionId) => {
    setCanvasData(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }))
  }

  const updateCanvasCard = (cardId, updates) => {
    setCanvasData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    }))
  }

  const deleteCanvasCard = (cardId) => {
    setCanvasData(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== cardId),
      connections: prev.connections.filter(conn => conn.from !== cardId && conn.to !== cardId)
    }))
  }

  const handleCardDragStart = (e, card) => {
    setDraggedCard(card.id)
    const rect = e.target.getBoundingClientRect()
    setCardOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleCardDrag = (e) => {
    if (!draggedCard) return
    const card = canvasData.cards.find(c => c.id === draggedCard)
    if (!card) return

    const canvas = document.getElementById('canvas-container')
    const canvasRect = canvas.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - cardOffset.x
    const newY = e.clientY - canvasRect.top - cardOffset.y

    updateCanvasCard(draggedCard, { x: newX, y: newY })
  }

  const handleCardDragEnd = () => {
    setDraggedCard(null)
  }

  const handleCanvasClick = (e) => {
    if (e.target.id === 'canvas-container') {
      closeContextMenu()
      if (connectingFrom) {
        setConnectingFrom(null)
        return
      }
      const canvas = document.getElementById('canvas-container')
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      addCanvasCard(x, y)
    }
  }

  const handleCardClick = (e, cardId) => {
    e.stopPropagation()
    if (e.shiftKey) {
      if (connectingFrom === null) {
        setConnectingFrom(cardId)
      } else if (connectingFrom !== cardId) {
        addConnection(connectingFrom, cardId)
        setConnectingFrom(null)
      }
    } else {
      setSelectedCard(cardId)
    }
  }

  const handleCardRightClick = (e, cardId) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedCard(cardId)
    setContextMenu({ x: e.clientX, y: e.clientY, cardId })
    setContextMenuType('card')
  }

  const handleConnectionRightClick = (e, connectionId) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, connectionId })
    setContextMenuType('connection')
  }

  const closeContextMenu = () => {
    setContextMenu(null)
    setContextMenuType(null)
  }

  const handleResizeStart = (e, cardId, handle) => {
    e.preventDefault()
    e.stopPropagation()
    const card = canvasData.cards.find(c => c.id === cardId)
    if (!card) return
    setResizingCard(cardId)
    setResizeHandle(handle)
    setInitialCardSize({ width: card.width, height: card.height })
    setInitialMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleResizeDrag = (e) => {
    if (!resizingCard || !resizeHandle) return
    const card = canvasData.cards.find(c => c.id === resizingCard)
    if (!card) return

    const deltaX = e.clientX - initialMousePos.x
    const deltaY = e.clientY - initialMousePos.y

    let newWidth = initialCardSize.width
    let newHeight = initialCardSize.height

    switch (resizeHandle) {
      case 'se':
        newWidth = Math.max(100, initialCardSize.width + deltaX)
        newHeight = Math.max(100, initialCardSize.height + deltaY)
        break
      case 'sw':
        newWidth = Math.max(100, initialCardSize.width - deltaX)
        newHeight = Math.max(100, initialCardSize.height + deltaY)
        break
      case 'ne':
        newWidth = Math.max(100, initialCardSize.width + deltaX)
        newHeight = Math.max(100, initialCardSize.height - deltaY)
        break
      case 'nw':
        newWidth = Math.max(100, initialCardSize.width - deltaX)
        newHeight = Math.max(100, initialCardSize.height - deltaY)
        break
    }

    updateCanvasCard(resizingCard, { width: newWidth, height: newHeight })
  }

  const handleResizeEnd = () => {
    setResizingCard(null)
    setResizeHandle(null)
  }

  const handleConnectionPointClick = (e, cardId, side) => {
    e.stopPropagation()
    if (connectingFrom === null) {
      setConnectingFrom(cardId)
      setConnectionPoint(side)
    } else if (connectingFrom !== cardId) {
      addConnection(connectingFrom, cardId, connectionPoint, side, arrowColor)
      setConnectingFrom(null)
      setConnectionPoint(null)
    } else {
      setConnectingFrom(null)
      setConnectionPoint(null)
    }
  }

  const getConnectionPointPosition = (card, side) => {
    switch (side) {
      case 'top':
        return { x: card.x + card.width / 2, y: card.y }
      case 'right':
        return { x: card.x + card.width, y: card.y + card.height / 2 }
      case 'bottom':
        return { x: card.x + card.width / 2, y: card.y + card.height }
      case 'left':
        return { x: card.x, y: card.y + card.height / 2 }
      default:
        return { x: card.x + card.width / 2, y: card.y + card.height / 2 }
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            createNote()
            break
          case 'p':
            e.preventDefault()
            if (activeNote) togglePin(activeNote.id)
            break
          case 'e':
            e.preventDefault()
            setViewMode('edit')
            break
          case '/':
            e.preventDefault()
            setShowShortcuts(!showShortcuts)
            break
        }
      }
      if (e.key === 'Escape') {
        setShowTemplates(false)
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeNote, showShortcuts])

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }))
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || (note.tags || []).includes(selectedTag)
    const matchesPin = !filterPinned || note.pinned
    return matchesSearch && matchesTag && matchesPin
  })

  const notesByFolder = folders.reduce((acc, folder) => {
    const folderNotes = filteredNotes.filter(note => note.folder === folder)
    // Sort pinned notes first, then by date
    folderNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    acc[folder] = folderNotes
    return acc
  }, {})

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <img src="/logo.png" alt="NoteCanvas" className="w-6 h-6" />
              {sidebarCollapsed ? 'NC' : 'NoteCanvas'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle sidebar"
              >
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5 rotate-180" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Search */}
          {!sidebarCollapsed && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              
              {/* Filter buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setFilterPinned(!filterPinned)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    filterPinned 
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  Pinned
                </button>
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Type className="w-3 h-3" />
                  Shortcuts
                </button>
              </div>
            </>
          )}
        </div>

        {/* Folders & Notes */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {!sidebarCollapsed ? (
            <>
              {folders.map(folder => (
                <div key={folder}>
                  <div 
                    className={`flex items-center justify-between group rounded-lg transition-colors ${
                      draggedOverFolder === folder ? 'bg-primary-100 dark:bg-primary-900/30' : ''
                    }`}
                    onDragOver={(e) => handleFolderDragOver(e, folder)}
                    onDrop={(e) => handleFolderDrop(e, folder)}
                    onDragLeave={() => setDraggedOverFolder(null)}
                  >
                    <button
                      onClick={() => toggleFolder(folder)}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {expandedFolders[folder] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <Folder className="w-4 h-4" />
                      <span className="font-medium">{folder}</span>
                      <span className="text-xs text-gray-400">
                        {notesByFolder[folder]?.length || 0}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => renameFolder(folder)}
                        className="p-1 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteFolder(folder)}
                        className="p-1 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedFolders[folder] && notesByFolder[folder]?.map(note => (
                    <div
                      key={note.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, note.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, note.id)}
                      className={`w-full text-left pl-8 pr-2 py-2 rounded-lg text-sm transition-colors group cursor-move ${
                        activeNote?.id === note.id
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${draggedNote === note.id ? 'opacity-50' : ''}`}
                      style={{ 
                        borderLeft: noteColors[note.id] ? `3px solid ${noteColors[note.id]}` : 'none'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-2 flex-1 min-w-0"
                          onClick={() => selectNote(note)}
                        >
                          {note.pinned && <Pin className="w-3 h-3 text-primary-500 flex-shrink-0" />}
                          {favoriteNotes.includes(note.id) && <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                          <span className="truncate">{note.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(note.id)
                            }}
                            className="p-1 hover:text-yellow-500"
                            title="Toggle favorite"
                          >
                            {favoriteNotes.includes(note.id) ? <StarOff className="w-3 h-3 text-yellow-500" /> : <Star className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePin(note.id)
                            }}
                            className="p-1 hover:text-primary-600 dark:hover:text-primary-400"
                            title="Toggle pin"
                          >
                            {note.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNote(note.id)
                            }}
                            className="p-1 hover:text-red-500"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <button
                onClick={createFolder}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </button>

              {/* Tags Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tags</span>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {getAllTags().map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedTag === tag
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Collapsed sidebar - show icons only
            <div className="flex flex-col items-center gap-2">
              {folders.map(folder => (
                <div key={folder} className="w-full">
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="w-full flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title={folder}
                  >
                    <Folder className="w-5 h-5" />
                  </button>
                  {expandedFolders[folder] && notesByFolder[folder]?.map(note => (
                    <button
                      key={note.id}
                      onClick={() => selectNote(note)}
                      className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                        activeNote?.id === note.id
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={note.title}
                      style={{ 
                        borderLeft: noteColors[note.id] ? `3px solid ${noteColors[note.id]}` : 'none'
                      }}
                    >
                      {note.pinned && <Pin className="w-4 h-4 text-primary-500" />}
                      {favoriteNotes.includes(note.id) && <Star className="w-4 h-4 text-yellow-500" />}
                      {!note.pinned && !favoriteNotes.includes(note.id) && <FileText className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Note Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed ? (
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
              
              {/* Templates Dropdown */}
              {showTemplates && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => createNote('basic')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Basic Note
                  </button>
                  <button
                    onClick={() => createNote('journal')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Journal Entry
                  </button>
                  <button
                    onClick={() => createNote('canvas')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Layout className="w-4 h-4 inline mr-2" />
                    Canvas Note
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={createNote}
              className="w-full flex items-center justify-center p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              title="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        {activeNote ? (
          <>
            {/* Note Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote('title', e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-800 dark:text-white flex-1"
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'edit'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                    }`}
                    title="Edit mode (Ctrl+E)"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(activeNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favoriteNotes.includes(activeNote.id)
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                    }`}
                    title="Toggle favorite"
                  >
                    {favoriteNotes.includes(activeNote.id) ? <StarOff className="w-5 h-5 text-yellow-500" /> : <Star className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => togglePin(activeNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      activeNote.pinned
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                    }`}
                    title="Pin note (Ctrl+P)"
                  >
                    {activeNote.pinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={duplicateNote}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    title="Duplicate note"
                  >
                    <FileDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={exportNote}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    title="Export note"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <select
                  value={activeNote.folder}
                  onChange={(e) => updateNote('folder', e.target.value)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {folders.map(folder => (
                    <option key={folder} value={folder} className="dark:bg-gray-800">
                      {folder}
                    </option>
                  ))}
                </select>
                <span>•</span>
                <span>Last updated: {new Date(activeNote.updatedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{getWordCount(activeNote.content)} words</span>
                <span>•</span>
                <span>{getCharacterCount(activeNote.content)} characters</span>
              </div>

              {/* Tags Input */}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {(activeNote.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-xs"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="bg-transparent border-none focus:outline-none text-sm text-gray-500 dark:text-gray-400 w-24"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Note Color:</span>
                <div className="flex gap-1">
                  {['transparent', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNoteColor(activeNote.id, color === 'transparent' ? null : color)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        noteColors[activeNote.id] === color || (color === 'transparent' && !noteColors[activeNote.id])
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-110'
                      }`}
                      style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
                      title={color === 'transparent' ? 'No color' : color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'canvas' ? (
                <div 
                  id="canvas-container"
                  className="w-full h-full bg-gray-100 dark:bg-gray-900 overflow-auto relative cursor-crosshair"
                  onClick={handleCanvasClick}
                  onMouseMove={(e) => {
                    handleCardDrag(e)
                    handleResizeDrag(e)
                  }}
                  onMouseUp={() => {
                    handleCardDragEnd()
                    handleResizeEnd()
                  }}
                >
                  <div className="absolute inset-0" style={{ width: '5000px', height: '5000px' }}>
                    {/* Connection lines */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                      {canvasData.connections.map(conn => {
                        const fromCard = canvasData.cards.find(c => c.id === conn.from)
                        const toCard = canvasData.cards.find(c => c.id === conn.to)
                        if (!fromCard || !toCard) return null
                        
                        const fromPos = getConnectionPointPosition(fromCard, conn.fromSide || 'right')
                        const toPos = getConnectionPointPosition(toCard, conn.toSide || 'left')
                        const color = conn.color || '#6366f1'
                        
                        return (
                          <g key={conn.id} onContextMenu={(e) => handleConnectionRightClick(e, conn.id)} style={{ cursor: 'context-menu' }}>
                            <line
                              x1={fromPos.x}
                              y1={fromPos.y}
                              x2={toPos.x}
                              y2={toPos.y}
                              stroke={color}
                              strokeWidth="2"
                              markerEnd={`url(#arrowhead-${conn.id})`}
                              style={{ pointerEvents: 'stroke' }}
                            />
                            <circle
                              cx={fromPos.x}
                              cy={fromPos.y}
                              r="4"
                              fill={color}
                              style={{ pointerEvents: 'all', cursor: 'context-menu' }}
                            />
                            <circle
                              cx={toPos.x}
                              cy={toPos.y}
                              r="4"
                              fill={color}
                              style={{ pointerEvents: 'all', cursor: 'context-menu' }}
                            />
                          </g>
                        )
                      })}
                      {canvasData.connections.map(conn => (
                        <defs key={`defs-${conn.id}`}>
                          <marker
                            id={`arrowhead-${conn.id}`}
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3.5, 0 7"
                              fill={conn.color || '#6366f1'}
                            />
                          </marker>
                        </defs>
                      ))}
                    </svg>

                    {/* Cards */}
                    {canvasData.cards.map(card => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, card)}
                        onClick={(e) => handleCardClick(e, card.id)}
                        onContextMenu={(e) => handleCardRightClick(e, card.id)}
                        className={`absolute rounded-lg shadow-lg border-2 transition-colors group ${
                          selectedCard === card.id
                            ? 'border-primary-500 dark:border-primary-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400'
                        } ${connectingFrom === card.id ? 'border-yellow-500' : ''}`}
                        style={{
                          left: card.x,
                          top: card.y,
                          width: card.width,
                          height: card.height,
                          cursor: 'move',
                          backgroundColor: card.color || '#ffffff'
                        }}
                      >
                        <div className="p-3 h-full flex flex-col">
                          {card.type === 'note' && card.title && (
                            <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {card.title}
                            </div>
                          )}
                          <textarea
                            className="flex-1 bg-transparent border-none focus:outline-none resize-none text-sm text-gray-800 dark:text-gray-200"
                            value={card.content}
                            onChange={(e) => updateCanvasCard(card.id, { content: e.target.value })}
                            placeholder="Type here..."
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCanvasCard(card.id)
                            }}
                            className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Connection points */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleConnectionPointClick(e, card.id, 'top')}
                            className="w-3 h-3 bg-primary-500 rounded-full hover:bg-primary-600 hover:scale-125 transition-all"
                            title="Connect from top"
                          />
                        </div>
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleConnectionPointClick(e, card.id, 'right')}
                            className="w-3 h-3 bg-primary-500 rounded-full hover:bg-primary-600 hover:scale-125 transition-all"
                            title="Connect from right"
                          />
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleConnectionPointClick(e, card.id, 'bottom')}
                            className="w-3 h-3 bg-primary-500 rounded-full hover:bg-primary-600 hover:scale-125 transition-all"
                            title="Connect from bottom"
                          />
                        </div>
                        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleConnectionPointClick(e, card.id, 'left')}
                            className="w-3 h-3 bg-primary-500 rounded-full hover:bg-primary-600 hover:scale-125 transition-all"
                            title="Connect from left"
                          />
                        </div>

                        {/* Resize handles */}
                        <div
                          onMouseDown={(e) => handleResizeStart(e, card.id, 'nw')}
                          className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div
                          onMouseDown={(e) => handleResizeStart(e, card.id, 'ne')}
                          className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div
                          onMouseDown={(e) => handleResizeStart(e, card.id, 'sw')}
                          className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div
                          onMouseDown={(e) => handleResizeStart(e, card.id, 'se')}
                          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Context Menu */}
                  {contextMenu && contextMenuType === 'card' && (
                    <div
                      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50"
                      style={{ left: contextMenu.x, top: contextMenu.y }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Card Options</div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Color</div>
                        <div className="flex gap-1 flex-wrap">
                          {['#ffffff', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#fee2e2', '#f3f4f6', '#e5e7eb'].map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setCardColor(color)
                                if (contextMenu.cardId) {
                                  updateCanvasCard(contextMenu.cardId, { color })
                                }
                              }}
                              className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                                cardColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (contextMenu.cardId) {
                            deleteCanvasCard(contextMenu.cardId)
                            setSelectedCard(null)
                          }
                          closeContextMenu()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}

                  {contextMenu && contextMenuType === 'connection' && (
                    <div
                      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50"
                      style={{ left: contextMenu.x, top: contextMenu.y }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Arrow Options</div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Color</div>
                        <div className="flex gap-1 flex-wrap">
                          {['#6366f1', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#6b7280'].map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                if (contextMenu.connectionId) {
                                  setCanvasData(prev => ({
                                    ...prev,
                                    connections: prev.connections.map(conn =>
                                      conn.id === contextMenu.connectionId ? { ...conn, color } : conn
                                    )
                                  }))
                                }
                                closeContextMenu()
                              }}
                              className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                                arrowColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (contextMenu.connectionId) {
                            deleteConnection(contextMenu.connectionId)
                          }
                          closeContextMenu()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Simple toolbar for adding cards */}
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const canvas = document.getElementById('canvas-container')
                        const rect = canvas.getBoundingClientRect()
                        addCanvasCard(rect.left + 100, rect.top + 100, '', 'text', cardWidth, cardHeight, cardColor)
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Card
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const canvas = document.getElementById('canvas-container')
                            const rect = canvas.getBoundingClientRect()
                            addNoteToCanvas(parseInt(e.target.value), rect.left + 100, rect.top + 100, cardColor)
                            e.target.value = ''
                          }
                        }}
                        className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                      >
                        <option value="">Embed note...</option>
                        {notes.map(note => (
                          <option key={note.id} value={note.id}>{note.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Right-click</strong> cards/arrows for options</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => updateNote('content', e.target.value)}
                    className="w-full h-full bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
                    placeholder="Start writing in Markdown..."
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No note selected
              </h2>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Select a note from the sidebar or create a new one
              </p>
              <div className="flex flex-col gap-2 items-center">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create New Note
                </button>
                {showTemplates && (
                  <div className="flex flex-col gap-2 mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => createNote('basic')}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="w-4 h-4" />
                      Basic Note
                    </button>
                    <button
                      onClick={() => createNote('journal')}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                    >
                      <Type className="w-4 h-4" />
                      Journal Entry
                    </button>
                    <button
                      onClick={() => createNote('canvas')}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                    >
                      <Layout className="w-4 h-4" />
                      Canvas Note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">New Note</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Ctrl+N</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Pin Note</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Ctrl+P</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Edit Mode</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Ctrl+E</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Ctrl+/</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Close Modal</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
