WITH districts(district_name, center_lat, center_lng, street_name, district_order) AS (
    VALUES
        ('강남', 37.497900, 127.027600, '강남구 강남대로', 1),
        ('성수', 37.544600, 127.055900, '성동구 성수이로', 2),
        ('홍대', 37.556300, 126.923600, '마포구 홍익로', 3),
        ('연남', 37.562700, 126.925300, '마포구 동교로', 4),
        ('합정', 37.549900, 126.914500, '마포구 양화로', 5),
        ('을지로', 37.566000, 126.991900, '중구 을지로', 6),
        ('잠실', 37.513300, 127.100200, '송파구 올림픽로', 7),
        ('신촌', 37.559800, 126.942400, '서대문구 연세로', 8),
        ('이태원', 37.534500, 126.994600, '용산구 이태원로', 9),
        ('여의도', 37.521900, 126.924500, '영등포구 여의대방로', 10)
),
cafe_numbers(cafe_number) AS (
    SELECT generate_series(1, 20)
),
seed_cafes AS (
    SELECT
        CONCAT(d.district_name, ' ', names.name_part, ' ', LPAD(c.cafe_number::text, 2, '0')) AS name,
        d.district_name AS district,
        CONCAT('서울특별시 ', d.street_name, ' ', (c.cafe_number * 3 + d.district_order), '길') AS address,
        ROUND((
            d.center_lat
            + ((((c.cafe_number - 1) % 5) - 2) * 0.0012)
            + (((c.cafe_number % 3) - 1) * 0.00025)
        )::numeric, 6) AS latitude,
        ROUND((
            d.center_lng
            + ((((c.cafe_number - 1) / 5) - 1.5) * 0.0016)
            + (((c.cafe_number % 4) - 1.5) * 0.00015)
        )::numeric, 6) AS longitude,
        (3.8 + (((c.cafe_number + d.district_order) % 12) * 0.1))::numeric(2, 1) AS rating,
        40 + ((c.cafe_number * 37 + d.district_order * 29) % 461) AS review_count,
        1 + ((c.cafe_number + d.district_order) % 4) AS price_level,
        CASE
            WHEN c.cafe_number % 5 = 0 THEN TIME '10:00'
            WHEN c.cafe_number % 4 = 0 THEN TIME '09:00'
            ELSE TIME '08:00'
        END AS opens_at,
        CASE
            WHEN c.cafe_number % 6 = 0 THEN TIME '23:30'
            WHEN c.cafe_number % 5 = 0 THEN TIME '21:00'
            ELSE TIME '22:00'
        END AS closes_at,
        ((c.cafe_number + d.district_order) % 5 <> 0) AS has_wifi,
        ((c.cafe_number * 2 + d.district_order) % 4 <> 0) AS has_power,
        52 + ((c.cafe_number * 7 + d.district_order * 5) % 45) AS quiet_score,
        18 + ((c.cafe_number * 9 + d.district_order * 4) % 70) AS seat_count,
        CASE
            WHEN c.cafe_number % 6 = 0 THEN ARRAY['조용함', '스페셜티 커피', '공부하기 좋음']
            WHEN c.cafe_number % 5 = 0 THEN ARRAY['디저트', '브런치', '반려동물 동반']
            WHEN c.cafe_number % 4 = 0 THEN ARRAY['작업하기 좋음', '콘센트 많음', '늦게까지 영업']
            WHEN c.cafe_number % 3 = 0 THEN ARRAY['작업하기 좋음', '디저트', '스페셜티 커피']
            ELSE ARRAY['작업하기 좋음', '조용함', '에스프레소']
        END AS tags
    FROM districts d
    CROSS JOIN cafe_numbers c
    CROSS JOIN LATERAL (
        SELECT (ARRAY[
            '커피 연구소',
            '로스터리',
            '스터디 바',
            '빈 하우스',
            '브루 룸',
            '디저트 카페',
            '코너 커피',
            '조용한 테이블',
            '에스프레소 웍스',
            '필터 바',
            '데일리 머그',
            '워크 라운지',
            '슬로우 브루',
            '테라스 카페',
            '드립 스튜디오',
            '밀크 바',
            '카페 아틀리에',
            '리딩 룸',
            '동네 브루',
            '모닝 컵'
        ])[c.cafe_number] AS name_part
    ) names
)
INSERT INTO cafes (
    name,
    district,
    address,
    latitude,
    longitude,
    rating,
    review_count,
    price_level,
    opens_at,
    closes_at,
    has_wifi,
    has_power,
    quiet_score,
    seat_count,
    tags
)
SELECT
    name,
    district,
    address,
    latitude,
    longitude,
    rating,
    review_count,
    price_level,
    opens_at,
    closes_at,
    has_wifi,
    has_power,
    quiet_score,
    seat_count,
    tags
FROM seed_cafes seed
WHERE NOT EXISTS (
    SELECT 1
    FROM cafes existing
    WHERE existing.name = seed.name
);
