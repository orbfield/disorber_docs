import React from 'react';
import { useNav } from './NavContext';

const SearchSite = () => {
  const { searchTerm, updateSearch } = useNav();

  const handleSearch = (e) => {
    updateSearch(e.target.value);
  };

  return (
    <div className="mb-0.6">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search Site ..."
        className="w-full px-3 py-1 text-sm bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
      />
    </div>
  );
};

export default SearchSite;
