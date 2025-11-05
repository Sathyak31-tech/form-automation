import React, { useState } from 'react';
import { Download, FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ProcessForms = ({ data }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const processForms = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Get API URL from environment variable or use relative path
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const apiEndpoint = `${apiUrl}/api/process-forms`;
      
      // Send data to backend
      const response = await axios.post(apiEndpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle Vercel serverless function response format
      let responseData = response.data;
      
      // If response body is a string (Vercel Python format), parse it
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response format from server');
        }
      }
      
      // Handle nested body structure (Vercel serverless functions)
      if (responseData && typeof responseData === 'object' && responseData.body) {
        if (typeof responseData.body === 'string') {
          try {
            responseData.body = JSON.parse(responseData.body);
          } catch (e) {
            console.error('Failed to parse response body:', e);
          }
        }
        responseData = { ...responseData, ...responseData.body };
      }
      
      // Check if success is in response or response body
      const success = responseData?.success || false;
      const downloadLinksData = responseData?.downloadLinks || [];
      const filesData = responseData?.files || {};
      
      if (success) {
        setIsCompleted(true);
        
        // Store files data if returned as base64 (for Vercel serverless)
        const links = Array.isArray(downloadLinksData) ? downloadLinksData : [];
        if (filesData && typeof filesData === 'object') {
          // Attach file data to each link
          const linksWithFiles = links.map(link => {
            if (!link || typeof link !== 'object') return link;
            return {
              ...link,
              fileData: link.filename ? filesData[link.filename] : null
            };
          }).filter(Boolean); // Remove any null/undefined entries
          setDownloadLinks(linksWithFiles);
        } else {
          setDownloadLinks(links);
        }
      } else {
        // Extract error message and ensure it's a string
        let errorMsg = responseData.error || 
                       responseData.body?.error || 
                       responseData.message ||
                       responseData.body?.message ||
                       'Failed to process forms';
        
        // Handle error object with code/message (Vercel format)
        if (typeof errorMsg === 'object') {
          if (errorMsg.code && errorMsg.message) {
            errorMsg = `Error ${errorMsg.code}: ${String(errorMsg.message)}`;
          } else if (errorMsg.code) {
            errorMsg = `Error ${errorMsg.code}`;
          } else {
            errorMsg = JSON.stringify(errorMsg);
          }
        }
        
        // Handle nested error structure
        if (responseData.code && responseData.message) {
          errorMsg = `Error ${responseData.code}: ${String(responseData.message)}`;
        }
        
        // Ensure it's a string
        if (typeof errorMsg !== 'string') {
          errorMsg = String(errorMsg);
        }
        
        // Final safety check
        const finalErrorMsg = typeof errorMsg === 'string' && errorMsg.trim() ? errorMsg : 'Failed to process forms';
        setError(finalErrorMsg);
      }
    } catch (err) {
      console.error('Error processing forms:', err);
      console.error('Error response:', err.response);
      console.error('Error object:', JSON.stringify(err, null, 2));
      
      // Extract error message safely - MUST be a string
      let errorMessage = 'An error occurred while processing forms';
      
      let status = null;
      try {
        // Handle axios error response
        if (err.response) {
          status = err.response.status || 500;
          const data = err.response.data;
          
          // Check if data is null/undefined (server might not return body)
          if (!data) {
            errorMessage = `Server error (${status}): No error details available`;
          }
          
          // Handle string response
          if (typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                errorMessage = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
              } else if (parsed.message) {
                errorMessage = typeof parsed.message === 'string' ? parsed.message : JSON.stringify(parsed.message);
              } else {
                errorMessage = `Server error (${status}): ${data.substring(0, 100)}`;
              }
            } catch (e) {
              errorMessage = `Server error (${status}): ${data.substring(0, 200)}`;
            }
          } 
          // Handle object response
          else if (data && typeof data === 'object') {
            // Handle Vercel serverless function error format
            if (data.body) {
              let body = data.body;
              
              // Parse if body is a string
              if (typeof body === 'string') {
                try {
                  body = JSON.parse(body);
                } catch (e) {
                  // If parsing fails, use the string directly
                  errorMessage = `Server error (${status}): ${body.substring(0, 200)}`;
                  body = null; // Skip further processing
                }
              }
              
              // Process parsed object body
              if (body && typeof body === 'object') {
                if (body.code && body.message) {
                  errorMessage = `Error ${body.code}: ${String(body.message)}`;
                } else if (body.error) {
                  errorMessage = typeof body.error === 'string' ? body.error : JSON.stringify(body.error);
                } else if (body.message) {
                  errorMessage = typeof body.message === 'string' ? body.message : JSON.stringify(body.message);
                } else if (body.details) {
                  errorMessage = typeof body.details === 'string' ? body.details : JSON.stringify(body.details);
                }
              }
            }
            // Direct error object (Vercel format: {code: "500", message: "..."})
            else if (data.code && data.message) {
              errorMessage = `Error ${data.code}: ${String(data.message)}`;
            } 
            // Handle Vercel error wrapper
            else if (data.error && typeof data.error === 'object' && data.error.code && data.error.message) {
              errorMessage = `Error ${data.error.code}: ${String(data.error.message)}`;
            } 
            else if (data.error) {
              const errorData = data.error;
              if (typeof errorData === 'string') {
                errorMessage = errorData;
              } else if (errorData && typeof errorData === 'object') {
                if (errorData.code && errorData.message) {
                  errorMessage = `Error ${errorData.code}: ${String(errorData.message)}`;
                } else {
                  errorMessage = JSON.stringify(errorData);
                }
              } else {
                errorMessage = JSON.stringify(errorData);
              }
            } else if (data.message) {
              errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
            } else {
              errorMessage = `Server error (${status}): ${JSON.stringify(data).substring(0, 200)}`;
            }
          } else if (!data) {
            errorMessage = `Server error (${status}): No error details available`;
          } else {
            errorMessage = `Server error (${status}): No error details available`;
          }
        } else if (err.response) {
          // Response exists but no data property
          status = err.response.status || 500;
          errorMessage = `Server error (${status}): ${err.response.statusText || 'Internal Server Error'}`;
        }
        // Handle network errors or other axios errors
        else if (err.message) {
          errorMessage = typeof err.message === 'string' ? err.message : String(err.message);
        } 
        // Handle error objects with code/message
        else if (err.code && err.message) {
          errorMessage = `Error ${err.code}: ${String(err.message)}`;
        }
        // Handle status code from error object
        else if (err.status) {
          errorMessage = `Server error (${err.status}): Request failed`;
        }
        // Fallback: stringify the entire error
        else {
          errorMessage = `Request failed: ${err.code || 'Unknown error'}`;
        }
      } catch (e) {
        // Ultimate fallback
        console.error('Error in error handler:', e);
        errorMessage = `An error occurred: ${status ? `HTTP ${status}` : 'Network error'}. Please check the console for details.`;
      }
      
      // CRITICAL: Ensure errorMessage is ALWAYS a string before setting state
      if (typeof errorMessage !== 'string') {
        console.warn('Error message is not a string, converting:', errorMessage);
        try {
          if (errorMessage && typeof errorMessage === 'object') {
            if (errorMessage.code && errorMessage.message) {
              errorMessage = `Error ${errorMessage.code}: ${String(errorMessage.message)}`;
            } else {
              errorMessage = JSON.stringify(errorMessage);
            }
          } else {
            errorMessage = String(errorMessage);
          }
        } catch (e) {
          errorMessage = 'An unknown error occurred. Please check the browser console for details.';
        }
      }
      
      // Final safety check - ensure it's a valid string
      if (!errorMessage || errorMessage === 'null' || errorMessage === 'undefined' || errorMessage.trim() === '') {
        errorMessage = 'An unknown error occurred. Please check the browser console for details.';
      }
      
      // DOUBLE CHECK: Force string conversion one more time
      const finalError = typeof errorMessage === 'string' ? errorMessage : String(errorMessage);
      setError(finalError);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (filename, fileData = null) => {
    // If file data is provided (base64 from serverless function), use it
    if (fileData) {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      } catch (err) {
        console.error('Error downloading file:', err);
      }
    }
    
    // Fallback to API download endpoint
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const downloadUrl = `${apiUrl}/api/download/${encodeURIComponent(filename)}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <Download className="h-6 w-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Process Forms</h2>
      </div>

      {!isCompleted && !isProcessing && (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Process Forms</h3>
          <p className="text-gray-600 mb-6">
            Click the button below to generate all filled forms based on your information.
          </p>
          <button
            onClick={processForms}
            className="px-8 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Process Forms
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <Loader className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Forms...</h3>
          <p className="text-gray-600">
            Please wait while we fill out all the forms with your information.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Error Processing Forms</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">
            {(() => {
              // Ensure error is always a string before rendering
              if (typeof error === 'string') {
                return error;
              } else if (error && typeof error === 'object') {
                // Handle error objects
                if (error.code && error.message) {
                  return `Error ${error.code}: ${String(error.message)}`;
                } else {
                  return JSON.stringify(error);
                }
              } else {
                return String(error || 'Unknown error');
              }
            })()}
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsCompleted(false);
            }}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-green-800">Forms Processed Successfully!</h3>
            </div>
            <p className="mt-2 text-sm text-green-700">
              All forms have been filled and are ready for download.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Download Filled Forms</h3>
            
            {/* DOCX Files */}
            {downloadLinks.length > 0 ? (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <FileText className="h-4 w-4 text-blue-600 mr-2" />
                  Word Documents (.docx)
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  📝 Download editable Word documents with all your information filled in.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(downloadLinks) && downloadLinks.length > 0 ? downloadLinks.map((link, index) => {
                    if (!link || !link.filename) return null;
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">{link.filename || 'Unknown file'}</p>
                              <p className="text-xs text-gray-500">Editable document</p>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadFile(link.filename, link.fileData)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  }) : null}
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ No files were generated. Please check the console for errors or try again.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Download DOCX files for editing and printing</li>
                <li>• Review the information for accuracy</li>
                <li>• Print and sign the forms as required</li>
                <li>• Submit the forms to the respective authorities</li>
                <li>• Original DOCX files are saved in the output folder</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessForms;
