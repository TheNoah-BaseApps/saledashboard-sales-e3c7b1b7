CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  password text NOT NULL,
  role text DEFAULT 'user' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS website_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  ip text NOT NULL,
  owner_contact text,
  number_of_visits integer DEFAULT 1 NOT NULL,
  page_visits text[],
  website_duration integer,
  location text,
  time time NOT NULL,
  date date NOT NULL,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_website_visits_ip ON website_visits (ip);
CREATE INDEX IF NOT EXISTS idx_website_visits_owner_contact ON website_visits (owner_contact);
CREATE INDEX IF NOT EXISTS idx_website_visits_date ON website_visits (date);
CREATE INDEX IF NOT EXISTS idx_website_visits_user_id ON website_visits (user_id);

CREATE TABLE IF NOT EXISTS store_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  owner_contact text NOT NULL,
  number_of_visits integer DEFAULT 1 NOT NULL,
  location text NOT NULL,
  time time NOT NULL,
  date date NOT NULL,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_store_visits_owner_contact ON store_visits (owner_contact);
CREATE INDEX IF NOT EXISTS idx_store_visits_location ON store_visits (location);
CREATE INDEX IF NOT EXISTS idx_store_visits_date ON store_visits (date);
CREATE INDEX IF NOT EXISTS idx_store_visits_user_id ON store_visits (user_id);

CREATE TABLE IF NOT EXISTS login_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  location text,
  time time NOT NULL,
  date date NOT NULL,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_signups_email ON login_signups (email);
CREATE INDEX IF NOT EXISTS idx_login_signups_date ON login_signups (date);
CREATE INDEX IF NOT EXISTS idx_login_signups_user_id ON login_signups (user_id);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  contact_info text NOT NULL UNIQUE,
  first_seen timestamp with time zone NOT NULL,
  last_activity timestamp with time zone NOT NULL,
  total_website_visits integer DEFAULT 0 NOT NULL,
  total_store_visits integer DEFAULT 0 NOT NULL,
  has_registered boolean DEFAULT false NOT NULL,
  user_id uuid
);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_info ON contacts (contact_info);
CREATE INDEX IF NOT EXISTS idx_contacts_last_activity ON contacts (last_activity);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts (user_id);