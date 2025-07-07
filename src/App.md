# `App` Component

**File:** `src/App.tsx`

## Overview
The `App` component is the root of the Product Catalog UI.  
For now it renders a simple hero section that greets visitors, but as the
application evolves this component will become the main layout shell. It will
house global concerns such as:

* Client-side routing (e.g. React Router)
* Context providers (authentication, cart state, feature flags)
* Application-wide UI chrome (navigation bar, footer, modals, toasts)

## Props
_None._  
The component does not currently accept any props.

## Returns
`JSX.Element` — a hero section containing a title and subtitle.

## Future Improvements
1. Replace the static hero with real product catalog content.  
2. Integrate routing to product pages and the shopping cart.  
3. Add providers for theming, internationalisation, and analytics.