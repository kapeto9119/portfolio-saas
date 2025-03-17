import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { 
  ArrowRight, 
  Briefcase, 
  Code, 
  GraduationCap, 
  User, 
  Settings, 
  Palette, 
  Star,
  CheckCircle2,
  Users,
  Trophy,
  Sparkles,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HeroPreview } from '@/components/ui/hero-preview';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { GridPattern } from '@/components/ui/grid-pattern';

// Testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "/images/testimonials/sarah.jpg",
    content: "This platform helped me create a stunning portfolio that landed me my dream job. The AI-powered features are game-changing!"
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    company: "Apple",
    image: "/images/testimonials/michael.jpg",
    content: "The customization options are incredible. I was able to perfectly match my portfolio to my personal brand."
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Developer",
    company: "Microsoft",
    image: "/images/testimonials/emily.jpg",
    content: "The real-time preview feature saved me so much time. It's like having a personal portfolio assistant!"
  }
];

// FAQ data
const faqs = [
  {
    question: "How long does it take to create a portfolio?",
    answer: "You can create a basic portfolio in less than 5 minutes! Our intuitive interface and AI-powered features help you get started quickly. You can then customize and enhance your portfolio at your own pace."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes! You can either use our free subdomain (yourname.portfoliosaas.com) or connect your own custom domain. We provide easy-to-follow instructions for domain setup."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and security practices to protect your data. Your information is backed up regularly and stored securely."
  },
  {
    question: "Can I export my portfolio?",
    answer: "Yes, you can export your portfolio data at any time. We believe in data portability and making sure you're always in control of your information."
  }
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/70 text-white py-24 overflow-hidden">
        <GridPattern />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20">
                  ✨ Launching Soon: AI Portfolio Assistant
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Create a Portfolio That
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  Gets You Noticed
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Stand out with a professional portfolio website that showcases your best work. Built for developers, designers, and creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <ButtonLink href="/dashboard" size="lg" variant="secondary" className="flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="/auth/register" size="lg" variant="secondary" className="flex items-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </ButtonLink>
                    <ButtonLink href="/auth/login" size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white">
                      Sign In
                    </ButtonLink>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={`/images/avatars/user${i}.jpg`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-blue-100">
                  Joined by 10,000+ professionals
                </p>
              </div>
            </div>
            <div className="relative lg:block">
              <div className="relative w-full aspect-square">
                <HeroPreview className="transform rotate-1 scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Portfolios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground">
              Our platform provides all the tools and features you need to create a professional portfolio that stands out.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="h-6 w-6 text-primary" />,
                title: "Work Experience",
                description: "Showcase your professional journey with detailed work experience entries and achievements."
              },
              {
                icon: <Code className="h-6 w-6 text-primary" />,
                title: "Projects & Skills",
                description: "Display your projects with live demos and highlight your technical skills with proficiency levels."
              },
              {
                icon: <GraduationCap className="h-6 w-6 text-primary" />,
                title: "Education",
                description: "Highlight your educational background, certifications, and academic achievements."
              },
              {
                icon: <Sparkles className="h-6 w-6 text-primary" />,
                title: "AI-Powered Content",
                description: "Generate professional bios and project descriptions with our AI assistant."
              },
              {
                icon: <Palette className="h-6 w-6 text-primary" />,
                title: "Custom Themes",
                description: "Choose from beautiful themes or create your own with our visual customizer."
              },
              {
                icon: <Trophy className="h-6 w-6 text-primary" />,
                title: "SEO Optimization",
                description: "Get discovered by recruiters with our built-in SEO tools and analytics."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative bg-card hover:bg-accent rounded-lg p-6 shadow-sm border transition-colors duration-300"
              >
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Professionals</h2>
            <p className="text-xl text-muted-foreground">
              See what others are saying about their experience with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={i}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                imageSrc={testimonial.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Showcase Your Work?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who use our platform to advance their careers.
            Get started for free, no credit card required.
          </p>
          {session ? (
            <ButtonLink href="/dashboard" size="lg" variant="secondary" className="flex items-center mx-auto">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonLink>
          ) : (
            <ButtonLink href="/auth/register" size="lg" variant="secondary" className="flex items-center mx-auto">
              Create Your Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonLink>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <h3 className="font-semibold text-lg mb-4">Portfolio SaaS</h3>
              <p className="text-muted-foreground mb-4">
                Create a professional portfolio website in minutes. Showcase your work, get hired, and grow your career.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/customers" className="text-muted-foreground hover:text-foreground">
                    Customers
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Portfolio SaaS. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}