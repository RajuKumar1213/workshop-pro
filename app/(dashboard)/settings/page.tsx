import Link from "next/link";
import { ChevronRight, Database, Settings2, Image, Layers } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <PageHeader 
        title="Settings" 
        description="Manage your system configurations and masters."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/settings/product-categories" className="group flex items-center p-4 bg-surface border border-outline-variant rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-primary group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">Product Categories</h3>
            <p className="text-sm text-muted-foreground">Manage the master list of product categories.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link href="/settings/design-templates" className="group flex items-center p-4 bg-surface border border-outline-variant rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-primary group-hover:scale-110 transition-transform">
            <Image className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">Design Templates</h3>
            <p className="text-sm text-muted-foreground">Configure design templates and images for categories.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link href="/settings/materials" className="group flex items-center p-4 bg-surface border border-outline-variant rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-primary group-hover:scale-110 transition-transform">
            <Settings2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">Material Specs</h3>
            <p className="text-sm text-muted-foreground">Manage the list of available materials for products.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
