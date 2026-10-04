// Shared timing for the desktop hero, so the photo fades stay locked to the
// pagination morph (see HeroPagination.jsx for the step-by-step description).
export const NARROW = 900;  // old pill narrows to a dot width  
export const HEIGHT = 450;  // old bar -> dot, new dot -> bar    
export const WIDEN = 1000;  // new bar widens to the full pill   
export const PAUSE = 75;    // gap between steps
export const FILL = 800;    // pill fill fade

// The whole morph, start to finish. The photo fade runs over this same span.
export const TOTAL = NARROW + PAUSE + HEIGHT + PAUSE + WIDEN;
