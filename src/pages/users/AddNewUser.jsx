import { useState } from 'react';
import { AxiosInstance } from '../../Auth/Interceptor';
import { fireToast } from '../../utils/toastify';

export default function AddNewUser({ isModalOpen, setIsModalOpen, setRefetchDocs }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', // Note: Hash passwords in a real application
    role: 'user',
    willBeAffected: true,
    isActive: true,
  })
  const uploadUser = async (userData, file) => {
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      formData.append('file', file); // Attach the file

      // POST Request
      const response = await AxiosInstance.post('http://localhost:5000/api/users/create-user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('User Created Successfully:', formData, response.data);
      setIsModalOpen(false)
      setRefetchDocs(r => !r)
      setUserData({
        name: '',
        email: '',
        password: '',
        role: 'user',
      })
      setSelectedFile(null)
    } catch (error) {
      console.log(error.response.data);
      fireToast('error', error.response.data.error)
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
      }
      throw error;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData, selectedFile);
    uploadUser(userData, selectedFile);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    // Maximum file size in bytes (2 MB)
    if (!allowedTypes.includes(file.type)) {
      e.target.value = ''; // Reset the input
      setSelectedFile(null);
      return;
    }
    // Validate file size
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      fireToast('error', "File size must be less than 2 MB!");
      e.target.value = ''; // Reset the input
      setSelectedFile(null);
      return;
    }


    setSelectedFile(file);
  };
  return (
    <div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">Add New User</p>
              {/* Close Button */}
              <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}> ✕ </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  id="title"
                  minLength={4}
                  value={userData.name}
                  onChange={(e) => setUserData(u => { return { ...u, name: e.target.value } })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  type='email'
                  value={userData.email}
                  onChange={(e) => setUserData(u => { return { ...u, email: e.target.value } })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="password"
                  type='text'
                  value={userData.password}
                  onChange={(e) => setUserData(u => { return { ...u, password: e.target.value } })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select a Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={userData.role}
                  onChange={(e) => setUserData(u => { return { ...u, role: e.target.value } })}
                >
                  {/* <option disabled value="">
                    Choose an user role
                  </option> */}
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span>Upload an Image * <span className="text-xs text-info"> (Only less than 2MB jpg, jpeg, png files are allowed)</span></span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex gap-2 justify-between">

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">User is Active</span>
                    <input type="checkbox" checked={userData.isActive} className="checkbox" onChange={(e) => setUserData(f => { return { ...f, isActive: e.target.checked } })} />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Will be affected by Sync ?</span>
                    <input type="checkbox" checked={userData.willBeAffected} className="checkbox" onChange={(e) => setUserData(f => { return { ...f, willBeAffected: e.target.checked } })} />
                  </label>
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  className="btn btn-md text-lg w-full btn-primary text-white mt-4"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      }

    </div >
  )
}