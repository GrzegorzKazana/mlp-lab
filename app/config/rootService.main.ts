import DataLoadingService from '@/features/data-loader/services/DataLoadingService.main';

const dataLoadingService = new DataLoadingService();

export const backendRootService = {
  dataLoadingService,
};

export type BackendRootService = typeof backendRootService;
