/**
 * The admin's navigation tree, grouped by department.
 *
 * Every entry names the permission module it belongs to, which is what the sidebar filters on and
 * what the middleware would check by URL prefix in the real build.
 */

export interface NavItem {
  key: string;
  label: string;
  /** Permission module. Defaults to the key. */
  perm?: string;
  badge?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  /** 24x24 stroke path. */
  icon: string;
  items: NavItem[];
}

const I = {
  home: 'M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z',
  commerce: 'M6 7h12l-1 12H7zM9 7V5a3 3 0 016 0v2',
  people: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 20c.7-3.2 3.1-5 6-5s5.3 1.8 6 5M16 4.3a3.5 3.5 0 010 6.4M18 15.2c1.6.7 2.6 2.3 3 4.8',
  growth: 'M4 18l5-6 4 3 6-8M19 6h2v2',
  ops: 'M3 20h18M5 20V10l5 3v-3l5 3v-3l4 2.5V20',
  workspace: 'M9 4h6v3H9zM7 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1M8.5 13.5l2 2 4-4',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1v.3a2 2 0 11-4 0v-.2a1.6 1.6 0 00-2.8-1.1l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003.5 15a2 2 0 110-4h.2a1.6 1.6 0 001.1-2.8l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0011 4.5V4a2 2 0 114 0v.2a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 001.1 2.7h.3a2 2 0 110 4h-.2a1.6 1.6 0 00-1.3 1z',
};

export const DASHBOARD: NavItem = { key: 'dashboard', label: 'Dashboard', perm: '__always' };

export const GROUPS: NavGroup[] = [
  {
    key: 'commerce',
    label: 'Commerce',
    icon: I.commerce,
    items: [
      { key: 'orders', label: 'Orders', badge: 'toFulfill' },
      { key: 'drafts', label: 'Draft orders' },
      { key: 'products', label: 'Products' },
      { key: 'customers', label: 'Customers' },
      { key: 'groups', label: 'Groups & price sheets' },
      { key: 'discounts', label: 'Discounts & sales' },
      { key: 'affiliates', label: 'Affiliates' },
    ],
  },
  {
    key: 'relationships',
    label: 'Relationships',
    icon: I.people,
    items: [
      { key: 'inbox', label: 'Support inbox', badge: 'needsHuman' },
      { key: 'leads', label: 'Pipeline' },
      { key: 'contacts', label: 'Contacts & companies' },
      { key: 'territories', label: 'Territories' },
      { key: 'loyalty', label: 'Loyalty & rewards' },
      { key: 'events', label: 'Events & tickets' },
    ],
  },
  {
    key: 'growth',
    label: 'Growth',
    icon: I.growth,
    items: [
      { key: 'marketing', label: 'Marketing' },
      { key: 'email', label: 'Email & SMS' },
      { key: 'web_analytics', label: 'Website analytics' },
      { key: 'sales_analytics', label: 'Sales analytics' },
      { key: 'content', label: 'Content & blog' },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    icon: I.ops,
    items: [
      { key: 'inventory', label: 'Inventory', badge: 'lowStock' },
      { key: 'purchasing', label: 'Purchasing' },
      { key: 'production', label: 'Production' },
      { key: 'service', label: 'Field service' },
    ],
  },
  {
    key: 'workspace',
    label: 'Workspace',
    icon: I.workspace,
    items: [
      { key: 'tickets', label: 'Tickets', badge: 'openTickets' },
      { key: 'projects', label: 'Projects' },
      { key: 'calendar', label: 'Calendar' },
      { key: 'goals', label: 'Goals & KPIs' },
      { key: 'timeclock', label: 'Time clock' },
      { key: 'teams', label: 'Teams' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: I.settings,
    items: [
      { key: 'settings', label: 'All settings' },
      { key: 'staff', label: 'Staff & roles' },
      { key: 'integrations', label: 'Integrations' },
      { key: 'styleguide', label: 'Style guide' },
    ],
  },
];

export const ICONS = I;

/** Flat list of every routable view, for the command palette and the router. */
export const ALL_ITEMS: { key: string; label: string; group: string; perm: string }[] = [
  { key: DASHBOARD.key, label: DASHBOARD.label, group: 'Overview', perm: '__always' },
  ...GROUPS.flatMap((g) =>
    g.items.map((i) => ({ key: i.key, label: i.label, group: g.label, perm: i.perm ?? i.key }))
  ),
];
