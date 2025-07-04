# Extraction App Refactoring Todo

## Phase 2: Analyze integration map JSON and plan API structure
- [x] Analyze integration map JSON structure
- [x] Plan React Query hooks structure based on services
- [x] Design mock data structure for development
- [ ] Plan widget architecture for connection components

## Phase 3: Implement React Query hooks and API integration
- [x] Install @tanstack/react-query dependency
- [x] Create React Query client configuration
- [x] Implement connection service hooks (useConnections_list, useConnection_create, etc.)
- [x] Create mock data providers for development
- [x] Implement API client with axios
- [x] Add environment variable configuration

## Phase 4: Refactor connection page modal to be widgetable
- [x] Extract connection components into reusable widgets
- [x] Create ConnectionManager widget
- [x] Create ConnectionStatus widget
- [x] Create ConnectionWizard widget
- [x] Create ConnectionHistory widget
- [x] Make connection modal components reusable and configurable

## Phase 5: Synchronize setup page with dashboard config
- [x] Create shared configuration context
- [x] Implement dashboard config synchronization
- [x] Update first-time setup to use shared config
- [x] Ensure config persistence across components
- [x] Create refactored connection setup page
- [x] Add environment configuration for mock/real data

## Phase 6: Test and validate the implementation
- [x] Test React Query hooks with mock data
- [x] Test widget components in isolation
- [x] Test integration between setup and dashboard
- [x] Validate responsive design and accessibility
- [x] Test original connection setup page functionality
- [x] Verify connection modal and testing workflow
- [x] Confirm mock data integration works correctly

## Phase 7: Deliver updated application to user
- [ ] Package final application
- [ ] Provide documentation for new features
- [ ] Create migration guide if needed

