const PageWrapper = ({ children }) => (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(12px, 4vw, 24px)',
    minHeight: 'calc(100vh - 56px)',
  }}>
    {children}
  </div>
);

export default PageWrapper;