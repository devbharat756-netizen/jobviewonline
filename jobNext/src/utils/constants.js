export const APP_NAME = 'jobNext';
export const TAGLINE = 'Find Your Dream Job';
export const ADMIN_PASSWORD = 'vivek789456';

export const SALARY_RANGES = [
  { label: '₹50k+', value: '50000-999999' },
  { label: '₹75k+', value: '75000-999999' },
  { label: '₹100k+', value: '100000-999999' },
  { label: '₹125k+', value: '125000-999999' },
  { label: '₹150k+', value: '150000-999999' },
];

export const EXPERIENCE_LEVELS = [
  { label: '0-2 years', value: '0-2' },
  { label: '2-4 years', value: '2-4' },
  { label: '4-6 years', value: '4-6' },
  { label: '6-8 years', value: '6-8' },
  { label: '8+ years', value: '8-99' },
];

export const WORK_MODES = ['Remote', 'Hybrid', 'Onsite'];

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

export const APPLICATION_STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Freelance', path: '/freelance' },
  { label: 'Companies', path: '/companies' },
  { label: 'Blog', path: '/blog' },
  { label: 'Career Tips', path: '/career-tips' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const CAREER_TIPS = [
  {
    id: 1,
    title: '10 Resume Mistakes That Could Cost You the Interview',
    excerpt: 'Your resume is your first impression. Avoid these common pitfalls that recruiters say are instant dealbreakers.',
    category: 'Resume',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
    content: `Your resume is often the first thing a hiring manager sees, and you only get about 6 seconds to make an impression. Here is an in-depth breakdown of the top 10 mistakes that could send your resume straight to the rejection pile, and how to fix them:

**1. Typos and Grammatical Errors**
Nothing says "I don't pay attention to detail" like a typo. Always proofread your resume multiple times, use online writing assistants, and have a trusted peer review it before submitting.

**2. Using a Generic Objective Statement**
Statements like "Dedicated professional seeking a challenging position" are outdated and tell the recruiter nothing about what you bring to the table. Replace it with a targeted professional summary that highlights your specific value, years of experience, and core skills.

**3. Listing Duties Instead of Achievements**
Do not copy and paste your past job descriptions. Instead of writing "Managed a team of 10," write "Led a team of 10 developers to deliver a $2M SaaS platform 2 weeks ahead of schedule." Quantify your impact with metrics, percentages, and dollar amounts.

**4. Including Irrelevant Information**
Your high school GPA, unrelated hobbies, and personal details (like marital status or profile photos in regions where not standard) do not belong on a professional resume. Focus purely on professional competence.

**5. Poor Formatting and Bad Typography**
Use clean, readable, professional fonts (like Inter, Arial, or Calibri) with consistent spacing. Avoid excessive colors, complicated sidebars, or unusual layouts that confuse Applicant Tracking Systems (ATS).

**6. Being Too Vague**
Vague claims like "Improved sales" are weak. Be specific: "Increased sales by 35% in Q3 through implementing a new automated CRM funnel."

**7. One-Size-Fits-All Approach**
Tailor your resume for every single job you apply for. Mirror the exact keywords from the job description and show how your experience matches their needs.

**8. Missing Keywords for ATS**
Most mid-to-large companies use automated systems to scan resumes. Make sure skills mentioned in the job post appear naturally in your text.

**9. Too Long or Too Short**
For most professionals, a 1-to-2 page resume is ideal. Senior executives might go to 3 pages, but anything longer is unnecessary.

**10. Inaccurate Contact Information**
Double-check your email and phone number. Make sure your LinkedIn profile link works and is professional.`
  },
  {
    id: 2,
    title: 'How to Ace Your Technical Interview in 2025',
    excerpt: 'Technical interviews have evolved. Learn the latest strategies to demonstrate both coding skills and engineering thinking.',
    category: 'Interview',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop',
    content: `Technical interviews in 2025 look different from even a few years ago. Companies are moving beyond pure algorithmic puzzles toward assessing real-world engineering skills. Here's a structured approach to preparing:

**Understand the Interview Format**
Most technical interviews now consist of multiple rounds:
1. Online Assessment (OA) / Take-home assignment.
2. Live coding round (45-60 min) focused on data structures and problem-solving.
3. System Design round (45 min) focused on high-level architecture.
4. Behavioral interview focusing on teamwork and past experience.

**Master the Algorithmic Fundamentals**
Data structures (arrays, hash maps, trees, graphs) and algorithms (sorting, searching, dynamic programming, BFS/DFS) are still the foundation. Focus on understanding patterns rather than memorizing solutions.

**Think and Code Out Loud**
The interviewer wants to see how you solve problems under pressure. Start by asking clarifying questions, discuss your approach before writing any code, and explain your trade-offs (time and space complexity) as you program.

**Write Production-Ready Code**
Use meaningful variable names, keep functions modular, handle edge cases, and add tests. Code quality and clean architecture matter as much as correctness.

**System Design Preparation**
For mid-to-senior roles, system design is crucial. Practice designing scalable systems: load balancers, caching strategies, database sharding, and message queues. Start with high-level architecture and drill into components.

**Prepare Behavioral Stories**
Use the STAR method (Situation, Task, Action, Result) to answer behavioral questions. Have 5-6 stories ready that showcase conflict resolution, learning from failure, and team leadership.`
  },
  {
    id: 3,
    title: 'The Complete Guide to Salary Negotiation',
    excerpt: 'Don\'t leave money on the table. Learn proven negotiation tactics that can increase your offer by 10-20%.',
    category: 'Salary',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    content: `Salary negotiation is one of the highest-ROI activities in your career. A single successful negotiation can mean tens of thousands of dollars over your tenure. Here is how to navigate the process:

**Do Your Research Early**
Before you even speak with a recruiter, know your market value. Use Glassdoor, Levels.fyi, Payscale, and industry surveys. Factor in your location, experience level, and the company's size.

**Do Not Disclose Your Number First**
If asked for your salary expectations early in the process, try to defer: "I'd like to learn more about the role's responsibilities before discussing compensation." If pressed, give a wide range based on your research.

**Get the Offer in Writing**
Always wait to negotiate until you have a written offer letter in hand. This gives you concrete leverage and shows the company is fully invested in hiring you.

**Negotiate the Total Package**
Salary is just one component. Also negotiate:
- Sign-on bonuses.
- Stock options / RSUs.
- Vacation days.
- Remote work flexibility.
- Professional development budget.

**Use the "We" Frame**
Instead of demanding more, frame it as a collaborative discussion: "I'm excited about this opportunity and want to find a number that reflects my experience and the value I'll bring to the team."

**Know Your Walk-Away Number**
Establish your absolute minimum before entering negotiations. This keeps you grounded and prevents you from accepting an offer you'll regret.`
  },
  {
    id: 4,
    title: 'Remote Work: How to Stay Productive and Connected',
    excerpt: 'Remote work is here to stay. Discover strategies to maintain productivity, avoid burnout, and build relationships from anywhere.',
    category: 'Remote Work',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    content: `Remote work offers incredible flexibility, but it also requires discipline and intentional habits. Here are proven strategies to thrive while working remotely:

**Create a Dedicated Workspace**
Avoid working from your bed or couch. Designate a specific desk or table for work. This helps your brain switch into "work mode" and creates physical boundaries between professional and personal life.

**Establish a Daily Routine**
Start and end your workday at consistent times. Include a "commute" ritual — like taking a morning walk or reading a book — to simulate the transition into work.

**Over-Communicate**
In remote settings, visibility must be intentional. Share progress updates proactively, document your processes, and let your team know when you'll be away.

**Use Asynchronous Communication**
Not everything needs a meeting. Use written updates, screen recordings, and shared documents for status reports. Reserve meetings for complex discussions.

**Prioritize Physical and Mental Health**
Step away from your screen periodically. Use the Pomodoro technique (25 min work, 5 min break) to keep fresh. Make sure to schedule social interactions outside of work.`
  },
  {
    id: 5,
    title: 'Building a LinkedIn Profile That Recruiters Notice',
    excerpt: 'LinkedIn is the #1 platform for job seekers. Learn how to optimize your profile to attract recruiters and opportunities.',
    category: 'Personal Branding',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=600&auto=format&fit=crop',
    content: `With over 900 million users, LinkedIn is where recruiters actively search for candidates. An optimized profile can be the difference between being found and being invisible:

**Professional Headshot**
Use a high-quality, recent headshot with good lighting. No selfies or cropped group photos. Your face should take up 60-70% of the frame.

**Compelling Headline**
Instead of just listing your title, write a value statement: "Senior Full Stack Engineer | React & Node.js | Building Scalable SaaS Products."

**About Section That Tells a Story**
Write in the first person. Explain what you do, who you help, and what makes you unique. Include relevant keywords for your industry.

**Showcase Achievements, Not Just Titles**
Under each position, highlight 3-5 key accomplishments with metrics. Use bullet points for readability.

**Get Recommendations**
Aim for recommendations from managers, colleagues, and clients. These add social proof that your claims are backed by others.`
  },
  {
    id: 6,
    title: 'From Coding Bootcamp to Tech Career: A Realistic Roadmap',
    excerpt: 'Bootcamp graduates face unique challenges. Here\'s an honest, actionable guide to landing your first tech role.',
    category: 'Career Transition',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    content: `Coding bootcamps can be an excellent path into tech, but the transition isn't automatic. Here's a realistic roadmap for bootcamp graduates:

**Manage Your Expectations**
The average bootcamp graduate takes 3-6 months to land their first role. Prepare financially and mentally for this timeline.

**Build Beyond Bootcamp Projects**
Tutorial projects look identical on other graduate portfolios. Build 2-3 unique projects that solve real problems, use modern stacks, and demonstrate depth.

**Contribute to Open Source**
Even small contributions (documentation fixes, minor bug fixes) show you can work with real codebases and collaborate with other developers.

**Network Intentionally**
Attend local meetups, join Discord communities, participate in hackathons. Many bootcamp graduates land their first role through connections, not applications.

**Master the Fundamentals**
Go deeper than what the bootcamp covered. Study data structures, algorithms, system design basics, and computer science fundamentals.`
  }
];

export const TESTIMONIALS = [
  { id: 1, name: 'Sarah Chen', role: 'Frontend Developer at TechNova', avatar: 'https://picsum.photos/seed/sarah/100/100.jpg', text: 'viewjob helped me land my dream role in just 3 weeks. The job listings are curated and verified, unlike other platforms where I had to sift through hundreds of spam postings.' },
  { id: 2, name: 'Marcus Johnson', role: 'Data Scientist at DataMind', avatar: 'https://picsum.photos/seed/marcus/100/100.jpg', text: 'The search and filter features are extremely precise. I could easily narrow down to exactly the type of role, salary range, and work mode I was looking for. Highly recommended.' },
  { id: 3, name: 'Emily Rodriguez', role: 'Product Designer at DesignHub', avatar: 'https://picsum.photos/seed/emily/100/100.jpg', text: 'What sets viewjob apart is the authenticity of listings. Every job I applied to was legitimate and directly from verified companies. No fake agency listings or middleman spam.' },
  { id: 4, name: 'David Kim', role: 'DevOps Engineer at InfraCore', avatar: 'https://picsum.photos/seed/david/100/100.jpg', text: 'The career resources section is highly practical. I used the salary negotiation guide and successfully increased my compensation package. This platform is built for serious job seekers.' },
  { id: 5, name: 'Priya Patel', role: 'Full Stack Engineer at CloudScale', avatar: 'https://picsum.photos/seed/priya/100/100.jpg', text: 'After months of frustrating job searches elsewhere, viewjob was a game-changer. Clean interface, direct recruiter application updates, and simple status tracking.' },
  { id: 6, name: 'James Wright', role: 'Mobile Developer at AppCraft', avatar: 'https://picsum.photos/seed/james/100/100.jpg', text: 'I found my current remote role through viewjob. The platform makes it easy to filter out hybrid/onsite roles and apply directly to fully remote companies.' },
];

export const FAQ_DATA = [
  { q: 'How do I search for jobs on viewjob?', a: 'Use the search bar on the Jobs page to search by job title, company, skill, or location. You can also use the filter sidebar to narrow results by salary range, experience level, work mode, company, and category.' },
  { q: 'Is viewjob free for job seekers?', a: 'Yes, viewjob is completely free for job seekers. You can browse jobs, save listings, apply to positions, and access all resources at no cost.' },
  { q: 'How do I save a job for later?', a: 'Click the bookmark icon on any job card or job details page. Saved jobs are stored in your profile and accessible from your Dashboard > Saved Jobs.' },
  { q: 'How do I apply for a job?', a: 'Click the "Apply Now" button on the job details page. Your application will be submitted directly to the recruiter and tracked in your Dashboard > Applications.' },
  { q: 'Can I track my application status?', a: 'Yes, all your applications are tracked in your Dashboard. You can view the current status (Applied, Shortlisted, Interview, Rejected, Hired) as updated by hiring managers.' },
  { q: 'How do I edit my profile?', a: 'Go to Dashboard > Profile. You can update your name, contact details, professional summary, skills, education, experience history, portfolio links, and upload your resume PDF.' },
  { q: 'Is my data secure?', a: 'Yes, your data is securely stored. All profile information, application details, and uploaded resume files are encrypted in transit and at rest on our secure servers, and are shared only with the hiring managers of the jobs you apply to.' },
  { q: 'How often are new jobs posted?', a: 'New jobs are posted regularly by verified recruiters and administrators. You can sort by "Newest" to see the latest listings first.' },
  { q: 'Can I search for remote jobs specifically?', a: 'Yes! Use the Work Mode filter and select "Remote" to see only remote job listings, or type "Remote" in the search bar.' },
  { q: 'How do companies post jobs on viewjob?', a: 'Companies can register as employers or post jobs through the Recruiter Dashboard. All submissions are audited by administrators to ensure validity.' },
];