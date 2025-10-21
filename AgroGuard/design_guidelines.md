# FarmGuard Design Guidelines

## Design Approach: Material Design + Agricultural Accessibility

**Foundation**: Material Design principles adapted for extreme accessibility and agricultural context. Prioritizes high contrast, large touch targets, and visual clarity for outdoor use.

**Key Principles**:
- Maximum contrast for sunlight readability
- Icon-first communication for low literacy
- Generous spacing for touch accuracy
- Consistent visual language across all conditions

---

## Core Design Elements

### A. Color Palette

**Light Mode** (Default - Optimized for Sunlight):
- Primary: 142 65% 35% (Deep agricultural green)
- Primary Variant: 142 55% 45% (Lighter green for interactive states)
- Surface: 0 0% 98% (Off-white, reduces glare)
- Background: 0 0% 95% (Light gray)
- Text Primary: 0 0% 15% (Near black, maximum contrast)
- Text Secondary: 0 0% 40% (Medium gray)
- Success: 142 70% 40% (Green - good conditions)
- Warning: 38 95% 50% (Amber - caution)
- Danger: 0 75% 45% (Red - alerts)
- Borders: 0 0% 85% (Subtle separation)

**Dark Mode** (Night/Indoor):
- Primary: 142 60% 55% (Lighter green for visibility)
- Surface: 0 0% 12% (Dark gray, not pure black)
- Background: 0 0% 8% (Darker background)
- Text Primary: 0 0% 95% (Near white)
- Text Secondary: 0 0% 70% (Light gray)
- Borders: 0 0% 25% (Visible separation)

**High Contrast Mode** (Maximum Visibility):
- Background: Pure white (0 0% 100%) or pure black (0 0% 0%)
- Text: Pure black (0 0% 0%) or pure white (0 0% 100%)
- Interactive elements: 142 100% 25% (Maximum saturation green)
- All borders: 2px solid, increased from 1px

### B. Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN) - Exceptional legibility at all sizes
- Fallback: system-ui, -apple-system, sans-serif

**Scale** (Larger than typical for accessibility):
- Heading 1: 32px/40px, font-weight 700
- Heading 2: 24px/32px, font-weight 600
- Heading 3: 20px/28px, font-weight 600
- Body Large: 18px/28px, font-weight 400 (Default body text)
- Body: 16px/24px, font-weight 400
- Caption: 14px/20px, font-weight 500
- All text: letter-spacing 0.01em for improved readability

### C. Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 24
- Component padding: p-6 (standard), p-8 (large cards)
- Section spacing: space-y-6 (tight), space-y-8 (standard), space-y-12 (generous)
- Touch targets: Minimum 48px (h-12) height, 56px (h-14) preferred
- Page margins: px-4 mobile, px-6 tablet, px-8 desktop
- Max content width: max-w-4xl centered

**Grid System**:
- Settings menu: Single column on mobile, two-column on tablet+
- Dashboard: Grid with 1-2-3 column breakpoints for weather cards
- Responsive: Always stack to single column below 640px

### D. Component Library

**Accessibility Settings Menu Components**:

1. **Settings Container**
   - Full-height panel, rounded-2xl corners
   - Surface background with subtle border
   - Padding: p-8
   - Sticky header with close button (top-0)

2. **Setting Group**
   - Each group in elevated card: bg-surface, border, rounded-xl, p-6
   - Group header: text-xl font-semibold with icon (24px Heroicons)
   - Items: space-y-4 within group

3. **Toggle Controls** (Theme, High Contrast, Large Text)
   - Full-width rows with label left, toggle right
   - Toggle switch: 52px wide, 28px tall, rounded-full
   - Active state: primary color, inactive: border with bg-surface
   - Touch target: h-14, flex items-center justify-between
   - Icon (24px) + Label (text-lg) on left

4. **Selector Controls** (Language, Text Size)
   - Dropdown-style with chevron icon
   - Full border, rounded-lg, p-4, h-14
   - Selected value in text-lg
   - Options modal: Full-screen on mobile, centered card on desktop
   - Each option: Large touch target (h-16), radio indicator, icon if applicable

5. **Preview Section**
   - Live preview card showing current settings
   - Sample text in three sizes
   - Sample alert badge with icon
   - Border-2, rounded-lg, p-6, bg-gradient subtle

6. **Action Buttons**
   - Primary: Full-width, h-14, rounded-lg, text-lg font-semibold
   - Secondary: Outline variant, same dimensions
   - Icon buttons (close, back): 48px square, rounded-full

**Weather Dashboard Components**:
- Weather cards: Rounded-xl, p-6, icon (48px) + temperature (text-4xl) + condition (text-lg)
- Alert banners: Full-width, border-l-4 (color-coded), p-4, icon + message
- Field map cards: Aspect-square, rounded-xl, border-2
- Quick stats: Grid layout, each stat with large number + label + icon

**Navigation**:
- Bottom tab bar (mobile): 5 items max, 64px height, icon (28px) + label (text-xs)
- Sidebar (tablet+): 280px width, icon (24px) + label (text-base)
- Active state: Primary color background (alpha 0.1) + primary text color

**Form Elements**:
- Input fields: h-14, rounded-lg, border-2, px-4, text-lg
- Focus: Primary color border, no shadow (glare reduction)
- Labels: text-base font-medium, mb-2
- Helper text: text-sm, text-secondary

**Icons**: Heroicons (CDN) - Outline for inactive, Solid for active states

### E. Animations

**Minimal, Purposeful Only**:
- Toggle switches: 200ms ease transition on background/position
- Modal entry: 250ms ease-out slide-up on mobile, fade-in on desktop
- Tab changes: 150ms crossfade
- NO scroll animations, parallax, or decorative motion (battery/performance)

---

## Accessibility Settings Menu Specific Layout

**Structure**:
1. **Header** (Sticky): "Accessibility Settings" + Close button (top-right)
2. **Theme Group**: Dark Mode toggle, High Contrast toggle
3. **Display Group**: Text Size selector (Small/Default/Large/Extra Large), Language selector
4. **Preview Group**: Live preview card showing settings effect
5. **Actions**: Save button (primary), Reset to defaults (secondary text link)

**Visual Hierarchy**:
- Group headers with left border accent (border-l-4 border-primary)
- Subtle elevation between groups (space-y-6)
- Preview section highlighted with border-2 and subtle background tint

**Responsive Behavior**:
- Mobile: Full-screen modal, single column
- Tablet+: Right-side panel (400px) or centered modal (max-w-lg)
- Settings persist across app immediately on toggle

---

## Images

**Not Applicable**: Accessibility settings menu is utility-focused with no imagery. Main app areas may use:
- Field mapping: Satellite/aerial imagery in map view
- Weather icons: Iconography library (Heroicons weather set)
- Dashboard header: Optional subtle background pattern (low opacity agricultural motif)

No hero images in settings. Primary app uses icon-driven interface prioritizing data clarity over visual decoration.