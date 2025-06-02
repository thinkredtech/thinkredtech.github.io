import React from 'react';
import { FaGavel } from 'react-icons/fa';

const TermsOfServicePage: React.FC = () => (
    <div>
        <section className="py-8 md:py-16">
            <div className="container mx-auto text-center mt-16">
                <div className="flex flex-col items-center mb-8">
                    <FaGavel className="w-12 h-12 text-primary mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                </div>
                <p className="text-lg text-secondary max-w-3xl mx-auto">
                    Please read these Terms of Service carefully before using the ThinkRED Technologies website.
                </p>
            </div>
        </section>
        <section className="bg-backgroundAlt">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="prose prose-lg">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the ThinkRED Technologies website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>
                    <h2>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                    <h2>3. Disclaimer</h2>
                    <p>
                        The materials on this website are provided "as is". ThinkRED Technologies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                    </p>
                    <h2>4. Limitations</h2>
                    <p>
                        In no event shall ThinkRED Technologies or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.
                    </p>
                    <h2>5. Modifications</h2>
                    <p>
                        ThinkRED Technologies may revise these Terms of Service at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
                    </p>
                    <h2>6. Governing Law</h2>
                    <p>
                        Any claim relating to ThinkRED Technologies' website shall be governed by the laws of the State of Maharashtra, India without regard to its conflict of law provisions.
                    </p>
                </div>
            </div>
        </section>
    </div>
);

export default TermsOfServicePage;
