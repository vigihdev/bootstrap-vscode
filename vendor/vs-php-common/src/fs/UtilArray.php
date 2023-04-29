<?php

namespace vsPhpCommon\fs;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class UtilArray
{
	public static function isAssociative(array $array, bool $allStrings = true): bool
	{
		if ($array === []) {
			return false;
		}

		if ($allStrings) {
			foreach ($array as $key => $_value) {
				if (!is_string($key)) {
					return false;
				}
			}

			return true;
		}

		foreach ($array as $key => $_value) {
			if (is_string($key)) {
				return true;
			}
		}

		return false;
	}

	public static function isIndexed(array $array, bool $consecutive = false): bool
	{
		if ($array === []) {
			return true;
		}

		if ($consecutive) {
			return array_keys($array) === range(0, count($array) - 1);
		}

		/** @psalm-var mixed $value */
		foreach ($array as $key => $_value) {
			if (!is_int($key)) {
				return false;
			}
		}

		return true;
	}
}
