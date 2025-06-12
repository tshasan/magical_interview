import cron from 'node-cron';
import { main } from './main';

console.log('Scheduler started. Workflow will run every 5 minutes.');

// Schedule to run main() every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled medical form workflow...');
  try {
    await main();
    console.log('Scheduled medical form workflow completed successfully.');
  } catch (error) {
    console.error('Error running scheduled medical form workflow:', error);
  }
});

// Keep the process alive (optional, depending on how you run it)
// process.stdin.resume(); 