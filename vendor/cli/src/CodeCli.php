<?php

namespace cli;

/**
 * CommandLine control for accept variables that user set at constructor
 *
 * PHP version 7.4
 *
 * LICENSE: This source file is subject to version 3.0 of the GNU license
 * that is available through the world-wide-web at the following URI:
 * https://www.gnu.org/licenses/gpl-3.0.txt.  If you did not receive a copy of
 * the GNU License and are unable to obtain it through the web, please
 * send a note to license@gnu.org so we can mail you a copy immediately.
 *
 * @category   Scripting, Helpers, CommandLine, CLI
 * @author     Michael Araque https://t.me/michyaraque
 * @since      File available since Release 1.0.0
 * @datetime   23/03/2021
 */

class CodeCli
{

	/**
	 * @var array
	 */
	private array $data = [];

	/**
	 * @var array
	 */
	private array $argvs = [];

	/**
	 * @var string
	 */
	public string $argument_symbol;

	/**
	 * @var string
	 */
	public string $argument_value;

	private array $available_parameters = ['METHOD', 'ARG'];

	/**
	 * @param array|null $arguments this argument need the ARGV that represent the CLI array
	 * @param array $available_parameters you can set your own parameters in a array
	 * @param string $argument_symbol this argument represents the symbol that the " $available_parameters " needs
	 */
	public function __construct(?array $arguments = [], array $available_parameters = ['make', 'create'], string $argument_symbol = '--')
	{
		$this->isCommandLineInterface();
		$this->argvs = $arguments;
		$this->argument_symbol = $argument_symbol;
		$this->constructParameters($available_parameters);
		$this->deconstructParameters();
	}

	/**
	 * Used to control if the request is from Browser or CLI
	 * @return void
	 */
	private function isCommandLineInterface(): void
	{
		try {
			if (php_sapi_name() !== 'cli') {
				throw new \Exception("You have to use this script on command line");
			}
		} catch (\Exception $e) {
			die($e->getMessage());
		}
	}

	/**
	 * @param array $parameters this argument receive a array of available_parameters
	 * 
	 * @return void
	 */
	private function constructParameters(array $parameters): void
	{
		foreach ($parameters as $parameter) {
			$this->available_parameters[] = $this->argument_symbol . $parameter;
		}
	}

	/**
	 * Split and get the value or not of the parameters
	 * @return void
	 */
	private function deconstructParameters(): void
	{
		foreach ($this->argvs as $i => $argument) {
			$arg_explode = explode(':', $argument);
			if (!empty($arg_explode) && in_array($arg_explode[0], $this->available_parameters)) {
				$this->data[$arg_explode[0]]['content'] = $arg_explode[1];
			}
		}
		$this->checkParameters($arg_explode);
	}

	/**
	 * @param mixed $content Check if any parameter is setted if not they return a message
	 * 
	 * @return void
	 */
	private function checkParameters($content): void
	{
		if (!in_array($content[0], $this->available_parameters)) {
			die("No valid parameter found, valid values: " . implode(', ', $this->available_parameters));
		}
	}

	/**
	 * @param string $argument this argument receive the unique parameter that you want to get the data
	 */
	public function getParameter(string $argument = '')
	{
		try {
			$this->argument_value = $argument;
			if (empty($argument)) {
				throw new \Exception("Argument not seted");
			} elseif (!empty($this->data[$argument]) && !empty($this->data[$argument]['content'])) {
				return $this->data[$argument]['content'];
			} else {
				return false;
			}
		} catch (\Exception $e) {
			echo '[' . __FUNCTION__ . ']: ' . $e->getMessage();
		}
	}

	/**
	 * @return string|null get value of the parameter selected in getParameter function
	 */
	public function getValue(): ?string
	{
		if (!empty($this->argument_value)) {
			return $this->data[$this->argument_value]['content'];
		}
	}
}
