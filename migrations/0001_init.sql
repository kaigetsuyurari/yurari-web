CREATE TABLE broadcasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_index INTEGER NOT NULL UNIQUE,
  date TEXT NOT NULL
);

CREATE TABLE news_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broadcast_id INTEGER NOT NULL REFERENCES broadcasts(id),
  headline_index INTEGER NOT NULL,
  headline_text TEXT NOT NULL,
  script TEXT NOT NULL,
  UNIQUE (broadcast_id, headline_index)
);
