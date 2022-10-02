import React, { useEffect, useState } from "react";
import axios from "axios";

import "./styles.css";
import MembersTable from "./components/MembersTable";

function App() {
  const [members, setMembers] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState(null);
  const [searchValue, setsearchValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    return await axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        setLoading(false);
        setIsError(false);
        setMembers(res.data.map((row) => ({ ...row, isChecked: false })));
      })
      .catch((err) => {
        setLoading(false);
        setIsError(true);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchValue?.length > 0) {
      setFilteredMembers(
        members?.filter((member) => {
          if (
            member.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return member;
          }
        })
      );
    } else {
      setFilteredMembers(members);
    }
  }, [searchValue, members]);

  const handleCheck = (id) => {
    let temporaryMembers = [...members];
    temporaryMembers.forEach((member) => {
      if (member.id === id) {
        member.isChecked = !member.isChecked;
      }
    });
    setMembers(temporaryMembers);
  };

  const handleDelete = (id) => {
    let temporaryMembers = [...members];
    temporaryMembers = temporaryMembers.filter((member) => member.id !== id);
    setMembers(temporaryMembers);
  };

  const handleDeleteSelected = () => {
    let temporaryMembers = [...members];
    temporaryMembers = temporaryMembers.filter((member) => !member.isChecked);
    setMembers(temporaryMembers);
  };

  const handleEdit = (row) => {
    let temporaryMembers = [...members];
    temporaryMembers = temporaryMembers.map((member) => {
      if (member.id === row.id) {
        return Object.assign(member, row);
      }
      return member;
    });
    setMembers(temporaryMembers);
  };

  return (
    <div className="container">
      <div className="search-bar-container">
        <input
          className="search-bar-box"
          name="search-bar"
          value={searchValue}
          onChange={(e) => setsearchValue(e.target.value)}
          placeholder="Search by name, email or role"
        />
      </div>
      {isLoading ? (
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      ) : isError ? (
        <div className="fallback">Unable to fetch data at the moment</div>
      ) : (
        filteredMembers && (
          <MembersTable
            members={filteredMembers}
            onCheck={handleCheck}
            onDelete={handleDelete}
            onDeleteSelected={handleDeleteSelected}
            onEditSelected={handleEdit}
          />
        )
      )}
    </div>
  );
}

export default App;
