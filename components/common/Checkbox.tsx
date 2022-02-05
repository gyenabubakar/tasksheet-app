import React from 'react';

interface Props {
  isChecked: boolean;
  toggle: () => void;
}

const Checkbox: React.FC<Props> = ({ isChecked, toggle }) => (
  <div
    className="w-[25px] h-[25px] inline-block border-2 border-lightgray rounded-md flex items-center justify-center"
    onClick={toggle}
  >
    {isChecked && (
      <svg
        width="15"
        height="13"
        viewBox="0 0 13 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33337 5.00002L4.66671 8.33336L11.3334 1.66669"
          stroke="#121212"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

export default Checkbox;
