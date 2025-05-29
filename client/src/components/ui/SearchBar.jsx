import { useState, useEffect } from "react";
import SearchResult from "../../pages/SearchResult";
import { useAuth } from "../../store/Auth";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { API } = useAuth();

  // Debounce search input
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timerId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/api/search/notes?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      console.log("API Response:", data); // Add this line

      if (!response.ok) throw new Error(data.message || "Search failed");

      setSearchResults(data.notes || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for Notes, PYQ's and Study Material"
          className="search-bar"
        />
      </div>

      {(isLoading || searchResults.length > 0 || searchQuery) && (
        <SearchResult
          results={searchResults}
          searchQuery={searchQuery}
          isLoading={isLoading}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );
};

export default SearchBar;
