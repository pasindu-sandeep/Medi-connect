import React, { useState } from "react";
import { Search } from "lucide-react"; // optional icon

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send to parent
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent form reload
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for medicines..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </form>
  );
};

export default SearchBar;
