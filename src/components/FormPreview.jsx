import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addResponse } from "../store/formBuilderSlice";
import * as Yup from "yup";

const FormPreview = ({ form }) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  if (!form || !Array.isArray(form.fields)) {
    return <p className="text-red-500 text-center">Form data is missing or invalid.</p>;
  }

  const buildValidationSchema = () => {
    const schemaFields = {};
    form.fields.forEach((field) => {
      let fieldSchema;
      switch (field.type) {
        case "text":
          fieldSchema = Yup.string()
            .typeError("Must be a Alphabate")
            .min(2, "Must be at least 2 characters")
            .max(100, "Must be less than 100 characters");
          break;
        case "email":
          fieldSchema = Yup.string()
            .email("Invalid email format")
            .required("Email is required");
          break;
        case "number":
          fieldSchema = Yup.number()
            .typeError("Must be a number");
          break;
        case "password":
          fieldSchema = Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password must be less than 32 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .matches(/[@$!%*?&]/, "Must contain at least one special character");
          break;
        case "textarea":
          fieldSchema = Yup.string()
            .min(5, "Must be at least 5 characters")
            .max(500, "Must be less than 500 characters");
          break;
        case "select":
          fieldSchema = Yup.string().required("Please select an option");
          break;
        case "checkbox":
          fieldSchema = Yup.array()
            .min(1, "At least one option must be selected");
          break;
        case "radio":
          fieldSchema = Yup.string().required("Please select an option");
          break;
        case "date":
          fieldSchema = Yup.date()
            .typeError("Invalid date format")
            .required("Date is required");
          break;
        case "file":
          fieldSchema = Yup.mixed()
            .test("fileSize", "File size too large", (value) => !value || (value && value.size <= 5000000)) // 5MB limit
            .test("fileType", "Unsupported file type", (value) => 
              !value || (value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type))
            );
          break;
        default:
          fieldSchema = Yup.string();
      }
      if (field.required) {
        fieldSchema = fieldSchema.required("This field is required");
      }
      schemaFields[field.id] = fieldSchema;
    });
    return Yup.object().shape(schemaFields);
  };

  const handleChange = (e, fieldId, fieldType) => {
    const { name, value, type, checked } = e.target;
    if (fieldType === "checkbox") {
      setFormValues({
        ...formValues,
        [fieldId]: checked
          ? [...(formValues[fieldId] || []), value]
          : (formValues[fieldId] || []).filter((item) => item !== value),
      });
    } else {
      setFormValues({ ...formValues, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await buildValidationSchema().validate(formValues, { abortEarly: false });
      setErrors({});
      setIsSubmitted(true);
      dispatch(addResponse({ formId: form.id, response: formValues }));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitted(false);
    }
  };

  const renderField = (field) => {
    const baseClass = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        return <input type={field.type} id={field.id} name={field.id} value={formValues[field.id] || ""} onChange={(e) => handleChange(e, field.id)} placeholder={field.placeholder} className={baseClass} />;
      case "textarea":
        return <textarea id={field.id} name={field.id} value={formValues[field.id] || ""} onChange={(e) => handleChange(e, field.id)} placeholder={field.placeholder} rows="4" className={baseClass}></textarea>;
      case "select":
        return (
          <select id={field.id} name={field.id} value={formValues[field.id] || ""} onChange={(e) => handleChange(e, field.id)} className={baseClass}>
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="radio" name={field.id} value={option} checked={(formValues[field.id] || "") === option} onChange={(e) => handleChange(e, field.id)} className="h-4 w-4" />
                {option}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="checkbox" name={`${field.id}-${index}`} value={option} checked={(formValues[field.id] || []).includes(option)} onChange={(e) => handleChange(e, field.id, "checkbox")} className="h-4 w-4" />
                {option}
              </label>
            ))}
          </div>
        );
      case "file":
        return <input type="file" id={field.id} name={field.id} onChange={(e) => handleChange(e, field.id)} className={baseClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{form.name || "Preview Form"}</h2>

        {isSubmitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
            <p className="font-bold">🎉 Success!</p>
            <p>Your form has been submitted.</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" onClick={() => setIsSubmitted(false)}>
              Submit Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.length > 0 ? (
              form.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No fields added yet. Ask for designing the form!</p>
            )}

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Submit Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormPreview;
