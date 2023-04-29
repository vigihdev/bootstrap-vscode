<?php

use Webmozart\Glob\Glob;
use Webmozart\PathUtil\Path;
use vsPhpCommon\fs\Fs;
use vsPhpCommon\fs\Utils;

/** 
 * Save File Db
 * @param array $listFileName Data list file from scanner .css
 * @param string $saveAsFileName Path filename save as
 * @return bool
 */
function saveAsFiles(array $listFileName, string $saveAsFileName): bool
{
	if (Utils::isArrayIndexed($listFileName) && is_dir(Path::getDirectory($saveAsFileName))) {
		$result = [];
		foreach ($listFileName as $file) {
			if (substr($file, -8) !== '.min.css' && substr($file, -4) === '.css') {
				foreach (Fs::readFilesCss($file) as $text) {
					$result[] = $text;
				}
			}
		}
		if (!empty($result)) {
			$result = Utils::unique($result);
			$result = Utils::sortAlpabhet($result);
			return Fs::saveAsFile($saveAsFileName, $result);
		}
	}
	return false;
}
