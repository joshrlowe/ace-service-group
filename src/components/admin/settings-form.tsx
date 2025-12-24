"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { updateSiteSettings } from "@/app/actions/settings";

interface SettingsFormProps {
  settings: {
    businessName: string;
    tagline: string | null;
    introText: string | null;
    phone: string;
    email: string;
    hours: string | null;
    serviceArea: string | null;
    address: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;
    youtubeUrl: string | null;
    heroHeadline: string;
    heroSubheadline: string | null;
    heroCta1Text: string | null;
    heroCta1Link: string | null;
    heroCta2Text: string | null;
    heroCta2Link: string | null;
    heroImageUrl: string | null;
    aboutHeadline: string | null;
    aboutContent: string | null;
    aboutImageUrl: string | null;
  };
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateSiteSettings(formData);

      if (result.success) {
        toast.success("Settings updated successfully");
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
          toast.error("Please fix the errors below");
        } else {
          toast.error(result.message || "Failed to update settings");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Business Information</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            Basic information about your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" required>
                Business Name
              </Label>
              <Input
                id="businessName"
                name="businessName"
                defaultValue={settings.businessName}
                error={errors.businessName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={settings.tagline || ""}
                error={errors.tagline}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="introText">Introduction Text</Label>
            <Textarea
              id="introText"
              name="introText"
              defaultValue={settings.introText || ""}
              rows={3}
              placeholder="Brief introduction for your business..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            How customers can reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" required>
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={settings.phone}
                error={errors.phone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
                error={errors.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Business Hours</Label>
              <Input
                id="hours"
                name="hours"
                defaultValue={settings.hours || ""}
                placeholder="e.g., Always open"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceArea">Service Area</Label>
              <Input
                id="serviceArea"
                name="serviceArea"
                defaultValue={settings.serviceArea || ""}
                placeholder="e.g., Lansdale, PA and surrounding areas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={settings.address || ""}
              placeholder="Street address (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Social Media Links</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            Links to your social media profiles (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={settings.facebookUrl || ""}
                placeholder="https://facebook.com/..."
                error={errors.facebookUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                defaultValue={settings.instagramUrl || ""}
                placeholder="https://instagram.com/..."
                error={errors.instagramUrl}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                defaultValue={settings.youtubeUrl || ""}
                placeholder="https://youtube.com/..."
                error={errors.youtubeUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                defaultValue={settings.linkedinUrl || ""}
                placeholder="https://linkedin.com/..."
                error={errors.linkedinUrl}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homepage Hero */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Homepage Hero</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            Customize your homepage hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroHeadline" required>
              Hero Headline
            </Label>
            <Input
              id="heroHeadline"
              name="heroHeadline"
              defaultValue={settings.heroHeadline}
              error={errors.heroHeadline}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubheadline">Hero Subheadline</Label>
            <Textarea
              id="heroSubheadline"
              name="heroSubheadline"
              defaultValue={settings.heroSubheadline || ""}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroCta1Text">Primary CTA Text</Label>
              <Input
                id="heroCta1Text"
                name="heroCta1Text"
                defaultValue={settings.heroCta1Text || ""}
                placeholder="e.g., Call Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCta1Link">Primary CTA Link</Label>
              <Input
                id="heroCta1Link"
                name="heroCta1Link"
                defaultValue={settings.heroCta1Link || ""}
                placeholder="e.g., tel:+12676405958"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroCta2Text">Secondary CTA Text</Label>
              <Input
                id="heroCta2Text"
                name="heroCta2Text"
                defaultValue={settings.heroCta2Text || ""}
                placeholder="e.g., Request a Quote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCta2Link">Secondary CTA Link</Label>
              <Input
                id="heroCta2Link"
                name="heroCta2Link"
                defaultValue={settings.heroCta2Link || ""}
                placeholder="e.g., /contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Page */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">About Page</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            Content for your About page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutHeadline">About Headline</Label>
            <Input
              id="aboutHeadline"
              name="aboutHeadline"
              defaultValue={settings.aboutHeadline || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutContent">About Content</Label>
            <Textarea
              id="aboutContent"
              name="aboutContent"
              defaultValue={settings.aboutContent || ""}
              rows={8}
              placeholder="Tell visitors about your business..."
            />
            <p className="text-xs text-[#CFCFCF]">
              Use line breaks to create paragraphs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
