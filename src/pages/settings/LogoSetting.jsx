import React, { useEffect, useState } from 'react'
import { fireToast } from '../../utils/toastify';
import { AxiosInstance } from '../../Auth/Interceptor';

export default function LogoSetting() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const [logo, setLogo] = useState({});
  useEffect(()=>{
    AxiosInstance.get('http://localhost:5000/api/logo')
      .then((response) => {
        console.log(response.data.data);
        setLogo(response.data.data.length ? response.data.data[0] : {})
      })
      .catch((error) => {
        console.error(error.message);
      });
  },[refresh])
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
  const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file); // Attach the file

      // POST Request
      const response = await AxiosInstance.post('http://localhost:5000/api/logo/update-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Document uploaded successfully:', formData, response.data);
      setSelectedFile(null)
    } catch (error) {
      fireToast('error', error.response.data.error || error.response.data.msg)
      if (error.response) {
        console.error('Error:', error.response.data.error || error.response.data.msg);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
    setrefresh(r => !r)
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    uploadDocument(selectedFile)
  }
  return (
    <div className="card bg-white p-6  w-full">
      <div className="m-auto">
        <img src={`http://localhost:5000/${logo.file_path}`} width={180} height={180} alt="logo" className="m-auto" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="form-control">
          <label className="label">
            <span>Upload an Image * <span className="text-xs text-info"> (Only less than 2MB jpg, jpeg, png files are allowed)</span></span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            required
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex justify-start">
          <button
            className="btn btn-md text-lg w-full btn-primary text-white mt-4"
            type="submit"
            // disabled={!selectedFile}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}