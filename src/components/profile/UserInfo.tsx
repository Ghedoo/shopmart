'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

export default function UserInfo() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [role] = useState(session?.user?.role || '')
  const [loading, setLoading] = useState(false)

  if (!session) return null

  const userToken = (session as any)?.accessToken // يجب إضافة accessToken عند إعداد NextAuth callbacks

  const handleUpdate = async () => {
    if (!userToken) {
      alert('User token not found. Please login again.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/updateMe', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: userToken,
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await res.json()
      if (data.status === 'success') {
        alert('Profile updated successfully!')
      } else {
        alert(data.message || 'Failed to update profile.')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg max-w-sm mx-auto border border-indigo-100">
      <h3 className="text-xl font-bold mb-4 text-indigo-700 text-center">My Profile</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="text-indigo-500 w-5 h-5" />
          <span className="font-medium text-gray-700">Name:</span>
          <span className="text-gray-900">{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="text-indigo-500 w-5 h-5" />
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-900">{email}</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-indigo-500 w-5 h-5" />
          <span className="font-medium text-gray-700">Role:</span>
          <span className="text-gray-900 capitalize">{role}</span>
        </div>
      </div>

      {/* زر فتح نموذج التعديل */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
