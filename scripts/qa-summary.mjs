import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = join('test-results', 'visual-audit');
if (!existsSync(dir)) {
  console.error('A auditoria visual não gerou capturas. Verifique a execução do Playwright.');
  process.exit(1);
}
const results = readdirSync(dir).filter(file => file.endsWith('.json') && file !== 'summary.json')
  .map(file => JSON.parse(readFileSync(join(dir,file), 'utf8')))
  .sort((a,b) => a.screenshot.localeCompare(b.screenshot));
const count = results.length;
const failures = results.filter(result => !result.passed);
const lines = [
  '# Auditoria visual automática — Projeto_CRUD',
  '',
  '- Cenários fotografados: **' + count + '**',
  '- Cenários aprovados: **' + (count - failures.length) + '**',
  '- Cenários com ocorrências: **' + failures.length + '**',
  '',
  '| Resolução | Tela | Erros JS | HTTP local | Excesso horizontal (px) | Controles cortados | Resultado |',
  '|---|---|---:|---:|---:|---:|---|'
];
for(const item of results) {
  const http = item.errors.badResponses.filter(x => {
    try { return new URL(x.url).origin === new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4173').origin; }
    catch { return false; }
  }).length;
  lines.push('| ' + item.viewport.width + '×' + item.viewport.height +
    ' | ' + item.route + ' | ' + item.errors.pageErrors.length +
    ' | ' + http + ' | ' + item.layout.horizontalOverflow +
    ' | ' + item.layout.clippedControls.length + ' | ' + (item.passed ? 'OK' : 'FALHA') + ' |');
}
if (failures.length) lines.push('', '## Ocorrências', ...failures.map(i =>
  '- **' + i.screenshot + '**: ' + JSON.stringify({errors:i.errors, layout:i.layout}).slice(0,1000)));
const markdown = lines.join('\n')+'\n';
writeFileSync(join(dir, 'summary.md'), markdown);
writeFileSync(join(dir, 'summary.json'), JSON.stringify({ count, passed: count - failures.length, failed: failures.length, results }, null, 2));
console.log(markdown);
if (!count) process.exit(1);
if (failures.length) process.exitCode = 1;
