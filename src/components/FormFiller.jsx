import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormPreview from './FormPreview';

const FormFiller = () => {
  const { formId } = useParams();
  const form = useSelector((state) =>
    state.formBuilder.forms.find((f) => f.id === formId)
  );

  if (!form) {
    return <div className="container mx-auto p-4">Form not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <FormPreview form={form} />
    </div>
  );
};

export default FormFiller;