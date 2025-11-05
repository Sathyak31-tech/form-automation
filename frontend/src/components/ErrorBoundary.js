import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            padding: '20px', 
            borderRadius: '8px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#c00', marginTop: 0 }}>⚠️ Something went wrong</h2>
            <p style={{ color: '#666' }}>
              The application encountered an error. Please refresh the page or try again.
            </p>
            {this.state.error && (
              <details style={{ marginTop: '20px', fontSize: '12px' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
                <pre style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  marginTop: '10px'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      <br />
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                window.location.reload();
              }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

