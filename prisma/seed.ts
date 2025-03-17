import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create test user if doesn't exist
  const testEmail = 'test@example.com';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail }
  });
  
  let userId: string;
  
  if (!existingUser) {
    const hashedPassword = await hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testEmail,
        password: hashedPassword,
        job_title: 'Full Stack Developer',
        bio: 'Passionate developer with a focus on creating intuitive user experiences and scalable backends.',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
        website: 'https://example.com',
      }
    });
    
    userId = user.id;
    console.log(`Created test user with ID: ${userId}`);
  } else {
    userId = existingUser.id;
    console.log(`Using existing test user with ID: ${userId}`);
  }

  // Create portfolio if it doesn't exist
  const existingPortfolio = await prisma.portfolio.findFirst({
    where: { userId }
  });

  if (!existingPortfolio) {
    const portfolio = await prisma.portfolio.create({
      data: {
        slug: 'test-user',
        title: 'My Developer Portfolio',
        subtitle: 'Full Stack Developer',
        description: 'Showcasing my projects and skills in web development.',
        isPublished: true,
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        userId,
      }
    });
    
    console.log(`Created portfolio with ID: ${portfolio.id}`);
  } else {
    console.log(`Using existing portfolio with ID: ${existingPortfolio.id}`);
  }

  // Create skills if none exist
  const skillsCount = await prisma.skill.count({
    where: { userId }
  });

  if (skillsCount === 0) {
    const skills = await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', category: 'Frontend', proficiency: 90, order: 1, userId },
        { name: 'TypeScript', category: 'Frontend', proficiency: 85, order: 2, userId },
        { name: 'React', category: 'Frontend', proficiency: 90, order: 3, userId },
        { name: 'Next.js', category: 'Frontend', proficiency: 85, order: 4, userId },
        { name: 'Node.js', category: 'Backend', proficiency: 80, order: 1, userId },
        { name: 'Express', category: 'Backend', proficiency: 85, order: 2, userId },
        { name: 'PostgreSQL', category: 'Backend', proficiency: 75, order: 3, userId },
        { name: 'Prisma', category: 'Backend', proficiency: 80, order: 4, userId },
        { name: 'Docker', category: 'DevOps', proficiency: 70, order: 1, userId },
        { name: 'AWS', category: 'DevOps', proficiency: 65, order: 2, userId },
      ]
    });
    
    console.log(`Created ${skills.count} skills`);
  } else {
    console.log(`Using existing ${skillsCount} skills`);
  }

  // Create projects if none exist
  const projectsCount = await prisma.project.count({
    where: { userId }
  });

  if (projectsCount === 0) {
    const projects = await prisma.project.createMany({
      data: [
        {
          title: 'Portfolio Builder',
          description: 'A web application that helps professionals create and maintain their portfolios easily.',
          imageUrl: 'https://picsum.photos/seed/portfolio/800/600',
          liveUrl: 'https://example.com/portfolio',
          repoUrl: 'https://github.com/example/portfolio',
          technologies: ['React', 'Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
          isFeatured: true,
          order: 1,
          userId,
        },
        {
          title: 'Task Management App',
          description: 'A productivity tool for teams to collaborate and manage tasks efficiently.',
          imageUrl: 'https://picsum.photos/seed/tasks/800/600',
          liveUrl: 'https://example.com/tasks',
          repoUrl: 'https://github.com/example/tasks',
          technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
          isFeatured: true,
          order: 2,
          userId,
        },
        {
          title: 'E-commerce Platform',
          description: 'A full-featured online store with product management, shopping cart, and payment integration.',
          imageUrl: 'https://picsum.photos/seed/ecommerce/800/600',
          liveUrl: 'https://example.com/shop',
          repoUrl: 'https://github.com/example/shop',
          technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
          isFeatured: false,
          order: 3,
          userId,
        },
      ]
    });
    
    console.log(`Created ${projects.count} projects`);
  } else {
    console.log(`Using existing ${projectsCount} projects`);
  }

  // Create experiences if none exist
  const experiencesCount = await prisma.experience.count({
    where: { userId }
  });

  if (experiencesCount === 0) {
    const experiences = await prisma.experience.createMany({
      data: [
        {
          title: 'Senior Frontend Developer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startDate: new Date('2020-06-01'),
          current: true,
          description: 'Leading the frontend development team, building scalable web applications with React and TypeScript. Implementing modern design patterns and optimizing performance.',
          userId,
        },
        {
          title: 'Full Stack Developer',
          company: 'Innovation Labs',
          location: 'Remote',
          startDate: new Date('2018-03-01'),
          endDate: new Date('2020-05-31'),
          current: false,
          description: 'Developed full-stack applications using React, Node.js, and PostgreSQL. Collaborated with design team to implement responsive UI components.',
          userId,
        },
        {
          title: 'Web Developer',
          company: 'Digital Agency',
          location: 'Seattle, WA',
          startDate: new Date('2016-07-01'),
          endDate: new Date('2018-02-28'),
          current: false,
          description: 'Created interactive websites for clients across various industries. Worked with WordPress, JavaScript, and PHP.',
          userId,
        },
      ]
    });
    
    console.log(`Created ${experiences.count} experiences`);
  } else {
    console.log(`Using existing ${experiencesCount} experiences`);
  }

  // Create education entries if none exist
  const educationCount = await prisma.education.count({
    where: { userId }
  });

  if (educationCount === 0) {
    const education = await prisma.education.createMany({
      data: [
        {
          degree: 'Master of Science in Computer Science',
          school: 'University of Technology',
          location: 'San Francisco, CA',
          startDate: new Date('2014-09-01'),
          endDate: new Date('2016-05-31'),
          current: false,
          description: 'Specialized in Artificial Intelligence and Machine Learning. Thesis on "Neural Networks for Natural Language Processing".',
          userId,
        },
        {
          degree: 'Bachelor of Science in Computer Engineering',
          school: 'State University',
          location: 'Chicago, IL',
          startDate: new Date('2010-09-01'),
          endDate: new Date('2014-05-31'),
          current: false,
          description: 'Dean\'s List for 6 semesters. Participated in ACM programming competitions.',
          userId,
        },
      ]
    });
    
    console.log(`Created ${education.count} education entries`);
  } else {
    console.log(`Using existing ${educationCount} education entries`);
  }

  // Create social links if none exist
  const socialLinksCount = await prisma.socialLink.count({
    where: { userId }
  });

  if (socialLinksCount === 0) {
    const socialLinks = await prisma.socialLink.createMany({
      data: [
        {
          platform: 'GitHub',
          url: 'https://github.com/example',
          userId,
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/example',
          userId,
        },
        {
          platform: 'Twitter',
          url: 'https://twitter.com/example',
          userId,
        },
      ]
    });
    
    console.log(`Created ${socialLinks.count} social links`);
  } else {
    console.log(`Using existing ${socialLinksCount} social links`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 