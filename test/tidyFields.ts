export function tidyFields(obj: any, fieldList: string[]) {
	for (let key in obj) {
		if (!fieldList.includes(key)) {
			delete obj[key];
		}
		if (Array.isArray(obj[key])) {
			for (let child of obj[key]) {
				tidyFields(child, fieldList);
			}
		} else if (typeof obj[key] === "object") {
			tidyFields(obj[key], fieldList);
		}
	}
	return obj;
}
