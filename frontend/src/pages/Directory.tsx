import React, { useState, ChangeEvent } from 'react';
import { Input } from 'shadcn-ui';

const jobTypes = ['Engineer', 'Manager', 'Researcher', 'Teacher', 'Other'];
const groups = ['Batch 2020', 'Batch 2021', 'CSE', 'EEE', 'Other'];

interface Alumni {
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

interface Filters {
  name: string;
  location: string;
  jobTitle: string;
  group: string;
}

export default function Directory() {
  const [filters, setFilters] = useState<Filters>({ name: '', location: '', jobTitle: '', group: '' });
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  async function fetchAlumni() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      // Clerk JWT is usually in local/session storage or via Clerk SDK
      const token = window.localStorage.getItem('clerkToken') || '';
      const res = await fetch(`/api/alumni?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAlumni(await res.json());
      } else {
        setAlumni([]);
      }
    } catch {
      setAlumni([]);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    fetchAlumni();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Alumni Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input name="name" placeholder="Name" value={filters.name} onChange={handleChange} />
        <Input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <select name="jobTitle" value={filters.jobTitle} onChange={handleChange} className="border rounded px-2 py-1">
          <option value="">Job Type</option>
          {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
        <select name="group" value={filters.group} onChange={handleChange} className="border rounded px-2 py-1">
          <option value="">Group</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : alumni.length === 0 ? (
          <div className="text-gray-500">No alumni found.</div>
        ) : (
          alumni.map(a => (
            <div key={a.clerkUserId} className="bg-white rounded shadow p-4">
              <div className="font-bold">{a.name}</div>
              <div className="text-sm text-gray-600">{a.jobTitle} • {a.department}</div>
              <div className="text-sm">{a.location}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
