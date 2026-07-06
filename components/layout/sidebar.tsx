"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card px-3 py-4">
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Workshop Pro
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {NAV_SECTIONS.map((section, index) => {
            // Filter items based on permissions
            const visibleItems = section.items.filter(
              (item) => !item.requiredPermission || can(item.requiredPermission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={index} className="flex flex-col gap-1">
                {section.label && (
                  <h4 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </h4>
                )}
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "justify-start",
                        isActive ? "bg-secondary font-medium" : "text-muted-foreground font-normal"
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
