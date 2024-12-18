import { useState } from 'react'
import { AxiosInstance } from '../../Auth/Interceptor';
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router';

export default function AddNewDoc() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const uploadDocument = async (name, description, file) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file); // Attach the file

      // POST Request
      const response = await AxiosInstance.post('http://localhost:5000/api/docs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Document uploaded successfully:', response.data);
      navigate('/documents');
      // return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedFile);
    if (selectedFile) {
      uploadDocument(title, '', selectedFile);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Document</h1>
      <div className="p-4 card bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              Upload a File (Only .doc and .docx files are allowed)
            </label>
            <FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
          </div>
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={!selectedFile}
          >
            Upload Document
          </button>
        </form>
      </div>
    </div>
  )
}
