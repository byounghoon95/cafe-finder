WITH normalized_tags AS (
    SELECT
        c.id,
        ARRAY(
            SELECT mapped.tag_value
            FROM (
                SELECT
                    tag_order,
                    CASE tag_value
                        WHEN 'work-friendly' THEN '작업하기 좋음'
                        WHEN 'dessert' THEN '디저트'
                        WHEN 'quiet' THEN '조용함'
                        WHEN 'specialty-coffee' THEN '스페셜티 커피'
                        WHEN 'study' THEN '공부하기 좋음'
                        WHEN 'brunch' THEN '브런치'
                        WHEN 'pet-friendly' THEN '반려동물 동반'
                        WHEN 'power-friendly' THEN '콘센트 많음'
                        WHEN 'late-night' THEN '늦게까지 영업'
                        WHEN 'espresso' THEN '에스프레소'
                        ELSE tag_value
                    END AS tag_value
                FROM unnest(c.tags) WITH ORDINALITY AS source_tags(tag_value, tag_order)
            ) mapped
            WHERE NOT (c.quiet_score < 70 AND mapped.tag_value = '조용함')
            ORDER BY mapped.tag_order
        ) AS tags
    FROM cafes c
)
UPDATE cafes
SET
    tags = normalized_tags.tags,
    updated_at = CURRENT_TIMESTAMP
FROM normalized_tags
WHERE cafes.id = normalized_tags.id
  AND cafes.tags IS DISTINCT FROM normalized_tags.tags;
