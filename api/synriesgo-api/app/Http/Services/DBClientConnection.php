<?php
namespace App\Http\Services;

class DBClientConnection
{
    private $client;

    function __construct($client) {
        $this->client = $client;
    }

    public function getConnectionArray() {
        return [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST'),
            'port' => env('DB_PORT'),
            'database' => env('DB_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => $this->client,
            'sslmode' => 'prefer'
        ];
    }
}