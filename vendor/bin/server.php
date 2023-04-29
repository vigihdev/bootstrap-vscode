<?php
require_once 'composer.php';
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

use vsPhpCommon\fs\Utils;
use cli\CodeCli;
use cli\UtilCli;

$cli = new CodeCli($argv, ['METHOD', 'ARG'], '--');
if ($cli->getParameter('METHOD') && $cli->getParameter('ARG')) {
	$method = $cli->getParameter('METHOD');
	$arg = $cli->getParameter('ARG');

	switch ($method) {
		case 'saveAsFiles':
			$response = call_user_func_array('saveAsFiles', UtilCli::parseArgs($arg));
			echo Utils::parseBool($response);
			break;
	}
}
