import { DependencyList, useEffect, useState } from 'react';

export interface FormValidationErrors {
  [prop: string]: string | null;
}

function useFormValidation<E extends FormValidationErrors>(
  properties: E,
  dependencies: DependencyList,
  messages: string[],
) {
  const [errors, setErrors] = useState(properties);

  useEffect(() => {
    const fields = Object.keys(properties);
    fields.forEach((field, fieldIndex) => {
      if (dependencies[fieldIndex] === false) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: messages[fieldIndex],
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: null,
        }));
      }
    });
  }, dependencies);

  return { errors, setErrors };
}

export default useFormValidation;
