import { Router } from 'express';
import { getLearnerState } from './learnerStateService';

export const learnerStateRouter = Router();

learnerStateRouter.get('/:learnerId', async (req, res) => {
  try {
    const state = await getLearnerState(req.params.learnerId);

    if (!state) {
      return res.status(404).json({
        error: 'Learner not found',
      });
    }

    return res.json(state);
  } catch (error) {
    console.error('[API] Failed to load learner state:', error);

    return res.status(500).json({
      error: 'Failed to load learner state',
    });
  }
});
