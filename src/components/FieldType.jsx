import React from "react";
import {
  FaFont,
  FaHashtag,
  FaEnvelope,
  FaLock,
  FaAlignLeft,
  FaCaretDown,
  FaCheckSquare,
  FaDotCircle,
  FaCalendarAlt,
  FaPaperclip,
} from "react-icons/fa";

const FieldType = ({ onAddField }) => {
  const fieldTypes = [
    { type: "text", label: "Text Field", icon: <FaFont /> },
    { type: "number", label: "Number Field", icon: <FaHashtag /> },
    { type: "email", label: "Email Field", icon: <FaEnvelope /> },
    { type: "password", label: "Password Field", icon: <FaLock /> },
    { type: "textarea", label: "Text Area", icon: <FaAlignLeft /> },
    { type: "select", label: "Dropdown", icon: <FaCaretDown /> },
    { type: "checkbox", label: "Checkbox Group", icon: <FaCheckSquare /> },
    { type: "radio", label: "Radio Group", icon: <FaDotCircle /> },
    { type: "date", label: "Date Picker", icon: <FaCalendarAlt /> },
    { type: "file", label: "File Upload", icon: <FaPaperclip /> },
  ];

  return (
    <div className="space-y-3 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Field</h3>
      {fieldTypes.map((field) => (
        <button
          key={field.type}
          className="w-full flex items-center gap-3 p-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => onAddField(field.type)}
        >
          <span className="text-blue-600 text-sm">{field.icon}</span>
          <span className="text-md font-medium">{field.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FieldType;
