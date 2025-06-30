/**
 * Utility functions for job management
 * Handles ID generation, job creation, and storage
 */

import { Position } from "../types";

/**
 * Generate a unique job ID based on timestamp and random string
 * @returns Unique job ID as a number
 */
export const generateJobId = (): number => {
  // Use timestamp + random to ensure uniqueness
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return parseInt(
    `${timestamp.toString().slice(-6)}${random.toString().padStart(3, "0")}`,
  );
};

/**
 * Generate a URL-friendly slug from a job title
 * @param title - Job title
 * @returns URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
};

/**
 * Create a new job position with auto-generated ID and slug
 * @param jobData - Job data without ID, slug, and timestamps
 * @returns Complete Position object
 */
export const createJobPosition = (
  jobData: Omit<Position, "id" | "slug" | "createdAt" | "updatedAt">,
): Position => {
  const id = generateJobId();
  const slug = generateSlug(jobData.title);
  const now = new Date().toISOString();

  return {
    ...jobData,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Get all job positions from localStorage
 * @returns Array of job positions
 */
export const getStoredJobs = (): Position[] => {
  try {
    const storedJobs = localStorage.getItem("thinkred_job_positions");
    return storedJobs ? JSON.parse(storedJobs) : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error retrieving stored jobs:", error);
    return [];
  }
};

/**
 * Save job positions to localStorage
 * @param jobs - Array of job positions
 */
export const saveJobsToStorage = (jobs: Position[]): void => {
  try {
    localStorage.setItem("thinkred_job_positions", JSON.stringify(jobs));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving jobs to storage:", error);
  }
};

/**
 * Add a new job position
 * @param jobData - Job data without ID, slug, and timestamps
 * @returns Created job position
 */
export const addJobPosition = (
  jobData: Omit<Position, "id" | "slug" | "createdAt" | "updatedAt">,
): Position => {
  const newJob = createJobPosition(jobData);
  const existingJobs = getStoredJobs();
  const updatedJobs = [...existingJobs, newJob];
  saveJobsToStorage(updatedJobs);
  return newJob;
};

/**
 * Update an existing job position
 * @param jobId - ID of the job to update
 * @param updates - Partial job data to update
 * @returns Updated job position or null if not found
 */
export const updateJobPosition = (
  jobId: number,
  updates: Partial<Position>,
): Position | null => {
  const jobs = getStoredJobs();
  const jobIndex = jobs.findIndex((job) => job.id === jobId);

  if (jobIndex === -1) return null;

  const updatedJob = {
    ...jobs[jobIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  jobs[jobIndex] = updatedJob;
  saveJobsToStorage(jobs);
  return updatedJob;
};

/**
 * Delete a job position
 * @param jobId - ID of the job to delete
 * @returns Boolean indicating success
 */
export const deleteJobPosition = (jobId: number): boolean => {
  const jobs = getStoredJobs();
  const filteredJobs = jobs.filter((job) => job.id !== jobId);

  if (filteredJobs.length === jobs.length) return false; // Job not found

  saveJobsToStorage(filteredJobs);
  return true;
};

/**
 * Get all job positions (combines hardcoded and stored)
 * @param hardcodedJobs - Array of hardcoded job positions
 * @returns Combined array of all job positions
 */
export const getAllJobPositions = (
  hardcodedJobs: Position[] = [],
): Position[] => {
  const storedJobs = getStoredJobs();
  return [...hardcodedJobs, ...storedJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
