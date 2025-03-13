import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaEdit, FaTrash } from "react-icons/fa";
import FieldEditor from "./FieldEditor";

const FieldList = ({ fields, setFields, onRemoveField, onUpdateField }) => {
  const [editingField, setEditingField] = useState(null);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleCloseEditor = () => {
    setEditingField(null);
  };

  const handleFieldUpdate = (updatedField) => {
    onUpdateField(updatedField);
    setEditingField(null);
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Draggable key={field.id} draggableId={field.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all ${
                snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-300" : "hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-center">
                {/* Drag Handle (Fixed) */}
                <div
                  {...provided.dragHandleProps}
                  className="mr-3 cursor-grab text-gray-500 text-xl hover:text-gray-700 flex items-center"
                >
                  <FaGripVertical />
                </div>

                {/* Field Info */}
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-800">{field.label}</h4>
                  <p className="text-sm text-gray-500">Type: {field.type}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                    onClick={() => handleEditField(field)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition"
                    onClick={() => onRemoveField(field.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}

      {/* Modal for Editing Field */}
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit Field</h3>
            <FieldEditor
              field={editingField}
              onUpdate={handleFieldUpdate}
              onCancel={handleCloseEditor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldList;
