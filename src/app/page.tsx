"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getImages } from "./actions/image";
import { Image as ImageType } from "@prisma/client";
import Fuse from "fuse.js";
import debounce from "lodash/debounce";
import { useToast } from "@/hooks/use-toast";

import SearchBar from "./components/search-bar";
import HeaderCard from "./components/header-card";
import ImageGrid from "./components/image-grid";
import { StorageRequestModal } from "./components/storage-request-modal";

// Constants
const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

// Fuse options
const fuseOptions = {
  keys: ["code", "number"],
  threshold: 0.0,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: true,
  findAllMatches: false,
  minMatchCharLength: 1
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// Debounced search handler
const debouncedSearch = debounce(
  (callback: (query: string) => void, query: string) => {
    callback(query);
  },
  SEARCH_DEBOUNCE_MS
);

export default function Home() {
  const { toast } = useToast();
  const [allImages, setAllImages] = useState<ImageType[]>([]);
  const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [fuse, setFuse] = useState<Fuse<ImageType> | null>(null);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  // Initialize Fuse instance
  useEffect(() => {
    if (allImages.length > 0) {
      setFuse(new Fuse(allImages, fuseOptions));
    }
  }, [allImages]);

  // Fetch initial images
  useEffect(() => {
    let mounted = true;

    const fetchImages = async () => {
      try {
        const fetchedImages = await getImages();
        if (mounted) {
          setAllImages(fetchedImages);
          setDisplayedImages(fetchedImages.slice(0, ITEMS_PER_PAGE));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImages();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle search
  const handleDebouncedSearch = useCallback((query: string) => {
    setDebouncedSearchQuery(query);
    setPage(1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(handleDebouncedSearch, query);
  };

  // Get filtered results
  const filteredImages = useMemo(() => {
    if (!debouncedSearchQuery || !fuse) return allImages;
    
    // First try exact match
    const exactMatch = allImages.find(img => 
      img.code.toLowerCase() === debouncedSearchQuery.toLowerCase()
    );
    
    if (exactMatch) {
      return [exactMatch];
    }
    
    // If no exact match, use Fuse search with strict threshold
    const searchResults = fuse.search(debouncedSearchQuery);
    
    // Only return high confidence matches (score closer to 0 means better match)
    return searchResults
      .filter(result => result.score && result.score < 0.3)
      .map(result => result.item);
  }, [debouncedSearchQuery, allImages, fuse]);

  // Update displayed images when search query changes
  useEffect(() => {
    // Reset pagination when search query changes
    setPage(1);
    
    // Update displayed images with first page of filtered results
    const initialImages = filteredImages.slice(0, ITEMS_PER_PAGE);
    setDisplayedImages(initialImages);
    
    // Update hasMore flag
    setHasMore(filteredImages.length > ITEMS_PER_PAGE);
  }, [filteredImages]);

  // Load more images
  const loadMoreImages = useCallback(() => {
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newImages = filteredImages.slice(0, endIndex);
    
    setDisplayedImages(newImages);
    setPage(prev => prev + 1);
    setHasMore(endIndex < filteredImages.length);
  }, [page, filteredImages]);

  const handleStorageRequest = () => {
    if (allImages.length > 0) {
      setSelectedImage(allImages[0]);
      setIsStorageModalOpen(true);
    } else {
      toast({
        title: "Không có ảnh",
        description: "Không có ảnh nào để yêu cầu lưu trữ.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="mx-auto max-w-[1960px] p-4" role="main">
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onStorageRequest={handleStorageRequest}
      />

      <ImageGrid
        images={displayedImages}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMoreImages}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      >
        <HeaderCard variants={itemVariants} />
      </ImageGrid>

      {selectedImage && (
        <StorageRequestModal
          isOpen={isStorageModalOpen}
          onClose={() => {
            setIsStorageModalOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </main>
  );
}
