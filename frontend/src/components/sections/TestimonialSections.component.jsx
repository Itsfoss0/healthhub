export default function TestimonialSection () {
  return (
    <>
      <section id='testimonials' className='mb-20'>
        <h2 className='text-4xl font-bold mb-12 text-center'>
          What Healthcare Professionals Say
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-white p-8 rounded-lg shadow-md'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                <span className='text-blue-600 font-bold text-xl'>DR</span>
              </div>
              <div>
                <h4 className='font-semibold text-xl'>Dr. Robert Kamau</h4>
                <p className='text-gray-600'>Chief Medical Officer</p>
              </div>
            </div>
            <p className='italic text-gray-700 text-lg'>
              "HealthHub has enhanced our patient management workflow. The
              system is easy to use and has significantly reduced our
              administrative overhead."
            </p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                <span className='text-blue-600 font-bold text-xl'>SN</span>
              </div>
              <div>
                <h4 className='font-semibold text-xl'>Sarah Mweda</h4>
                <p className='text-gray-600'>Head Nurse</p>
              </div>
            </div>
            <p className='italic text-gray-700 text-lg'>
              "The electronic medical records feature has made accessing patient
              information so much easier. We can now provide better care with
              complete information at our fingertips."
            </p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                <span className='text-blue-600 font-bold text-xl'>JM</span>
              </div>
              <div>
                <h4 className='font-semibold text-xl'>James Kiprotich</h4>
                <p className='text-gray-600'>Hospital Administrator</p>
              </div>
            </div>
            <p className='italic text-gray-700 text-lg'>
              "From patient record management,
              HealthHub has streamlined our entire operation. I highly recommend
              it to any healthcare facility."
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
