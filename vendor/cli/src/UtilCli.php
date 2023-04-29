<?php

namespace cli;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class UtilCli
{
	public static function parseArgs(string $args): array
	{
		$result = [];
		$items = explode('||', trim($args));

		foreach ($items as $value) {
			$values = explode(' ', $value);
			$result[] = count($values) > 1 ? $values : current($values);
		}
		return $result;
	}
}
