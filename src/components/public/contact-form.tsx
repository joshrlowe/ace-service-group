"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/app/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        if (result.errors) {
          setErrors(result.errors);
          toast.error("Please fix the errors below");
        } else {
          toast.error(result.message || "Failed to send message");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            error={errors.name}
            disabled={isSubmitting}
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
            placeholder="your@email.com"
            required
            error={errors.email}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            error={errors.phone}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="How can we help?"
            error={errors.subject}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          rows={5}
          required
          error={errors.message}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <p className="text-sm text-gray-500">
        By submitting this form, you agree to be contacted about your inquiry.
      </p>
    </form>
  );
}
