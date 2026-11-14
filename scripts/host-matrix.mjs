// 把开发依赖对齐到指定宿主版本，供 CI 矩阵在隔离版本上跑同一份源码。
// CI 工作区用完即弃，因此直接改写 package.json，不需要还原。
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!/^0\.2\.[0-9]+-(?:rc|alpha)\.[0-9]+$/.test(version ?? '')) {
  throw new Error(`需要精确的宿主版本（例如 0.2.2-rc.3），实际收到：${version}`);
}

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

// 每个宿主代际配套的 Cordis 与 Schemastery 版本，不能一律钉最新稳定版。
const toolchain = version.startsWith('0.2.0-')
  ? { cordis: '4.0.4', schemastery: '3.18.4' }
  : version.startsWith('0.2.1-')
    ? { cordis: '4.0.5', schemastery: '3.18.5' }
    : { cordis: '4.1.0', schemastery: '3.19.0' };

// dsh-error 自 0.2.2-rc.2 才发布，更早代际保留 package.json 里钉的版本。
const errorAvailable = !(version.startsWith('0.2.0-') || version.startsWith('0.2.1-') || version === '0.2.2-rc.1');

const dev = manifest.devDependencies ?? {};
const aligned = [];
for (const name of Object.keys(dev)) {
  if (!name.startsWith('@deepseek-ai/dsh')) continue;
  if (name === '@deepseek-ai/dsh-error' && !errorAvailable) continue;
  dev[name] = version;
  aligned.push(name);
}
if (aligned.length === 0) throw new Error('package.json 里没有 @deepseek-ai/dsh* 开发依赖可对齐');
if ('@deepseek-ai/cordis' in dev) dev['@deepseek-ai/cordis'] = toolchain.cordis;
if ('@deepseek-ai/schemastery' in dev) dev['@deepseek-ai/schemastery'] = toolchain.schemastery;

// overrides 里钉住的工具链版本必须一起对齐，否则安装会以 EOVERRIDE 拒绝。
if (manifest.overrides) {
  if ('@deepseek-ai/cordis' in manifest.overrides) manifest.overrides['@deepseek-ai/cordis'] = toolchain.cordis;
  if ('@deepseek-ai/schemastery' in manifest.overrides) manifest.overrides['@deepseek-ai/schemastery'] = toolchain.schemastery;
}

manifest.devDependencies = dev;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `已对齐 ${aligned.length} 个开发依赖到 DSH ${version}（Cordis ${toolchain.cordis} / Schemastery ${toolchain.schemastery}）`,
);
