export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'at_risk':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStageColor = (stage) => {
  switch (stage) {
    case 'planted':
      return 'text-purple-600';
    case 'growing':
      return 'text-blue-600';
    case 'ready':
      return 'text-yellow-600';
    case 'harvested':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};