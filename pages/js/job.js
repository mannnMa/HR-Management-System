const departmentJobs = {
  admin: [
    {
      title: "Admin Manager",
      description: "Coordinates city office operations, manages administrative staff, and ensures compliance with municipal regulations.",
      slots: 2
    },
    {
      title: "Office Assistant",
      description: "Supports daily administrative tasks in city departments including scheduling, document preparation, and correspondence.",
      slots: 4
    },
    {
      title: "Document Controller",
      description: "Maintains city records and official documents, ensuring accurate filing and accessibility for public records requests.",
      slots: 3
    },
    {
      title: "Receptionist",
      description: "Welcomes visitors to city offices, manages inquiries, and directs citizens to appropriate services.",
      slots: 2
    },
    {
      title: "Executive Assistant",
      description: "Provides administrative support to city executives, including scheduling public meetings and managing official communications.",
      slots: 1
    }
  ],
  it: [
    {
      title: "System Analyst",
      description: "Evaluates city IT systems to improve digital services and ensures secure, reliable infrastructure.",
      slots: 1
    },
    {
      title: "Junior Developer",
      description: "Develops and maintains software applications used by city departments to improve citizen services.",
      slots: 2
    },
    {
      title: "IT Support Specialist",
      description: "Provides technical assistance to city employees and supports maintenance of city-wide networks.",
      slots: 3
    },
    {
      title: "Frontend Developer",
      description: "Designs and develops user-friendly web interfaces for city websites and public portals.",
      slots: 1
    },
    {
      title: "Network Engineer",
      description: "Maintains and secures the city’s IT network infrastructure to support all municipal operations.",
      slots: 2
    }
  ],
  hr: [
    {
      title: "HR Manager",
      description: "Manages city employee relations, recruitment for municipal roles, and compliance with civil service regulations.",
      slots: 1
    },
    {
      title: "Recruiter",
      description: "Conducts recruitment for city departments, coordinates hiring processes, and manages candidate communications.",
      slots: 2
    },
    {
      title: "HR Assistant",
      description: "Supports HR administrative functions, including employee record management and training coordination.",
      slots: 3
    },
    {
      title: "Training Coordinator",
      description: "Organizes professional development and mandatory training programs for city staff.",
      slots: 1
    },
    {
      title: "Compensation Analyst",
      description: "Analyzes city salary scales and benefits to ensure competitive and equitable compensation.",
      slots: 1
    }
  ],
  sales: [
    {
      title: "Sales Executive",
      description: "Coordinates sales of city-owned properties or services, engaging with potential buyers or partners.",
      slots: 2
    },
    {
      title: "Account Manager",
      description: "Manages relationships with businesses and contractors working with city departments.",
      slots: 2
    },
    {
      title: "Sales Coordinator",
      description: "Supports city sales operations by managing contracts, documentation, and communications.",
      slots: 3
    },
    {
      title: "Business Development Officer",
      description: "Identifies opportunities for city economic development and public-private partnerships.",
      slots: 1
    },
    {
      title: "Sales Manager",
      description: "Leads the city’s sales initiatives for municipal programs and property management.",
      slots: 1
    }
  ],
  marketing: [
    {
      title: "Marketing Strategist",
      description: "Develops campaigns to promote city events, services, and initiatives to residents and visitors.",
      slots: 1
    },
    {
      title: "Content Specialist",
      description: "Creates engaging content for city newsletters, social media, and public information materials.",
      slots: 2
    },
    {
      title: "SEO Analyst",
      description: "Optimizes city websites to increase visibility and accessibility of online services.",
      slots: 1
    },
    {
      title: "Social Media Manager",
      description: "Manages the city’s social media presence, engaging citizens and providing timely information.",
      slots: 2
    },
    {
      title: "Product Marketing Manager",
      description: "Promotes city programs and services, coordinating public outreach and communications.",
      slots: 1
    }
  ],
  finance: [
    {
      title: "Accountant",
      description: "Maintains the city’s financial records, prepares reports, and ensures adherence to municipal accounting standards.",
      slots: 2
    },
    {
      title: "Financial Analyst",
      description: "Analyzes the city budget, forecasts expenditures, and supports financial planning for city projects.",
      slots: 1
    },
    {
      title: "Accounts Payable Clerk",
      description: "Processes payments for city vendors, contractors, and service providers.",
      slots: 2
    },
    {
      title: "Budget Officer",
      description: "Develops and monitors city department budgets, ensuring fiscal responsibility and transparency.",
      slots: 1
    },
    {
      title: "Internal Auditor",
      description: "Conducts audits to ensure compliance with city policies and regulations, identifying areas for improvement.",
      slots: 1
    }
  ]
};

document.querySelectorAll('.view-info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const dept = button.getAttribute('data-dept');
    const jobList = document.getElementById('jobList');
    const jobCardsContainer = document.getElementById('jobCards');
    const jobListTitle = document.getElementById('jobListTitle');

    jobCardsContainer.innerHTML = '';

    if (departmentJobs[dept]) {
      jobListTitle.textContent = `${dept.toUpperCase()} Department Job Listings`;

      departmentJobs[dept].forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';

        const title = document.createElement('h3');
        title.textContent = job.title;

        const desc = document.createElement('p');
        desc.textContent = job.description;

        const slot = document.createElement('p');
        slot.innerHTML = `<strong>Available Slots: ${job.slots}</strong>`;

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(slot);

        jobCardsContainer.appendChild(card);
      });


      jobList.classList.remove('hidden');
      jobList.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const closeBtn = document.getElementById('closeJobListBtn');

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    const jobList = document.getElementById('jobList');
    jobList.classList.add('hidden');
  });
}
