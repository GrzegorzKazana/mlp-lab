import { DatasetService } from '@/features/data-loader/services/DatasetService.main';

const datasetService = new DatasetService();

export const backendRootService = {
  datasetService,
};

export type BackendRootService = typeof backendRootService;
