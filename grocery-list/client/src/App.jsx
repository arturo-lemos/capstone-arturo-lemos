import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("produce");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, category }),
    })
      .then((res) => res.json())
      .then(() => {
        setName("");
        setCategory("produce");
        fetchItems();
      });
  }

  function togglePurchased(item) {
    fetch(`http://localhost:3000/api/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purchased: !item.purchased }),
    }).then(() => fetchItems());
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <h1>Grocery List</h1>

      {/* ADD ITEM FORM */}
      <form onSubmit={addItem} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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

        <button type="submit">Add</button>
      </form>

      {/* ITEM LIST */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => togglePurchased(item)}
            />

            <span
              style={{
                textDecoration: item.purchased ? "line-through" : "none",
                marginLeft: "0.5rem",
              }}
            >
              {item.name} ({item.category})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
