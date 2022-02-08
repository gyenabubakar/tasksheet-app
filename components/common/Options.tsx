import React, {
  ComponentProps,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';

type Option = {
  element: JSX.Element;
  onClick: (arg: any) => void;
};

interface OptionProps extends ComponentProps<'div'> {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  originID: string;
  optionObject: { [key: string]: any };
  options: Option[];
}

const Options: React.FC<OptionProps> = ({
  options,
  setShow,
  show,
  originID,
  optionObject,
  className = '',
  ...props
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = document.querySelector(`#${originID}`);
      if (target.id !== originID && !btn?.contains(target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [show]);

  return (
    <div className={`options ${className}`} {...props}>
      <ul>
        {options.map((option, index) => (
          <li
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              option.onClick(optionObject);
            }}
          >
            {option.element}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Options;
