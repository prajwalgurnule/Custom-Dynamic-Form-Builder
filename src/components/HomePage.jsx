import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewForm, loadForm, deleteForm } from "../store/formBuilderSlice";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaClipboardList } from "react-icons/fa";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state) => state.formBuilder);

  const handleCreateNewForm = () => {
    dispatch(createNewForm("New Form"));
    navigate("/builder");
  };

  const handleLoadForm = (formId) => {
    dispatch(loadForm(formId));
    navigate("/builder");
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(deleteForm(formId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold flex items-center">
            📋 Custom Dynamic Form Builder
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNewForm}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg font-semibold hover:bg-blue-100 transition-all duration-300"
          >
            <FaPlus /> New Form
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.length > 0 ? (
            forms.map((form) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-yellow-300 py-3 px-4 flex items-center gap-2">
                  <FaClipboardList className="text-blue-800 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {form.name}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Date Published: <strong>{new Date().toLocaleDateString()}</strong>
                  </p>
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleLoadForm(form.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200"
                    >
                      <FaEdit /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleDeleteForm(form.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200"
                    >
                      <FaTrash /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full w-full"
            >
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center text-gray-700 text-lg bg-white/90 py-4 px-6 rounded-xl shadow-lg w-[90%] max-w-md"
              >
                 No forms created yet. Start by creating your First form!
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
