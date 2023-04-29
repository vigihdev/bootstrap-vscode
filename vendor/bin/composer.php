<?php

use Composer\Autoload\ClassLoader;

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$GLOBALS['_composer_bin_dir'] = __DIR__;
$GLOBALS['_composer_autoload_path'] = __DIR__ . '/..' . '/autoload.php';


$composerAutoload = [
	__DIR__ . '/..' . '/autoload.php',
];
$vendorPath = null;
foreach ($composerAutoload as $autoload) {
	if (file_exists($autoload)) {
		require $autoload;
	}
}

// require $vendor . '/yiisoft/yii2/Yii.php';
// $_SERVER['SCRIPT_FILENAME'] = 'index.php';
// $_SERVER['SCRIPT_NAME'] =  '/index.php';
// $_SERVER['REQUEST_URI'] = 'index.php';

// $webPhp = dirname($vendor) . '/config/web.php';
// $db = require dirname($vendor) . '/config/db.php';
// $web = require dirname($vendor) . '/config/web.php';
