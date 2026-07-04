import React, { useState } from "react";

const FormTodo = props => {
	const { handleAddItem } = props;
	const [description, setDescription] = useState("");
	const handleSubmit = e => {
		e.preventDefault();
		// create item with consistent property order: id, description, done
		handleAddItem({
			id: (+new Date()).toString(),
			description,
			done: false
		});
		setDescription("");
	};
	return (
		<form onSubmit={handleSubmit}>
			<div className="todo-list">
				<div className="file-input">
					<input
						type="text"
						className="text"
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
					<button
						className="button pink"
						disabled={description ? "" : "disabled"}
					>
						Add
					</button>
				</div>
			</div>
		</form>
	);
};

export default FormTodo;