import React, { useState } from 'react';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setMessageType('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      setMessageType('error');
      return;
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');
    setMessageType('info');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/resume/uploadResume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid server response: ${responseText.substring(0, 100)}...`);
      }

      if (response.ok) {
        setMessage('Resume uploaded successfully!');
        setMessageType('success');
        if (onUploadSuccess) {
          onUploadSuccess(data.resumeText);
        }
      } else {
        setMessage(`Upload failed: ${data.message || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4">Upload Resume</h3>
      <div className="mb-4">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-600 file:text-white
            hover:file:bg-purple-500"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          uploading || !file 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-500'
        } text-white`}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          messageType === 'success' 
            ? 'bg-green-900 text-green-200' 
            : messageType === 'error'
            ? 'bg-red-900 text-red-200'
            : 'bg-blue-900 text-blue-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;