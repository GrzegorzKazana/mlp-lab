const routes = {
  DATA: '/data',
  MODEL: '/model',
  TRAINING: '/training/:historyEntryId?',

  createTrainingHistoryEntryUrl: (historyEntryId = '') =>
    `/training/${historyEntryId}`,
};

export default routes;
