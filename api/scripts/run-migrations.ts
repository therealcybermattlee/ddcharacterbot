/**
 * Migration Runner Script
 *
 * Executes database migrations using the migration system
 *
 * Usage:
 *   npx tsx scripts/run-migrations.ts --env development
 *   npx tsx scripts/run-migrations.ts --env production --validate
 *   npx tsx scripts/run-migrations.ts --env development --status
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { Migration } from '../src/db';

// Parse command line arguments
const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const environment = envIndex !== -1 ? args[envIndex + 1] : 'development';
const validateOnly = args.includes('--validate');
const statusOnly = args.includes('--status');

// Environment to database ID mapping
const DATABASE_IDS: Record<string, string> = {
  development: '875afef7-f88b-464f-9242-d804f8f3c47d',
  staging: 'ca591138-e49e-444a-adbd-42ba624e8366',
  production: '00ae6e9f-afee-446e-b53f-818f2fc0feb3',
};

async function loadMigrations(): Promise<Migration[]> {
  const migrationsDir = join(__dirname, '../../database/migrations');
  const files = await readdir(migrationsDir);

  // Filter for SQL files and sort numerically
  const sqlFiles = files
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => {
      // Extract numeric prefix (001, 0001, 002, etc.)
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
      return numA - numB;
    });

  const migrations: Migration[] = [];

  for (const file of sqlFiles) {
    const filePath = join(migrationsDir, file);
    const content = await readFile(filePath, 'utf-8');

    // Extract migration ID and name from filename
    const match = file.match(/^(\d+)_(.+)\.sql$/);
    if (!match) {
      console.warn(`Skipping invalid migration file: ${file}`);
      continue;
    }

    const [, id, name] = match;

    migrations.push({
      id: id.padStart(4, '0'), // Normalize to 4 digits (0001, 0002, etc.)
      name: name.replace(/_/g, ' '),
      sql: content,
    });
  }

  return migrations;
}

async function runMigrationsWithWrangler() {
  try {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║         D&D Character Manager - Migration Runner         ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`Environment: ${environment}`);
    console.log(`Database ID: ${DATABASE_IDS[environment]}`);
    console.log('');

    // Load migrations from filesystem
    const migrations = await loadMigrations();

    console.log(`Found ${migrations.length} migration(s):`);
    migrations.forEach((m) => {
      console.log(`  • ${m.id}: ${m.name}`);
    });
    console.log('');

    if (statusOnly) {
      console.log('Status check mode - would query migration status');
      console.log('(Status check requires runtime access to D1)');
      return;
    }

    if (validateOnly) {
      console.log('Validation mode - checking migration integrity');
      console.log('(Validation requires runtime access to D1)');
      return;
    }

    // In a real implementation, we would use wrangler to execute migrations
    // For now, provide instructions
    console.log('To apply migrations manually, run:');
    console.log('');

    for (const migration of migrations) {
      const fileName = `${migration.id}_${migration.name.replace(/ /g, '_')}.sql`;
      console.log(
        `npx wrangler d1 execute dnd-character-manager-${environment === 'production' ? 'prod' : environment === 'staging' ? 'staging' : 'dev'} \\`
      );
      console.log(`  --file=database/migrations/${fileName}`);
      console.log('');
    }

    console.log('Or apply all at once:');
    console.log('');
    console.log(`cd api`);
    migrations.forEach((migration) => {
      const fileName = `${migration.id}_${migration.name.replace(/ /g, '_')}.sql`;
      console.log(
        `npx wrangler d1 execute dnd-character-manager-${environment === 'production' ? 'prod' : environment === 'staging' ? 'staging' : 'dev'} --file=../database/migrations/${fileName} && \\`
      );
    });
    console.log(`echo "All migrations applied"`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Execute
runMigrationsWithWrangler().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
