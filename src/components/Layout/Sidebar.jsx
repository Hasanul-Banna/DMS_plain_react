import { useState } from 'react'
import { ChevronDown, CircleDotDashed, FileText, LayoutDashboard, LayoutList, Settings, UserCog, Users } from 'lucide-react';
import { NavLink } from 'react-router';

export default function Sidebar({ isSidebarHidden }) {
  const sidebarItems = [
    { link: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    {
      link: '/documents',
      icon: <FileText />,
      label: 'Templates',
      // subItems: [
      //   { link: '/documents', icon: <CircleDotDashed size={12} />, label: 'List' },
      //   { link: '/documents/add', icon: <CircleDotDashed size={12} />, label: 'Upload New' }
      // ]
    },
    { link: '/users', icon: <Users />, label: 'Users' },
    // { link: '/roles', icon: <UserCog />, label: 'Role Management' },
    { link: '/logs', icon: <LayoutList />, label: 'Logs' },
    {
      link: '/settings', icon: <Settings />, label: 'Settings',
      subItems: [
        { link: '/settings/logo', icon: <CircleDotDashed size={12} />, label: 'Logo' },
        // { link: '/settings', icon: <CircleDotDashed size={12} />, label: 'MS Azure Sync' },
        { link: '/settings', icon: <CircleDotDashed size={12} />, label: 'MS Active Directory' },
      ]

    }
  ];
  return (
    <div>
      {/* Sidebar content */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li className="px-5">
            <div className="flex flex-row items-center h-8 mb-3">
              <div className="text-sm font-light tracking-wide text-gray-200 w-full">
                {/* <img src={'logo'} width={100} height={100} alt="logo" className='m-auto' /> */}
              </div>
            </div>
          </li>
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} link={item.link} icon={item.icon} label={item.label} subItems={item.subItems} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const SidebarItem = ({ icon, label, link, subItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSubItems = (e) => {
    e.preventDefault(); // Prevent navigating if the chevron is clicked
    setIsExpanded(!isExpanded);
  };
  return (
    <li>
      <NavLink
        to={link}
        className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-slate-100 text-gray-50 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
      >
        <span className="inline-flex justify-center items-center ml-4">{icon}</span>
        <span className="ml-2 text-md w-full tracking-wide truncate flex justify-between items-center">
          {label}
          {subItems && (
            <span onClick={toggleSubItems} className="ml-auto cursor-pointer">
              <ChevronDown className={`${isExpanded ? 'rotate-180' : ''} transition-transform duration-500`} />
            </span>
          )}
        </span>
      </NavLink >
      {subItems && (
        <ul className={`pl-10 overflow-hidden whitespace-nowrap transition-height duration-300 ${isExpanded ? 'max-h-[300px]' : 'max-h-0'}`}>
          {subItems.map((subItem, index) => (
            <li
              key={index}
              className="text-white hover:bg-slate-100 rounded-tl-sm rounded-bl-sm hover:text-slate-800 transition py-1 pl-5 text-sm cursor-pointer"
            >
              <NavLink to={subItem.link} className="flex items-center gap-1">
                {subItem.icon} {subItem.label}
              </NavLink >
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
