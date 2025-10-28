import Tag from "@/src/components/Tag.jsx";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  // Generate an array of years from 1960 to current year
  const years = [""];
  for (let year = 2025; year >= 1960; year--) {
    years.push(year.toString());
  }

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            <p>Albums</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Genre"
            options={[
              "",
              "Rock",
              "Pop",
              "Hip Hop",
              "Jazz",
              "Classical",
              "Electronic",
              "Folk",
              "Blues",
              "Country",
              "Metal",
              "Indie",
              "R&B",
              "Soul",
              "Reggae",
              "World"
            ]}
            value={filters.genre}
            onChange={(event) => handleSelectionChange(event, "genre")}
            name="genre"
            icon="/music.svg"
          />

          <FilterSelect
            label="Release Year"
            options={years}
            value={filters.releaseYear}
            onChange={(event) => handleSelectionChange(event, "releaseYear")}
            name="releaseYear"
            icon="/calendar.svg"
          />

          <FilterSelect
            label="Sort"
            options={["Rating", "Review", "Year"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  setFilters({
                    genre: "",
                    releaseYear: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          if (type == "sort" || value == "") {
            return null;
          }
          return (
            <Tag
              key={value}
              type={type}
              value={value}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}
