import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../../Auth/Interceptor';
import { useAuth } from '../../hooks/auth';
import AddNewUser from './AddNewUser';
import { ChevronDown, ListFilter, Trash, User } from 'lucide-react';
export default function Users() {
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
  const [isStatusFIlterOpen, setIsStatusFIlterOpen] = useState(false);
  const [isTypeFilterOpen, setTypeFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  useEffect(() => {
    setUiLoader(true)
    AxiosInstance.get('http://localhost:5000/api/users')
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
  const createDoc = () => {
    setDocDetails({
      isEditMode: false,
    })
    setIsModalOpen(true)
  }
  const handlePageChange = (selectedPage) => {
    const currentPage = selectedPage.selected
    setCurrentPage(currentPage);

    setCurrentDocs(documents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ))
  };
  const removeDocument = (id) => {
    setUiLoader(true)
    AxiosInstance.delete('http://localhost:5000/api/users/delete', { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setDocuments(documents.filter((doc) => doc._id !== id));
        setRefetchDocs(r => !r)
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error:', error.response.data.error || error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      });
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {/* <h1 className="text-2xl font-bold">API Log List</h1> */}
          <h1 className="text-2xl font-bold">User List</h1>
          (<p> Status <ListFilter size={14} className='inline' /> :  {filterStatus.toUpperCase() || 'All'} </p>  |
          <p> User Type <ListFilter size={14} className='inline' /> :  {filterType.toUpperCase() || 'All'} </p>)
        </div>
        <div></div>
        <div className="flex gap-4">
          <button className="btn btn-primary text-white" onClick={createDoc}>Add New User</button>
          <button className="btn btn-primary bg-black text-white" onClick={createDoc}>Sync Now!</button>

        </div>
      </div>
      <AddNewUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchDocs={setRefetchDocs} />
      <div className="card shadow-lg">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  Avatar
                </th>
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  Name
                </th>
                <th className="text-white text-center font-bold max-w-[50px] break-words">
                  Email
                </th>
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  Role
                </th>
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setTypeFilter(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Type</div>
                    {isTypeFilterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setTypeFilter(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('Azure') }}>Azure</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('App-User') }}>App user</a></li>
                    </ul>}
                  </div>
                </th>
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setIsStatusFIlterOpen(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Status</div>
                    {isStatusFIlterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setIsStatusFIlterOpen(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('Active') }}>Active</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('Inactive') }}>Inactive</a></li>
                    </ul>}
                  </div>
                </th>
                <th className="text-white text-center font-bold max-w-[15px] break-words">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => (
                <tr key={doc._id} className="hover">
                  <td className="text-center max-w-[15px] break-words mx-auto">
                    {doc.imagePath ? (
                      <img
                        src={`http://localhost:5000/${doc.imagePath}`}
                        className="h-[66px] w-[66px] rounded-full mx-auto"
                      />
                    ) : (
                      <User size={40} className='mx-auto' />
                    )}
                  </td>
                  <td className="text-center max-w-[15px] break-words">{doc.name}</td>
                  <td className="text-center max-w-[50px] break-words">{doc.email}</td>
                  <td className="text-center max-w-[15px] break-words">
                    {doc.role.toUpperCase()}
                  </td>
                  <td className="text-center max-w-[15px] break-words">
                    {doc.isMsadUser ? "Azure" : "App user"}
                  </td>
                  <td className="text-center max-w-[15px] break-words">
                    <div className={`p-1 rounded-md text-white ${doc.isActive ? "bg-emerald-500" : "bg-red-700"}`} >
                      {doc.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="text-center max-w-[15px] break-words">
                    <button
                      disabled={doc.isMsadUser}
                      className="btn btn-error btn-sm text-white"
                      onClick={() => removeDocument(doc._id)}
                    >
                      <Trash color="white" size={15}></Trash>
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
