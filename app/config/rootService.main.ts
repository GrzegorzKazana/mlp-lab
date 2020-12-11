import DataLoadingService from '@/features/data-loader/services/DataLoadingService.main';
import ModelService from '@/features/model-trainer/services/ModelService.main';

const dataLoadingService = new DataLoadingService();
const modelService = new ModelService();

export const backendRootService = {
  dataLoadingService,
  modelService,
};

export type BackendRootService = typeof backendRootService;
