"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/app/redux/slices/filterSlice";
import { setCurrentPage } from "@/app/redux/slices/accountSlice";
import { RootState } from "@/app/redux/store/store";

const Searcher = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filterState);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setCurrentPage(1));
  };

  return (
    <input
      type="text"
      value={filters.searchTerm}
      onChange={handleSearch}
      placeholder="Search accounts..."
      className="p-2 border border-gray-300 rounded-md w-full"
    />
  );
};

export default Searcher;
