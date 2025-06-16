import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { Position } from '../types';
import {
  addJobPosition,
  getAllJobPositions,
  deleteJobPosition,
} from '../utils/jobUtils';

interface JobFormData {
  title: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
}

const AdminJobManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<Position[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    type: 'Full-time',
    location: 'Remote',
    experience: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    skills: [''],
  });

  // Simple password authentication (in a real app, use proper auth)
  const ADMIN_PASSWORD = 'ThinkRED2025!';

  useEffect(() => {
    if (isAuthenticated) {
      loadJobs();
    }
  }, [isAuthenticated]);

  const loadJobs = () => {
    const allJobs = getAllJobPositions();
    setJobs(allJobs);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: 'requirements' | 'responsibilities' | 'skills',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: 'requirements' | 'responsibilities' | 'skills'
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'requirements' | 'responsibilities' | 'skills',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Filter out empty array items
    const cleanedData = {
      ...formData,
      requirements: formData.requirements.filter(item => item.trim() !== ''),
      responsibilities: formData.responsibilities.filter(
        item => item.trim() !== ''
      ),
      skills: formData.skills.filter(item => item.trim() !== ''),
    };

    try {
      const newJob = addJobPosition(cleanedData);
      alert(`Job "${newJob.title}" created successfully! ID: ${newJob.id}`);
      setShowForm(false);
      setFormData({
        title: '',
        type: 'Full-time',
        location: 'Remote',
        experience: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        skills: [''],
      });
      loadJobs();
    } catch {
      alert('Error creating job. Please try again.');
    }
  };

  const handleDeleteJob = (jobId: number, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      if (deleteJobPosition(jobId)) {
        alert('Job deleted successfully');
        loadJobs();
      } else {
        alert('Error deleting job');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <PageHero
          title="Admin Access"
          subtitle="Enter the admin password to manage job openings"
        />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-md">
            <form
              onSubmit={handleAuth}
              className="bg-white rounded-xl shadow-xl p-8"
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button type="submit" className="w-full btn btn-primary">
                Access Admin Panel
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="Job Management"
        subtitle="Create and manage job openings for ThinkRED Technologies"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="heading-1 text-dark">
              Current Job Openings ({jobs.length})
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? 'Cancel' : 'Create New Job'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
              <h3 className="heading-2 text-dark mb-6">
                Create New Job Opening
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={e =>
                        handleInputChange('location', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={e =>
                        handleInputChange('experience', e.target.value)
                      }
                      placeholder="e.g., 2-4 years"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={e =>
                          handleArrayChange(
                            'requirements',
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter requirement"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-primary hover:underline"
                  >
                    + Add Requirement
                  </button>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={e =>
                          handleArrayChange(
                            'responsibilities',
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter responsibility"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem('responsibilities', index)
                        }
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    className="text-primary hover:underline"
                  >
                    + Add Responsibility
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={e =>
                          handleArrayChange('skills', index, e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter skill"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="text-primary hover:underline"
                  >
                    + Add Skill
                  </button>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary">
                    Create Job Opening
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="space-y-6">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-regular p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="heading-2 text-dark">{job.title}</h3>
                    <p className="text-secondary">
                      {job.type} | {job.location} | {job.experience}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {job.id} | Slug: {job.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/careers/${job.slug}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="btn bg-red-600 text-white hover:bg-red-700 btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-secondary text-sm">{job.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminJobManagement;
