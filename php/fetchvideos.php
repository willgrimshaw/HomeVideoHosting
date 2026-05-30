<?php

$filter_name = $_GET['name'] ?? '';
$filter_location = $_GET['location'] ?? '';
$filter_startdate = $_GET['startdate'] ?? '';
$filter_enddate = $_GET['enddate'] ?? '';

header('Content-Type: application/json');

# TODO - implement SQL logic

echo json_encode([
    "filters" => [
        "name" => $filter_name,
        "location" => $filter_location,
        "startdate" => $filter_startdate,
        "enddate" => $filter_enddate
    ],
    "videos" => []
]);