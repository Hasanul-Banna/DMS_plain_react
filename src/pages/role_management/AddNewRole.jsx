import { useEffect, useState } from 'react'
import { AxiosInstance } from '../../Auth/Interceptor';
import { useNavigate } from 'react-router';

export default function AddNewRole({ docDetails, isModalOpen, setIsModalOpen, setRefetchDocs }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  useEffect(() => {
    setTitle(docDetails?.isEditMode ? docDetails.name : '')
  }, [docDetails?.isEditMode])
  const uploadDocument = async (name) => {
    try {
      const payload = { name }

      // POST Request
      const response = await AxiosInstance.post('http://localhost:5000/api/docs/upload', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Document uploaded successfully:', payload, response.data);
      setIsModalOpen(false)
      setRefetchDocs(r => !r)
      setTitle('')
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
    uploadDocument(title);
  };
  return (
    <div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">{docDetails?.isEditMode ? 'Update' : 'Create New'}  Role</p>
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
              <button
                className="btn btn-sm btn-primary"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )
      }

    </div >
  )
}