# Haniiiii Period Care

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Welcome Page**: Hero section with warm greeting "Hey Haniiiii, We've Got You 💕", uplifting copy, soft animated entrance
- **Mood Lifting Section**: Horizontal carousel/slider of cards with comforting quotes and messages tailored for period days
- **Self-Care Tips Section**: Grid of pretty cards with emoji icons and tips (hydration, heating pad, chocolate, comfort shows, rest, warm tea, etc.)
- **Period Log Section**:
  - Form to log period start date and end date
  - Daily symptom logger: cramps, mood swings, bloating, headache, fatigue -- each with severity (1-5 or mild/moderate/severe)
  - Personal diary/notes field per entry
  - History view showing past period entries sorted by date
  - All data persisted in Motoko backend canister
- **Comfort Corner**: Animated "hug button" that randomly displays a sweet comforting quote/message with a playful animation on each click
- **Navigation**: Sticky soft top nav linking to each section
- **Footer**: Soft footer with a warm closing message

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
- `PeriodEntry` type: { id, startDate, endDate, symptoms: [Symptom], notes: Text, createdAt }
- `Symptom` type: { name: Text, severity: Nat (1-3) }
- Functions:
  - `addPeriodEntry(startDate, endDate, notes)` -> returns entry ID
  - `updatePeriodEntry(id, startDate, endDate, notes)` -> updates entry
  - `deletePeriodEntry(id)` -> removes entry
  - `getAllPeriodEntries()` -> returns sorted list
  - `addSymptomToEntry(entryId, symptomName, severity)` -> adds symptom
  - `removeSymptomFromEntry(entryId, symptomName)` -> removes symptom

### Frontend
- Single-page app with smooth scroll sections
- Sticky navigation with soft pink/lavender brand
- Welcome hero: large greeting, animated hearts/sparkles, soft gradient background
- Mood carousel: auto-play + manual navigation, pastel card backgrounds
- Self-care tips: 3-column responsive grid of cards with emoji icons
- Period log:
  - Tab between "Log New Entry" form and "History" view
  - Form: date pickers for start/end, symptom chips with severity toggle, notes textarea
  - History: list of past entries with expandable detail
- Comfort corner: large animated hug button, bounce/pulse animation, modal/toast with random message on click
- Smooth scroll animations using CSS transitions
- Soft floral/heart decorative elements
