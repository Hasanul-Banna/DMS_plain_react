import { useEffect, useState } from 'react';
import { AxiosInstance } from '../../Auth/Interceptor';
import AddNewDoc from './AddNewDoc';
import { useAuth } from '../../hooks/auth';
import ReactPaginate from 'react-paginate';
import { Download, Edit, Trash } from 'lucide-react';

export default function DocumentList() {
  // const navigate = useNavigate()
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  const [docDetails, setDocDetails] = useState({ isEditMode: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefetchDocs] = useState(false);

  const itemsPerPage = 10 // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);

  useEffect(() => {
    setUiLoader(true)
    AxiosInstance.get('http://localhost:5000/api/docs')
      .then((response) => {
        console.log(response.data.data);
        setDocuments(response.data.data);
        setCurrentDocs(response.data.data.slice(0, itemsPerPage));
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [refresh]);
  const removeDocument = (id) => {
    setUiLoader(true)
    AxiosInstance.delete('http://localhost:5000/api/docs/delete', { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setDocuments(documents.filter((doc) => doc._id !== id));
        setRefetchDocs(r=> !r)
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
  const createDoc = () => {
    setDocDetails({
      isEditMode: false,
    })
    setIsModalOpen(true)
  }
  const editDocument = (doc) => {
    setDocDetails({
      isEditMode: true,
      ...doc
    })
    setIsModalOpen(true)
  };
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Template List</h1>
        <button className="btn btn-primary text-white" onClick={createDoc}>Upload New Document</button>
      </div>
      <AddNewDoc docDetails={docDetails} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchDocs={setRefetchDocs} />
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold">ID</th>
                <th className="text-white text-center font-bold">Name</th>
                <th className="text-white text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center">{doc._id}</td>
                  <td className="text-center">{doc.name}</td>
                  <td className="text-center">
                    <button className="btn btn-outline btn-sm mr-2" onClick={() => editDocument(doc)}> <Edit size={15}></Edit> Update</button>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => downloadDocx(doc.name, `http://localhost:5000/${doc.file_path}`)}
                    >
                     <Download size={15}></Download> Download
                    </button>
                    <button
                      className="btn btn-error btn-sm text-white"
                      onClick={() => removeDocument(doc._id)}
                    >
                     <Trash color='white' size={15}></Trash> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="mx-4 my-5 flex justify-between items-center">
        <div className='text-xl font-bold'>
          Total : {documents.length}
        </div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center gap-2"}
          pageClassName={"page-item"}
          pageLinkClassName={"btn btn-outline btn-sm"}
          previousClassName={"page-item"}
          previousLinkClassName={"btn btn-outline btn-sm"}
          nextClassName={"page-item"}
          nextLinkClassName={"btn btn-outline btn-sm"}
          activeClassName={"active"}
          activeLinkClassName={"btn btn-primary btn-sm"}
        />
      </div>
    </div>
  )
}
