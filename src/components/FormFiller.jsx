// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import FormPreview from './FormPreview';

// const FormFiller = () => {
//   const { formId } = useParams();
//   const form = useSelector((state) =>
//     state.formBuilder.forms.find((f) => f.id === formId)
//   );

//   if (!form) {
//     return <div className="container mx-auto p-4">Form not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <FormPreview form={form} />
//     </div>
//   );
// };

// export default FormFiller;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormPreview from './FormPreview';

const FormFiller = () => {
  const { formId } = useParams();
  const [loading, setLoading] = useState(true);
  const form = useSelector((state) =>
    state.formBuilder.forms.find((f) => f.id === formId)
  );

  useEffect(() => {
    if (form) {
      setLoading(false);
    } else {
      // Simulate fetching delay (if form data is being loaded)
      setTimeout(() => setLoading(false), 1000);
    }
  }, [form]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading form...</div>;
  }

  if (!form) {
    return <div className="container mx-auto p-4 text-center text-red-500">❌ Form not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Fill out the form</h1>
      <FormPreview form={form} />
    </div>
  );
};

export default FormFiller;
