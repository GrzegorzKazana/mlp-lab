import { DatasetService } from '@/features/data-loader/services/DatasetService.main';

const dataLoadingService = new DatasetService();

export const backendRootService = {
  dataLoadingService,
};

export type BackendRootService = typeof backendRootService;
