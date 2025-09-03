import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/Auth";

export const SubjectsTest = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { branchName, semesterNumber } = useParams();
  const { API } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Test branch endpoint
        const branchResponse = await fetch(
          `${API}/api/branches/slug/${branchName}`
        );

        const branchData = await branchResponse.json();

        // Test subjects endpoint
        const subjectsResponse = await fetch(`${API}/api/subjects`);

        const subjectsData = await subjectsResponse.json();

        setApiData({
          branch: branchData,
          subjects: subjectsData,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [branchName, semesterNumber]);

  if (loading) return <div>Loading API data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Test Results</h1>

      <h2>URL Parameters</h2>
      <pre>{JSON.stringify({ branchName, semesterNumber }, null, 2)}</pre>

      <h2>Branch API Response</h2>
      <pre>{JSON.stringify(apiData?.branch, null, 2)}</pre>

      <h2>Subjects API Response</h2>
      <pre>{JSON.stringify(apiData?.subjects, null, 2)}</pre>
    </div>
  );
};

export default SubjectsTest;
