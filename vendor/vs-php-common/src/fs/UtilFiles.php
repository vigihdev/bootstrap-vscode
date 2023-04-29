<?php

namespace vsPhpCommon\fs;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class UtilFiles
{
	public static function isFile(string $fileName): bool
	{
		return is_file($fileName) && file_exists($fileName);
	}

	public static function isFileJs(string $fileName): bool
	{
		return UtilFiles::isFile($fileName) && substr($fileName, -3) === '.js';
	}

	public static function isFilePhp(string $fileName): bool
	{
		return UtilFiles::isFile($fileName) && substr($fileName, -4) === '.php';
	}

	public static function isFileHtml(string $fileName): bool
	{
		return UtilFiles::isFile($fileName) && substr($fileName, -5) === '.html';
	}

	public static function isFileCss(string $fileName): bool
	{
		return UtilFiles::isFile($fileName) && substr($fileName, -4) === '.css';
	}

	public static function isFileMinCss(string $fileName): bool
	{
		return UtilFiles::isFile($fileName) && substr($fileName, -8) === '.min.css';
	}
}
