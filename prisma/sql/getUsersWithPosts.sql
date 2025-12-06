-- Get users with their post counts
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(p.id) as "postCount"
FROM 
  "User" u
LEFT JOIN 
  "Post" p ON u.id = p."authorId"
GROUP BY 
  u.id, u.name, u.email
ORDER BY 
  "postCount" DESC
