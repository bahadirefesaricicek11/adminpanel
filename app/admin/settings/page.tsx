'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your admin panel settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input defaultValue="PaintCo" className="mt-1" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input defaultValue="admin@paintco.com" type="email" className="mt-1" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input defaultValue="+1 (555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label>Website</Label>
                <Input defaultValue="www.paintco.com" className="mt-1" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>

          {/* Email Notifications */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>New job notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Job completion alerts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Team activity updates</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span>Weekly reports</span>
              </label>
              <Button>Save Preferences</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Account</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-semibold">Admin User</p>
                  <p className="text-sm text-slate-500">Owner</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Two-Factor Auth
              </Button>
            </div>
          </Card>

          {/* System Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">System</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-600">Panel Version</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-slate-600">Database</p>
                <p className="font-semibold">Supabase</p>
              </div>
              <div className="pt-2 border-t pb-2">
                <p className="text-slate-600">Last Backup</p>
                <p className="font-semibold">Today 10:30 AM</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
