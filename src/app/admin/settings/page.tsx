import { getSiteSettings, getServices } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";
import { ServicesManager } from "@/components/admin/services-manager";

export default async function SettingsPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="mt-1 text-[#CFCFCF]">
          Manage your website content and configuration
        </p>
      </div>

      <div className="space-y-8">
        <SettingsForm settings={settings} />
        <ServicesManager services={services} />
      </div>
    </div>
  );
}
