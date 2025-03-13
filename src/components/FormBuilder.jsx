import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import {
  addField,
  removeField,
  updateField,
  reorderFields,
  saveForm,
  updateFormName,
} from "../store/formBuilderSlice";
import FieldList from "./FieldList";
import FieldType from "./FieldType";
import FormPreview from "./FormPreview";
import { FaSave, FaArrowLeft, FaShareAlt } from "react-icons/fa";

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [shareableLink, setShareableLink] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state) => state.formBuilder);

  const handleAddField = (type) => {
    const fieldConfig = {
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: "",
      required: false,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : [],
    };
    dispatch(addField(fieldConfig));
  };

  const handleRemoveField = (id) => {
    dispatch(removeField(id));
  };

  const handleUpdateField = (updatedField) => {
    dispatch(updateField(updatedField));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(
      reorderFields({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  const handleSaveForm = () => {
    dispatch(saveForm());
    const link = `${window.location.origin}/form/${currentForm.id}`;
    setShareableLink(link);
    alert(`🎉 Form saved successfully!\nShareable link: ${link}`);
  };

  const handleFormNameChange = (e) => {
    dispatch(updateFormName(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Floating Save Button */}
        <button
          className="fixed bottom-8 right-8 bg-indigo-600 text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
          onClick={handleSaveForm}
        >
          <FaSave /> Save Form
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2"> 
           <input
              type="text"
              value={currentForm.name}
              onChange={handleFormNameChange}
              className="w-full text-2xl font-semibold border-b-2 focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="Enter Form Name"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-300 mb-6">
          <nav className="flex space-x-4">
            {["builder", "preview"].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "builder" ? "Form Builder" : "Preview Form"}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "builder" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Field Type Selection */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <FieldType onAddField={handleAddField} />
            </div>

            {/* Form Builder Section */}
            <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Your Form</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-gray-50 p-4 rounded-lg min-h-[400px] border border-gray-300"
                    >
                      <FieldList
                        fields={currentForm.fields}
                        onRemoveField={handleRemoveField}
                        onUpdateField={handleUpdateField}
                      />
                      {provided.placeholder}
                      {currentForm.fields.length === 0 && (
                        <div className="text-center py-10 text-gray-400 italic">
                          Select fields here to build your form
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        ) : (
          /* Preview Tab */
            <div className="flex justify-center items-center min-h-[70vh]">
              <div className="w-full max-w-2xl">
                <FormPreview form={currentForm} />
              </div>
            </div>

        )}

        {/* Shareable Link */}
        {shareableLink && (
          <div className="mt-4 p-4 bg-blue-100 rounded-md text-center shadow-md">
            <p className="text-blue-600 font-medium flex items-center justify-center gap-2">
              <FaShareAlt /> Shareable Link:{" "}
              <a
                href={shareableLink}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shareableLink}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
