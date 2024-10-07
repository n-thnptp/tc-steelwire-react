import React from 'react';
import FormInput from './FormInput';

const CompanyForm = () => {
  return (
    <div className="px-28 py-8 flex flex-wrap flex-col rounded-3xl bg-primary">
      <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 items-center justify-center text-accent-900">
        Step 2
      </h1>
      
      <form action="">
        <div className="w-80 flex flex-col gap-3">
          <FormInput
            size="md"
            title="Company Name"
            type="text"
            placeholder="Company Name"
            required
          />
          <FormInput
            size="md"
            title="Phone Number"
            type="text"
            placeholder="Phone Number"
            required
          />
          <FormInput
            size="lg"
            title="Address"
            type="text"
            isTextArea
            placeholder="Address"
            required
          />
          <FormInput
            size="md"
            title="City"
            type="text"
            placeholder="State"
            required
          />
          <FormInput
            size="md"
            title="Postcode"
            type="text"
            placeholder="Postcode"
            required
          />
        </div>

        <div className="pt-10 flex flex-row gap-5">
          <button type="reset" className="secondary-buttons inline-flex w-3/4 items-center justify-center">
            Back
          </button>

          <button type="submit" className="primary-buttons inline-flex w-3/4 items-center justify-center">
            Continue
          </button>
        </div>
      </form>

    </div>
  )
}

export default CompanyForm