export default function Footer () {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className='bg-gray-100 border-t border-gray-200'>
        <div className='max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-12'>
          <div className='grid md:grid-cols-4 gap-10'>
            <div>
              <div className='flex items-center mb-6'>
                <span className='text-3xl mr-2'>⚕️</span>
                <span className='font-bold text-2xl text-blue-600'>
                  HealthHub
                </span>
              </div>
              <p className='text-gray-600 text-lg'>
                A comprehensive hospital management system designed to
                streamline healthcare operations.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-xl mb-6'>Quick Links</h3>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#features'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href='#benefits'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    href='#testimonials'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href='#contact'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-xl mb-6'>Resources</h3>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Training
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-xl mb-6'>Legal</h3>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    HIPAA Compliance
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-600 hover:text-blue-600 text-lg'
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-200 mt-10 pt-8 text-center text-lg text-gray-600'>
            <p>
              © {currentYear} HealthHub Medical Center. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
