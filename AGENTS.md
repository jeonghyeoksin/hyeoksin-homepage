# AI Agent Custom Instructions

- **Patch Notes Auto-Update**: Whenever you make functional changes, add new features, or modify existing functionality, you **MUST** automatically record these updates in the `patchNotes` array inside `src/App.tsx`. 
  - Add a new entry to the top of the `patchNotes` array using the format: `{ version: 'vX.X.X', date: 'YYYY-MM-DD', title: '...', changes: ['...'] }`.
  - Increment the version number appropriately (e.g., minor bump for new features, patch bump for bug fixes).
  - This ensures users are always aware of the latest changes in the service.
