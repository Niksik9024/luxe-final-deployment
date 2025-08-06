
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS "user_history";
DROP TABLE IF EXISTS "user_favorites";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "galleries";
DROP TABLE IF EXISTS "videos";
DROP TABLE IF EXISTS "models";

-- Create Models Table
CREATE TABLE "models" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" character varying NOT NULL,
    "image" text NOT NULL,
    "description" text,
    "instagram" character varying,
    "twitter" character varying
);

-- Create Videos Table
CREATE TABLE "videos" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" character varying NOT NULL,
    "models" text[] NOT NULL,
    "image" text NOT NULL,
    "videoUrl" text NOT NULL,
    "date" date NOT NULL,
    "tags" text[] NOT NULL,
    "description" text,
    "status" text DEFAULT 'Draft'::text,
    "isFeatured" boolean DEFAULT false
);

-- Create Galleries Table
CREATE TABLE "galleries" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" character varying NOT NULL,
    "models" text[] NOT NULL,
    "image" text NOT NULL,
    "date" date NOT NULL,
    "tags" text[] NOT NULL,
    "description" text,
    "status" text DEFAULT 'Draft'::text,
    "album" text[]
);

-- Create Users Table (for auth)
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "name" text,
  "image" text,
  "role" text DEFAULT 'user'
);

-- Create User Favorites Table
CREATE TABLE "user_favorites" (
    "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "content_id" character varying NOT NULL,
    "content_type" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "metadata" jsonb,
    UNIQUE (user_id, content_id)
);

-- Create User History Table
CREATE TABLE "user_history" (
    "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "content_id" character varying NOT NULL,
    "content_type" text NOT NULL,
    "viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, content_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Policies for Public Access (Read-only)
CREATE POLICY "Allow public read access to models" ON models FOR SELECT USING (true);
CREATE POLICY "Allow public read access to videos" ON videos FOR SELECT USING (status = 'Published');
CREATE POLICY "Allow public read access to galleries" ON galleries FOR SELECT USING (status = 'Published');

-- Policies for Admin Full Access (Admins can do anything)
CREATE POLICY "Allow admin full access to models" ON models FOR ALL USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Allow admin full access to videos" ON videos FOR ALL USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Allow admin full access to galleries" ON galleries FOR ALL USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Allow admin to see all users" ON users FOR SELECT USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );

-- Policies for User-specific data (Users can only touch their own stuff)
CREATE POLICY "Allow users to update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to manage their own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage their own history" ON user_history FOR ALL USING (auth.uid() = user_id);

-- Function to create a user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, image, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    CASE
      WHEN NEW.email = 'admin@luxe.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Functions for tag management
CREATE OR REPLACE FUNCTION rename_tag(old_name text, new_name text)
RETURNS void AS $$
BEGIN
  UPDATE videos SET tags = array_replace(tags, old_name, new_name) WHERE old_name = ANY(tags);
  UPDATE galleries SET tags = array_replace(tags, old_name, new_name) WHERE old_name = ANY(tags);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_tag(tag_name text)
RETURNS void AS $$
BEGIN
  UPDATE videos SET tags = array_remove(tags, tag_name) WHERE tag_name = ANY(tags);
  UPDATE galleries SET tags = array_remove(tags, tag_name) WHERE tag_name = ANY(tags);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION merge_tags(from_tag text, to_tag text)
RETURNS void AS $$
BEGIN
  -- Add the to_tag to any content that has from_tag but not to_tag
  UPDATE videos SET tags = array_append(tags, to_tag) WHERE from_tag = ANY(tags) AND NOT (to_tag = ANY(tags));
  UPDATE galleries SET tags = array_append(tags, to_tag) WHERE from_tag = ANY(tags) AND NOT (to_tag = ANY(tags));
  -- Remove the from_tag from all content
  PERFORM delete_tag(from_tag);
END;
$$ LANGUAGE plpgsql;
