import React, { Fragment, useState, useRef, useEffect } from "react";

const Checkbox = props => {
	const {
		onChange,
		onEdit,
		data: { id, description, done }
	} = props;

	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(description);
	const inputRef = useRef(null);

	useEffect(() => {
		setValue(description);
	}, [description]);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	const finishEdit = () => {
		const newVal = value.trim();
		setEditing(false);
		if (newVal !== description && newVal.length > 0) {
			onEdit && onEdit(id, newVal);
		} else {
			setValue(description); // revert empty or unchanged
		}
	};

	const onKeyDown = e => {
		if (e.key === "Enter") {
			finishEdit();
		} else if (e.key === "Escape") {
			setValue(description);
			setEditing(false);
		}
	};

	return (
		<Fragment>
			<svg
				viewBox="0 0 0 0"
				style={{ position: "absolute", zIndex: -1, opacity: 0 }}
			>
				<defs>
					<path id="todo__line" d="M21 12.3h168v0.1z" />
					<path
						id="todo__box"
						d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4"
					/>
					<path id="todo__check" d="M10 13l2 2 5-5" />
					<circle id="todo__circle" cx="13.5" cy="12.5" r="10" />
				</defs>
			</svg>

			<label className="todo new-item">
				<input
					className="todo__state"
					name={id}
					type="checkbox"
					checked={!!done}
					onChange={onChange}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 200 25"
					className="todo__icon"
				>
					<use xlinkHref="#todo__line" className="todo__line" />
					<use xlinkHref="#todo__box" className="todo__box" />
					<use xlinkHref="#todo__check" className="todo__check" />
					<use xlinkHref="#todo__circle" className="todo__circle" />
				</svg>

				{editing ? (
					<input
						ref={inputRef}
						className="todo__text editable"
						value={value}
						onChange={e => setValue(e.target.value)}
						onBlur={finishEdit}
						onKeyDown={onKeyDown}
					/>
				) : (
					<div
						className="todo__text"
						onDoubleClick={() => setEditing(true)}
						title="Doble clic para editar"
					>
						{description}
					</div>
				)}
			</label>
		</Fragment>
	);
};

export default Checkbox;