import academicData from './data/academic.json';
import abusedData from './data/abused.json';
import stoplistData from './data/stoplist.json';

export const academicDomains: ReadonlySet<string> = new Set(academicData);
export const abusedDomains: ReadonlySet<string> = new Set(abusedData);
export const stoplistDomains: ReadonlySet<string> = new Set(stoplistData);

function walkUp(domain: string, set: ReadonlySet<string>): boolean {
	const parts = domain.toLowerCase().split('.');
	for (let i = 0; i < parts.length - 1; i++) {
		if (set.has(parts.slice(i).join('.'))) return true;
	}
	return false;
}

export function isAcademic(domain: string): boolean {
	return walkUp(domain, academicDomains) && !walkUp(domain, stoplistDomains);
}

export function isAbused(domain: string): boolean {
	return walkUp(domain, abusedDomains);
}
