# Gallery System Architecture Documentation

This document provides a comprehensive overview of the gallery system architecture, including its components, data flow, and key features.

## System Overview

The gallery system is a React-based application that provides a dynamic, window-based interface for viewing and navigating media content. It supports:
- Dynamic loading of media files
- Directory-based navigation
- Interactive windows with drag functionality
- Multiple image resolution variants
- Thumbnail previews for directories

## Core Components

### 1. DynamicGalleryPage (`src/Pages/DynamicGallery.jsx`)

The main page component that orchestrates the gallery functionality.

#### Key Functions:

```javascript
extractMediaFiles(nodes, targetPath)
```
- Purpose: Extracts media files based on directory level
- Parameters:
  - nodes: Directory tree nodes
  - targetPath: Target path to filter files
- Returns: Array of filtered media files and directory previews

```javascript
groupFilesByVariants(files)
```
- Purpose: Groups GIF files by base name with resolution variants
- Parameters:
  - files: Array of media file objects
- Returns: Object grouping files by base name with variants

```javascript
processMediaFiles(files)
```
- Purpose: Processes media files into gallery-compatible format
- Parameters:
  - files: Array of media file objects
- Returns: Array of processed image objects for gallery display

### 2. Media Scanner (`src/media/mediaScanner.js`)

Handles media file discovery and organization.

#### Key Functions:

```javascript
scanMediaDirectory()
```
- Purpose: Scans for media files and builds directory tree
- Returns: Promise resolving to tree structure of media files

```javascript
getMediaUrl(mediaPath)
```
- Purpose: Generates URL for media file access
- Parameters:
  - mediaPath: Path to media file
- Returns: URL for accessing the media file

### 3. Gallery Component (`src/components/gallery/index.jsx`)

Renders the gallery interface and manages window interactions.

#### Components:

##### Gallery
- Purpose: Main gallery grid display
- Props:
  - images: Array of image objects
- Features:
  - Thumbnail grid display
  - Window management
  - Directory navigation

##### ImageThumbnail
- Purpose: Individual thumbnail display
- Props:
  - src: Image source URL
  - alt: Alternative text
  - isDirectory: Directory indicator
  - onClick: Click handler

##### GalleryWindow
- Purpose: Floating window for full-size image display
- Props:
  - id: Window identifier
  - imageUrl: Full-size image URL
  - toggleVisibility: Visibility toggle function

## Data Flow

1. Application Initialization:
   ```
   App.jsx
   ├─> scanMediaDirectory()
   ├─> Creates navigation tree
   └─> Sets up routing
   ```

2. Gallery Page Load:
   ```
   DynamicGalleryPage
   ├─> Loads media directory
   ├─> Processes media files
   └─> Renders Gallery component
   ```

3. User Interaction:
   ```
   Gallery Component
   ├─> Thumbnail click
   │   └─> Opens window or navigates directory
   ├─> Window drag
   └─> Window close
   ```

## File Structure

```
src/
├── Pages/
│   └── DynamicGallery.jsx       # Main gallery page
├── components/
│   └── gallery/
│       └── index.jsx            # Gallery components
├── media/
│   └── mediaScanner.js          # Media file handling
└── config/
    └── imageResolutions.js      # Resolution configurations
```

## Media File Organization

### Directory Structure
```
media/
└── category/
    └── subcategory/
        ├── image-50.gif      # Thumbnail
        ├── image-300.gif     # Medium size
        └── image-1000.gif    # Full size
```

### Naming Convention
- Format: `name-resolution.gif`
- Example: `1-0.2-50.gif`
  - Base name: `1-0.2`
  - Resolution: `50`

## Window Management

### Window Creation
1. User clicks thumbnail
2. Window position calculated
3. Window registered with context
4. Window becomes active

### Window Properties
- Draggable header
- Resizable content area
- Close button
- Z-index management

### Error Handling
1. Handle missing files gracefully
2. Provide fallback thumbnails
3. Log scanning errors

## Configuration

### Image Resolutions
Defined in `src/config/imageResolutions.js`:
- small: 50px (thumbnails)
- medium: 300px (preview)
- large: 1000px (full size)

## Security Considerations

1. File Access
   - Validate file paths
   - Restrict to media directory
   - Sanitize file names

2. Resource Management
   - Limit concurrent windows
   - Clean up unused resources
   - Handle memory efficiently

