import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface AlumniProfile {
  clerkUserId: string;
  name: string;
  email: string;
  avatar?: string;
  graduationYear?: number;
  department?: string;
  jobTitle?: string;
  location?: string;
  group?: string;
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Partial<AlumniProfile>>({});

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const token = window.localStorage.getItem('clerkToken') || '';
      const res = await fetch(id ? `/api/alumni/${id}` : '/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setForm(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  async function handleSave() {
    const token = window.localStorage.getItem('clerkToken') || '';
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEdit(false);
      setProfile(await res.json());
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div className="text-gray-500">Profile not found.</div>;

  const isOwnProfile = !id;

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
      {profile.avatar && <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-4" />}
      {edit ? (
        <>
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.jobTitle || ''} onChange={e => setForm({ ...form, jobTitle: e.target.value })} placeholder="Job Title" />
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" />
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" />
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.group || ''} onChange={e => setForm({ ...form, group: e.target.value })} placeholder="Group" />
          <input className="block w-full mb-2 px-2 py-1 border rounded" value={form.graduationYear || ''} onChange={e => setForm({ ...form, graduationYear: Number(e.target.value) })} placeholder="Graduation Year" type="number" />
          <button className="bg-blue-600 text-white px-4 py-1 rounded mr-2" onClick={handleSave}>Save</button>
          <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEdit(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-2">{profile.name}</h2>
          <div className="text-center text-gray-600 mb-2">{profile.jobTitle} • {profile.department}</div>
          <div className="text-center text-gray-500 mb-4">{profile.location} | {profile.group}</div>
          <div className="text-center text-gray-400 text-sm">Graduation: {profile.graduationYear || 'N/A'}</div>
          <div className="text-center text-gray-400 text-sm mt-2">Email: {profile.email}</div>
          {isOwnProfile && (
            <button className="mt-4 bg-blue-600 text-white px-4 py-1 rounded" onClick={() => setEdit(true)}>Edit Profile</button>
          )}
        </>
      )}
    </div>
  );
}
