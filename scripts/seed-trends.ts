import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";

config();

const prisma = new PrismaClient();

const categories = [
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "Science",
  "Health",
  "Politics",
  "Finance",
  "Education",
  "Environment",
];

const regions = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Oceania",
  "Middle East",
];

const sources = [
  "Twitter",
  "Reddit",
  "News",
  "YouTube",
  "LinkedIn",
  "TikTok",
  "Instagram",
  "Facebook",
];

const topics = [
  // Technology
  "Artificial Intelligence Breakthrough",
  "Quantum Computing Advances",
  "Blockchain Technology",
  "Cybersecurity Threats",
  "Cloud Computing Trends",
  "5G Network Expansion",
  "Virtual Reality Gaming",
  "Augmented Reality Apps",
  "Machine Learning Models",
  "IoT Device Adoption",
  "Edge Computing Growth",
  "Web3 Development",
  "Cryptocurrency Market",
  "NFT Marketplace",
  "Metaverse Platforms",
  
  // Business
  "Remote Work Culture",
  "E-commerce Growth",
  "Supply Chain Innovation",
  "Startup Funding Trends",
  "Merger and Acquisitions",
  "Corporate Sustainability",
  "Digital Transformation",
  "Customer Experience",
  "Brand Marketing Strategies",
  "Market Expansion",
  "Product Innovation",
  "Business Analytics",
  "Entrepreneurship Trends",
  "Investment Opportunities",
  "Global Trade Dynamics",
  
  // Entertainment
  "Streaming Service Competition",
  "Movie Box Office Records",
  "Music Industry Trends",
  "Gaming Industry Growth",
  "Podcast Popularity",
  "Social Media Influencers",
  "Content Creation",
  "Celebrity News",
  "TV Show Ratings",
  "Entertainment Technology",
  "Live Event Attendance",
  "Digital Media Consumption",
  "Animation Industry",
  "Comic Book Adaptations",
  "Reality TV Shows",
  
  // Sports
  "Olympic Games Coverage",
  "World Cup Preparations",
  "Athlete Performance",
  "Sports Technology",
  "Fantasy Sports Growth",
  "Esports Tournaments",
  "Sports Betting Trends",
  "Team Merchandise Sales",
  "Stadium Attendance",
  "Sports Broadcasting",
  "Athletic Training Methods",
  "Sports Nutrition",
  "Youth Sports Participation",
  "Professional Leagues",
  "Sports Analytics",
  
  // Science
  "Space Exploration",
  "Climate Research",
  "Medical Breakthroughs",
  "Renewable Energy",
  "Genetic Research",
  "Ocean Conservation",
  "Wildlife Protection",
  "Scientific Discoveries",
  "Research Publications",
  "Laboratory Innovations",
  "Scientific Collaboration",
  "Technology Transfer",
  "Science Education",
  "Research Funding",
  "Scientific Communication",
  
  // Health
  "Mental Health Awareness",
  "Telemedicine Adoption",
  "Fitness Trends",
  "Nutrition Science",
  "Public Health Policies",
  "Medical Technology",
  "Healthcare Access",
  "Wellness Programs",
  "Disease Prevention",
  "Health Monitoring Devices",
  "Therapeutic Advances",
  "Healthcare Costs",
  "Patient Care Quality",
  "Health Data Privacy",
  "Global Health Initiatives",
  
  // Politics
  "Election Campaigns",
  "Policy Reforms",
  "International Relations",
  "Government Transparency",
  "Voting Rights",
  "Political Debates",
  "Legislative Changes",
  "Public Opinion",
  "Political Movements",
  "Civic Engagement",
  "Election Turnout",
  "Policy Implementation",
  "Political Communication",
  "Government Services",
  "Democratic Processes",
  
  // Finance
  "Stock Market Trends",
  "Cryptocurrency Volatility",
  "Banking Innovation",
  "Investment Strategies",
  "Financial Technology",
  "Economic Indicators",
  "Market Analysis",
  "Wealth Management",
  "Financial Planning",
  "Credit Markets",
  "Insurance Trends",
  "Payment Systems",
  "Financial Regulation",
  "Economic Growth",
  "Currency Exchange",
  
  // Education
  "Online Learning Platforms",
  "Educational Technology",
  "Student Engagement",
  "Curriculum Development",
  "Teacher Training",
  "Educational Access",
  "Learning Outcomes",
  "Educational Funding",
  "Student Performance",
  "Educational Innovation",
  "Skills Development",
  "Lifelong Learning",
  "Educational Research",
  "School Infrastructure",
  "Educational Policy",
  
  // Environment
  "Climate Change Action",
  "Renewable Energy Adoption",
  "Carbon Emissions",
  "Sustainable Practices",
  "Environmental Protection",
  "Green Technology",
  "Conservation Efforts",
  "Ecosystem Restoration",
  "Water Conservation",
  "Waste Management",
  "Biodiversity Protection",
  "Environmental Policy",
  "Clean Energy Transition",
  "Environmental Awareness",
  "Sustainable Development",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSummary(topic: string, category: string): string {
  const summaries = [
    `${topic} is gaining significant traction in the ${category.toLowerCase()} sector.`,
    `Recent developments in ${topic} are reshaping the ${category.toLowerCase()} landscape.`,
    `${topic} continues to evolve with new innovations and market dynamics.`,
    `The ${category.toLowerCase()} industry is experiencing a surge in interest around ${topic}.`,
    `${topic} represents a key trend driving changes in ${category.toLowerCase()}.`,
  ];
  return getRandomElement(summaries);
}

async function seedTrends() {
  console.log("Starting to seed trends...");

  const trendsToCreate = 120;
  const trends = [];

  for (let i = 0; i < trendsToCreate; i++) {
    const category = getRandomElement(categories);
    const topic = getRandomElement(topics);
    const region = Math.random() > 0.1 ? getRandomElement(regions) : null;
    const growthRate = getRandomFloat(-25.0, 150.0);
    const source = getRandomElement(sources);
    const summary = Math.random() > 0.3 ? generateSummary(topic, category) : null;

    const daysAgo = getRandomInt(0, 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59));

    trends.push({
      topic,
      category,
      region,
      growthRate: Math.round(growthRate * 100) / 100,
      source,
      summary,
      createdAt,
    });
  }

  try {
    const result = await prisma.trend.createMany({
      data: trends,
      skipDuplicates: true,
    });

    console.log(`Successfully created ${result.count} trend records!`);
  } catch (error) {
    console.error("Error seeding trends:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedTrends();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

