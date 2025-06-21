import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { 
  Users, 
  UserCheck, 
  Settings, 
  BarChart3, 
  LogOut,
  Building2,
  Settings as SettingsIcon,
  ArrowUp,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  firmSlug: string;
}

const Sidebar = ({ firmSlug }: SidebarProps) => {
  const location = useLocation();
  const { role, logout, firm, consultant } = useAuthStore();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const isOwner = role === 'owner';

  const navigation = [
    {
      name: 'Clients',
      href: `/${firmSlug}`,
      icon: Users,
      current: location.pathname === `/${firmSlug}`,
    },
    // {
    //   name: "Profile Settings",
    //   href: `/${firmSlug}/consultant-profile`,
    //   icon: Settings,
    //   current: location.pathname === `/${firmSlug}/consultant-profile`,
    //   // role: ['consultant', 'team_leader', 'owner'],
    // },

    ...(isOwner ? [
      {
        name: 'Consultants',
        href: `/${firmSlug}/consultants`,
        icon: UserCheck,
        current: location.pathname === `/${firmSlug}/consultants`,
      },
      {
        name: 'Firm Settings',
        href: `/${firmSlug}/firm-settings`,
        icon: Settings,
        current: location.pathname === `/${firmSlug}/firm-settings`,
      },
      {
        name: 'Dashboard',
        href: `/${firmSlug}/dashboard`,
        icon: BarChart3,
        current: location.pathname === `/${firmSlug}/dashboard`,
      },
    ] : []),
    {
      name: 'Resources',
      href: `/${firmSlug}/pnp-resources`,
      icon: BookOpen,
      current: location.pathname === `/${firmSlug}/pnp-resources`,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isAccountSettingsOpen) {
      setIsAccountSettingsOpen(true);
    }
  }, [isAccountSettingsOpen]);

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-gray-900">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-lg font-semibold text-white">{firm?.name}</h1>
              <p className="text-sm text-gray-300">role: {role}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 bg-gray-900 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div
          onClick={() => { setIsAccountSettingsOpen(!isAccountSettingsOpen) }}
          // onMouseEnter={() => { setIsAccountSettingsOpen(true) }}
          // onMouseLeave={() => { setIsAccountSettingsOpen(false) }}
          className='group flex items-center justify-between text-white text-sm font-medium rounded-md gap-2 border border-gray-700 mx-2 my-2 px-2 py-2'>
          <div className='flex items-center gap-2'>
            <SettingsIcon className='h-6 w-6 text-gray-400 group-hover:text-white' />
            <p>Account Settings</p>
          </div>
          <ArrowUp className={`h-6 w-6 text-gray-400 group-hover:text-white ${isAccountSettingsOpen ? 'rotate-180' : ''}`} />
        </div>
        {isAccountSettingsOpen && (
          <div className='flex flex-col mb-5'>
            <div className='mb-3 w-full bg-gray-700 h-1' />
            <Link
              key={"Profile Settings"}
              to={`/${firmSlug}/consultant-profile`}
              className={cn(
                location.pathname === "/profile-settings"
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md border border-gray-700 mx-2'
              )}
            >
              <SettingsIcon
                className={cn(
                  location.pathname === "/profile-settings" ? 'text-white' : 'text-gray-400 group-hover:text-white',
                  'mr-3 flex-shrink-0 h-6 w-6'
                )}
              />
              Profile Settings
            </Link>

            <div className="group flex items-center text-sm font-medium rounded-md border border-gray-700 mx-2 my-2">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="group flex w-full items-center justify-start text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                Logout
              </Button>
            </div>
          </div>
        )}
        <p className="text-sm text-gray-300 px-4 mb-4">Logged in as: <span className="font-bold">{consultant?.email}</span></p>

      </div>
    </div>
  );
};

export default Sidebar;
