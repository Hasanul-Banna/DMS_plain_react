import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AxiosInstance } from '../../Auth/Interceptor';
import { useAuth } from '../../hooks/auth';
import AddNewUser from './AddNewUser';
import { ChevronDown, Edit, ListFilter, Trash, User } from 'lucide-react';
export default function Users() {
  const { setUiLoader } = useAuth()
  const [documents, setDocuments] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefetchDocs] = useState(false);

  const itemsPerPage = 10 // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Get the documents for the current page
  const pageCount = Math.ceil(documents.length / itemsPerPage);
  const [isStatusFIlterOpen, setIsStatusFIlterOpen] = useState(false);
  const [isTypeFilterOpen, setTypeFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Active');
  const [filterType, setFilterType] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', // Note: Hash passwords in a real application
    role: 'user',
    willBeAffected: true,
    isActive: true,
    isEditMode: false
  })
  useEffect(() => {
    setUiLoader(true)
    const url = `http://localhost:5000/api/users?isActive=${filterStatus || ''}&isMsadUser=${filterType || ''}`
    AxiosInstance.get(url)
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
  }, [filterStatus, filterType, refresh]);
  const createUser = () => {
    setUserData({
      name: '',
      email: '',
      password: '', // Note: Hash passwords in a real application
      role: 'user',
      willBeAffected: true,
      isActive: true,
      isEditMode: false
    })
    setIsModalOpen(true)
  }
  const UpdateUser = (user) => {
    console.log(user);

    setUserData({
      ...user,
      password: '',
      isEditMode: true,
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
  const removeUser = (id) => {
    setUiLoader(true)
    AxiosInstance.delete('http://localhost:5000/api/users/delete', { data: { id } })
      .then((response) => {
        console.log('Document deleted successfully:', response.data);
        setTimeout(() => {
          setUiLoader(false)
        }, 500);
        // setDocuments(documents.filter((user) => user._id !== id));
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
          <button className="btn btn-primary text-white" onClick={createUser}>Add New User</button>
          {/* <button className="btn btn-primary bg-black text-white" onClick={createUser}>Sync Now!</button> */}

        </div>
      </div>
      <AddNewUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setRefetchDocs={setRefetchDocs} userData={userData} setUserData={setUserData} />
      <div className="card shadow-lg">
        <div className="overflow-x-auto min-h-[120px]">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-white text-center font-bold break-words">
                  Avatar
                </th>
                <th className="text-white text-center font-bold break-words">
                  Name
                </th>
                <th className="text-white text-center font-bold break-words">
                  Email
                </th>
                <th className="text-white text-center font-bold break-words">
                  Role
                </th>
                <th className="text-white text-center font-bold break-words">
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setTypeFilter(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Type</div>
                    {isTypeFilterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setTypeFilter(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('Azure') }}>Azure</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterType('App-User') }}>App user</a></li>
                    </ul>}
                  </div>
                </th>
                <th className="text-white text-center font-bold break-words">
                  <div className="dropdown">
                    <div tabIndex={0} role="" className="cursor-pointer" onClick={() => setIsStatusFIlterOpen(true)}> <ChevronDown size={14} strokeWidth={4} className='inline' /> Status</div>
                    {isStatusFIlterOpen && <ul tabIndex={0} className="menu dropdown-content bg-gray-900 rounded-md z-[1] w-32 p-0 shadow mt-3 mx-w-[80px]" onClick={() => setIsStatusFIlterOpen(false)}>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('') }}>All</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('Active') }}>Active</a></li>
                      <li><a className='text-xs font-semibold px-4 py-2' onClick={() => { setFilterStatus('Inactive') }}>Inactive</a></li>
                    </ul>}
                  </div>
                </th>
                <th className="text-white text-center font-bold break-words">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((user) => (
                <tr key={user._id} className="hover" >
                  <td className="text-center break-words mx-auto">
                    {user.imagePath ? (
                      <img
                        src={`http://localhost:5000/${user.imagePath}`}
                        className="h-[66px] w-[66px] rounded-full mx-auto"
                      />
                    ) : (
                      <User size={40} className='mx-auto' />
                    )}
                  </td>
                  <td className="text-center break-words">{user.name}</td>
                  <td className="text-center break-words">{user.email}</td>
                  <td className="text-center break-words">
                    {user?.role?.toUpperCase()}
                  </td>
                  <td className="text-center break-words">
                    {user.isMsadUser ? "Azure" : "App user"}
                  </td>
                  <td className="text-center break-words">
                    <div className={`p-1 rounded-md text-white ${user.isActive ? "bg-emerald-500" : "bg-red-700"}`} >
                      {user.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="text-center break-words">
                    <button
                      className="btn btn-outline btn-xs mr-2"
                      onClick={() => UpdateUser(user)}
                    >
                      <Edit size={12}></Edit> Update
                    </button>
                    <button
                      disabled={user.isMsadUser}
                      className="btn btn-error btn-xs text-white"
                      onClick={() => removeUser(user._id)}
                    >
                      <Trash color="white" size={12}></Trash> Remove
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
