import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fb',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            border: '1px solid #e2e5ea',
            padding: '40px 30px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px'
            }}>
              ⚠️
            </div>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '12px'
            }}>
              Oops! Something went wrong
            </h1>
            
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              We encountered an unexpected error. Please try refreshing the page or go back to home.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div style={{
                background: '#f8f9fb',
                border: '1px solid #e2e5ea',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#991b1b',
                  fontFamily: 'monospace',
                  margin: '0 0 8px 0'
                }}>
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                </p>
                <details style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginTop: '8px'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Error Details</summary>
                  <pre style={{
                    background: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '10px',
                    marginTop: '8px',
                    maxHeight: '150px'
                  }}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#1d6fd8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'transparent',
                  color: '#1d6fd8',
                  border: '2px solid #1d6fd8',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
