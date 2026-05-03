import { useState, useEffect, createContext, useContext } from "react";

export const AuthContext = createContext();

const STREAM_CACHE_KEY = "faby_streams_cache_v1";
const BRANCH_CACHE_KEY = "faby_branches_cache_v1";
const CACHE_TTL_MS = 1000 * 60 * 30;
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout

// Helper function to fetch with timeout and progress tracking
const fetchWithTimeout = async (url, options = {}, onProgress = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    if (onProgress) onProgress();
  }
};

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;

    return parsed.data;
  } catch (error) {
    console.error("Failed to read cache:", error);
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch (error) {
    console.error("Failed to write cache:", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("faby_token"));
  const [user, setUser] = useState(null);
  const [streamData, setStremData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0); // Real progress tracking
  const [loadingErrors, setLoadingErrors] = useState([]); // Track errors

  const authorizationToken = `Bearer ${token}`;
  const API = import.meta.env.VITE_APP_URI_API;

  // Function for storing token to localStorage
  const storeTokenToLocalStrorage = (faby_token) => {
    setToken(faby_token);
    setIsLoggedIn(true);
    return localStorage.setItem("faby_token", faby_token);
  };

  // Function to logout user
  const logoutUser = () => {
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("faby_token");
  };

  const fetchSubjectsData = async (semesterNumber, streamName, slug) => {
    try {
      const response = await fetch(
        `${API}/api/subjects?semesterNumber=${semesterNumber}&streamName=${streamName}&slug=${slug}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.subjectsData;
    } catch (error) {
      console.error("Error fetching subjects data:", error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  // gets note with subject code
  const fetchNotesWithSubjectCode = async (subjectCode) => {
    try {
      // Fetch subject details
      const notesResponse = await fetchWithTimeout(
        `${API}/api/notes/code/${subjectCode}`,
        {},
      );
      if (!notesResponse.ok) {
        throw new Error(`Failed to fetch notes: ${notesResponse.statusText}`);
      }
      const notesData = await notesResponse.json();
      return notesData.notes || [];
    } catch (err) {
      console.error("Error fetching notes:", err);
      throw err; // Re-throw so calling component can handle it
    }
  };

  // fetch branch with slug
  const fetchBranchWithSlug = async (slug) => {
    try {
      const response = await fetch(`${API}/api/branches/slug/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.branch;
    } catch (error) {
      console.log("error fetching branch data with slug");
    }
  };

  //TODO: to get all the books according to there streamName
  const fetchStreamViseBooks = async (streamName) => {
    try {
      const response = await fetch(`${API}/api/books/${streamName}`);
      if (response.ok) {
        const data = await response.json();
        return data.books;
      }
    } catch (error) {
      console.error(`Error Fetching Books🚫`);
    }
  };

  // Get user data when token changes
  useEffect(() => {
    // Check if there's a token in the URL (from Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      storeTokenToLocalStrorage(tokenFromUrl);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    let isMounted = true; // Prevent state updates after unmount

    const fetchUserData = async () => {
      if (!token) {
        if (isMounted) {
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
        return;
      }

      try {
        const response = await fetchWithTimeout(`${API}/api/auth/user`, {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        });

        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setIsLoggedIn(true);
          } else {
            logoutUser();
          }
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) {
          setLoadingErrors((prev) => [
            ...prev,
            `User auth failed: ${error.message}`,
          ]);
          setLoadProgress((prev) => Math.min(prev + 33, 100)); // Still progress even on error
          logoutUser();
        }
      }
    };

    const fetchStreamData = async () => {
      const cachedStreams = readCache(STREAM_CACHE_KEY);
      if (cachedStreams?.length) {
        if (isMounted) {
          setStremData(cachedStreams);
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
        return;
      }

      try {
        const response = await fetchWithTimeout(`${API}/api/streams`, {});
        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setStremData(data.streams);
            writeCache(STREAM_CACHE_KEY, data.streams);
          }
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
      } catch (error) {
        console.error("Error fetching stream data:", error);
        if (isMounted) {
          setLoadingErrors((prev) => [
            ...prev,
            `Streams failed: ${error.message}`,
          ]);
          setLoadProgress((prev) => Math.min(prev + 33, 100)); // Still progress even on error
        }
      }
    };

    const fetchBranchData = async () => {
      const cachedBranches = readCache(BRANCH_CACHE_KEY);
      if (cachedBranches?.length) {
        if (isMounted) {
          setBranchData(cachedBranches);
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
        return;
      }

      try {
        const response = await fetchWithTimeout(`${API}/api/branches`, {});
        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setBranchData(data.branches);
            writeCache(BRANCH_CACHE_KEY, data.branches);
          }
          setLoadProgress((prev) => Math.min(prev + 33, 100));
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
        if (isMounted) {
          setLoadingErrors((prev) => [
            ...prev,
            `Branches failed: ${error.message}`,
          ]);
          setLoadProgress((prev) => Math.min(prev + 33, 100)); // Still progress even on error
        }
      }
    };

    // Start loading
    setLoadProgress(10);
    setLoadingErrors([]);
    setIsLoading(true);

    // Fetch user first (blocking), then streams & branches in parallel
    fetchUserData().then(() => {
      Promise.all([fetchStreamData(), fetchBranchData()]).finally(() => {
        if (isMounted) {
          setIsLoading(false);
          setLoadProgress(100);
        }
      });
    });

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [token, API]);

  return (
    <AuthContext.Provider
      value={{
        storeTokenToLocalStrorage,
        logoutUser,
        API,
        token,
        user,
        isLoggedIn,
        isLoading,
        authorizationToken,
        streamData,
        branchData,
        loadProgress, // Real progress tracking
        loadingErrors, // Error messages
        fetchSubjectsData,
        fetchNotesWithSubjectCode,
        fetchBranchWithSlug,
        fetchStreamViseBooks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    console.log(`Wrap the Provider Properly`);
  }
  return authContextValue;
};
