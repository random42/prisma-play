-- @param {String} $1:searchTerm Search term for post content
-- Search posts by content with engagement metrics
SELECT 
  id,
  title,
  slug,
  status,
  "viewCount",
  "likeCount",
  ("viewCount" + "likeCount" * 10) as "engagementScore"
FROM 
  "Post"
WHERE 
  content ILIKE '%' || $1 || '%'
ORDER BY 
  "engagementScore" DESC
LIMIT 10
