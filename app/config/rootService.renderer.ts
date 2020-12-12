import { ModelService } from '@/features/model-trainer/services/ModelService';

const modelService = new ModelService();

export const appRootService = { modelService };

export type AppRootService = typeof appRootService;
