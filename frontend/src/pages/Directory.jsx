import React, { useState } from 'react';
import { Input } from 'shadcn-ui';

const jobTypes = ['Engineer', 'Manager', 'Researcher', 'Teacher', 'Other'];
const groups = ['Batch 2020', 'Batch 2021', 'CSE', 'EEE', 'Other'];

export default function Directory() {
  const [filters, setFilters] = useState({ name: '', location: '', jobTitle: '', group: '' });

  // Placeholder for alumni list (to be fetched from backend)
  const alumni = [];

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

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
      {/* TODO: List alumni here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alumni.length === 0 ? (
          <div className="text-gray-500">No alumni found. (Connect to backend to show results)</div>
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
