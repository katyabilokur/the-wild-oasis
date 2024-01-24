import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "name-asc";

  const page = searchParams.get("page");
  function handleChange(e) {
    // if (page) searchParams.set("page", 1);
    if (page) searchParams.delete("page");
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <Select
      value={sortBy}
      options={options}
      type={"white"}
      onChange={handleChange}
    />
  );
}

export default SortBy;
