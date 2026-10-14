/**
 * Roles and permissions for the sample admin.
 *
 * Planned tables: departments, roles, role_permissions, user_overrides, staff_users.
 * Levels are 0 none, 1 view, 2 edit, 3 manage. The demo resolves them in the browser so the
 * presenter can switch roles instantly; the real build checks the same matrix on the server for
 * every read and every write, and hidden buttons are never the only guard.
 */

export type Level = 0 | 1 | 2 | 3;

export const LEVELS: Record<Level, string> = {
  0: 'No access',
  1: 'View',
  2: 'Edit',
  3: 'Manage',
};

/** Actions checked on their own, over and above the module level. */
export const SENSITIVE = [
  'refunds',
  'pricing',
  'approve_applications',
  'send_campaigns',
  'discounts',
  'approve_samples',
  'export_data',
] as const;

export type Sensitive = (typeof SENSITIVE)[number];

export interface Role {
  key: string;
  name: string;
  department: string;
  admin?: boolean;
  /** Module key to level. '*' is the fallback for anything not listed. */
  perms: Record<string, Level>;
  sensitive: Sensitive[];
  /** Who the presenter is while this role is selected. */
  person: { name: string; initials: string; title: string };
}

export const ROLES: Role[] = [
  {
    key: 'super',
    name: 'Super Admin',
    department: 'Leadership',
    admin: true,
    perms: { '*': 3 },
    sensitive: [...SENSITIVE],
    person: { name: 'Dana Whitfield', initials: 'DW', title: 'Operations Director' },
  },
  {
    key: 'sales_manager',
    name: 'Sales Manager',
    department: 'Sales',
    admin: true,
    perms: {
      '*': 0,
      orders: 3,
      drafts: 3,
      products: 1,
      customers: 3,
      groups: 3,
      discounts: 2,
      affiliates: 2,
      inbox: 2,
      leads: 3,
      contacts: 3,
      territories: 3,
      loyalty: 2,
      events: 1,
      sales_analytics: 2,
      tickets: 2,
      projects: 1,
      calendar: 2,
      goals: 2,
      timeclock: 1,
      chat: 2,
      teams: 3,
      staff: 1,
    },
    sensitive: ['pricing', 'approve_samples', 'approve_applications', 'export_data', 'discounts'],
    person: { name: 'Marcus Oyelaran', initials: 'MO', title: 'Sales Manager' },
  },
  {
    key: 'sales_rep',
    name: 'Sales Rep',
    department: 'Sales',
    perms: {
      '*': 0,
      orders: 1,
      drafts: 2,
      products: 1,
      customers: 2,
      groups: 1,
      leads: 2,
      contacts: 2,
      territories: 1,
      inbox: 2,
      loyalty: 1,
      sales_analytics: 1,
      tickets: 2,
      calendar: 2,
      goals: 1,
      timeclock: 1,
      chat: 2,
    },
    sensitive: [],
    person: { name: 'Priya Raman', initials: 'PR', title: 'Account Executive' },
  },
  {
    key: 'support',
    name: 'Customer Support',
    department: 'Sales',
    perms: {
      '*': 0,
      orders: 2,
      products: 1,
      customers: 2,
      inbox: 3,
      contacts: 2,
      loyalty: 2,
      events: 1,
      tickets: 2,
      calendar: 1,
      timeclock: 1,
      chat: 2,
    },
    sensitive: ['refunds'],
    person: { name: 'Tomás Herrera', initials: 'TH', title: 'Support Specialist' },
  },
  {
    key: 'plant_manager',
    name: 'Plant Manager',
    department: 'Production',
    admin: true,
    perms: {
      '*': 0,
      orders: 1,
      products: 2,
      inventory: 3,
      purchasing: 3,
      production: 3,
      service: 1,
      tickets: 3,
      projects: 2,
      calendar: 2,
      goals: 2,
      timeclock: 3,
      chat: 2,
      teams: 3,
      staff: 1,
    },
    sensitive: ['export_data'],
    person: { name: 'Alice Nowak', initials: 'AN', title: 'Plant Manager' },
  },
  {
    key: 'production',
    name: 'Production',
    department: 'Production',
    perms: {
      '*': 0,
      inventory: 1,
      production: 2,
      purchasing: 1,
      tickets: 2,
      calendar: 1,
      timeclock: 2,
      chat: 2,
    },
    sensitive: [],
    person: { name: 'Jonas Beck', initials: 'JB', title: 'Production Associate' },
  },
  {
    key: 'marketing_head',
    name: 'Marketing Head',
    department: 'Marketing',
    admin: true,
    perms: {
      '*': 0,
      orders: 1,
      products: 2,
      customers: 1,
      discounts: 3,
      affiliates: 3,
      loyalty: 2,
      events: 3,
      marketing: 3,
      email: 3,
      web_analytics: 3,
      sales_analytics: 2,
      content: 3,
      tickets: 2,
      projects: 2,
      calendar: 2,
      goals: 2,
      timeclock: 1,
      chat: 2,
      teams: 3,
    },
    sensitive: ['send_campaigns', 'discounts', 'export_data'],
    person: { name: 'Elise Tran', initials: 'ET', title: 'Head of Growth' },
  },
  {
    key: 'technician',
    name: 'Technician',
    department: 'Service',
    perms: {
      '*': 0,
      service: 2,
      inventory: 1,
      customers: 1,
      calendar: 2,
      tickets: 2,
      timeclock: 2,
      chat: 2,
    },
    sensitive: [],
    person: { name: 'Ray Okonkwo', initials: 'RO', title: 'Field Technician' },
  },
];

export const levelFor = (role: Role, moduleKey: string): Level =>
  role.perms[moduleKey] ?? role.perms['*'] ?? 0;
