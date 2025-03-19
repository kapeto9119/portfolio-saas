import { redirect } from 'next/navigation';

export default function ProfileIndexPage() {
  // Redirect to home page if someone visits /profile directly
  redirect('/');
} 