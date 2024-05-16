/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Select from 'react-select';
import { filterOptions } from './data';

const customStyles = {
  control: (base: any) => ({
    ...base,
    boxShadow: 'none',
    '&:hover': {
      border: 'none',
    },
    border: 'none',
  }),
};
export default function Index(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return (
    <div className='max-w-xl'>
      <Select
        className='p-2 text-sm md:text-md text-textGray shadow-md rounded bg-white'
        placeholder="Filter by region..."
        options={filterOptions}
        isLoading={isLoading}
        onChange={() => setIsLoading((state) => !state)}
        styles={customStyles}
      />
    </div>
  )
}
