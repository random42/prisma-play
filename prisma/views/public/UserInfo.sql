SELECT
  u.id,
  u.email,
  u.name,
  COALESCE(p.bio, u.bio) as bio,
  p."avatarUrl",
  p.website,
  p.location
FROM
  "User" u
LEFT JOIN
  "Profile" p ON (u.id = p."userId")
