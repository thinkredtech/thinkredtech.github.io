import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { hardcodedPositions } from './CareerPage'; // Import hardcodedPositions from CareerPage
import { getAllJobPositions } from '../utils/jobUtils'; // Import getAllJobPositions
import { Position } from '../types'; // Import Position from types

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();

  // Get all jobs (hardcoded + stored)
  const allJobs = getAllJobPositions(hardcodedPositions);

  // Find job by ID or slug
  const job: Position | undefined = allJobs.find((p: Position) => p.id.toString() === jobId || p.slug === jobId);

  if (!job) {
    return (
      <div>
        <PageHero
          title="Job Not Found"
          subtitle="The job opening you are looking for does not exist or is no longer available."
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <Link to="/careers" className="btn btn-primary">
            View Open Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero title={job.title} subtitle={`${job.type} | ${job.location} | ${job.experience} Experience`} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="mb-8">
              <h2 className="heading-1 text-dark mb-4">Job Description</h2>
              <p className="text-secondary leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="heading-1 text-dark mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-secondary">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="heading-1 text-dark mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-secondary">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="heading-1 text-dark mb-4">Skills & Qualifications</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-accent1/10 text-accent1 body-2 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 text-center">
              <Link to={`/apply/${job.slug}`} className="btn btn-primary px-8 py-3 text-lg">
                Apply for this Position
              </Link>
              <Link to="/careers" className="block mt-6 text-primary hover:underline">
                Back to All Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetailsPage;
