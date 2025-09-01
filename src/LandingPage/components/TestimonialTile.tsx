
const TestimonialTile = () => {
  return (
    <div className="flex justify-center items-center py-16 bg-primary px-20 text-left my-32">
      <div className="bg-[#D9D9D9] w-[1120px] h-[240px] relative flex items-start">
        <div className="bg-[#2049E2] text-primary p-8 w-[600px] h-[216px] -mt-8 z-10 flex gap-8">
          <div><svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.42503 3.44136C10.0561 3.23654 10.7837 3.2402 11.3792 3.54623C12.7532 4.25224 13.3477 6.07191 12.7946 8C12.5465 8.8649 12.1102 9.70472 11.1861 10.5524C10.262 11.4 8.98034 11.9 8.38571 11.9C8.17269 11.9 8 11.7321 8 11.525C8 11.3179 8.17644 11.15 8.38571 11.15C9.06497 11.15 9.67189 10.7804 10.3906 10.236C10.9406 9.8193 11.3701 9.28633 11.608 8.82191C12.0628 7.93367 12.0782 6.68174 11.3433 6.34901C10.9904 6.73455 10.5295 6.95946 9.97725 6.95946C8.7773 6.95946 8.0701 5.99412 8.10051 5.12009C8.12957 4.28474 8.66032 3.68954 9.42503 3.44136ZM3.42503 3.44136C4.05614 3.23654 4.78366 3.2402 5.37923 3.54623C6.7532 4.25224 7.34766 6.07191 6.79462 8C6.54654 8.8649 6.11019 9.70472 5.1861 10.5524C4.26201 11.4 2.98034 11.9 2.38571 11.9C2.17269 11.9 2 11.7321 2 11.525C2 11.3179 2.17644 11.15 2.38571 11.15C3.06497 11.15 3.67189 10.7804 4.39058 10.236C4.94065 9.8193 5.37014 9.28633 5.60797 8.82191C6.06282 7.93367 6.07821 6.68174 5.3433 6.34901C4.99037 6.73455 4.52948 6.95946 3.97725 6.95946C2.7773 6.95946 2.0701 5.99412 2.10051 5.12009C2.12957 4.28474 2.66032 3.68954 3.42503 3.44136Z"
            fill="currentColor"
          />
        </svg>
        </div>
          <div className='flex flex-col justify-between'>
            <p className="text-[16px] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum quis risus tristique tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
            </p>
            <p className="text-[16px] text-blue-200 mt-4">Lorem ipsum dolor sit amet</p>
            <img className="self-end w-[100px]" src="./assets/kpmg-alt.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialTile