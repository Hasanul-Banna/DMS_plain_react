import { useState } from "react"

export default function MicrosoftActiveDirectorySettings() {
  const [formData, setformData] = useState({
    id: ''
  })
  const handleSubmit = (e) => {

  }
  return (
    <div>
      <div className="flex gap-4">
        <div className="card bg-white p-6 w-full">
          <form onSubmit={handleSubmit} className="space-y-1">
            <p className="font-bold text-xl bg-gray-200 pl-4 pt-2 rounded-lg border-b pb-2">Ms Active Directory Settings</p>
            {['SMTP Server', 'Port Number (default: 25)', 'From Address', 'Use Secure Transport', 'Use Authentication', 'Authentication user ID', 'Authentication Password'].map(config => <div key={config} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config}</span>
              </label>
              <input
                // value={formData.name}
                // onChange={(e) => setformData(u => { return { ...u, name: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            <div className="flex justify-start">
              <button className="btn btn-sm text-lg w-full btn-primary text-white mt-4" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="card bg-white p-6 w-full">
          <form onSubmit={handleSubmit} className="space-y-1">
            <p className="font-bold text-xl bg-gray-200 pl-4 pt-2 rounded-lg border-b pb-2">Ms Active Directory Settings</p>
            {['Azure Tenant', 'App Id', 'App Secret', 'Client Id'].map(config => <div key={config} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config}</span>
              </label>
              <input
                // value={formData.name}
                // onChange={(e) => setformData(u => { return { ...u, name: e.target.value } })}
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
                <input type="checkbox"  className="checkbox" />
              </label>
            </div>
            <p className="font-bold text-xl bg-gray-200 pl-4 pt-2 rounded-lg border-b pb-2">Synchronizatioin</p>
            {['Start Hour (24h)', 'Start Minute', 'Last Synchronizatioin'].map(config => <div key={config} className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text">{config}</span>
              </label>
              <input
                // value={formData.name}
                // onChange={(e) => setformData(u => { return { ...u, name: e.target.value } })}
                className="input input-bordered input-sm"
                required
              />
            </div>)}
            <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Activate</span>
                <input type="checkbox"  className="checkbox" />
              </label>
            </div>
            <div className="flex justify-start">
              <button className="btn btn-sm text-lg w-full btn-primary text-white mt-4" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
