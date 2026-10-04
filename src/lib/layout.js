// Width-driven layout values (the original switched on window.innerWidth in JS).
export function layoutFor(width) {
  const isMobile = width <= 680;
  const isTablet = width > 680 && width <= 980;
  return {
    isMobile,
    isTablet,
    galleryCols: isMobile ? 2 : (isTablet ? 2 : 3),
    teaserGridCols: isMobile ? 1 : (isTablet ? 2 : 3),
    sessionGridCols: isMobile ? 1 : 2,
    photoGap: isMobile ? '6px' : 'clamp(16px,2vw,22px)',
    teaserSectionStyle: { padding: isMobile ? 0 : '0 clamp(20px,4vw,40px)' },
    sessionGridStyle: isMobile
      ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }
      : { maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gridAutoFlow: 'dense', gap: 'clamp(14px,2vw,20px)' },
    pricingGridCols: isMobile ? 1 : (isTablet ? 2 : 3),
    pricingGridGap: isMobile ? '48px' : 'clamp(18px,2.6vw,28px)',
    pricingNoteGap: isMobile ? '20px' : '4px',
    pricingNoteGap2: isMobile ? '28px' : '16px',
    navLinkMobile: {
      background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0',
      fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: '30px',
      color: '#FBF8F2', width: '100%', textAlign: 'center',
    },
  };
}
