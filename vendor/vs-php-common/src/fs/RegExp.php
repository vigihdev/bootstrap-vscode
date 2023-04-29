<?php

namespace vsPhpCommon\fs;

use Webmozart\PathUtil\Path;
use Webmozart\Glob\Glob;

class RegExp
{
	const REMOVE_BLOCK_COMMENT = '/\/\*.*|\*.*|\*\/.*|\/\/.*/';
	const REMOVE_BODY_CSS = '/{[^\r]+?}|[a-zA-Z-0-9-\\s+:]+.*?;/';
	const REMOVE_AT_CSS = '/@.*/';
	const REMOVE_SELECTOR_CSS = '/\w+:[a-z-A-z-0-9]+\(.*?\)|\[.*?\]/';

	public static function test(string $regex, string $text): bool
	{
		return false;
	}
}
