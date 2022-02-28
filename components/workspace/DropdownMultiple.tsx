import React, { useEffect, useState } from 'react';
import { DropdownItem } from '~/assets/ts/types';

interface DropdownProps {
  id: string;
  options: DropdownItem[];
  className?: string;
  value: DropdownItem[];
  readOnly?: boolean;
  onSelect?: (item: any) => void;
  onClose: () => void;
}

const DropdownMultiple: React.FC<DropdownProps> = ({
  id,
  options,
  className = '',
  value,
  readOnly = false,
  onSelect,
  onClose,
}) => {
  const [selectedItems, setSelectedItems] = useState<DropdownItem[]>(
    () => value,
  );
  const [keyword, setKeyword] = useState('');

  const filteredOptions = options.filter((option) =>
    new RegExp(`${keyword}`, 'ig').test(option.searchable || ''),
  );

  function isSelected(item: DropdownItem) {
    let result: [boolean, number] = [false, 0];

    const index = selectedItems.findIndex((__item) => __item.id === item.id);
    result = [index > -1, index];

    return result;
  }

  function onSelectItem(item: DropdownItem) {
    if (readOnly) return;

    const [selected, index] = isSelected(item);

    const itemsCopy = [...selectedItems];

    if (selected) {
      itemsCopy.splice(index, 1);
      setSelectedItems(itemsCopy);
      return;
    }

    itemsCopy.push(item);
    setSelectedItems(itemsCopy);
  }

  useEffect(() => {
    onSelect?.(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    console.log('--->', value);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!document.querySelector(`#${id}`)?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [id]);

  return (
    <div
      id={id}
      className={`dropdown z-10 ${className}`}
      style={{ minWidth: '350px', maxWidth: '' }}
    >
      <div className="search border-b border-b-gray-100 relative">
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          className="block w-full border-0 outline-0 pl-[40px] pr-5 py-2 text-base"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="absolute top-[0.75rem] left-[1.125rem]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.66465 0.045166C3.89415 0.045166 0.045105 3.95109 0.045105 8.74669C0.045105 13.5423 3.89415 17.4482 8.66465 17.4482C13.4352 17.4482 17.2842 13.5423 17.2842 8.74669C17.2842 6.44234 16.3786 4.23023 14.7634 2.59758C13.1477 0.964561 10.9542 0.045166 8.66465 0.045166ZM2.0451 8.74669C2.0451 5.03543 5.01884 2.04517 8.66465 2.04517C10.4168 2.04517 12.0994 2.74859 13.3416 4.0042C14.5842 5.26018 15.2842 6.96591 15.2842 8.74669C15.2842 12.458 12.3105 15.4482 8.66465 15.4482C5.01884 15.4482 2.0451 12.458 2.0451 8.74669ZM17.0791 15.6767C16.6886 15.2862 16.0555 15.2862 15.6649 15.6767C15.2744 16.0672 15.2744 16.7004 15.6649 17.0909L18.2483 19.6743C18.6388 20.0648 19.272 20.0648 19.6625 19.6743C20.053 19.2838 20.053 18.6506 19.6625 18.2601L17.0791 15.6767Z"
              fill="#B8B8B8"
            />
          </svg>
        </div>
      </div>

      {filteredOptions.length ? (
        <ul>
          {filteredOptions.map((item) => (
            <li
              key={item.id}
              className="dropdown-item"
              onClick={() => onSelectItem(item)}
            >
              {item.value}

              {isSelected(item)[0] && !readOnly && (
                <i className="linearicons linearicons-check font-bold text-main" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-darkgray italic text-center py-2">
          Found nothing
        </div>
      )}
    </div>
  );
};

export default DropdownMultiple;
