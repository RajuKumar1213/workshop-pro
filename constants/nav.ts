import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Factory,
  FileText,
  ImageIcon,
  BarChart3,
  Clock,
  UserCog,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';
import { PERMISSIONS } from './permissions';
import type { PermissionKey } from './permissions';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: PermissionKey;
  badge?: string;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        label: 'Customers',
        href: ROUTES.CUSTOMERS,
        icon: Users,
        // requiredPermission: PERMISSIONS.CUSTOMERS.VIEW,
      },
      {
        label: 'Orders',
        href: ROUTES.ORDERS,
        icon: ClipboardList,
        // requiredPermission: PERMISSIONS.ORDERS.VIEW,
      },
      {
        label: 'New Order',
        href: '/orders/new',
        icon: ClipboardList,
      },
      {
        label: 'Production',
        href: ROUTES.PRODUCTION,
        icon: Factory,
        // requiredPermission: PERMISSIONS.PRODUCTION.VIEW,
      },
      {
        label: 'Invoices',
        href: ROUTES.INVOICES,
        icon: FileText,
        // requiredPermission: PERMISSIONS.INVOICES.VIEW,
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        label: 'Gallery',
        href: ROUTES.GALLERY,
        icon: ImageIcon,
        requiredPermission: PERMISSIONS.GALLERY.VIEW,
      },
      {
        label: 'Reports',
        href: ROUTES.REPORTS,
        icon: BarChart3,
        requiredPermission: PERMISSIONS.REPORTS.VIEW,
      },
      {
        label: 'Attendance',
        href: ROUTES.ATTENDANCE,
        icon: Clock,
        requiredPermission: PERMISSIONS.ATTENDANCE.VIEW,
      },
      {
        label: 'Staff',
        href: ROUTES.STAFF,
        icon: UserCog,
        requiredPermission: PERMISSIONS.STAFF.VIEW,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        href: ROUTES.SETTINGS,
        icon: Settings,
        requiredPermission: PERMISSIONS.SETTINGS.VIEW,
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
