
export function repCssMin(content: string): string[] {
	const result: string[] = [];
	let data = content
		.replace(/\/\*.*/g, '')
		.replace(/\*\s.*/g, '')
		.replace(/\*\//g, '')
		.replace(/{.*?}/g, '')
		.replace(/\[.*?\]/g, '')
		.replace(/:[:a-z-A-Z\(]+.*?\)/g, '')
		.replace(/[>+]+/g, '')
		.match(/\.[\w+-]+/g);

	if (Array.isArray(data)) {
		let newdata = data.map(d => d.substr(1)).filter(d => isNaN(parseInt(d.charAt(0))))
		newdata.sort();
		result.push(...new Set(newdata))
	}
	return result;
}

