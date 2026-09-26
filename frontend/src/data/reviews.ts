import type { ResponseTemplate, Review, Sentiment } from "@/types/review";
import { initials } from "@/lib/format";
import { createRng, floatBetween, intBetween, pick } from "@/lib/random";
import { LOCATIONS } from "./locations";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";
import { USERS } from "./users";

const REVIEWER_NAMES = [
  "Rahul Mehta", "Sneha Kulkarni", "Imran Qureshi", "Divya Raman", "Anil Kumar", "Farah Sheikh",
  "Ravi Prakash", "Neha Bansal", "Joseph Thomas", "Sanjana Rao", "Vivek Malhotra", "Ayesha Khan",
  "Gaurav Sethi", "Lakshmi Pillai", "Sourav Das", "Tanvi Shah", "Harpreet Kaur", "Mohit Jain",
  "Preeti Nanda", "Zoya Ansari",
];

const POSITIVE = [
  "Excellent service and the staff helped me find exactly the size I needed. In and out in ten minutes.",
  "Great collection and very clean store. The fitting assistance was genuinely helpful.",
  "Delivery to my home was arranged the same day. Very professional team.",
  "Prices matched the app and billing was quick. Will visit again.",
  "The manager personally handled my exchange without any argument. Impressive.",
];
const NEUTRAL = [
  "Decent store, though the queue at billing was long on a weekend.",
  "Stock was okay but a couple of sizes were unavailable. Staff were polite.",
  "Average experience. Parking is a bit difficult during evenings.",
];
const NEGATIVE = [
  "Waited 25 minutes and nobody attended to us. Very disappointing.",
  "The product I ordered was different from what was delivered and the exchange took a week.",
  "Store hours on Google were wrong, arrived to find it closed.",
  "Staff was dismissive when I asked about the warranty policy.",
];

const KEYWORD_POOL = ["service", "pricing", "delivery", "ambience", "quality", "product", "staff", "billing"];

const RESPONSES = [
  "Thank you for the kind words — we've shared your feedback with the store team.",
  "We appreciate you taking the time to review us. Hope to see you again soon!",
  "We're sorry about this experience. Our regional manager will reach out today to make it right.",
  "Thanks for flagging this. We've corrected the listed hours and briefed the team.",
];

function sentimentFor(rating: number): Sentiment {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}

function buildReviews(): Review[] {
  const rng = createRng(20_260_913);
  const out: Review[] = [];

  for (let i = 0; i < 620; i++) {
    const location = pick(rng, LOCATIONS);
    const roll = rng();
    const rating = roll < 0.62 ? 5 : roll < 0.78 ? 4 : roll < 0.88 ? 3 : roll < 0.95 ? 2 : 1;
    const sentiment = sentimentFor(rating);
    const text =
      sentiment === "positive"
        ? pick(rng, POSITIVE)
        : sentiment === "neutral"
          ? pick(rng, NEUTRAL)
          : pick(rng, NEGATIVE);
    const answered = rng() < 0.84;
    const createdAt = new Date(Date.now() - intBetween(rng, 1, 240) * 3.6e6 * intBetween(rng, 1, 6));
    const reviewerName = pick(rng, REVIEWER_NAMES);

    const review: Review = {
      id: `rev_${10_000 + i}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      locationId: location.id,
      locationName: location.name,
      reviewerName,
      reviewerInitials: initials(reviewerName),
      rating,
      text,
      createdAt: createdAt.toISOString(),
      sentiment,
      status: answered ? "answered" : "unanswered",
      source: "google",
      keywords: [pick(rng, KEYWORD_POOL), pick(rng, KEYWORD_POOL)].filter(
        (v, idx, arr) => arr.indexOf(v) === idx,
      ),
      flagged: rng() < 0.04,
    };
    if (answered) {
      review.response = {
        text: pick(rng, RESPONSES),
        respondedAt: new Date(
          createdAt.getTime() + floatBetween(rng, 0.5, 12) * 3.6e6,
        ).toISOString(),
        respondedBy: pick(rng, USERS).name,
      };
    }
    out.push(review);
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const REVIEWS: Review[] = buildReviews();

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    id: "tpl_1",
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: "5-star thank you",
    category: "positive",
    body: "Thank you for the wonderful feedback, {{reviewer}}! We're delighted the team at {{location}} made your visit easy. See you again soon.",
    usageCount: 18_204,
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
  {
    id: "tpl_2",
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: "Service recovery",
    category: "negative",
    body: "We're sorry about your experience at {{location}}, {{reviewer}}. Our regional manager will contact you within 24 hours to resolve this.",
    usageCount: 4_912,
    updatedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
  },
  {
    id: "tpl_3",
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: "Neutral follow-up",
    category: "neutral",
    body: "Thanks for the honest feedback, {{reviewer}}. We're working on billing wait times at {{location}} and would love another chance.",
    usageCount: 2_338,
    updatedAt: new Date(Date.now() - 16 * 86_400_000).toISOString(),
  },
  {
    id: "tpl_4",
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: "Incorrect hours",
    category: "operational",
    body: "Apologies for the confusion — we've corrected the opening hours for {{location}} on Google. Thank you for reporting it.",
    usageCount: 861,
    updatedAt: new Date(Date.now() - 24 * 86_400_000).toISOString(),
  },
];
