# Specification

## Summary
**Goal:** Make the public site header and footer logo/brand areas behave as Home buttons that always navigate to the main homepage route (`/`) via client-side routing.

**Planned changes:**
- Update the header logo area in `frontend/src/components/PublicLayout.tsx` to navigate to `/` on click using client-side navigation, from any current route.
- Update the footer logo/brand area in `frontend/src/components/PublicLayout.tsx` to navigate to `/` on click using client-side navigation, matching the header behavior.
- Ensure both logo click targets are keyboard-accessible and appropriately labeled for accessibility, without changing existing nav behaviors (smooth-scroll links, HR Dashboard routing, mobile menu behavior).

**User-visible outcome:** Clicking the site logo in the header or footer takes the user to the homepage (`/`) from anywhere in the app without a full page reload, and the logo is accessible via keyboard.
