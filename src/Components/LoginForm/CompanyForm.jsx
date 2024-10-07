import React from 'react';
import FormInput from './FormInput';


const CompanyForm = () => {
  return (
    <div className="p-10 flex flex-wrap flex-col rounded-3xl bg-primary w-full">
      <div className="mx-16">
        <form action="">

          <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 items-center justify-center text-accent-900">
            Step 2
          </h1>

          {/* input fields */}
          <div className="grid gap-2">
            <FormInput
              title="Company Name"
              type="text"
              placeholder="Company Name"
              required
            />
            <FormInput
              title="Phone Number"
              type="text"
              placeholder="Phone Number"
              required
            />
            <FormInput
              title="Address"
              type="text"
              placeholder="Address"
              required
            />
            <FormInput
              title="City"
              type="text"
              placeholder="City"
              required
            />
            <FormInput
              title="State"
              type="text"
              placeholder="State"
              required
            />
            <FormInput
              title="Postcode"
              type="text"
              placeholder="Postcode"
              required
            />
          </div>
        </form>
      </div>

      {/* continue button */}
      <button type="submit" className="mt-6 primary-buttons inline-flex items-center justify-center w-1/2 mx-auto">
        Continue
      </button>
    </div>
  )
}

export default CompanyForm