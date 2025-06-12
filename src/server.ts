import express, {Request, Response} from 'express';
import {
  URL,
  generate as configGenerateDefault,
  healthLevel as configHealthLevelDefault,
  defaultFormData,
} from './config';
import {createSession} from './session';
import {FormData, HealthLevel} from './types';
import {runMedicalForm} from './workflows/medical-form';

const app = express();

app.use(express.json());

app.post('/workflow/medical-form', async (req: Request, res: Response) => {
  try {
    const {generate, healthLevel, ...formDataFromRequest} = req.body;

    const effectiveGenerate: boolean =
      typeof generate === 'boolean' ? generate : configGenerateDefault;

    let effectiveHealthLevel: HealthLevel = configHealthLevelDefault;
    if (healthLevel && HealthLevel[healthLevel as keyof typeof HealthLevel]) {
      effectiveHealthLevel =
        HealthLevel[healthLevel as keyof typeof HealthLevel];
    } else if (healthLevel !== undefined) {
      console.warn(
        `API: Invalid healthLevel '${healthLevel}' received. Using default: ${configHealthLevelDefault}`,
      );
    }

    const formData: FormData = {...defaultFormData, ...formDataFromRequest};

    console.log('API: Received request to run medical form workflow.');
    console.log('API: Effective FormData:', formData);
    console.log(`API: Effective generate: ${effectiveGenerate}`);
    console.log(`API: Effective healthLevel: ${effectiveHealthLevel}`);

    const {browser, page} = await createSession(URL);
    console.log('API: Browser session created.');

    await runMedicalForm(
      page,
      formData,
      effectiveGenerate,
      effectiveHealthLevel,
    );
    console.log('API: Medical form workflow completed.');

    await browser.close();
    console.log('API: Browser session closed.');

    res
      .status(200)
      .json({message: 'Medical form workflow completed successfully.'});
  } catch (error) {
    console.error('API: Error running medical form workflow:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({
        message: 'Error running medical form workflow.',
        error: errorMessage,
      });
  }
});

export default app;
