import React from 'react';

interface SwitchProps {
  value: boolean;
  onSwitch: () => void;
}

const Switch: React.FC<SwitchProps> = ({ value: isOn, onSwitch }) => (
  <div className="switch">
    <input
      type="checkbox"
      checked={isOn}
      id="pause-join-reqs"
      className="hidden"
      onChange={() => onSwitch()}
    />

    <div
      className="flex items-center w-12 h-4 rounded-full cursor-pointer transform bg-gray-400"
      onClick={() => onSwitch()}
    >
      <div
        className={`w-7 h-7 rounded-full shadow-md ${
          isOn
            ? 'justify-self-end translate-x-[1.5rem] bg-green-500'
            : 'justify-self-start bg-white'
        }`}
      />
    </div>
  </div>
);

export default Switch;
