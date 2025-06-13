// Script to update browserslist database
import { execSync } from 'child_process';

try {
  console.log('Updating browserslist database...');
  execSync('npx update-browserslist-db@latest', { stdio: 'inherit' });
  console.log('Browserslist database updated successfully!');
} catch (error) {
  console.error('Error updating browserslist database:', error.message);
  process.exit(1);
}