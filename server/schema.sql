DROP TABLE IF EXISTS trips;

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  destination TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget TEXT NOT NULL,
  travel_style TEXT NOT NULL,
  host_name TEXT NOT NULL,
  blurb TEXT NOT NULL,
  itinerary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  travel_style TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
