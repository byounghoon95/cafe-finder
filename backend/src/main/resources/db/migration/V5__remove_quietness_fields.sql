UPDATE cafes
SET
    tags = array_remove(tags, '조용함'),
    updated_at = CURRENT_TIMESTAMP
WHERE '조용함' = ANY(tags);

ALTER TABLE cafes
DROP COLUMN quiet_score;
