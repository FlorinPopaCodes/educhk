import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SWOT_REPO = 'https://github.com/JetBrains/swot.git';
const SWOT_DIR = join(__dirname, '..', '.swot-clone');
const OUTPUT_DIR = join(__dirname, '..', 'packages', 'educhk', 'src', 'data');

function cloneOrPull() {
	if (existsSync(join(SWOT_DIR, '.git'))) {
		console.log('Pulling latest swot data...');
		execFileSync('git', ['pull', '--ff-only'], { cwd: SWOT_DIR, stdio: 'inherit' });
	} else {
		console.log('Cloning swot repository...');
		execFileSync('git', ['clone', '--depth', '1', SWOT_REPO, SWOT_DIR], { stdio: 'inherit' });
	}
}

function walkDomainFiles(dir: string, parts: string[] = []): string[] {
	const domains: string[] = [];
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			domains.push(...walkDomainFiles(fullPath, [...parts, entry.name]));
		} else if (entry.name.endsWith('.txt')) {
			const name = entry.name.replace(/\.txt$/, '');
			const domain = [...parts, name].reverse().join('.');
			domains.push(domain);
		}
	}

	return domains;
}

function readFlatList(filePath: string): string[] {
	if (!existsSync(filePath)) return [];
	return readFileSync(filePath, 'utf8')
		.split('\n')
		.map((line) => line.trim().toLowerCase())
		.filter((line) => line && !line.startsWith('#'));
}

function main() {
	cloneOrPull();

	const domainsDir = join(SWOT_DIR, 'lib', 'domains');

	// Read stoplist and abused flat files
	const stoplistDomains = readFlatList(join(domainsDir, 'stoplist.txt'));
	const abusedDomains = readFlatList(join(domainsDir, 'abused.txt'));
	const stoplistSet = new Set(stoplistDomains);
	const abusedSet = new Set(abusedDomains);

	// Walk the directory tree for academic domains, excluding special flat files
	const allDomains = walkDomainFiles(domainsDir);

	// Filter: academic domains are those NOT in stoplist or abused
	const academicDomains = allDomains.filter((d) => !stoplistSet.has(d) && !abusedSet.has(d));

	// Sort for deterministic output
	academicDomains.sort();
	stoplistDomains.sort();
	abusedDomains.sort();

	// Write output
	mkdirSync(OUTPUT_DIR, { recursive: true });
	writeFileSync(join(OUTPUT_DIR, 'academic.json'), JSON.stringify(academicDomains));
	writeFileSync(join(OUTPUT_DIR, 'abused.json'), JSON.stringify(abusedDomains));
	writeFileSync(join(OUTPUT_DIR, 'stoplist.json'), JSON.stringify(stoplistDomains));

	console.log(`\nGenerated:`);
	console.log(`  academic.json: ${academicDomains.length} domains`);
	console.log(`  abused.json:   ${abusedDomains.length} domains`);
	console.log(`  stoplist.json: ${stoplistDomains.length} domains`);
}

main();
