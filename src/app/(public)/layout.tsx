import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getSiteSettings } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header businessName={settings.businessName} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer
        businessName={settings.businessName}
        phone={settings.phone}
        email={settings.email}
        serviceArea={settings.serviceArea || "Lansdale, PA and surrounding areas"}
        hours={settings.hours || "Always open"}
        facebookUrl={settings.facebookUrl}
        instagramUrl={settings.instagramUrl}
      />
    </div>
  );
}
