import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../Auth/Interceptor';
import { useAuth } from '../hooks/auth';
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
    setUiLoader(true)
    AxiosInstance.get('http://localhost:5000/api/logs')
      .then((response) => {
        console.log(response.data.data);
        setDocuments(response.data.data);
        setCurrentDocs(response.data.data.slice(0, itemsPerPage));
        setUiLoader(false)
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);
  // const createDoc = () => {
  //   setDocDetails({
  //     isEditMode: false,
  //   })
  //   setIsModalOpen(true)
  // }
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
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
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">API Log List</h1>
      </div>
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold">URL</th>
                <th className="text-white text-center font-bold">Method</th>
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
      <div className="mx-4 my-5 flex justify-end">
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