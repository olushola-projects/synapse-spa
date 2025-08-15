import { MONITORING_CONSTANTS } from '@/utils/constants';

export function getHealthColor(health: string): string {
  switch (health.toLowerCase()) {
    case 'healthy':
      return 'text-green-500';
    case 'degraded':
      return 'text-yellow-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getHealthIconProps(
  health: string,
  iconSize = `h-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX}`
): { className: string } {
  const color = getHealthColor(health);
  return { className: `${iconSize} ${color}` };
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
