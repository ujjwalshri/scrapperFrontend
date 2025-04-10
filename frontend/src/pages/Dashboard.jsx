import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // Quick links for dashboard navigation
  const quickLinks = [
    {
      title: 'Create Menu',
      description: 'Design and customize a new menu',
      icon: '📝',
      path: '/create-menu',
      color: 'bg-green-100 dark:bg-green-800'
    },
    {
      title: 'My Menus',
      description: 'View and edit your saved menus',
      icon: '📋',
      path: '/my-menus',
      color: 'bg-blue-100 dark:bg-blue-800'
    },
    {
      title: 'Settings',
      description: 'Update your account preferences',
      icon: '⚙️',
      path: '/settings',
      color: 'bg-purple-100 dark:bg-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-accent-primary mb-2">Welcome to your Dashboard</h1>
          <p className="text-theme-secondary max-w-3xl">
            Manage your menus, update settings, and access all your MenuMaker features from this central hub.
          </p>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={link.path} className="block">
                <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-theme-tertiary' : 'bg-white'} hover:shadow-lg transition-shadow`}>
                  <div className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{link.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-theme-primary">{link.title}</h3>
                  <p className="text-theme-secondary">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent activity placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-theme-tertiary' : 'bg-white'} mb-8`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-theme-primary">Recent Activity</h2>
          <div className="space-y-4">
            <div className="p-4 border border-theme rounded-md bg-theme-secondary bg-opacity-5">
              <p className="text-theme-secondary">You haven't created any menus yet. Get started by clicking "Create Menu"!</p>
            </div>
          </div>
        </motion.div>

        {/* Get started section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary p-8 text-white"
        >
          <div className="md:flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to create your first menu?</h2>
              <p className="mb-4 md:mb-0 opacity-90">Design beautiful custom menus with our easy-to-use editor.</p>
            </div>
            <Link to="/create-menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-accent-primary font-medium px-6 py-3 rounded-full shadow-md"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 