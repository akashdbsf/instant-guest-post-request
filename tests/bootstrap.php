<?php
// Define minimal WordPress constants and load autoloader
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__);
}
if (!defined('DAY_IN_SECONDS')) {
    define('DAY_IN_SECONDS', 86400);
}
require dirname(__DIR__) . '/vendor/autoload.php';
