import { z } from 'zod';

export const enquiryFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().optional(),
  phone: z.string().min(10, 'Please enter a valid phone number with country code'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.enum(['retail', 'wholesale', 'restaurant', 'household', 'farmer', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const productCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().min(5, 'Short description is required'),
  full_description: z.string().optional(),
  image_url: z.string().min(1, 'Category image is required'),
  image_public_id: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

export const productItemSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(5, 'Description is required'),
  image_url: z.string().min(1, 'Image is required'),
  image_public_id: z.string().optional(),
  unit: z.string().default('1 kg'),
  price_text: z.string().optional(),
  in_stock: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role / Designation is required'),
  location: z.string().min(2, 'Location is required'),
  quote: z.string().min(10, 'Testimonial quote must be at least 10 characters'),
  avatar_url: z.string().min(1, 'Avatar image is required'),
  avatar_public_id: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

export const farmVideoSchema = z.object({
  title: z.string().min(2, 'Video title is required'),
  duration: z.string().min(2, 'Duration is required (e.g. 0:45)'),
  video_url: z.string().url('Must be a valid URL'),
  thumbnail_url: z.string().min(1, 'Thumbnail is required'),
  thumbnail_public_id: z.string().optional(),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

export const statisticSchema = z.object({
  number_value: z.string().min(1, 'Number value is required (e.g. 500+)'),
  label: z.string().min(2, 'Label is required'),
  sublabel: z.string().min(2, 'Sublabel is required'),
  icon_name: z.string().default('users'),
  icon_url: z.string().optional(),
  icon_public_id: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});
