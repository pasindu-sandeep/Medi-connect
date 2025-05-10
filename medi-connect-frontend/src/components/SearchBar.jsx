import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState(""); // <-- define query state

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Send value to parent
  };

  return (
    <form className="w-full max-w-3xl mx-auto px-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for medicines..."
            className="w-full px-4 py-2 rounded-lg border text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
