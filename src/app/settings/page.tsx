'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Load user and localStorage settings
  useEffect(() => {
    if (user) setName(user.fullName || '');
    if (typeof window !== 'undefined') {
      setDark(document.documentElement.classList.contains('dark'));
      setNotifications(localStorage.getItem('notifications') === 'enabled');
    }
  }, [user]);

  // Handle dark mode toggle
  const handleDarkToggle = () => {
    setDark((d) => {
      const newDark = !d;
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newDark;
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = () => {
    setNotifications((n) => {
      const newVal = !n;
      localStorage.setItem('notifications', newVal ? 'enabled' : 'disabled');
      return newVal;
    });
  };

  // Save display name to Clerk
  const handleSave = async () => {
    setSaving(true);
    if (user && name && name !== user.fullName) {
      await user.update({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isLoaded) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="flex justify-center py-10">
      <div className="bg-white dark:bg-[#232946] rounded-lg shadow p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#2d3250] bg-gray-50 dark:bg-[#181823] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            value={user?.emailAddresses[0]?.emailAddress || ''}
            disabled
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#2d3250] bg-gray-100 dark:bg-[#181823] text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
          <button
            onClick={handleDarkToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${dark ? 'bg-indigo-600' : 'bg-gray-300'}`}
            aria-label="Toggle dark mode"
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${dark ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-700 dark:text-gray-200">Notifications</span>
          <button
            onClick={handleNotificationToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
            aria-label="Toggle notifications"
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition mb-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <div className="text-green-500 text-sm mt-1 text-center">Settings saved!</div>}
      </div>
    </div>
  );
}
