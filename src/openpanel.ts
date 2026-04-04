import { OpenPanel } from '@openpanel/web'

export const op = new OpenPanel({
  apiUrl: 'https://api.panel.apoena.dev',
  clientId: '00b205e9-2993-4124-9290-bb45851f5967',
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true
})
