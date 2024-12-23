import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../Auth/Interceptor';
import { useAuth } from '../hooks/auth';
import { Download, Trash } from 'lucide-react';
import { fireToast } from '../utils/toastify';
export default function ApiLogs() {
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  // const [docDetails, setDocDetails] = useState({ isEditMode: false });
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [refresh, setRefetchDocs] = useState(false);

  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);

  useEffect(() => {
    FetchAPILogs()
  }, []);

  const FetchAPILogs = (method) => {
    setUiLoader(true)
    const url = method ? `http://localhost:5000/api/logs?method=${method}` : 'http://localhost:5000/api/logs'
    AxiosInstance.get(url)
      .then((response) => {
        console.log(response.data.data);
        setDocuments(response.data.data);
        setCurrentDocs(response.data.data.slice(0, itemsPerPage));
        setUiLoader(false)
      })
      .catch((error) => {
        console.error(error.message);
        setUiLoader(false)
      });
  }
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };
  const clearLogs = () => {

    AxiosInstance.get('http://localhost:5000/api/logs/clear')
      .then((response) => {
        console.log(response.data.data);
        FetchAPILogs()
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  function convertToNorwayTime(isoTimestamp) {
    const date = new Date(isoTimestamp);

    // Format date in Norway's style: DD.MM.YYYY
    const formattedDate = date.toLocaleDateString("nb-NO", {
      timeZone: "Europe/Oslo",
    });

    // Format time in 24-hour format with seconds
    const formattedTime = date.toLocaleTimeString("nb-NO", {
      timeZone: "Europe/Oslo",
      hour12: false,
    });

    // Combine date and time
    return `${formattedDate} ${formattedTime}`;
  }
  function exportArrayAsJSON(array, fileName = "data.json") {
    if (!Array.isArray(array)) {
      throw new Error("Input is not a valid array.");
    }
  
    const jsonString = JSON.stringify(array, null, 2); // Format JSON with 2 spaces indentation
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
  
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  
  
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">API Log List</h1>
        <div>
          <button className="btn bg-[red] text-white btn-sm mr-2" onClick={() => { clearLogs() }} >
            <Trash size={15}></Trash> Clear Logs
          </button>
          <button className="btn btn-primary text-white btn-sm" onClick={() => { exportArrayAsJSON(documents, "Logs.json"); }} >
            <Download size={15}></Download> Export Logs
          </button>
        </div>
      </div>
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold">URL</th>
                <th className="text-white text-center font-bold" >
                  <details className="dropdown">
                    <summary className="cursor-pointer">Method</summary>
                    <ul className="menu dropdown-content bg-gray-900 rounded-box z-[1] w-32 p-2 shadow mt-3">
                      <li><a className='text-xs font-semibold' onClick={() => {
                        FetchAPILogs()
                      }}>All</a></li>
                      <li><a className='text-xs font-semibold' onClick={() => {
                        FetchAPILogs('get'); fireToast("success", "Table Filtered by GET method")
                      }}>GET</a></li>
                      <li><a className='text-xs font-semibold' onClick={() => {
                        FetchAPILogs('post'); fireToast("success", "Table Filtered by POST method")
                      }}>POST</a></li>
                    </ul>
                  </details>
                  {/* Method */}
                </th>
                <th className="text-white text-center font-bold">Status Code</th>
                <th className="text-white text-center font-bold">Time-Stamp (Norway)</th>
                <th className="text-white text-center font-bold">Type</th>
                <th className="text-white text-center font-bold">Response Message</th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center">{doc.url}</td>
                  <td className="text-center">{doc.method}</td>
                  <td className="text-center">{doc.statusCode}</td>
                  <td className="text-center">{convertToNorwayTime(doc.timestamp)}</td>
                  <td className="text-center">{(doc.responseBody.success ? 'Success' : 'Failed')}</td>
                  <td className="text-center">{(doc.responseBody.msg)}</td>
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