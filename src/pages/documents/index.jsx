import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosInstance } from '../../Auth/Interceptor';

export default function DocumentList() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    AxiosInstance.get('http://localhost:5000/api/docs')
      .then((response) => {
        console.log(response.data.data);
        setDocuments(response.data.data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);
  const removeDocument = (id) => {
    AxiosInstance.delete('http://localhost:5000/api/docs/delete', { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setDocuments(documents.filter((doc) => doc._id !== id));
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error:', error.response.data.error || error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      });
  };
  const downloadDocx = async (filename, fileUrl) => {
    try {
      // Fetch the file content as a blob
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('File download failed');

      const blob = await response.blob();

      // Create an object URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      // Extract the file extension from the URL
      const urlParts = fileUrl.split('.');
      const fileExtension = urlParts[urlParts.length - 1]; // Get last part after dot (e.g., "docx")
      // Combine desired file name with the original extension
      const finalFileName = `${filename}.${fileExtension}`;

      // Set the desired file name
      link.setAttribute('download', finalFileName);

      // Append to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: Remove the link and revoke the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Document List</h1>
        <button className="btn btn-primary" onClick={() => navigate('add')}>Upload New Document</button>
      </div>
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold">Name</th>
                <th className="text-white text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center">{doc.name}</td>
                  <td className="text-center">
                    <button className="btn btn-outline btn-sm mr-2">Edit</button>
                    <button className="btn btn-outline btn-sm mr-2">Preview</button>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => downloadDocx(doc.name, `http://localhost:5000/${doc.file_path}`)}
                    >
                      Download
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => removeDocument(doc._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
