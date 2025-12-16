DROP TABLE IF EXISTS items;

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'produce',
      'dairy',
      'meat',
      'pantry',
      'bakery',
      'frozen',
      'beverages',
      'snacks',
      'misc'
    )
  ),
  purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);