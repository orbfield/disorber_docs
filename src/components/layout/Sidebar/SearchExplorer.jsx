import React from 'react';

const SearchExplorer = () => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search Explorer (Ctrl+;)"
        className="w-full px-3 py-1.5 text-sm bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
      />
    </div>
  );
};

export default SearchExplorer;