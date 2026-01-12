import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("produce");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  function fetchItems() {
    fetch("http://localhost:3000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }

  function addItem(e) {
    e.preventDefault();
    if (!name.trim()) return;

    fetch("http://localhost:3000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category }),
    }).then(() => {
      setName("");
      setCategory("produce");
      fetchItems();
    });
  }

  function togglePurchased(item) {
    fetch(`http://localhost:3000/api/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchased: !item.purchased }),
    }).then(() => fetchItems());
  }

  function deleteItem(id) {
    fetch(`http://localhost:3000/api/items/${id}`, {
      method: "DELETE",
    }).then(() => fetchItems());
  }

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  const totalCount = items.length;
  const purchasedCount = items.filter((item) => item.purchased).length;
  const remainingCount = totalCount - purchasedCount;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "520px",
        backgroundColor: "#2a2a2a",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      {/* TITLE */}
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Grocery List
      </h1>

      {/* ADD ITEM ROW */}
      <form
        onSubmit={addItem}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 2, padding: "0.4rem" }}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ flex: 1, padding: "0.4rem" }}
        >
          <option value="produce">Produce</option>
          <option value="dairy">Dairy</option>
          <option value="meat">Meat</option>
          <option value="pantry">Pantry</option>
          <option value="bakery">Bakery</option>
          <option value="frozen">Frozen</option>
          <option value="beverages">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="misc">Misc</option>
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </form>

      {/* FILTER + STATS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <label>
          Filter:{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="produce">Produce</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
            <option value="pantry">Pantry</option>
            <option value="bakery">Bakery</option>
            <option value="frozen">Frozen</option>
            <option value="beverages">Beverages</option>
            <option value="snacks">Snacks</option>
            <option value="misc">Misc</option>
          </select>
        </label>

        <div style={{ fontSize: "0.9rem" }}>
          <strong>Total:</strong> {totalCount} | <strong>Purchased:</strong>{" "}
          {purchasedCount} | <strong>Remaining:</strong> {remainingCount}
        </div>
      </div>

      {/* ITEM LIST */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem",
              borderBottom: "1px solid #444",
            }}
          >
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => togglePurchased(item)}
            />

            <span
              style={{
                marginLeft: "0.5rem",
                flexGrow: 1,
                textDecoration: item.purchased ? "line-through" : "none",
              }}
            >
              {item.name} ({item.category})
            </span>

            <button
              onClick={() => deleteItem(item.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
