import * as commerce from './views-commerce';
import * as rel from './views-relationships';
import * as growth from './views-growth';
import * as ops from './views-ops';
import * as work from './views-workspace';
import * as settings from './views-settings';

/** viewKey -> rendered HTML. Keys match nav.ts, which is what the router switches on. */
export const VIEWS: Record<string, () => string> = {
  dashboard: commerce.dashboard,

  orders: commerce.ordersView,
  drafts: commerce.drafts,
  products: commerce.productsView,
  customers: commerce.customersView,
  groups: commerce.groups,
  discounts: commerce.discountsView,
  affiliates: commerce.affiliates,

  inbox: rel.inbox,
  leads: rel.pipeline,
  contacts: rel.contacts,
  territories: rel.territories,
  loyalty: rel.loyalty,
  events: rel.events,

  marketing: growth.marketing,
  email: growth.email,
  web_analytics: growth.webAnalytics,
  sales_analytics: growth.salesAnalytics,
  content: growth.content,

  inventory: ops.inventory,
  purchasing: ops.purchasing,
  production: ops.production,
  service: ops.service,

  tickets: work.ticketsView,
  projects: work.projectsView,
  calendar: work.calendar,
  goals: work.goalsView,
  timeclock: work.timeclock,
  teams: work.teams,

  settings: settings.settings,
  staff: settings.staff,
  integrations: settings.integrations,
  styleguide: settings.styleguide,
};
