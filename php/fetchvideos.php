<?php

$filter_name = trim($_GET['name'] ?? '');
$filter_location = trim($_GET['location'] ?? '');
$filter_startdate = $_GET['startdate'] ?? '';
$filter_enddate = $_GET['enddate'] ?? '';

header('Content-Type: application/json');

try {
    $db = new PDO('sqlite:/var/www/data/hvh.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = 'SELECT 
        h.Id,
        h.Filename,
        h.LengthSeconds,
        h.RecordedDate,
        h.Location,
        GROUP_CONCAT(p.FirstName || \' \' || p.LastName, \', \') as People
    FROM HomeVideos h
    LEFT JOIN HomeVideoPeople hvp ON hvp.HomeVideoId = h.Id
    LEFT JOIN People p ON p.Id = hvp.PersonId
    WHERE 1=1';
    $clauses = [];
    $params = [];

    if ($filter_name !== '') {
        $clauses[] = 'EXISTS (
            SELECT 1 FROM HomeVideoPeople hvp2
            JOIN People p2 ON p2.Id = hvp2.PersonId
            WHERE hvp2.HomeVideoId = h.Id
            AND (p2.FirstName LIKE ? OR p2.LastName LIKE ?)
        )';
        $params[] = '%' . $filter_name . '%';
        $params[] = '%' . $filter_name . '%';
    }

    if ($filter_location !== '') {
        $clauses[] = 'h.Location LIKE ?';
        $params[] = '%' . $filter_location . '%';
    }

    if ($filter_startdate !== '') {
        $clauses[] = 'h.RecordedDate >= ?';
        $params[] = $filter_startdate . ' 00:00:00';
    }

    if ($filter_enddate !== '') {
        $clauses[] = 'h.RecordedDate <= ?';
        $params[] = $filter_enddate . ' 23:59:59';
    }

    if (!empty($clauses)) {
        $sql .= ' AND ' . implode(' AND ', $clauses);
    }

    $sql .= ' GROUP BY h.Id, h.Filename, h.LengthSeconds, h.RecordedDate, h.Location';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'filters' => [
            'name' => $filter_name,
            'location' => $filter_location,
            'startdate' => $filter_startdate,
            'enddate' => $filter_enddate
        ],
        // 'sql' => $sql,
        // 'params' => $params,
        'videos' => $videos
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'filters' => [
            'name' => $filter_name,
            'location' => $filter_location,
            'startdate' => $filter_startdate,
            'enddate' => $filter_enddate
        ]
    ]);
}
