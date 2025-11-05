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
        }
      }
      
      // Check if success is in response or response body
      const success = responseData.success || responseData.body?.success;
      const downloadLinksData = responseData.downloadLinks || responseData.body?.downloadLinks || [];
      const filesData = responseData.files || responseData.body?.files;
      
      if (success) {
        setIsCompleted(true);
        
        // Store files data if returned as base64 (for Vercel serverless)
        const links = downloadLinksData || [];
        if (filesData) {
          // Attach file data to each link
          const linksWithFiles = links.map(link => ({
            ...link,
            fileData: filesData[link.filename]
          }));
          setDownloadLinks(linksWithFiles);
        } else {
          setDownloadLinks(links);
        }
      } else {
        // Extract error message and ensure it's a string
        let errorMsg = responseData.error || 
                       responseData.body?.error || 
                       'Failed to process forms';
        
        // Handle error object with code/message
        if (typeof errorMsg === 'object') {
          if (errorMsg.code && errorMsg.message) {
            errorMsg = `Error ${errorMsg.code}: ${errorMsg.message}`;
          } else {
            errorMsg = JSON.stringify(errorMsg);
          }
        }
        
        // Ensure it's a string
        if (typeof errorMsg !== 'string') {
          errorMsg = String(errorMsg);
        }
        
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error processing forms:', err);
      console.error('Error response:', err.response);
      
      // Extract error message safely - MUST be a string
      let errorMessage = 'An error occurred while processing forms';
      
      try {
        if (err.response?.data) {
          const data = err.response.data;
          
          // Handle string response
          if (typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              errorMessage = parsed.error || parsed.message || errorMessage;
              if (typeof errorMessage !== 'string') {
                errorMessage = JSON.stringify(errorMessage);
              }
            } catch (e) {
              errorMessage = data;
            }
          } 
          // Handle object response
          else if (typeof data === 'object') {
            // Check for error object with code/message
            if (data.code && data.message) {
              errorMessage = `Error ${data.code}: ${data.message}`;
            } else if (data.error) {
              errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            } else if (data.body) {
              const body = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
              if (body.code && body.message) {
                errorMessage = `Error ${body.code}: ${body.message}`;
              } else {
                errorMessage = body.error || body.message || errorMessage;
              }
              if (typeof errorMessage !== 'string') {
                errorMessage = JSON.stringify(errorMessage);
              }
            } else if (data.message) {
              errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
            } else {
              // If it's just an object, stringify it
              errorMessage = JSON.stringify(data);
            }
          }
        } else if (err.message) {
          errorMessage = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
        } else if (err.code) {
          errorMessage = `Error ${err.code}: ${err.message || 'Unknown error'}`;
        }
      } catch (e) {
        // Fallback to safe error message
        errorMessage = 'An error occurred while processing forms. Please check the console for details.';
      }
      
      // Ensure errorMessage is always a string
      if (typeof errorMessage !== 'string') {
        errorMessage = JSON.stringify(errorMessage);
      }
      
      setError(errorMessage);
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
            {typeof error === 'string' ? error : JSON.stringify(error)}
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
                  {downloadLinks.map((link, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{link.filename}</p>
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
                  ))}
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
