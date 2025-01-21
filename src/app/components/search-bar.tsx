'use client'

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStorageRequest: () => void;
}

const SearchBar = ({ searchQuery, onSearchChange, onStorageRequest }: SearchBarProps) => {
  const handleClear = () => {
    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onSearchChange(event);
  };

  return (
    <div className="mb-8 relative max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />

          <input
            type="text"
            role="searchbox"
            aria-label="Search images by code or number"
            placeholder="Tìm kiếm theo mã hoặc số..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <Button
          onClick={onStorageRequest}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          aria-label="Yêu cầu lưu trữ ảnh"
        >
          <InboxIcon className="h-5 w-5" />
          <span>Yêu cầu lưu trữ ảnh</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default SearchBar;
