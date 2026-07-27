export const APP_NAME = 'jobNext';
export const TAGLINE = 'Find Your Dream Job';
export const ADMIN_PASSWORD = 'vivek789456';

export const SALARY_RANGES = [
  { label: '$50k+', value: '50000-999999' },
  { label: '$75k+', value: '75000-999999' },
  { label: '$100k+', value: '100000-999999' },
  { label: '$125k+', value: '125000-999999' },
  { label: '$150k+', value: '150000-999999' },
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
  { label: 'Companies', path: '/companies' },
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
    image: 'https://picsum.photos/seed/resume-tips/600/400.jpg',
    content: `Your resume is often the first thing a hiring manager sees, and you only get about 6 seconds to make an impression. Here are the top 10 mistakes that could send your resume straight to the rejection pile:\n\n**1. Typos and Grammatical Errors**\nNothing says "I don't pay attention to detail" like a typo. Always proofread your resume multiple times and have someone else review it too.\n\n**2. Using a Generic Objective Statement**\n"Dedicated professional seeking a challenging position" tells the recruiter nothing. Replace it with a targeted summary that highlights your specific value.\n\n**3. Listing Duties Instead of Achievements**\nInstead of "Managed a team of 10," write "Led a team of 10 to deliver a $2M project 2 weeks ahead of schedule." Quantify your impact.\n\n**4. Including Irrelevant Information**\nYour high school GPA, hobbies (unless relevant), and personal details like marital status don't belong on a professional resume.\n\n**5. Poor Formatting**\nUse consistent fonts, bullet points, and spacing. Avoid crazy colors, graphics, or unusual layouts that confuse ATS systems.\n\n**6. Being Too Vague**\n"Improved sales" is weak. "Increased sales by 35% in Q3 through implementing a new CRM strategy" is powerful.\n\n**7. One-Size-Fits-All Approach**\nTailor your resume for each job. Mirror the language from the job description and highlight the most relevant experience.\n\n**8. Missing Keywords**\nMost companies use ATS (Applicant Tracking Systems) that scan for keywords. Include terms from the job description naturally throughout your resume.\n\n**9. Too Long or Too Short**\nFor most professionals, 1-2 pages is ideal. Senior executives might go to 3 pages, but anything longer is likely unnecessary.\n\n**10. No Contact Information or Wrong Contact Info**\nDouble-check your phone number and email. Include your LinkedIn profile and optionally your portfolio URL.`
  },
  {
    id: 2,
    title: 'How to Ace Your Technical Interview in 2025',
    excerpt: 'Technical interviews have evolved. Learn the latest strategies to demonstrate both coding skills and engineering thinking.',
    category: 'Interview',
    readTime: '8 min',
    image: 'https://picsum.photos/seed/tech-interview/600/400.jpg',
    content: `Technical interviews in 2025 look different from even a few years ago. Companies are moving beyond pure algorithmic puzzles toward assessing real-world engineering skills. Here's how to prepare:\n\n**Understand the Format**\nMost technical interviews now include: a coding round (45-60 min), a system design round (45 min), and a behavioral round (30 min). Some companies have added "take-home" projects or pair programming sessions.\n\n**Master the Fundamentals**\nData structures (arrays, hash maps, trees, graphs) and algorithms (sorting, searching, dynamic programming, BFS/DFS) are still the foundation. Use platforms like LeetCode, but focus on understanding patterns rather than memorizing solutions.\n\n**Think Out Loud**\nInterviewers want to see your thought process. Start by clarifying the problem, discuss your approach before coding, and explain your decisions as you go.\n\n**Write Clean Code**\nUse meaningful variable names, keep functions short, handle edge cases, and add comments for complex logic. Code quality matters as much as correctness.\n\n**System Design Preparation**\nFor mid-to-senior roles, system design is crucial. Practice designing scalable systems: load balancers, caching strategies, database sharding, message queues. Start with high-level architecture and drill into components.\n\n**Behavioral Questions Matter**\n"Tell me about a time..." questions reveal your soft skills. Use the STAR method (Situation, Task, Action, Result) to structure your answers. Prepare 5-6 stories that demonstrate leadership, conflict resolution, and impact.\n\n**Ask Great Questions**\nWhen given the chance to ask questions, show genuine curiosity about the team, tech stack, challenges, and culture. This is your interview too.`
  },
  {
    id: 3,
    title: 'The Complete Guide to Salary Negotiation',
    excerpt: 'Don\'t leave money on the table. Learn proven negotiation tactics that can increase your offer by 10-20%.',
    category: 'Salary',
    readTime: '7 min',
    image: 'https://picsum.photos/seed/salary-neg/600/400.jpg',
    content: `Salary negotiation is one of the highest-ROI activities in your career. A single successful negotiation can mean tens of thousands of dollars over your tenure. Here's how to do it right:\n\n**Do Your Research**\nBefore any negotiation, know your market value. Use Glassdoor, Levels.fyi, Payscale, and industry surveys. Factor in your location, experience level, and the company's size.\n\n**Never Share Your Number First**\nIf asked for your salary expectations early, try to defer: "I'd like to learn more about the role's responsibilities before discussing compensation." If pressed, give a wide range based on your research.\n\n**Get the Offer in Writing First**\nAlways negotiate after receiving a written offer. This gives you leverage and shows the company is already invested in you.\n\n**Negotiate the Total Package**\nSalary is just one component. Also negotiate: signing bonus, equity/RSUs, annual bonus percentage, vacation days, remote work flexibility, professional development budget, and title.\n\n**Use the "We" Frame**\nInstead of "I want more money," try "I'm excited about this role and want to make sure we find a number that reflects my experience and the value I'll bring."\n\n**Have a Walk-Away Number**\nKnow your absolute minimum before entering negotiations. This gives you confidence and prevents you from accepting an offer you'll regret.\n\n**Practice Your Pitch**\nRehearse your negotiation conversation. Role-play with a friend. The more comfortable you are, the more natural and confident you'll sound.\n\n**Get Everything in Writing**\nVerbal promises mean nothing. Ensure every agreed-upon term is documented in the final offer letter.`
  },
  {
    id: 4,
    title: 'Remote Work: How to Stay Productive and Connected',
    excerpt: 'Remote work is here to stay. Discover strategies to maintain productivity, avoid burnout, and build relationships from anywhere.',
    category: 'Remote Work',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/remote-work/600/400.jpg',
    content: `Remote work offers incredible flexibility, but it also requires discipline and intentional habits. Here are proven strategies to thrive while working remotely:\n\n**Create a Dedicated Workspace**\nEven if you don't have a separate office, designate a specific area for work. This helps your brain switch into "work mode" and creates boundaries between professional and personal life.\n\n**Establish a Routine**\nStart and end your workday at consistent times. Include a "commute" ritual — even if it's just walking to your desk with coffee. Routines reduce decision fatigue and create structure.\n\n**Over-Communicate**\nIn remote settings, no one can see you working. Share progress updates proactively, document your work, and don't assume people know what you're doing.\n\n**Use Async Communication Wisely**\nNot everything needs a meeting. Use written updates, Loom videos, and shared documents for status updates. Reserve meetings for discussions that benefit from real-time interaction.\n\n**Schedule Virtual Social Time**\nRemote work can be isolating. Schedule virtual coffee chats, participate in non-work Slack channels, and attend virtual team events.\n\n**Take Real Breaks**\nStep away from your screen. Walk, exercise, eat lunch away from your desk. The Pomodoro technique (25 min work, 5 min break) works well for many remote workers.\n\n**Set Boundaries**\nCommunicate your working hours to your team. Turn off notifications outside those hours. Having clear boundaries prevents burnout and sustains long-term productivity.\n\n**Invest in Your Setup**\nA good chair, external monitor, quality webcam, and reliable internet are not luxuries — they're productivity tools that pay for themselves.`
  },
  {
    id: 5,
    title: 'Building a LinkedIn Profile That Recruiters Actually Notice',
    excerpt: 'LinkedIn is the #1 platform for job seekers. Learn how to optimize your profile to attract recruiters and opportunities.',
    category: 'Personal Branding',
    readTime: '6 min',
    image: 'https://picsum.photos/seed/linkedin-tips/600/400.jpg',
    content: `With over 900 million users, LinkedIn is where recruiters actively search for candidates. An optimized profile can be the difference between being found and being invisible:\n\n**Professional Headshot**\nUse a high-quality, recent headshot with good lighting. No selfies, no wedding photos, no cropped group shots. Your face should take up 60-70% of the frame.\n\n**Compelling Headline**\nYour headline is your elevator pitch. Instead of "Software Engineer at X," try "Senior Full Stack Engineer | React & Node.js | Building Scalable SaaS Products."\n\n**About Section That Tells a Story**\nWrite in first person. Explain what you do, who you help, and what makes you unique. Include keywords naturally. End with a call to action.\n\n**Showcase Achievements, Not Just Titles**\nUnder each position, highlight 3-5 key accomplishments with metrics. Use bullet points for readability.\n\n**Get Recommendations**\nAim for at least 5-6 recommendations from managers, colleagues, and clients. These add social proof that your claims are backed by others.\n\n**Skills and Endorsements**\nList your top skills and reorder them so the most relevant ones appear first. Endorsements from credible connections boost your profile's strength.\n\n**Be Active**\nPost original content 2-3 times per week. Comment thoughtfully on others' posts. Engage in your industry's conversations. Activity signals that you're current and engaged.\n\n**Custom URL**\nChange your LinkedIn URL to linkedin.com/in/yourname — it looks more professional and is easier to share.`
  },
  {
    id: 6,
    title: 'From Coding Bootcamp to Tech Career: A Realistic Roadmap',
    excerpt: 'Bootcamp graduates face unique challenges. Here\'s an honest, actionable guide to landing your first tech role.',
    category: 'Career Transition',
    readTime: '7 min',
    image: 'https://picsum.photos/seed/bootcamp-career/600/400.jpg',
    content: `Coding bootcamps can be an excellent path into tech, but the transition isn't automatic. Here's a realistic roadmap for bootcamp graduates:\n\n**Manage Your Expectations**\nThe average bootcamp graduate takes 3-6 months to land their first role. It's a marathon, not a sprint. Prepare financially and mentally for this timeline.\n\n**Build Beyond Bootcamp Projects**\nBootcamp projects are a starting point, not an endpoint. Build 2-3 additional projects that solve real problems, use modern stacks, and demonstrate depth beyond tutorial-level work.\n\n**Contribute to Open Source**\nEven small contributions (documentation fixes, good first issues) show you can work with real codebases and collaborate with other developers.\n\n**Network Intentionally**\nAttend local meetups, join Discord communities, participate in hackathons. Many bootcamp graduates land their first role through connections, not applications.\n\n**Target the Right Companies**\nLarge tech companies often have degree requirements. Focus on startups, agencies, and mid-size companies that value skills over credentials. Many excellent companies hire based on ability alone.\n\n**Master the Fundamentals**\nGo deeper than what the bootcamp covered. Study data structures, algorithms, system design basics, and computer science fundamentals. Free resources like CS50, freeCodeCamp, and The Odin Project can fill gaps.\n\n**Practice Interviewing Early**\nDon't wait until you're "ready." Start practicing technical interviews from week one of your job search. The gap between knowing and performing under pressure is real.\n\n**Consider Contract-to-Hire**\nMany bootcamp graduates break in through contract roles. These can lead to full-time positions and provide the experience that makes future job searches much easier.`
  }
];

export const TESTIMONIALS = [
  { id: 1, name: 'Sarah Chen', role: 'Frontend Developer at TechNova', avatar: 'https://picsum.photos/seed/sarah/100/100.jpg', text: 'jobNext helped me land my dream role in just 3 weeks. The job listings are curated and relevant, unlike other platforms where I had to sift through hundreds of mismatched postings.' },
  { id: 2, name: 'Marcus Johnson', role: 'Data Scientist at DataMind AI', avatar: 'https://picsum.photos/seed/marcus/100/100.jpg', text: 'The search and filter features are incredibly powerful. I could narrow down to exactly the type of role, salary range, and work mode I was looking for. Highly recommended.' },
  { id: 3, name: 'Emily Rodriguez', role: 'Product Designer at DesignHub', avatar: 'https://picsum.photos/seed/emily/100/100.jpg', text: 'What sets jobNext apart is the quality of listings. Every job I applied to through here was legitimate and from companies I actually wanted to work for. No spam, no scams.' },
  { id: 4, name: 'David Kim', role: 'DevOps Engineer at InfraCore', avatar: 'https://picsum.photos/seed/david/100/100.jpg', text: 'The career tips section alone is worth bookmarking. I used the salary negotiation guide and increased my offer by $15,000. This platform genuinely cares about job seekers.' },
  { id: 5, name: 'Priya Patel', role: 'Full Stack Engineer at CloudScale', avatar: 'https://picsum.photos/seed/priya/100/100.jpg', text: 'After months of frustrating job searches on other platforms, jobNext was a breath of fresh air. Clean interface, relevant results, and the saved jobs feature kept me organized.' },
  { id: 6, name: 'James Wright', role: 'Mobile Developer at AppCraft', avatar: 'https://picsum.photos/seed/james/100/100.jpg', text: 'I found my current role through jobNext\'s remote job filter. Working remotely was a non-negotiable for me, and jobNext made it easy to find companies that offered exactly that.' },
];

export const FAQ_DATA = [
  { q: 'How do I search for jobs on jobNext?', a: 'Use the search bar on the Jobs page to search by job title, company, skill, or location. You can also use the filter sidebar to narrow results by salary range, experience level, work mode, company, and category.' },
  { q: 'Is jobNext free for job seekers?', a: 'Yes, jobNext is completely free for job seekers. You can browse jobs, save listings, apply to positions, and access all career resources at no cost.' },
  { q: 'How do I save a job for later?', a: 'Click the bookmark icon on any job card or job details page. Saved jobs are stored in your browser and accessible from your Dashboard > Saved Jobs.' },
  { q: 'How do I apply for a job?', a: 'Click the "Apply Now" button on the job details page. Your application will be tracked in your Dashboard > Applications section where you can monitor its status.' },
  { q: 'Can I track my application status?', a: 'Yes, all your applications are tracked in your Dashboard. You can view the current status (Applied, Shortlisted, Interview, Rejected, Hired) and withdraw applications if needed.' },
  { q: 'How do I edit my profile?', a: 'Go to Dashboard > Profile. You can edit your name, email, phone, address, about me, skills, education, experience, portfolio links, and upload a resume PDF.' },
  { q: 'Is my data secure?', a: 'All your data is stored locally in your browser using LocalStorage. No data is sent to any server. You have full control over your information at all times.' },
  { q: 'How often are new jobs posted?', a: 'New jobs are posted regularly by our admin team. You can sort by "Newest" to see the latest listings first.' },
  { q: 'Can I search for remote jobs specifically?', a: 'Yes! Use the Work Mode filter and select "Remote" to see only remote job listings. You can also search for "remote" in the search bar.' },
  { q: 'How do companies post jobs on jobNext?', a: 'Companies can post jobs through our admin panel. If you represent a company and want to list positions, please contact us through the Contact page.' },
];