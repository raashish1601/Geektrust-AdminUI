import React, { useEffect, useState } from "react";
import "./MembersTable.css";

const MemberRow = ({
  row,
  onRowCheck,
  onRowDelete,
  onRowEdit,
  onClickEdit,
  token
}) => {
  const initialMembers = { ...row };
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState(initialMembers);

  useEffect(() => {
    setEditedValues(row);
  }, [row]);

  useEffect(() => {
    token === row.id ? setEditMode(true) : setEditMode(false);
  }, [token, row.id]);

  const handleCheck = () => onRowCheck(row.id);

  const handleDelete = () => onRowDelete(row.id);

  const handleEdit = (event) => {
    if (editMode) {
      const { name, value } = event.target;
      setEditedValues({
        ...editedValues,
        [name]: value
      });
    }
  };

  const handleCancel = () => {
    setEditedValues(initialMembers);
    setEditMode(false);
    onClickEdit(null);
  };

  const handleSave = () => {
    onRowEdit(editedValues);
    setEditMode(false);
    onClickEdit(null);
  };

  const handleEditMode = () => {
    onClickEdit(row.id);
  };

  return (
    <tr className={row.isChecked ? "selected" : ""}>
      <td>
        <input
          type="checkbox"
          onChange={handleCheck}
          checked={row.isChecked ? "checked" : ""}
        />
      </td>
      <td>
        <div className="inp-wrapper">
          <input
            className={`member-data${row.isChecked ? " selected" : ""}${
              editMode ? " editable" : " view"
            }`}
            name="name"
            value={editedValues.name}
            onChange={handleEdit}
          />
        </div>
      </td>
      <td>
        <div className="row-wrapper">
          <input
            className={`member-data${row.isChecked ? " selected" : ""}${
              editMode ? " editable" : " view"
            }`}
            name="email"
            value={editedValues.email}
            onChange={handleEdit}
          />
        </div>
      </td>
      <td>
        <div className="row-wrapper">
          <input
            className={`member-data${row.isChecked ? " selected" : ""}${
              editMode ? " editable" : " view"
            }`}
            name="role"
            value={editedValues.role}
            onChange={handleEdit}
          />
        </div>
      </td>
      <td>
        <div className="actions">
          {editMode ? (
            <>
              <span
                className="material-icons actions-icon"
                onClick={handleSave}
              >
                save
              </span>
              <span
                className="material-icons actions-icon"
                onClick={handleCancel}
              >
                close
              </span>
            </>
          ) : (
            <>
              <span
                className="material-icons actions-icon"
                onClick={handleEditMode}
              >
                edit
              </span>
              <span
                className="material-icons actions-icon"
                onClick={handleDelete}
              >
                delete
              </span>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default MemberRow;
