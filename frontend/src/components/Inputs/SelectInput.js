// SelectInput.js
// import React from 'react';

// export default function SelectInput({ value, options = [], placeholder, onChange, ...props }) {
//     return (
//       <select value={value} onChange={onChange} {...props}>
//           <option value="">{placeholder}</option>
//           {options.map((option) => (
//               <option key={option.id} value={option.id}>{option.name}</option>
//           ))}
//       </select>
//     );
// }
import React from 'react';

export default function SelectInput({ value, options = [], placeholder, onChange, labelKey = "name", ...props }) {
    return (
      <select value={value} onChange={onChange} {...props}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
              <option key={option.geonameId} value={option.geonameId}>
                {option[labelKey]}
              </option>
          ))}
      </select>
    );
}

