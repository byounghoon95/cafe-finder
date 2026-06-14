WITH districts(district_name, center_lat, center_lng, street_name, district_order) AS (
    VALUES
        ('Gangnam', 37.497900, 127.027600, 'Gangnam-daero, Gangnam-gu', 1),
        ('Seongsu', 37.544600, 127.055900, 'Seongsui-ro, Seongdong-gu', 2),
        ('Hongdae', 37.556300, 126.923600, 'Hongik-ro, Mapo-gu', 3),
        ('Yeonnam', 37.562700, 126.925300, 'Donggyo-ro, Mapo-gu', 4),
        ('Hapjeong', 37.549900, 126.914500, 'Yanghwa-ro, Mapo-gu', 5),
        ('Euljiro', 37.566000, 126.991900, 'Eulji-ro, Jung-gu', 6),
        ('Jamsil', 37.513300, 127.100200, 'Olympic-ro, Songpa-gu', 7),
        ('Sinchon', 37.559800, 126.942400, 'Yonsei-ro, Seodaemun-gu', 8),
        ('Itaewon', 37.534500, 126.994600, 'Itaewon-ro, Yongsan-gu', 9),
        ('Yeouido', 37.521900, 126.924500, 'Yeouidaebang-ro, Yeongdeungpo-gu', 10)
),
cafe_numbers(cafe_number) AS (
    SELECT generate_series(1, 20)
),
seed_cafes AS (
    SELECT
        CONCAT(d.district_name, ' ', names.name_part, ' ', LPAD(c.cafe_number::text, 2, '0')) AS name,
        d.district_name AS district,
        CONCAT((c.cafe_number * 3 + d.district_order), ' ', d.street_name, ', Seoul') AS address,
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
            WHEN c.cafe_number % 6 = 0 THEN ARRAY['quiet', 'specialty-coffee', 'study']
            WHEN c.cafe_number % 5 = 0 THEN ARRAY['dessert', 'brunch', 'pet-friendly']
            WHEN c.cafe_number % 4 = 0 THEN ARRAY['work-friendly', 'power-friendly', 'late-night']
            WHEN c.cafe_number % 3 = 0 THEN ARRAY['work-friendly', 'dessert', 'specialty-coffee']
            ELSE ARRAY['work-friendly', 'quiet', 'espresso']
        END AS tags
    FROM districts d
    CROSS JOIN cafe_numbers c
    CROSS JOIN LATERAL (
        SELECT (ARRAY[
            'Coffee Lab',
            'Roastery',
            'Study Bar',
            'Bean House',
            'Brew Room',
            'Dessert Cafe',
            'Corner Coffee',
            'Quiet Table',
            'Espresso Works',
            'Filter Bar',
            'Daily Mug',
            'Work Lounge',
            'Slow Brew',
            'Terrace Cafe',
            'Drip Studio',
            'Milk Bar',
            'Cafe Atelier',
            'Reading Room',
            'Neighborhood Brew',
            'Morning Cup'
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
