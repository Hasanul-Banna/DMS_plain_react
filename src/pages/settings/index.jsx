import { useEffect, useState } from "react"
import { AxiosInstance } from "../../Auth/Interceptor";
import { fireToast } from "../../utils/toastify";

export default function MicrosoftActiveDirectorySettings() {
  const [formData, setformData] = useState({
    id: '',
    isActivate: false,
    isIncludeDomain: false,

    smtp_server: '',
    port_number_default_25: '',
    from_address: '',
    use_secure_transport: '',
    use_authentication: '',
    authentication_user_id: '',
    authentication_password: '',
    azure_tenant: '',
    app_id: '',
    app_secret: '',
    client_id: '',
    start_hour_24h: '',
    start_minute: '',
    last_synchronization: '',
  })

  const configFields = [
    { name: 'SMTP Server', key: 'smtp_server' },
    { name: 'Port Number (default: 25)', key: 'port_number_default_25' },
    { name: 'From Address', key: 'from_address' },
    { name: 'Use Secure Transport', key: 'use_secure_transport' },
    { name: 'Use Authentication', key: 'use_authentication' },
    { name: 'Authentication user ID', key: 'authentication_user_id' },
    { name: 'Authentication Password', key: 'authentication_password' },
    { name: 'Azure Tenant', key: 'azure_tenant' },
    { name: 'App Id', key: 'app_id' },
    { name: 'App Secret', key: 'app_secret' },
    { name: 'Client Id', key: 'client_id' },
    { name: 'Start Hour (24h)', key: 'start_hour_24h' },
    { name: 'Start Minute', key: 'start_minute' },
    { name: 'Last Synchronization', key: 'last_synchronization' },
  ];
  useEffect(() => {
    console.log(configFields.map(x => x.key));
    AxiosInstance.get('http://localhost:5000/api/microsoft_ad')
      .then((response) => {
        console.log(response.data.data[0]);
        if (response.data.data.length) {
          setformData(response.data.data[0])
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    AxiosInstance.post('http://localhost:5000/api/microsoft_ad', formData)
      .then((response) => {
        console.log(response.data.data);
        fireToast('success', 'Microsoft Azure settings updated successfully')
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-1  max-w-[600px] mx-auto">
      <div>
        <div className="flex gap-4">
        <div className="card bg-white p-6 w-full">
            {/* <form onSubmit={handleSubmit} className="space-y-1"> */}
            <p className="font-bold text-xl bg-gray-200 pl-4 pt-2 rounded-lg border-b pb-2">Microsoft Active Directory Settings</p>
            {configFields.slice(7, 11).map((config,i) => <div key={i} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config.name}</span>
              </label>
              <input
                 value={formData[config.key]}
                 onChange={(e) => setformData(u => { return { ...u, [config.key]: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            <div className="form-control">
              {/* <label htmlFor="title" className="label">
                <span className="label-text">{'Include Domain'}</span>
              </label> */}
              <label className="label cursor-pointer">
                <span className="label-text">Include Domain</span>
                <input type="checkbox" className="checkbox" checked={formData.isIncludeDomain} onChange={(e) => setformData(f => { return { ...f, isIncludeDomain: e.target.checked } })} />
              </label>
            </div>
            
          </div>
          
        </div>
      </div>
      <div className="flex justify-start">
        <button className="btn  text-lg w-full btn-primary text-white mt-4" type="submit">
          Update
        </button>
      </div>
    </form>
  )
}
