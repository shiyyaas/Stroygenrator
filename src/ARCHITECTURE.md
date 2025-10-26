# Keys of Creation - Architecture Documentation

## Component Structure

The application has been fully refactored into granular, modular components. Every UI element is now a separate, reusable component for maximum flexibility and ease of design.

### Core Components

#### `/App.tsx`
Main application orchestrator that:
- Manages application state using custom hooks
- Coordinates between different views (Intro, Multiverse, World)
- Renders layout and UI components

#### `/components/AppLayout.tsx`
Root layout wrapper that provides:
- Screen container with overflow handling
- Background gradient styling
- Consistent border radius

### Layout Components (`/components/layout/`)

#### `ScreenContainer.tsx`
Root screen wrapper:
- Full viewport dimensions
- Relative positioning
- Props: `children`

#### `OverflowContainer.tsx`
Overflow management:
- Hides content overflow
- Full width/height
- Props: `children`

#### `GradientBackground.tsx`
Configurable gradient backgrounds:
- Customizable colors and direction
- Props: `children`, `from`, `to`, `via`, `direction`

#### `RoundedBorder.tsx`
Border radius wrapper:
- Configurable radius
- Props: `children`, `radius`

### Intro Components (`/components/intro/`)

#### `IntroContainer.tsx`
Intro screen wrapper with animations:
- Motion fade-out animation
- Centered layout
- Gradient background

#### `IntroTitle.tsx`
Main title and branding:
- "Build Your Multiverse" heading
- Gradient underline accent

#### `IntroDescription.tsx`
App description text:
- Clear, concise explanation
- Welcoming tone

#### `KeyboardShortcut.tsx`
Individual keyboard hint:
- Icon + label display
- Glassmorphic kbd tag
- Props: `icon`, `label`

#### `KeyboardShortcuts.tsx`
All keyboard shortcuts display:
- Composites multiple KeyboardShortcut components
- Responsive flex layout

#### `IntroPrompt.tsx`
Call-to-action text:
- "Begin typing" prompt
- Subtle styling

#### `IntroInstructions.tsx`
Complete instructions section:
- Combines KeyboardShortcuts + IntroPrompt
- Organized spacing

### Typing Components (`/components/typing/`)

#### `TypingBufferContainer.tsx`
Container for typing display:
- Fixed position at top center
- Glassmorphic card design
- Props: `children`

#### `TypedWordDisplay.tsx`
Current word display:
- Spaced letter tracking
- Placeholder when empty
- Props: `word`

#### `CharacterCounter.tsx`
Character requirement helper:
- Shows remaining characters needed
- Props: `remaining`

#### `CreatePrompt.tsx`
Ready-to-create indicator:
- "Space to create" message
- Keyboard hint

### HUD Components

#### `/components/ModeIndicator.tsx`
World evolution mode indicator:
- Shows active world name
- Pulse animation
- Props: `worldWord`

#### `/components/WorldLimitWarning.tsx`
Maximum worlds alert:
- Warning icon + message
- Amber color scheme
- Auto-displays when limit reached

#### `/components/EmojiReference.tsx`
Emoji inspiration panel:
- Available emojis/words
- Only in multiverse view

#### `/components/TypingSound.tsx`
Audio feedback:
- Typing click sounds
- Web Audio API
- Props: `isTyping`

### View Components

#### `/components/CartoonMultiverse.tsx`
Main multiverse view:
- Draggable canvas with all world portals
- Spiral positioning algorithm
- World counter and navigation
- Props: `worlds`, `onWorldClick`, `activeWorldId`

#### `/components/CartoonWorldView.tsx`
Immersive single world view:
- Story display (centered, prominent)
- Emoji showcase
- Back/exit buttons
- Background themed to world
- Props: `world`, `onExit`

#### `/components/CartoonPortal.tsx`
Individual world portal in multiverse:
- Visual representation of world
- Click to enter
- Shows emojis and colors
- Props: `world`, `position`, `onClick`, `isActive`

### World Components (`/components/world/`)

#### `WorldBackground.tsx`
Animated gradient background for worlds:
- Dynamic colors based on world
- Full-screen fixed positioning
- Props: `children`, `primaryColor`, `backgroundColor`

#### `BackgroundEmojis.tsx`
Decorative background emojis:
- Large, rotated, low-opacity emojis
- Adds playful atmosphere
- Props: `emojis`

#### `EmojiHeader.tsx`
**MAIN FEATURE** - Displays all typed emojis in order:
- Large, cartoonish emoji cards (80x80px)
- Each emoji has order number badge
- Bouncy hover effects
- Gradient backgrounds
- Props: `emojis`, `primaryColor`, `accentColor`

#### `StoryContent.tsx`
**MAIN FEATURE** - Story display:
- Large, readable text (18px)
- Clean white background
- Rounded, playful card design
- Props: `story`

#### `StoryPanel.tsx`
Main content panel wrapper:
- Combines EmojiHeader + StoryContent
- Theme and metadata display
- Glassmorphic design
- Scale-in animation
- Props: `emojis`, `primaryColor`, `accentColor`, `word`, `theme`, `story`, `mood`, `energy`

#### `BackButton.tsx`
Navigation back to multiverse:
- Gradient icon background
- Hover scale effect
- Clear labeling
- Props: `onClick`

#### `EvolutionHint.tsx`
Typing prompt in world view:
- Bottom-centered positioning
- Animated pulse indicator
- Props: `message` (optional)

#### `WorldTitle.tsx`
World name and theme (no longer used in main view):
- Props: `word`, `theme`

#### `WorldMetadata.tsx`
World statistics badges:
- Mood, energy, emoji count
- Props: `mood`, `energy`, `emojiCount`

#### `MetadataBadge.tsx`
Individual metadata pill:
- Rounded badge design
- Props: `text`

### Custom Hooks

#### `/hooks/useTypingInput.ts`
Manages all keyboard and paste input:
- Handles typing, backspace, enter, space
- Auto-commit timer (1.5s after typing stops)
- Intro dismissal on first keystroke
- Escape key handling
- Returns: `typedWord`, `isTyping`, `setTypedWord`

**Props:**
- `minWordLength` - Minimum characters before word can be created
- `onCommitWord` - Callback when word is ready to create/evolve
- `onDismissIntro` - Callback to dismiss intro screen
- `onEscape` - Callback for escape key press
- `showIntro` - Whether intro is showing
- `activeWorldId` - Current active world ID

#### `/hooks/useWorldManagement.ts`
Manages world creation, evolution, and navigation:
- Creates new worlds from words
- Evolves existing worlds
- Manages world collection (max 10)
- Enter/exit world navigation
- Returns: `worlds`, `activeWorldId`, `currentWorld`, `processWord`, `enterWorld`, `exitWorld`

**Props:**
- `maxWorlds` - Maximum number of simultaneous worlds

### Utility Modules

#### `/utils/CartoonWorldGenerator.ts`
World generation logic:
- `generateCartoonWorld(word, id)` - Creates new world from word
- `evolveCartoonWorld(world, word)` - Adds word to existing world
- Emoji mapping and selection
- Story generation based on words
- Color palette generation

## Data Flow

```
User Types → useTypingInput → processWord → useWorldManagement → generateCartoonWorld
                    ↓                              ↓
              TypingBuffer                    Updates worlds array
                                                    ↓
                                              CartoonMultiverse
                                                    ↓
User Clicks Portal → enterWorld → sets activeWorldId → CartoonWorldView
```

## State Management

### Application State
- `showIntro` (boolean) - Controls intro screen visibility
- Managed in App.tsx

### World State (via useWorldManagement)
- `worlds` (CartoonWorld[]) - Array of all created worlds
- `activeWorldId` (string | null) - Currently viewed world
- `currentWorld` (CartoonWorld | null) - Full world object for active world

### Typing State (via useTypingInput)
- `typedWord` (string) - Current text being typed
- `isTyping` (boolean) - Whether user is actively typing (for sound)
- `wordCommitTimeout` (NodeJS.Timeout | null) - Auto-commit timer

## Constants

```typescript
MAX_WORLDS = 10          // Maximum simultaneous worlds
MIN_WORD_LENGTH = 3      // Minimum characters to create world
```

## Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily styled or replaced
3. **Custom Hooks**: Business logic separated from UI
4. **Type Safety**: TypeScript interfaces for all props
5. **Clean Code**: Clear naming, comments, and structure

## How to Modify

### Change Intro Screen Design
- **Overall layout**: `/components/IntroScreen.tsx`
- **Title style**: `/components/intro/IntroTitle.tsx`
- **Description text**: `/components/intro/IntroDescription.tsx`
- **Keyboard hints**: `/components/intro/KeyboardShortcut.tsx`
- **Background**: `/components/intro/IntroContainer.tsx`

### Modify Typing Buffer Style
- **Overall layout**: `/components/TypingBuffer.tsx`
- **Word display**: `/components/typing/TypedWordDisplay.tsx`
- **Character counter**: `/components/typing/CharacterCounter.tsx`
- **Create prompt**: `/components/typing/CreatePrompt.tsx`
- **Container style**: `/components/typing/TypingBufferContainer.tsx`

### Customize World View (Main UI)
- **Overall composition**: `/components/CartoonWorldView.tsx`
- **Emoji header** (main feature): `/components/world/EmojiHeader.tsx`
  - Change emoji card size, spacing, animations
  - Modify order badges
  - Adjust hover effects
- **Story display** (main feature): `/components/world/StoryContent.tsx`
  - Change text size, padding, background
  - Modify story card style
- **Background gradient**: `/components/world/WorldBackground.tsx`
- **Background emojis**: `/components/world/BackgroundEmojis.tsx`
- **Back button**: `/components/world/BackButton.tsx`
- **Evolution hint**: `/components/world/EvolutionHint.tsx`

### Adjust World Generation & Stories
- **World logic**: `/utils/CartoonWorldGenerator.ts`
  - Modify story templates
  - Change emoji mappings
  - Adjust color palettes

### Change Input Behavior
- **Keyboard handling**: `/hooks/useTypingInput.ts`
  - Modify auto-commit timing
  - Change input validation

### Update World Management
- **World state**: `/hooks/useWorldManagement.ts`
  - Modify max worlds limit
  - Change world creation/evolution logic

### Modify App Layout/Background
- **Overall wrapper**: `/components/AppLayout.tsx`
- **Screen dimensions**: `/components/layout/ScreenContainer.tsx`
- **Overflow behavior**: `/components/layout/OverflowContainer.tsx`
- **Gradient colors**: `/components/layout/GradientBackground.tsx`
- **Border radius**: `/components/layout/RoundedBorder.tsx`

## File Organization

```
/
├── App.tsx                                    # Main orchestrator (85 lines)
├── components/
│   ├── AppLayout.tsx                         # Composed layout wrapper
│   ├── IntroScreen.tsx                       # Composed intro screen
│   ├── TypingBuffer.tsx                      # Composed typing HUD
│   ├── ModeIndicator.tsx                     # Evolution mode indicator
│   ├── WorldLimitWarning.tsx                 # Max worlds alert
│   ├── TypingSound.tsx                       # Audio feedback
│   ├── EmojiReference.tsx                    # Emoji helper panel
│   ├── CartoonMultiverse.tsx                 # Multiverse view
│   ├── CartoonWorldView.tsx                  # Composed world view
│   ├── CartoonPortal.tsx                     # Portal component
│   ├── layout/                               # Layout primitives
│   │   ├── ScreenContainer.tsx              # Viewport wrapper
│   │   ├── OverflowContainer.tsx            # Overflow control
│   │   ├── GradientBackground.tsx           # Gradient backgrounds
│   │   └── RoundedBorder.tsx                # Border radius wrapper
│   ├── intro/                                # Intro screen elements
│   │   ├── IntroContainer.tsx               # Intro wrapper
│   │   ├── IntroTitle.tsx                   # Title + accent
│   │   ├── IntroDescription.tsx             # Description text
│   │   ├── IntroInstructions.tsx            # Full instructions
│   │   ├── IntroPrompt.tsx                  # CTA text
│   │   ├── KeyboardShortcuts.tsx            # All shortcuts
│   │   └── KeyboardShortcut.tsx             # Single shortcut
│   ├── typing/                               # Typing buffer elements
│   │   ├── TypingBufferContainer.tsx        # Buffer wrapper
│   │   ├── TypedWordDisplay.tsx             # Word display
│   │   ├── CharacterCounter.tsx             # Character count
│   │   └── CreatePrompt.tsx                 # Create hint
│   └── world/                                # World view elements
│       ├── WorldBackground.tsx              # Gradient background
│       ├── BackgroundEmojis.tsx             # Decorative emojis
│       ├── StoryPanel.tsx                   # Main panel wrapper
│       ├── EmojiHeader.tsx                  # 🎯 Emoji display (main)
│       ├── StoryContent.tsx                 # 🎯 Story text (main)
│       ├── BackButton.tsx                   # Navigation button
│       ├── EvolutionHint.tsx                # Typing hint
│       ├── WorldTitle.tsx                   # Title component
│       ├── WorldMetadata.tsx                # Metadata display
│       └── MetadataBadge.tsx                # Single badge
├── hooks/
│   ├── useTypingInput.ts                     # Input handling hook
│   └── useWorldManagement.ts                 # World state hook
└── utils/
    └── CartoonWorldGenerator.ts              # World generation logic
```

## Future Enhancements

Potential areas for expansion:
- Add world saving/loading
- Implement world sharing
- Create more sophisticated story templates
- Add world merging/combining
- Implement world deletion
- Add customization options
- Create more visual effects
- Add sound themes per world category
