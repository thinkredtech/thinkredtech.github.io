import PageHero from '../components/ui/PageHero';

const BrandGuidelinesPage = () => {
  return (
    <div>
      <PageHero
        title="Brand Guidelines"
        subtitle="Visual identity, logo usage, color palettes, typography, and design principles that define the ThinkRED brand."
      />

      {/* Logo Guidelines Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Logo & Brand Mark</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              Our logo represents innovation, reliability, and technical excellence. Please follow these guidelines to
              maintain brand consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Primary Logo */}
            <div className="bg-backgroundAlt rounded-lg p-8 text-center">
              <h3 className="heading-2 text-dark mb-6">Primary Logo</h3>
              <div className="bg-white rounded-xl p-8 mb-6 shadow-regular">
                <img src="/assets/logos/thinkRED-np.svg" alt="ThinkRED Primary Logo" className="h-16 mx-auto" />
              </div>
              <p className="text-secondary text-sm">
                Use this logo on light backgrounds and when maximum impact is needed.
              </p>
            </div>

            {/* Logo Variations */}
            <div className="bg-backgroundAlt rounded-lg p-8 text-center">
              <h3 className="heading-2 text-dark mb-6">Logo Variations</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-regular">
                  <img
                    src="/assets/logos/thinkRED-np.svg"
                    alt="ThinkRED Logo White Background"
                    className="h-12 mx-auto"
                  />
                  <p className="text-xs text-secondary mt-2">Light Backgrounds</p>
                </div>
                <div className="bg-dark rounded-xl p-6 shadow-regular">
                  <img
                    src="/assets/logos/thinkRED-np.svg"
                    alt="ThinkRED Logo Dark Background"
                    className="h-12 mx-auto filter brightness-0 invert"
                  />
                  <p className="text-xs text-gray-300 mt-2">Dark Backgrounds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Color Palette</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              Our brand colors reflect energy, innovation, and professionalism. Use these colors consistently across all
              brand materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary Red */}
            <div className="bg-white rounded-lg p-6 text-center shadow-regular">
              <div className="w-full h-24 bg-primary rounded-xl mb-4"></div>
              <h3 className="font-bold text-dark mb-2">ThinkRED Primary</h3>
              <p className="text-sm text-secondary mb-2">#E4093E</p>
              <p className="text-xs text-secondary">Primary CTAs, Brand Elements</p>
            </div>

            {/* Accent Blue */}
            <div className="bg-white rounded-lg p-6 text-center shadow-regular">
              <div className="w-full h-24 bg-accent1 rounded-xl mb-4"></div>
              <h3 className="font-bold text-dark mb-2">ThinkRED Blue</h3>
              <p className="text-sm text-secondary mb-2">#518CEA</p>
              <p className="text-xs text-secondary">Secondary Actions, Links</p>
            </div>

            {/* Accent Purple */}
            <div className="bg-white rounded-lg p-6 text-center shadow-regular">
              <div className="w-full h-24 bg-accent2 rounded-xl mb-4"></div>
              <h3 className="font-bold text-dark mb-2">ThinkRED Purple</h3>
              <p className="text-sm text-secondary mb-2">#AE6CFC</p>
              <p className="text-xs text-secondary">Tertiary Actions, Gradients</p>
            </div>

            {/* Dark Gray */}
            <div className="bg-white rounded-lg p-6 text-center shadow-regular">
              <div className="w-full h-24 bg-dark rounded-xl mb-4"></div>
              <h3 className="font-bold text-dark mb-2">Dark Primary</h3>
              <p className="text-sm text-secondary mb-2">#2A2A2A</p>
              <p className="text-xs text-secondary">Primary Text, Headlines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Typography</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              Our typography system balances readability with brand personality, using Comfortaa for display text and
              Montserrat for body content.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Primary Display Font */}
            <div className="bg-backgroundAlt rounded-lg p-8">
              <h3 className="heading-2 text-dark mb-6">Display Font - Comfortaa</h3>
              <div className="space-y-4">
                <div className="font-comfortaa text-4xl font-medium text-primary">Simplify Technology</div>
                <div className="font-comfortaa text-2xl font-medium text-dark">Innovation & Experience</div>
                <p className="text-secondary text-sm">
                  Used for headlines, hero text, and primary brand statements. Rounded, friendly, and approachable
                  character.
                </p>
              </div>
            </div>

            {/* Body Text Font */}
            <div className="bg-backgroundAlt rounded-lg p-8">
              <h3 className="heading-2 text-dark mb-6">Body Font - Montserrat</h3>
              <div className="space-y-4">
                <h4 className="heading-1 text-dark">Professional Heading</h4>
                <p className="body-1-medium text-dark">
                  This is body text in Montserrat. Clean, professional, and highly legible for all interface elements
                  and content.
                </p>
                <p className="text-secondary text-sm">
                  Used for body text, navigation, UI elements, and all content that requires optimal readability and
                  professional appearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines Section */}
      <section className="py-16 md:py-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">Usage Guidelines</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              Follow these guidelines to ensure consistent and effective use of our brand elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Do's */}
            <div className="bg-white rounded-lg p-8 shadow-regular">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="heading-2 text-dark">Do's</h3>
              </div>
              <ul className="space-y-3 text-secondary">
                <li>• Use primary colors for CTAs and important elements</li>
                <li>• Maintain adequate white space around the logo</li>
                <li>• Use Comfortaa for headlines and brand statements</li>
                <li>• Use Montserrat for body text and UI elements</li>
                <li>• Ensure proper contrast ratios for accessibility</li>
                <li>• Keep the logo proportional when scaling</li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-white rounded-lg p-8 shadow-regular">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="heading-2 text-dark">Don'ts</h3>
              </div>
              <ul className="space-y-3 text-secondary">
                <li>• Don't alter logo colors or proportions</li>
                <li>• Don't use low contrast color combinations</li>
                <li>• Don't crowd the logo with other elements</li>
                <li>• Don't use outdated or unofficial logo versions</li>
                <li>• Don't mix fonts outside the brand system</li>
                <li>• Don't use brand colors on inappropriate backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="display-2 mb-4 text-dark">RED Assistant - Our AI Mascot</h2>
            <p className="body-1-medium text-secondary max-w-3xl mx-auto">
              Our 3D AI assistant embodies the ThinkRED brand personality - helpful, intelligent, and approachable while
              maintaining technical sophistication.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-accent1/10 rounded-lg p-8 text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 bg-primary rounded-full"></div>
                </div>
                <h3 className="heading-1 text-dark mb-4">RED Assistant</h3>
                <p className="body-1-medium text-secondary max-w-2xl mx-auto">
                  An interactive 3D avatar that provides contextual assistance, engages users with smart animations, and
                  represents our commitment to innovative user experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 rounded-xl p-6">
                  <h4 className="font-semibold text-dark mb-2">Interactive</h4>
                  <p className="text-sm text-secondary">
                    Responds to user interactions and provides contextual assistance
                  </p>
                </div>
                <div className="bg-white/60 rounded-xl p-6">
                  <h4 className="font-semibold text-dark mb-2">Adaptive</h4>
                  <p className="text-sm text-secondary">Changes behavior based on page context and user engagement</p>
                </div>
                <div className="bg-white/60 rounded-xl p-6">
                  <h4 className="font-semibold text-dark mb-2">Branded</h4>
                  <p className="text-sm text-secondary">Consistent with brand colors and personality traits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Assets Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="display-2 mb-4 text-white">Download Brand Assets</h2>
          <p className="body-1-medium text-white/90 max-w-3xl mx-auto mb-8">
            Need our logo, color swatches, or other brand materials? Contact us for access to our complete brand asset
            library.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 body-1-semibold"
            >
              Request Assets
            </a>
            <a href="/about" className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 body-1-semibold">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandGuidelinesPage;
