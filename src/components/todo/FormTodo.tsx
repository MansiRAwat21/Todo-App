import { category, priorities } from "../../utils/type";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCreateTodos } from "../../hooks/Apis";

const FormTodo = ({onClose}:any) => {
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();
    const createTodosMutation = useCreateTodos();
    const onSubmit = (data: any) => {
        const payload = {
            title: data?.task,
            priority: data?.priority,
            category: data?.category,
            due_at: data?.dueDate,
            description: data?.description,
            status: 'pending',
            owner_id: user?._id,
        };

        createTodosMutation.mutate(payload);
        reset();
        if (onClose) onClose();
    };

    return (
            <form onSubmit={handleSubmit(onSubmit)}>               
                {/* Task Input */}
                <div>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="pr-2 py-1 w-full outline-none border border-gray-300 rounded-lg px-4 mt-4"
                        {...register("task", {
                            required: "Task is required",
                        })}
                    />
                    {errors.task && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.task.message as ReactNode}
                        </p>
                    )}
                </div>
                <textarea className="pr-2 py-1 w-full outline-none border border-gray-300 rounded-lg px-4 mt-4"
                    placeholder="Description"
                    {...register("description")}
                >
                </textarea>


                {/* Priority, Category, Date */}
                <div className="grid gap-2">
                    {/* Priority */}
                    <div>
                        <select
                            className="pr-2 py-1 w-full outline-none border border-gray-300 rounded-lg px-4 mt-4 dark:bg-gray-700"
                            {...register("priority", {
                                required: "Priority is required",
                            })}
                        >
                            <option value="">Select Priority</option>
                            {priorities?.map((item) => (
                                <option key={item.label} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        {errors.priority && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.priority.message as ReactNode}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <select
                            className="pr-2 py-1 w-full outline-none border border-gray-300 rounded-lg px-4 mt-4 dark:bg-gray-700"
                            {...register("category", {
                                required: "Category is required",
                            })}
                        >
                            <option value="">Select Category</option>
                            {category?.map((item) => (
                                <option key={item.label} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category.message as ReactNode}
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="pr-2 py-1 w-full outline-none border border-gray-300 rounded-lg px-4 mt-4"
                            {...register("dueDate", {
                                required: "Date is required",
                            })}
                        />
                        {errors.dueDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.dueDate.message as ReactNode}
                            </p>
                        )}
                    </div>
                   
                </div>

                {/* Submit */}
                <button
                    className="btn-primary w-full mt-4 cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Task"}
                </button>
            </form>
    );
};

export default FormTodo;
