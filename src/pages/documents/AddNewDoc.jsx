import { useEffect, useState } from 'react'
import { AxiosInstance } from '../../Auth/Interceptor';
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router';

export default function AddNewDoc({ docDetails, isModalOpen, setIsModalOpen, setRefetchDocs }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    setTitle(docDetails?.isEditMode ? docDetails.name : '')
    setSelectedFile(null)
  }, [docDetails?.isEditMode])
  const uploadDocument = async (name, description, file) => {
    try {
      const formData = new FormData();
      if (docDetails?.isEditMode) {
        formData.append('id', docDetails._id);
      }
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file); // Attach the file

      // POST Request
      const response = await AxiosInstance.post('http://localhost:5000/api/docs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Document uploaded successfully:', formData, response.data);
      setIsModalOpen(false)
      setRefetchDocs(r => !r)
      setTitle('')
      setSelectedFile(null)
      // navigate('/documents');
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
    <div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">{docDetails?.isEditMode ? 'Update' : 'Upload New'}  Document</p>
              {/* Close Button */}
              <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}> ✕ </button>
            </div>
            {docDetails?.isEditMode && < div >
              <p>ID : {docDetails._id}</p>
              {/* <p>Title : {docDetails.name}</p> */}
            </div>}
            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  minLength={4}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  {docDetails?.isEditMode ? 'Upload Edited File' : 'Upload a File'} (Only .doc and .docx files are allowed)
                </label>
                <FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
              </div>
              <button
                className="btn btn-sm btn-primary"
                type="submit"
                disabled={!selectedFile}
              >
                {docDetails?.isEditMode ? 'Update' : 'Upload'} Document
              </button>
            </form>
          </div>
        </div>
      )
      }

    </div >
  )
}