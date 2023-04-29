<?php

namespace vsPhpCommon\fs;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class Utils
{
	const WORD = 'abcdefghijklmnopqrstuwvxzABCDEFGHIJKLMNOPQRSTUWVXZ';
	const NUMBER = '0123456789';

	public static function trim(string $haystack, string $needle = ' '): string
	{
		return trim($haystack, $needle);
	}

	public static function ltrim(string $haystack, string $needle): string
	{
		return ltrim($haystack, $needle);
	}

	public static function rtrim(string $haystack, string $needle): string
	{
		return rtrim($haystack, $needle);
	}

	public static function firstWord(string $text): string
	{
		return substr($text, 0, 1);
	}

	public static function endWord(string $text): string
	{
		return substr($text, -1);
	}

	public static function unique(array $item): array
	{
		return array_unique($item);
	}

	public static function sort(array $item): array
	{
		sort($item);
		return $item;
	}

	public static function sortAlpabhet(array $item): array
	{
		sort($item);
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
		return $item;
	}

	public static function parseBool($content): bool
	{
		if (is_int($content)) {
			return $content === 0 ? false : true;
		}
		return is_bool($content) ? $content : false;
	}

	public static function isArrayAssociative(array $array, bool $allStrings = true): bool
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

	public static function isArrayIndexed(array $array, bool $consecutive = false): bool
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
