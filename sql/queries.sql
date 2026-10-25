-- Database: PostgreSQL.

-- 1. Retrieve HOT leads, with higher scores first and id breaking ties.
SELECT id, name, email, score
FROM leads
WHERE score >= 80
ORDER BY score DESC, id ASC;

-- 2. Report every priority group, including groups with zero leads.
SELECT 'HOT' AS priority, COUNT(*) AS lead_count
FROM leads
WHERE score >= 80
UNION ALL
SELECT 'WARM' AS priority, COUNT(*) AS lead_count
FROM leads
WHERE score BETWEEN 50 AND 79
UNION ALL
SELECT 'COLD' AS priority, COUNT(*) AS lead_count
FROM leads
WHERE score BETWEEN 0 AND 49;
