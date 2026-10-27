import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import axios from "axios";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Todo {
	id: string;
	text: string;
	completed: boolean;
	isEditing: boolean;
}

let defaultTodo: Todo = {
	id: "",
	text: "",
	completed: false,
	isEditing: false,
};

type Buttons = "addTask" | "editTask" | "deleteTask";
type Dialogs = "deleteTask";

const App = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTaskForm, setNewTaskForm] = useState(defaultTodo);
	const [selectedEditTask, setSelectedEditTask] = useState<Todo>(defaultTodo);
	const [editingTask, setEditingTask] = useState<Todo>(defaultTodo);
	const [selectedDeleteTask, setSelectedDeleteTask] =
		useState<Todo>(defaultTodo);
	const [dialogOpen, setDialogOpen] = useState<Record<Dialogs, boolean>>({
		deleteTask: false,
	});
	const [buttonDisabled, setButtonDisabled] = useState<
		Record<Buttons, boolean>
	>({ addTask: false, editTask: false, deleteTask: false });

	useEffect(() => {
		fetchTodos();
	}, []);

	const addTodo = () => {
		changeButtonDisabled("addTask", true);
		// Backend call to add tasks
		axios
			.post(`${BACKEND_URL}/`, { taskName: newTaskForm.text })
			.then((response) => {
				let { status = false, taskId } = response.data;
				if (status) {
					setTodos([
						...todos,
						{
							id: taskId,
							text: newTaskForm.text.trim(),
							completed: false,
							isEditing: false,
						},
					]);
					setNewTaskForm(defaultTodo);
				}
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				changeButtonDisabled("addTask", false);
			});
	};

	function fetchTodos() {
		axios.get(`${BACKEND_URL}/`).then((response) => {
			let { status = false, tasks = [] } = response.data;
			let formatted: Todo[] = tasks.map((task: any) => {
				let { taskId = "", taskName = "", isComplete = "incomplete" } = task;
				return {
					id: taskId,
					text: taskName,
					completed: isComplete == "completed" ? true : false,
					isEditing: false,
				};
			});
			setTodos(formatted);
		});
	}

	function deleteTask() {
		changeButtonDisabled("deleteTask", true);
		axios
			.delete(`${BACKEND_URL}/`, {
				params: { taskId: selectedDeleteTask.id },
			})
			.then((response) => {
				setTodos((prevState) =>
					prevState.filter((t) => t.id != selectedDeleteTask.id),
				);
				changeDialogOpen("deleteTask", false);
			})
			.catch((err) => {})
			.finally(() => {
				changeButtonDisabled("deleteTask", false);
			});
	}

	function editTask() {
		axios
			.put(`${BACKEND_URL}`, {
				taskName: editingTask.text,
				taskId: editingTask.id,
			})
			.then((response) => {
				let { status } = response.data;
				setTodos((prevState) =>
					prevState.map(
						(t): Todo =>
							t.id == editingTask.id
								? { ...t, isEditing: false, text: editingTask.text }
								: t,
					),
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const toggleComplete = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		);
	};

	const startEdit = (todo: Todo) => {
		setSelectedEditTask(todo);
		setEditingTask(todo);
	};

	const saveEdit = (id: string) => {
		if (editingTask.text.trim()) {
			setTodos(
				todos.map((todo) =>
					todo.id === id ? { ...todo, text: editingTask.text.trim() } : todo,
				),
			);
			setEditingTask(defaultTodo);
			setSelectedEditTask(defaultTodo);
		}
	};

	const cancelEdit = () => {
		setEditingTask(defaultTodo);
		setSelectedEditTask(defaultTodo);
	};

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter") action();
		if (e.key === "Escape" && selectedEditTask) cancelEdit();
	};

	function changeButtonDisabled(button: Buttons, state: boolean) {
		setButtonDisabled((prevState) => ({ ...prevState, [button]: state }));
	}

	function handleDeleteClick(task: Todo) {
		setSelectedDeleteTask(task);
		changeDialogOpen("deleteTask", true);
	}

	function changeDialogOpen(dialog: Dialogs, state: boolean) {
		setDialogOpen((prevState) => ({ ...prevState, [dialog]: state }));
	}

	function handleEditClick(task: Todo) {
		if (selectedEditTask.id != task.id) {
			setTodos((prevState) =>
				prevState.map(
					(t): Todo =>
						t.id == selectedEditTask.id ? { ...t, isEditing: false } : t,
				),
			);
		}
		setEditingTask(task);
		setSelectedEditTask(task);
		setTodos((prevState) =>
			prevState.map(
				(t): Todo => (t.id == task.id ? { ...t, isEditing: true } : t),
			),
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
				<h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
					Todo List
				</h1>

				<div className='flex gap-2 mb-6'>
					<input
						type='text'
						value={newTaskForm.text}
						onChange={(e) => {
							setNewTaskForm((prevState) => ({
								...prevState,
								text: e.target.value,
							}));
						}}
						onKeyDown={(e) => handleKeyDown(e, addTodo)}
						placeholder='Add a new task...'
						className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<button
						onClick={addTodo}
						className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2'
					>
						<Plus size={18} /> Add
					</button>
				</div>

				<ul className='space-y-2'>
					{todos.length === 0 && (
						<li className='text-center text-gray-500 py-8'>
							No tasks yet. Add one above!
						</li>
					)}
					{todos.map((todo) => (
						<li
							key={todo.id}
							className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
						>
							<input
								type='checkbox'
								checked={todo.completed}
								onChange={() => toggleComplete(todo.id)}
								className='w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500'
							/>
							{todo.isEditing ? (
								<>
									<input
										type='text'
										value={editingTask.text}
										onChange={(e) => {
											setEditingTask((prevState) => ({
												...prevState,
												text: e.target.value,
											}));
										}}
										onKeyDown={(e) => handleKeyDown(e, () => editTask())}
										autoFocus
										className='flex-1 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
									/>
									<button
										onClick={() => editTask()}
										className='p-2 text-green-500 hover:bg-green-100 rounded transition-colors'
										aria-label='Save'
									>
										<Check size={18} />
									</button>
									<button
										onClick={cancelEdit}
										className='p-2 text-red-500 hover:bg-red-100 rounded transition-colors'
										aria-label='Cancel'
									>
										<X size={18} />
									</button>
								</>
							) : (
								<>
									<span
										className={`flex-1 text-left ${
											todo.completed
												? "line-through text-gray-400"
												: "text-gray-800"
										}`}
									>
										{todo.text}
									</span>
									<button
										onClick={() => handleEditClick(todo)}
										className='p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors'
										aria-label='Edit'
									>
										<Edit size={18} />
									</button>
									<button
										onClick={() => handleDeleteClick(todo)}
										className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors'
										aria-label='Delete'
									>
										<Trash2 size={18} />
									</button>
								</>
							)}
						</li>
					))}
				</ul>

				{todos.length > 0 && (
					<div className='mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500'>
						{todos.filter((t) => !t.completed).length} of {todos.length} tasks
						remaining
					</div>
				)}
			</div>

			<AlertDialog
				open={dialogOpen.deleteTask}
				onOpenChange={(state) => {
					changeDialogOpen("deleteTask", state);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Task</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{selectedDeleteTask.text}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							disabled={buttonDisabled.deleteTask}
							onClick={() => changeDialogOpen("deleteTask", false)}
						>
							Cancel
						</Button>
						<Button
							disabled={buttonDisabled.deleteTask}
							onClick={(e) => {
								deleteTask();
							}}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default App;
