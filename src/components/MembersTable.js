import React, { useEffect, useState } from "react";
import MemberRow from "./MemberRow";
import "./MembersTable.css";
import MemberPagination from "./MemberPagination";

const MembersTable = ({
  members,
  onCheck,
  onDelete,
  onDeleteSelected,
  onEditSelected
}) => {
  const maxMember = 10;
  const maxPageNumber = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [allCheckOnPage, setAllCheckOnPage] = useState(false);
  const [anyCheck, setAnyCheck] = useState(false);
  const [token, setEditLock] = useState(null);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(members?.length / maxMember)
  );
  const [data, setData] = useState(
    members.slice(
      (currentPage - 1) * maxMember,
      (currentPage - 1) * maxMember + maxMember
    )
  );

  const currentData = () => {
    const start = (currentPage - 1) * maxMember;
    const end = start + maxMember;
    setData(members.slice(start, end));
  };

  useEffect(() => {
    currentData();
  }, [members, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
  }, [members?.length, totalPages]);

  useEffect(() => {
    setTotalPages(Math.ceil(members?.length / maxMember));
    setAnyCheck(members.reduce((i, member) => i || member.isChecked, false));
  }, [members]);

  useEffect(() => {
    setAllCheckOnPage(data.reduce((i, member) => i && member.isChecked, true));
  }, [currentPage, members, data]);

  const handleAllRowsCheck = (event) => {
    if (event.target.checked)
      data?.map((row) => !row.isChecked && onCheck(row.id));
    else data?.map((row) => row.isChecked && onCheck(row.id));
  };

  const handleRowCheck = (id) => onCheck(id);

  const handleRowDelete = (id) => onDelete(id);

  const handleDelete = () => onDeleteSelected();

  const handleRowEdit = (row) => onEditSelected(row);

  const handleEditLock = (id) => setEditLock(id);

  return (
    <>
      {members?.length > 0 ? (
        <div className="main-container">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleAllRowsCheck}
                      checked={
                        anyCheck ? (allCheckOnPage ? "checked" : "") : ""
                      }
                    />
                  </th>
                  <th>
                    <div className="member-data">Name</div>
                  </th>
                  <th>
                    <div className="member-data">Email</div>
                  </th>
                  <th>
                    <div className="member-data">Role</div>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((member) => (
                  <MemberRow
                    key={member.id}
                    row={member}
                    onRowCheck={handleRowCheck}
                    onRowDelete={handleRowDelete}
                    onRowEdit={handleRowEdit}
                    onClickEdit={handleEditLock}
                    token={token}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <button
              className={`del-btn${!anyCheck ? " disabled" : ""}`}
              disabled={!anyCheck ? "disabled" : ""}
              onClick={handleDelete}
            >
              Delete seleted
            </button>
            {totalPages > 1 && (
              <MemberPagination
                currentPage={currentPage}
                limit={maxPageNumber}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="fallback">No data found</div>
      )}
    </>
  );
};

export default MembersTable;
