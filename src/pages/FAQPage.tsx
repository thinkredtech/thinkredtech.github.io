import react from 'react';

const FAQPage: react.FC = () => {
    return (
        <div>
            <section className="py-8 md:py-16">
                <div className="text-center mt-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-secondary max-w-3xl mx-auto">
                        Find answers to common questions about working with ThinkRED Technologies.
                    </p>
                </div>
            </section>
            <section className="py-16 md:py-24  bg-backgroundAlt">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-regular">
                            <h3 className="font-medium text-dark text-lg mb-2">What is your typical project process?</h3>
                            <p className="text-secondary">
                                Our process typically includes discovery and planning, design and development, testing and refinement, and deployment and support phases. We work closely with clients throughout the process to ensure their needs are met.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-regular">
                            <h3 className="font-medium text-dark text-lg mb-2">How long does a typical project take?</h3>
                            <p className="text-secondary">
                                Project timelines vary based on complexity and scope. Simple websites might take 4-6 weeks, while complex applications can take 3-6 months or more. We'll provide a detailed timeline during the discovery phase.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-regular">
                            <h3 className="font-medium text-dark text-lg mb-2">Do you provide ongoing support after launch?</h3>
                            <p className="text-secondary">
                                Yes, we offer various support and maintenance packages to ensure your solution continues to perform optimally after launch. These can include regular updates, performance monitoring, and technical support.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-regular">
                            <h3 className="font-medium text-dark text-lg mb-2">What technologies do you specialize in?</h3>
                            <p className="text-secondary">
                                We specialize in modern web and mobile technologies including React, Vue, Node.js, Python, Spring Boot, as well as cloud platforms like AWS, Azure, and Google Cloud. We also have expertise in DevOps, containerization, and infrastructure automation.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-regular">
                            <h3 className="font-medium text-dark text-lg mb-2">How do you handle project changes or additional requirements?</h3>
                            <p className="text-secondary">
                                We follow an agile approach that allows for flexibility. If requirements change during a project, we'll assess the impact on timeline and budget, discuss options with you, and implement changes in a controlled manner to minimize disruption.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
