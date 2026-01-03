import React, { useMemo, useState } from "react";
import { FaRegTrashAlt, FaRegEdit, FaRegCalendarAlt } from "react-icons/fa";
import { category, priorities } from "../../utils/type";
import { formatDateTime, getDueBadge } from "../../utils/date";
import { useDeleteTodos, useUpdatesTodos } from "../../hooks/Apis";
import { useAuth } from "../../context/AuthContext";
import DeleteModal from "../../ui/DeleteModal";
import Modal from "../../ui/Modal";
import { getPriorityClasses } from "../../utils/NewData";
import Tooltip from "../../ui/Tooltip";

const FormTodo = React.lazy(() => import('./FormTodo'))
const EditTodo = React.lazy(() => import('./EditTodo'))

const ListContainer = ({ data, isLoading }: any) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  const [selectedPriority, setSelectedPriority] = useState<any>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<any>(null);

  const handleEditClick = (todo: any) => {
    setTodoToEdit(todo);
    setShowEditModal(true);
  };
  const handleEditClose = () => {
    setShowEditModal(false);
    setTodoToEdit(null);
  };

  const confirmDelete = (id: string) => {
    setTodoToDelete(id);
    setShowDeleteModal(true);
  };

  const tabs = [{ label: "All" }, { label: "Active" }, { label: "Completed" }];
  const [activeTab, setActiveTab] = useState("All");
  const { user } = useAuth();

  const deleteTodoMutation = useDeleteTodos(user?._id as string);
  const handleDelete = () => {
    if (todoToDelete) deleteTodoMutation.mutate(todoToDelete);
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  const updatesTodosMutation = useUpdatesTodos();
  const handleToggleStatus = (task: any) => {
    updatesTodosMutation.mutate({
      id: task._id,
      payload: {
        status: task.status === "completed" ? "pending" : "completed",
        owner_id: user?._id,
      },
      action: "status",
    });
  };

  const filteredTodos = useMemo(() => {
    if (!data?.data) return [];
    let todos = [...data.data];

    // Tab filter
    if (activeTab === "Active")
      todos = todos.filter((t) => t.status === "pending");
    if (activeTab === "Completed")
      todos = todos.filter((t) => t.status === "completed");

    // Priority filter
    if (selectedPriority)
      todos = todos.filter((t) => t.priority === selectedPriority);

    // Category filter
    if (selectedCategory)
      todos = todos.filter((t) => t.category === selectedCategory);

    return todos;
  }, [data?.data, activeTab, selectedPriority, selectedCategory]);

  if (isLoading) return <p className="text-center py-10">Loading Todos...</p>;

  return (
    <div className="space-y-6">
      {/* Modals */}
      <Modal
        isOpen={showTodoModal}
        onClose={() => setShowTodoModal(false)}
        title="Add New Todo"
      >
        <React.Suspense fallback={<div>Loading...</div>}>
          <FormTodo onClose={() => setShowTodoModal(false)} />
        </React.Suspense>
      </Modal>

      <Modal isOpen={showEditModal} onClose={handleEditClose} title="Edit Todo">
        <React.Suspense fallback={<div>Loading...</div>}>
          {todoToEdit && (
            <EditTodo todo={todoToEdit} onClose={handleEditClose} isEdit />
          )}
        </React.Suspense>
      </Modal>

      {/* Tabs + Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 rounded-t text-sm font-medium ${activeTab === tab.label
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          className="bg-green-600 text-white hover:bg-green-700  text-sm rounded-md px-4 py-2 hover:bg-primary-hover transition cursor-pointer"
          onClick={() => setShowTodoModal(true)}
        >
          Create Todo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="w-full sm:w-auto p-2 rounded border border-gray-300 dark:bg-gray-700 text-sm"
        >
          <option value="">Select Priority</option>
          {priorities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto p-2 rounded border border-gray-300 dark:bg-gray-700 text-sm"
        >
          <option value="">Select Category</option>
          {category.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedPriority("");
            setSelectedCategory("");
          }}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No todos found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((task: any) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
            >
              {/* Left: Checkbox + Info */}
              <div className="flex gap-3 flex-1">
                <input
                  type="checkbox"
                  aria-label={`Mark task "${task.title}" as completed`}
                  checked={task.status === "completed"}
                  onChange={() => handleToggleStatus(task)}
                  className="w-5 h-5 rounded-full border-gray-300 dark:border-gray-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1 min-h-6">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityClasses(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-1 rounded bg-purple-500 text-white text-xs dark:bg-purple-700">
                      {task.category}
                    </span>
                    {task.due_at &&
                      task.status !== "completed" &&
                      (() => {
                        const { text, bgClass } = getDueBadge(task.due_at);
                        return (
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${bgClass}`}
                          >
                            <FaRegCalendarAlt className="text-xs" /> {text}
                          </span>
                        );
                      })()}
                  </div>
                  <p
                    className={`font-semibold text-lg ${task.status === "completed"
                      ? "line-through text-gray-400"
                      : "text-gray-900 dark:text-gray-100"
                      }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created: {formatDateTime(task.createdAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 sm:mt-0 max-sm:justify-between max-sm:w-full">
                {task.status !== "completed" && (
                  <Tooltip content="Edit Todo">
                    <FaRegEdit
                      className="cursor-pointer text-gray-500 hover:text-primary-hover dark:hover:text-primary-hover transition"
                      onClick={() => handleEditClick(task)}
                    />
                  </Tooltip>
                )}
                <Tooltip content="Delete Todo">
                  <FaRegTrashAlt
                    className="cursor-pointer text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition"
                    onClick={() => confirmDelete(task._id)}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
      />
    </div>
  );
};

export default ListContainer;
