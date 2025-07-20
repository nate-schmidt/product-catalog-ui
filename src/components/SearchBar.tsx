import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ searchQuery, onSearchChange, loading = false }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        ) : (
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        )}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => {
          console.log('SearchBar onChange:', (e.target as HTMLInputElement).value);
          onSearchChange((e.target as HTMLInputElement).value);
        }}
        onInput={(e) => {
          console.log('SearchBar onInput:', (e.target as HTMLInputElement).value);
          onSearchChange((e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
} 