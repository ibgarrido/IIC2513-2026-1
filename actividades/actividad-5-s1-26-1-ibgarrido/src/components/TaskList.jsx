import React from "react";
import Checkbox from "./CheckBox";

const TaskList = props => {
	const { list, setList, autoSave } = props;

	const onChangeStatus = e => {
		const { name, checked } = e.target;

		const updateList = list.map(item => ({
			...item,
			done: item.id === name ? checked : item.done
		}));
		setList(updateList);
	};

	const onEditItem = (id, newDescription) => {
		const updateList = list.map(item => ({
			...item,
			description: item.id === id ? newDescription : item.description
		}));
		setList(updateList);
	};

	const onClickRemoveItem = e => {
		const updateList = list.filter(item => !item.done);
		setList(updateList);
	};

	const chk = list.map(item => (
		<Checkbox key={item.id} data={item} onChange={onChangeStatus} onEdit={onEditItem} />
	));
	return (
		<div className="todo-list">
			{list.length ? chk : <p className="no-tasks">No tasks</p>}
			{list.length ? (
				<p>
					<button className="button blue" onClick={onClickRemoveItem}>
						Delete all done
					</button>
				</p>
			) : null}
		</div>
	);
};

export default TaskList;