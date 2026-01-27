# AER Public Hearings - React Native UI Design Guide

## Overview

This design guide shows the UI structure and components for implementing the AER Public Hearings app in React Native.

## Color Palette

- **Primary Blue**: `#00598E` (AER brand color)
- **Background**: `#F5F5F5`
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#333333`
- **Text Secondary**: `#666666`
- **Text Muted**: `#999999`
- **Border**: `#E0E0E0`
- **Accent Blue**: `#E3F2FD` (light blue for badges/status)

## Typography

- **Header Title**: 24px, Bold, `#00598E`
- **Screen Title**: 22px, Bold, `#333`
- **Section Title**: 18px, Semi-bold, `#333`
- **Body Text**: 15-16px, Regular, `#666`
- **Label**: 14px, Medium, `#333`
- **Caption**: 12-14px, Regular, `#999`

## Component Specifications

### Cards

- **Border Radius**: 12px
- **Padding**: 16px
- **Shadow**: 
  - iOS: `shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4`
  - Android: `elevation: 3`

### Buttons

- **Primary Button**: 
  - Background: `#00598E`
  - Text: White, 16px, Semi-bold
  - Padding: 16px vertical
  - Border Radius: 8px
  - Min Height: 44dp (accessibility)

- **Secondary Button**:
  - Border: 1px, `#00598E`
  - Text: `#00598E`, 16px, Semi-bold
  - Background: Transparent

### Input Fields

- **Border**: 1px, `#E0E0E0`
- **Border Radius**: 8px
- **Padding**: 12px
- **Background**: `#FAFAFA`
- **Font Size**: 16px
- **Min Height**: 44dp (touch target)

### Status Badges

- **Upcoming**: Background `#E3F2FD`, Text `#666`
- **Past**: Background `#E0E0E0`, Text `#666`
- **Padding**: 10px horizontal, 4-6px vertical
- **Border Radius**: 12px
- **Font Size**: 12px, Semi-bold

## Screen Layouts

### 1. Hearings List Screen

```
┌─────────────────────────────────┐
│ [Menu] Public Hearings          │
├─────────────────────────────────┤
│ [🔍] Search hearings...         │
├─────────────────────────────────┤
│ [All] [Upcoming] [Past]        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Pipeline Amendment Hearing  │ │
│ │ 📅 Mar 8, 2026 • 2:00 PM    │ │
│ │ 📍 Calgary, AB [Hybrid]     │ │
│ │ 📄 APP-2026-001             │ │
│ │ View Details →               │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Footprint Expansion Project │ │
│ │ 📅 Feb 12, 2026 • 10:00 AM  │ │
│ │ 📹 Virtual                   │ │
│ │ 📄 APP-2026-002             │ │
│ │ View Details →               │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 2. Hearing Detail Screen

```
┌─────────────────────────────────┐
│ [←] Hearing Details             │
├─────────────────────────────────┤
│ Pipeline Amendment Hearing      │
│ [Upcoming]                      │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 📅 Date & Time              │ │
│ │    Mar 8, 2026 • 2:00-5:00 │ │
│ ├─────────────────────────────┤ │
│ │ 📍 Location                 │ │
│ │    Calgary, AB              │ │
│ │    Virtual also available   │ │
│ ├─────────────────────────────┤ │
│ │ 📄 Application Number       │ │
│ │    APP-2026-001             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ About This Hearing              │
│ [Description text...]           │
├─────────────────────────────────┤
│ Documents                       │
│ 📄 Hearing Notice →             │
│ 📄 Application Form →           │
├─────────────────────────────────┤
│ How to Participate              │
│ 🎤 Register to speak            │
│ 📧 Submit Statement             │
│ 👁️  Attend as observer          │
├─────────────────────────────────┤
│ [Register / Participate]        │
│ [Share Hearing]                 │
└─────────────────────────────────┘
```

### 3. Register Screen

```
┌─────────────────────────────────┐
│ [←] Register for Hearing        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Pipeline Amendment Hearing  │ │
│ │ Mar 8, 2026 • 2:00 PM      │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ How would you like to           │
│ participate?                    │
│ ┌─────────────────────────────┐ │
│ │ 🎤 Speak at Hearing         │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 👁️  Attend as Observer      │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 📧 Submit Statement         │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Contact Information             │
│ Full Name *                     │
│ [________________________]      │
│ Email *                         │
│ [________________________]      │
│ Phone Number                    │
│ [________________________]      │
│ Address                         │
│ [________________________]      │
│ [________________________]      │
├─────────────────────────────────┤
│ [Submit Registration]           │
└─────────────────────────────────┘
```

## Navigation Flow

```
Bottom Tabs
├── Hearings Tab
│   └── Hearings Stack
│       ├── HearingsListScreen
│       ├── HearingDetailScreen
│       └── RegisterScreen
├── Map Tab
│   └── MapScreen (with pins for hearings)
└── My Participation Tab
    └── MyParticipationScreen
```

## Accessibility Guidelines

1. **Touch Targets**: Minimum 44x44dp for all interactive elements
2. **Color Contrast**: 
   - Text on background: WCAG AA compliant (4.5:1 for normal text)
   - Primary buttons: 4.5:1 contrast ratio
3. **Font Sizes**: Minimum 14px for body text, 16px preferred
4. **Screen Reader**: All interactive elements should have `accessibilityLabel`
5. **Focus Indicators**: Clear focus states for keyboard navigation

## Icons

Using Ionicons (via `@expo/vector-icons` or `react-native-vector-icons`):

- `document-text-outline` - Hearing documents
- `calendar-outline` - Dates
- `location-outline` - Physical location
- `videocam-outline` - Virtual meeting
- `mic-outline` - Speaking/participation
- `mail-outline` - Statement submission
- `eye-outline` - Observer
- `chevron-forward` - Navigation
- `search-outline` - Search
- `close-circle` - Clear search

## Responsive Considerations

- **Small Screens** (< 375px width): Reduce padding, smaller font sizes
- **Large Screens** (> 414px width): Max content width, centered layout
- **Tablets**: Two-column layout for detail screens, larger cards

## Implementation Notes

1. Use `FlatList` for the hearings list (performance)
2. Use `ScrollView` for detail/register screens (flexible content)
3. Use `SafeAreaView` to respect notches/status bars
4. Use `react-navigation` for screen transitions
5. Consider using `react-native-maps` for map view
6. Use `Linking` API for opening documents/PDFs


