<?php
require_once 'composer.php';
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

use vsPhpCommon\fs\Utils;
use vsPhpCommon\fs\UtilFiles;

$items = ['-', '--', 'p', 'j', 'a', 'b', 'c', 'd', 'o'];
$fileName = __FILE__;

function cmp($a, $b)
{
	if ($a == $b) {
		return 0;
	}
	$words = str_split(Utils::WORD);
	return in_array(substr($a, 0, 1), $words) ? -1 : 1;
	return ($a < $b) ? -1 : 1;
}

function sortAlpabhet(array $item)
{
	if (Utils::isArrayIndexed($item)) {
		$nonAlpha = [];
		$isAlpha = [];
		foreach ($item as $value) {
			if (in_array(substr($value, 0, 1), str_split(Utils::WORD))) {
				$isAlpha[] = $value;
			} else {
				$nonAlpha[] = $value;
			}
		}
		return array_merge($isAlpha, $nonAlpha);
	}
}
echo "<pre>";
var_dump(UtilFiles::isFilePhp($fileName));
var_dump(Utils::endWord(Utils::WORD));
echo "</pre>";
sortAlpabhet($items);
