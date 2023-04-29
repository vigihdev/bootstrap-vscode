<?php

namespace vsPhpCommon\fs;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class Fs
{
	public static function exist(string $filename): bool
	{
		return file_exists($filename);
	}

	public static function fileGetContents(string $filename): string
	{
		return Fs::exist($filename) ? file_get_contents($filename) : '';
	}

	public static function readFilesCss(string $filename): array
	{
		$content = Fs::fileGetContents($filename);
		$newContent = preg_replace(RegExp::REMOVE_BLOCK_COMMENT, '', $content);
		$newContent = preg_replace(RegExp::REMOVE_BODY_CSS, '', $newContent);
		$newContent = preg_replace(RegExp::REMOVE_AT_CSS, '', $newContent);
		$newContent = preg_replace(RegExp::REMOVE_SELECTOR_CSS, '', $newContent);
		preg_match_all('/\.[a-zA-Z-0-9-_]+/', $newContent, $matches);
		if (current($matches) && is_array(current($matches))) {
			$result = [];
			foreach (current($matches) as $data) {
				$text = Utils::ltrim($data, '.');
				$text = Utils::rtrim($text, '-');
				$result[] = $text;
			}
			$result = Utils::unique($result);
			return $result;
		}
		return [];
	}

	public static function saveAsFile(string $filename, array $content): bool
	{
		$dirname = Path::getDirectory($filename);
		if (is_dir($dirname)) {
			return file_put_contents($filename, json_encode($content, JSON_PRETTY_PRINT));
		}
		return false;
	}
}
