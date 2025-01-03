import { useNavigate } from 'react-router';
import { AxiosInstance } from '../../Auth/Interceptor';
import { fireToast } from '../../utils/toastify';

export default function AddNewRole({ docDetails, setDocDetails, isModalOpen, setIsModalOpen, setRefetchDocs }) {
  const navigate = useNavigate()
  const createOrUploadRole = async () => {
    try {
      const payload = { title: docDetails.title.trim() }
      if (docDetails?.isEditMode) {
        payload.id = docDetails._id
      }
      const url = docDetails?.isEditMode ? 'http://localhost:5000/api/roles/update' : 'http://localhost:5000/api/roles/create'
      // POST Request
      const response = await AxiosInstance.post(url, payload);

      console.log('Roles uploaded successfully:', payload, response.data);
      setIsModalOpen(false)
      setRefetchDocs(r => !r)
      setDocDetails({ isEditMode: false, _id: '', title: '' })
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
        fireToast('error', error.response.data.error || error.response.data.msg);
      } else {
        fireToast('error', error.message);
        console.error('Error:', error.message);
      }
      throw error;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createOrUploadRole();
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
            </div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  minLength={2}
                  value={docDetails.title}
                  onChange={(e) => setDocDetails({ ...docDetails, title: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>
              <button
                className="btn btn-sm btn-primary text-white"
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