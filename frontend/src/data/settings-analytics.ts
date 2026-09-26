export interface AIPromptItem {
  id: string;
  name: string;
  sentiment: "Positive" | "Neutral" | "Negative" | "Any Sentiment";
  rating: string;
  tone: "Friendly" | "Professional" | "Formal" | "Casual";
  wordLength: "Short (50-100 words)" | "Medium (100-200 words)" | "Long (200+ words)";
  status: "Active" | "Inactive";
  lastModifiedAt: string;
  openingLine?: string;
  closingLine?: string;
  promptTemplate?: string;
  preferredLanguage?: string;
}

export interface ReviewTemplateItem {
  id: string;
  name: string;
  sentiment: "Positive" | "Mixed" | "Negative";
  rating: string;
  linkedLocationAccounts: number;
  activeTemplates: string;
  status: "Active" | "Inactive";
  lastModifiedAt: string;
  templateContent?: string;
}

export const INITIAL_AI_PROMPTS: AIPromptItem[] = [
  {
    id: "prompt-1",
    name: "Positive 5-Star Cheerful Reply",
    sentiment: "Positive",
    rating: "5 Stars",
    tone: "Friendly",
    wordLength: "Short (50-100 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Hi [:reviewer_name],",
    closingLine: "Warm regards, Campus Team.",
    preferredLanguage: "English",
    promptTemplate: `You are an AI assistant working as an Online Reputation Manager for Demo Brand.\nWrite a [:word_length], [:tone] reply in [:preferred_language] for a [:rating]-star review with [:sentiment] sentiment.\n\nGuidelines:\n1. Start with [:opening_line].\n2. Thank the customer for their feedback and express genuine happiness.\n3. Include appreciation and an invitation to visit again similar to "Glad to know that we made your shopping experience great today. Looking forward to assist you again..."\n4. For product feedback include appreciation like "Glad you like our collection! Keep exploring our new styles. Happy shopping!"`,
  },
  {
    id: "prompt-2",
    name: "Generic Auto Sentiment-Based Reply",
    sentiment: "Any Sentiment",
    rating: "All Stars",
    tone: "Professional",
    wordLength: "Medium (100-200 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Hello [:reviewer_name],",
    closingLine: "Best regards, Support Team.",
    preferredLanguage: "English",
    promptTemplate: `You are an AI assistant working as an Online Reputation Manager for Demo Brand.\nWrite a [:word_length], [:tone] reply in [:preferred_language] for a [:rating]-star review with [:sentiment] sentiment.\n\nGuidelines:\n1. Start with [:opening_line].\n2. Acknowledge customer sentiment and provide helpful resolution context.`,
  },
  {
    id: "prompt-3",
    name: "Neutral 3-Star Balanced Reply",
    sentiment: "Neutral",
    rating: "3 Stars",
    tone: "Professional",
    wordLength: "Medium (100-200 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Dear [:reviewer_name],",
    closingLine: "Kind regards, Customer Care Team.",
    preferredLanguage: "English",
    promptTemplate: `You are an AI assistant working as an Online Reputation Manager for Demo Brand.\nWrite a [:word_length], [:tone] reply in [:preferred_language] for a [:rating]-star review with [:sentiment] sentiment.`,
  },
  {
    id: "prompt-4",
    name: "Negative 2-Star Apologetic Reply",
    sentiment: "Negative",
    rating: "2 Stars",
    tone: "Professional",
    wordLength: "Long (200+ words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Hi [:reviewer_name],",
    closingLine: "Sincerely, Management Team.",
    preferredLanguage: "English",
    promptTemplate: `Apologize sincerely and provide direct support email contact [:customer_support_email].`,
  },
  {
    id: "prompt-5",
    name: "Negative 1-Star Apologetic Reply",
    sentiment: "Negative",
    rating: "1 Star",
    tone: "Professional",
    wordLength: "Long (200+ words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Dear [:reviewer_name],",
    closingLine: "Best regards, Store Operations.",
    preferredLanguage: "English",
    promptTemplate: `Address critical concern and offer resolution steps via [:customer_support_phone].`,
  },
  {
    id: "prompt-6",
    name: "Negative Sentiment but High Rating Reply",
    sentiment: "Negative",
    rating: "4 Stars, 5 Stars",
    tone: "Professional",
    wordLength: "Medium (100-200 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Hi [:reviewer_name],",
    closingLine: "Warm regards, Team.",
    preferredLanguage: "English",
    promptTemplate: `Thank for high rating while addressing minor constructive points.`,
  },
  {
    id: "prompt-7",
    name: "Positive Sentiment but Low Rating Reply",
    sentiment: "Positive",
    rating: "1 Star, 2 Stars, 3 Stars",
    tone: "Formal",
    wordLength: "Medium (100-200 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Dear [:reviewer_name],",
    closingLine: "Respectfully, Customer Experience Team.",
    preferredLanguage: "English",
    promptTemplate: `Express appreciation for kind words and request rating clarification.`,
  },
  {
    id: "prompt-8",
    name: "Positive 4-Star Cheerful Reply",
    sentiment: "Positive",
    rating: "4 Stars",
    tone: "Friendly",
    wordLength: "Short (50-100 words)",
    status: "Active",
    lastModifiedAt: "7 months ago",
    openingLine: "Hi [:reviewer_name],",
    closingLine: "Cheers, Campus Team.",
    preferredLanguage: "English",
    promptTemplate: `Warm cheerful reply encouraging customer to achieve 5-star experience next visit.`,
  },
];

export const INITIAL_REVIEW_TEMPLATES: ReviewTemplateItem[] = [
  {
    id: "template-1",
    name: "3 Star rating templates",
    sentiment: "Mixed",
    rating: "3 Stars",
    linkedLocationAccounts: 1,
    activeTemplates: "2/2",
    status: "Active",
    lastModifiedAt: "7 months ago",
    templateContent: `Dear [:reviewer_name],\nThank you for sharing your experience. We appreciate your 3-star rating and are committed to improving our services to offer you a 5-star experience next time.\n\nWarm regards,\nCustomer Care Team`,
  },
  {
    id: "template-2",
    name: "1 Star rating templates",
    sentiment: "Negative",
    rating: "1 Star",
    linkedLocationAccounts: 1,
    activeTemplates: "3/3",
    status: "Active",
    lastModifiedAt: "7 months ago",
    templateContent: `Dear [:reviewer_name],\nWe sincerely apologize for not meeting your expectations. Please reach out to our team directly so we can resolve your issue immediately.\n\nSincerely,\nStore Management`,
  },
  {
    id: "template-3",
    name: "2 Star rating templates",
    sentiment: "Negative",
    rating: "2 Stars",
    linkedLocationAccounts: 1,
    activeTemplates: "3/3",
    status: "Active",
    lastModifiedAt: "7 months ago",
    templateContent: `Hi [:reviewer_name],\nThank you for giving us your honest feedback. We'd love to learn more about how we can improve your visit.\n\nBest regards,\nCustomer Experience Team`,
  },
  {
    id: "template-4",
    name: "4 Star rating templates",
    sentiment: "Positive",
    rating: "4 Stars",
    linkedLocationAccounts: 1,
    activeTemplates: "3/2",
    status: "Active",
    lastModifiedAt: "7 months ago",
    templateContent: `Hi [:reviewer_name],\nThank you for the 4-star rating! We are so glad you had a great experience with us. Hope to welcome you back soon!\n\nCheers,\nCampus Team`,
  },
  {
    id: "template-5",
    name: "5 Star rating templates",
    sentiment: "Positive",
    rating: "5 Stars",
    linkedLocationAccounts: 1,
    activeTemplates: "3/3",
    status: "Active",
    lastModifiedAt: "7 months ago",
    templateContent: `Hello [:reviewer_name],\nThank you so much for the 5-star review! We are delighted to hear you loved our collection and service.\n\nWarm regards,\nCampus Team`,
  },
];

export const SAMPLE_AI_RESPONSES = [
  {
    id: 1,
    title: "Sample Response 1",
    reviewerName: "A*************",
    stars: 5,
    date: "March 13, 2024 1:29 AM",
    reviewText: "If shoes are your passion and style is your mantra, then look no further than. Nestled in the heart of [Jaipur], this boutique shoe shop is a true gem for footwear aficionados. From classic designs to trendy statement pieces, Shoe Haven offers a diverse selection that caters to every taste and occasion.",
    highlightText: "Selection and Variety: Step inside and be prepared to be mesmerized by the sheer variety of sh...",
    aiReplyText: "Hello A*************, Thank you so much for your wonderful feedback! Glad to know that we made your shopping experience great today and that you like our diverse shoe collection. We're always excited to assist shoe lovers like you in finding the perfect pair. Looking forward to assisting you again soon.\n\nWarm regards, Campus Team.",
  },
  {
    id: 2,
    title: "Sample Response 2",
    reviewerName: "R*************",
    stars: 5,
    date: "March 10, 2024 11:15 AM",
    reviewText: "Excellent customer service and wide range of footwear collection. Staff was extremely helpful and courteous throughout my visit.",
    highlightText: "Staff Assistance: Politeness and swift billing experience at checkout desk...",
    aiReplyText: "Hello R*************, Thank you for taking out time to share your feedback! We are delighted to hear about your great experience with our staff. Hope to see you again soon!",
  },
  {
    id: 3,
    title: "Sample Response 3",
    reviewerName: "S*************",
    stars: 4,
    date: "February 28, 2024 04:40 PM",
    reviewText: "Good store experience and quality products. Parking space could be slightly expanded.",
    highlightText: "Store Ambience: Clean environment with quick service...",
    aiReplyText: "Hello S*************, Thank you for your review and valuable feedback regarding parking. We're glad you enjoyed our products and store experience!",
  },
];
