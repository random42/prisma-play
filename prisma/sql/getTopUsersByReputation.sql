-- @param {Int} $1:minReputation Minimum reputation score
-- @param {Int} $2:limit Maximum number of results
-- Get top users by reputation above a threshold
SELECT 
  id,
  name,
  email,
  reputation,
  "profileViews"
FROM 
  "User"
WHERE 
  reputation >= $1
ORDER BY 
  reputation DESC
LIMIT $2
