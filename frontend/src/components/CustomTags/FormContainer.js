import React, { useState } from 'react';
import InputComponent from './InputComponent';
import TextareaComponent from './TextareaComponent';
import SelectComponent from './SelectComponent';


const handleInputChange = (setterFunction, clearValidationError) => (e) => {
  const field = e.target.name;
  setterFunction(e.target.value);
  clearValidationError(field);
};

export const validateCommonFields = (fields, validations) => {
  const errors = {};

  validations.forEach(validation => {
    const fieldValue = fields[validation.fieldName];
    if (validation.rule(fieldValue)) {
      errors[validation.fieldName] = validation.message;
    }
  });

  return errors;
};

export default function FormContainer({ fields, validations = [] }) {
  const [validationErrors, setValidationErrors] = useState({});

  const clearValidationError = (fieldName) => {
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return (
    <div className="form-container">
      {fields.map((field, index) => {
        const Component = field.type === 'text' ? InputComponent : TextareaComponent;
        return (
          <Component
            key={index}
            {...field}
            error={validationErrors[field.name]}
            onChange={handleInputChange(field.setter, clearValidationError)}
            width={field.width}
          />
        );
      })}
    </div>
  );
}
// // FormContainer.js
// import InputComponent from './InputComponent';
// import TextareaComponent from './TextareaComponent';

// function FormContainer({ fields }) {
//   return (
//     <div className="form-container">
//       {fields.map((field, index) => {
//         const Component = field.type === 'text' ? InputComponent : TextareaComponent;
//         return <Component key={index} {...field} width={field.width} />;
//       })}
//     </div>
//   );
// }

// export default FormContainer;


// import InputComponent from './InputComponent';
// import TextareaComponent from './TextareaComponent';

// function FormContainer({ fields }) {
//   return (
//     <div className="form-container">
//       {fields.map((field, index) => {
//         if (field.type === 'text') {
//           return <InputComponent key={index} {...field} />;
//         }
//         if (field.type === 'textarea') {
//           return <TextareaComponent key={index} {...field} />;
//         }
//         return null;
//       })}
//     </div>
//   );
// }

// export default FormContainer;
