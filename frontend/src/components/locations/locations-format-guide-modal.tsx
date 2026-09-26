import { useState } from "react";
import { Download, Info, X, Copy, Check, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FieldGuide {
  name: string;
  required: boolean;
  desc: string;
}

const FIELD_GUIDELINES: FieldGuide[] = [
  { name: "Business Name", required: true, desc: "The public display name of the location." },
  { name: "Store Code", required: false, desc: "Set the unique store code for this location." },
  { name: "Business Description (short)", required: false, desc: "Brief summary of the location (max 300 characters)." },
  { name: "Business Description (long)", required: false, desc: "Full description of the location (max 750 characters)." },
  { name: "Business Status", required: true, desc: "Location open status." },
  { name: "Opening Date", required: false, desc: "Date the location opened (YYYY-MM-DD)." },
  { name: "Auto Sync", required: false, desc: "Enable automatic platform sync." },
  { name: "Tags", required: false, desc: "Comma-separated tag codes (must exist and be active)." },
  { name: "Address line 1", required: true, desc: "First line of the street address." },
  { name: "Address line 2", required: false, desc: "Second address line (optional)." },
  { name: "Address line 3", required: false, desc: "Third address line (optional)." },
  { name: "Address line 4", required: false, desc: "Fourth address line (optional)." },
  { name: "Sub-locality", required: false, desc: "Neighbourhood or sub-locality." },
  { name: "Locality", required: true, desc: "City or town." },
  { name: "Post Code", required: true, desc: "ZIP or postal code." },
  { name: "Administrative Area", required: true, desc: "State or province." },
  { name: "Country", required: true, desc: "ISO 3166-1 alpha-2 country code." },
  { name: "Latitude", required: true, desc: "GPS latitude coordinate." },
  { name: "Longitude", required: true, desc: "GPS longitude coordinate." },
  { name: "Google Location Group", required: true, desc: "The Google Business Location Group this location is linked to." },
  { name: "Google Primary Category", required: true, desc: "Google Business Profile primary category name (must exist in the system)." },
  { name: "Google Additional Categories", required: false, desc: "Comma-separated Google additional category names (max 9, each must exist in the system)." },
  { name: "Google Labels", required: false, desc: "Comma-separated labels for Google Business Profile (max 10, each max 255 characters)." },
  { name: "Primary Phone Number", required: false, desc: "country code + number, e.g. +91 99999 99999. Required if no additional phone numbers are provided." },
  { name: "Additional Phone Number 1", required: false, desc: "Additional phone number 1." },
  { name: "Additional Phone Number 2", required: false, desc: "Additional phone number 2." },
  { name: "Customer Support Phone", required: false, desc: "Customer support phone number." },
  { name: "Customer Support Email", required: false, desc: "Customer support email address." },
  { name: "Customer Support URL", required: false, desc: "Customer support web page URL." },
  { name: "Reporting Person Emails", required: false, desc: "Comma-separated email addresses of reporting persons for this location." },
  { name: "Website URL", required: false, desc: "Location website URL." },
  { name: "Menu URL", required: false, desc: "Link to the menu page." },
  { name: "Order URL", required: false, desc: "Online ordering page URL." },
  { name: "Reservation URL", required: false, desc: "Reservation page URL." },
  { name: "Facebook URL", required: false, desc: "Facebook page URL." },
  { name: "X URL", required: false, desc: "X (Twitter) profile URL." },
  { name: "LinkedIn URL", required: false, desc: "LinkedIn profile URL." },
  { name: "Instagram URL", required: false, desc: "Instagram profile URL." },
  { name: "Youtube URL", required: false, desc: "YouTube channel URL." },
  { name: "WhatsApp URL", required: false, desc: "WhatsApp link." },
  { name: "Pinterest URL", required: false, desc: "Pinterest profile URL." },
  { name: "Place an Order Link", required: false, desc: "Online shop URL." },
  { name: "Inventory Search URL", required: false, desc: "Inventory search page URL." },
  { name: "Texting Number URL", required: false, desc: "SMS or text messaging link." },
  { name: "Business Hours", required: true, desc: "Format: Day: HH:MM-HH:MM, Day2: HH:MM-HH:MM" },
  { name: "Special Hours", required: false, desc: "Format: DD-MM-YYYY (Label): HH:MM-HH:MM, DD-MM-YYYY: closed" },
  { name: "Accessibility: Assisted listening devices", required: false, desc: "Select Yes or No." },
  { name: "Accessibility: Assistive hearing loop", required: false, desc: "Select Yes or No." },
  { name: "Accessibility: Wheelchair accessible entrance", required: false, desc: "Select Yes or No." },
  { name: "Accessibility: Wheelchair accessible parking lot", required: false, desc: "Select Yes or No." },
  { name: "Accessibility: Wheelchair accessible restroom", required: false, desc: "Select Yes or No." },
  { name: "Accessibility: Wheelchair accessible seating", required: false, desc: "Select Yes or No." },
  { name: "Amenities: Gender-neutral restroom", required: false, desc: "Select Yes or No." },
  { name: "Amenities: Restroom", required: false, desc: "Select Yes or No." },
  { name: "Amenities: Wi-Fi", required: false, desc: "Select one option from the available choices." },
  { name: "Crowd: LGBTQ+ friendly", required: false, desc: "Select Yes or No." },
  { name: "Crowd: Transgender safespace", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as Asian-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as Black-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as disabled-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as Indigenous-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as Latino-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as LGBTQ+ owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as veteran-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Identifies as women-owned", required: false, desc: "Select Yes or No." },
  { name: "From the business: Small business", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Kids' shoes", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Kids' toys", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Men's clothing", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Men's shoes", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Service guarantee", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Used goods", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Women's clothing", required: false, desc: "Select Yes or No." },
  { name: "Offerings: Women's shoes", required: false, desc: "Select Yes or No." },
  { name: "Parking: Free parking garage", required: false, desc: "Select Yes or No." },
  { name: "Parking: Free parking lot", required: false, desc: "Select Yes or No." },
  { name: "Parking: Free street parking", required: false, desc: "Select Yes or No." },
  { name: "Parking: On-site parking", required: false, desc: "Select Yes or No." },
  { name: "Parking: Paid parking garage", required: false, desc: "Select Yes or No." },
  { name: "Parking: Paid parking lot", required: false, desc: "Select Yes or No." },
  { name: "Parking: Paid street parking", required: false, desc: "Select Yes or No." },
  { name: "Payments: Cash-only", required: false, desc: "Select Yes or No." },
  { name: "Payments: Checks", required: false, desc: "Select Yes or No." },
  { name: "Payments: Credit cards [Yes/No]", required: false, desc: "Select Yes or No." },
  { name: "Payments: Credit cards [Multiple]", required: false, desc: "Enter one or more option values, comma-separated." },
  { name: "Payments: Debit cards", required: false, desc: "Select Yes or No." },
  { name: "Payments: Google Pay", required: false, desc: "Select Yes or No." },
  { name: "Payments: NFC mobile payments", required: false, desc: "Select Yes or No." },
  { name: "Planning: Appointment required", required: false, desc: "Select Yes or No." },
  { name: "Recycling: Clothing", required: false, desc: "Select Yes or No." },
  { name: "Recycling: Electronics", required: false, desc: "Select Yes or No." },
  { name: "Service options: Curbside pickup", required: false, desc: "Select Yes or No." },
  { name: "Service options: Delivery", required: false, desc: "Select Yes or No." },
  { name: "Service options: In-store pickup", required: false, desc: "Select Yes or No." },
  { name: "Service options: In-store shopping", required: false, desc: "Select Yes or No." },
  { name: "Service options: Onsite services", required: false, desc: "Select Yes or No." },
  { name: "System ID [Read Only]", required: false, desc: "The unique system identifier. Leave blank to create a new location. Do not modify when updating." },
];

const UNCLAIMED_FIELD_GUIDELINES: FieldGuide[] = [
  { name: "Title [Read Only]", required: false, desc: "Business profile title. For reference only." },
  { name: "Rating [Read Only]", required: false, desc: "Average star rating. For reference only." },
  { name: "Total Ratings [Read Only]", required: false, desc: "Total number of reviews. For reference only." },
  { name: "Address [Read Only]", required: false, desc: "Business address. For reference only." },
  { name: "Phone [Read Only]", required: false, desc: "Business phone number. For reference only." },
  { name: "Map Link [Read Only]", required: false, desc: "Google Maps link for this listing. For reference only." },
  { name: "Identified At [Read Only]", required: false, desc: "Date the profile was first detected. For reference only." },
  { name: "Last Action At [Read Only]", required: false, desc: "Date of the last status change. For reference only." },
  { name: "Status", required: true, desc: "The status to apply to this unclaimed profile." },
  { name: "Remarks", required: false, desc: "Remark to add to this listing (max 500 characters). Leave blank to skip." },
  { name: "System ID [Read Only]", required: true, desc: "The unique system identifier. Do not modify." },
];

const SAMPLE_CSV_DATA = [
  {
    "Business Name": "Starbucks Reserve Fort",
    "Store Code": "SBUX-MUM-001",
    "Business Description (short)": "Premium coffee shop and roastery in Fort.",
    "Business Description (long)": "Discover artisan coffee, single-origin brews, fresh bakery products and relaxed seating in the heart of Mumbai's historic Fort district.",
    "Business Status": "OPEN",
    "Opening Date": "2021-05-15",
    "Auto Sync": "Yes",
    "Tags": "COFFEE,PREMIUM,ROASTERY",
    "Address line 1": "45 Horniman Circle, Fort",
    "Address line 2": "Near Town Hall",
    "Address line 3": "",
    "Address line 4": "",
    "Sub-locality": "Fort",
    "Locality": "Mumbai",
    "Post Code": "400001",
    "Administrative Area": "Maharashtra",
    "Country": "IN",
    "Latitude": "18.9322",
    "Longitude": "72.8347",
    "Google Location Group": "West Region Stores",
    "Google Primary Category": "Coffee shop",
    "Google Additional Categories": "Cafe, Espresso bar",
    "Google Labels": "Featured, Cafe, Downtown",
    "Primary Phone Number": "+91 98765 43210",
    "Additional Phone Number 1": "+91 98765 43211",
    "Additional Phone Number 2": "",
    "Customer Support Phone": "+91 1800 123 456",
    "Customer Support Email": "support@starbucks.in",
    "Customer Support URL": "https://starbucks.in/help",
    "Reporting Person Emails": "manager.fort@starbucks.in",
    "Website URL": "https://starbucks.in",
    "Menu URL": "https://starbucks.in/menu",
    "Order URL": "https://starbucks.in/order",
    "Reservation URL": "https://starbucks.in/reserve",
    "Facebook URL": "https://facebook.com/starbucksin",
    "X URL": "https://x.com/starbucksin",
    "LinkedIn URL": "https://linkedin.com/company/starbucks",
    "Instagram URL": "https://instagram.com/starbucksin",
    "Youtube URL": "https://youtube.com/starbucks",
    "WhatsApp URL": "https://wa.me/919876543210",
    "Pinterest URL": "https://pinterest.com/starbucks",
    "Place an Order Link": "https://starbucks.in/order",
    "Inventory Search URL": "",
    "Texting Number URL": "sms:+919876543210",
    "Business Hours": "Mo: 08:00-22:00, Tu: 08:00-22:00, We: 08:00-22:00",
    "Special Hours": "25-12-2026 (Christmas): 10:00-18:00",
    "Accessibility: Assisted listening devices": "Yes",
    "Accessibility: Assistive hearing loop": "Yes",
    "Accessibility: Wheelchair accessible entrance": "Yes",
    "Accessibility: Wheelchair accessible parking lot": "Yes",
    "Accessibility: Wheelchair accessible restroom": "Yes",
    "Accessibility: Wheelchair accessible seating": "Yes",
    "Amenities: Gender-neutral restroom": "Yes",
    "Amenities: Restroom": "Yes",
    "Amenities: Wi-Fi": "Free Wi-Fi",
    "Crowd: LGBTQ+ friendly": "Yes",
    "Crowd: Transgender safespace": "Yes",
    "From the business: Identifies as Asian-owned": "No",
    "From the business: Identifies as Black-owned": "No",
    "From the business: Identifies as disabled-owned": "No",
    "From the business: Identifies as Indigenous-owned": "No",
    "From the business: Identifies as Latino-owned": "No",
    "From the business: Identifies as LGBTQ+ owned": "No",
    "From the business: Identifies as veteran-owned": "No",
    "From the business: Identifies as women-owned": "No",
    "From the business: Small business": "No",
    "Offerings: Kids' shoes": "No",
    "Offerings: Kids' toys": "No",
    "Offerings: Men's clothing": "No",
    "Offerings: Men's shoes": "No",
    "Offerings: Service guarantee": "Yes",
    "Offerings: Used goods": "No",
    "Offerings: Women's clothing": "No",
    "Offerings: Women's shoes": "No",
    "Parking: Free parking garage": "No",
    "Parking: Free parking lot": "Yes",
    "Parking: Free street parking": "No",
    "Parking: On-site parking": "Yes",
    "Parking: Paid parking garage": "No",
    "Parking: Paid parking lot": "No",
    "Parking: Paid street parking": "Yes",
    "Payments: Cash-only": "No",
    "Payments: Checks": "No",
    "Payments: Credit cards [Yes/No]": "Yes",
    "Payments: Credit cards [Multiple]": "Visa, Mastercard, Amex",
    "Payments: Debit cards": "Yes",
    "Payments: Google Pay": "Yes",
    "Payments: NFC mobile payments": "Yes",
    "Planning: Appointment required": "No",
    "Recycling: Clothing": "No",
    "Recycling: Electronics": "No",
    "Service options: Curbside pickup": "Yes",
    "Service options: Delivery": "Yes",
    "Service options: In-store pickup": "Yes",
    "Service options: In-store shopping": "Yes",
    "Service options: Onsite services": "Yes",
    "System ID [Read Only]": "LOC-98401",
  },
  {
    "Business Name": "Nike Flagship Connaught Place",
    "Store Code": "NIKE-DEL-002",
    "Business Description (short)": "Sportswear and athletic footwear flagship store.",
    "Business Description (long)": "Shop latest sneakers, activewear, running shoes, and sports accessories with expert fitting services.",
    "Business Status": "OPEN",
    "Opening Date": "2019-11-20",
    "Auto Sync": "Yes",
    "Tags": "SPORTS,FOOTWEAR,CLOTHING",
    "Address line 1": "Block A, Connaught Place",
    "Address line 2": "Inner Circle",
    "Address line 3": "",
    "Address line 4": "",
    "Sub-locality": "Connaught Place",
    "Locality": "New Delhi",
    "Post Code": "110001",
    "Administrative Area": "Delhi",
    "Country": "IN",
    "Latitude": "28.6315",
    "Longitude": "77.2167",
    "Google Location Group": "North Region Stores",
    "Google Primary Category": "Shoe store",
    "Google Additional Categories": "Clothing store, Sportswear store",
    "Google Labels": "Flagship, Retail, Mall",
    "Primary Phone Number": "+91 98111 22233",
    "Additional Phone Number 1": "+91 98111 22234",
    "Additional Phone Number 2": "",
    "Customer Support Phone": "+91 1800 999 888",
    "Customer Support Email": "help@nike.in",
    "Customer Support URL": "https://nike.in/support",
    "Reporting Person Emails": "manager.cp@nike.in",
    "Website URL": "https://nike.in",
    "Menu URL": "",
    "Order URL": "https://nike.in/shop",
    "Reservation URL": "",
    "Facebook URL": "https://facebook.com/nikeindia",
    "X URL": "https://x.com/nikeindia",
    "LinkedIn URL": "https://linkedin.com/company/nike",
    "Instagram URL": "https://instagram.com/nikeindia",
    "Youtube URL": "https://youtube.com/nike",
    "WhatsApp URL": "https://wa.me/919811122233",
    "Pinterest URL": "https://pinterest.com/nike",
    "Place an Order Link": "https://nike.in/cart",
    "Inventory Search URL": "https://nike.in/search",
    "Texting Number URL": "sms:+919811122233",
    "Business Hours": "Mo: 10:00-21:00, Tu: 10:00-21:00, We: 10:00-21:00",
    "Special Hours": "01-01-2027: closed",
    "Accessibility: Assisted listening devices": "No",
    "Accessibility: Assistive hearing loop": "No",
    "Accessibility: Wheelchair accessible entrance": "Yes",
    "Accessibility: Wheelchair accessible parking lot": "Yes",
    "Accessibility: Wheelchair accessible restroom": "Yes",
    "Accessibility: Wheelchair accessible seating": "Yes",
    "Amenities: Gender-neutral restroom": "No",
    "Amenities: Restroom": "Yes",
    "Amenities: Wi-Fi": "Free Wi-Fi",
    "Crowd: LGBTQ+ friendly": "Yes",
    "Crowd: Transgender safespace": "Yes",
    "From the business: Identifies as Asian-owned": "No",
    "From the business: Identifies as Black-owned": "No",
    "From the business: Identifies as disabled-owned": "No",
    "From the business: Identifies as Indigenous-owned": "No",
    "From the business: Identifies as Latino-owned": "No",
    "From the business: Identifies as LGBTQ+ owned": "No",
    "From the business: Identifies as veteran-owned": "No",
    "From the business: Identifies as women-owned": "No",
    "From the business: Small business": "No",
    "Offerings: Kids' shoes": "Yes",
    "Offerings: Kids' toys": "No",
    "Offerings: Men's clothing": "Yes",
    "Offerings: Men's shoes": "Yes",
    "Offerings: Service guarantee": "Yes",
    "Offerings: Used goods": "No",
    "Offerings: Women's clothing": "Yes",
    "Offerings: Women's shoes": "Yes",
    "Parking: Free parking garage": "No",
    "Parking: Free parking lot": "No",
    "Parking: Free street parking": "No",
    "Parking: On-site parking": "Yes",
    "Parking: Paid parking garage": "Yes",
    "Parking: Paid parking lot": "Yes",
    "Parking: Paid street parking": "Yes",
    "Payments: Cash-only": "No",
    "Payments: Checks": "No",
    "Payments: Credit cards [Yes/No]": "Yes",
    "Payments: Credit cards [Multiple]": "Visa, Mastercard, Amex",
    "Payments: Debit cards": "Yes",
    "Payments: Google Pay": "Yes",
    "Payments: NFC mobile payments": "Yes",
    "Planning: Appointment required": "No",
    "Recycling: Clothing": "Yes",
    "Recycling: Electronics": "No",
    "Service options: Curbside pickup": "Yes",
    "Service options: Delivery": "No",
    "Service options: In-store pickup": "Yes",
    "Service options: In-store shopping": "Yes",
    "Service options: Onsite services": "Yes",
    "System ID [Read Only]": "LOC-98402",
  },
];

interface ValidationRule {
  field: string;
  rules: string[];
}

const VALIDATION_RULES: ValidationRule[] = [
  { field: "Business Name", rules: ["Cannot be empty (Required)", "Maximum 75 characters"] },
  { field: "Store Code", rules: ["Cannot be empty (Required)", "Maximum 50 characters"] },
  { field: "Business Description (short)", rules: ["Maximum 255 characters"] },
  { field: "Business Description (long)", rules: ["Maximum 750 characters"] },
  {
    field: "Business Status",
    rules: [
      "Cannot be empty (Required)",
      "Must be one of: OPEN, CLOSED_PERMANENTLY, CLOSED_TEMPORARILY",
    ],
  },
  { field: "Tags", rules: ["Must be a list/array format", "No duplicate values allowed"] },
  { field: "Address line 1", rules: ["Cannot be empty (Required)", "Maximum 255 characters"] },
  { field: "Address line 2", rules: ["Maximum 255 characters"] },
  { field: "Address line 3", rules: ["Maximum 255 characters"] },
  { field: "Address line 4", rules: ["Maximum 255 characters"] },
  { field: "Sub-locality", rules: ["Maximum 255 characters"] },
  { field: "Locality", rules: ["Cannot be empty (Required)", "Maximum 255 characters"] },
  { field: "Post Code", rules: ["Cannot be empty (Required)", "Maximum 20 characters"] },
  { field: "Administrative Area", rules: ["Cannot be empty (Required)", "Maximum 255 characters"] },
  { field: "Country", rules: ["Cannot be empty (Required)", "Maximum 2 characters"] },
  { field: "Latitude", rules: ["Cannot be empty (Required)", "Must be a number"] },
  { field: "Longitude", rules: ["Cannot be empty (Required)", "Must be a number"] },
  { field: "Google Location Group", rules: ["Cannot be empty (Required)"] },
  { field: "Google Primary Category", rules: ["Cannot be empty (Required)"] },
  { field: "Google Additional Categories", rules: ["Must be a list/array format", "Maximum 9 items"] },
  {
    field: "Google Labels",
    rules: ["Must be a list/array format", "Maximum 10 items", "Maximum 255 characters"],
  },
  { field: "Primary Phone Number", rules: ["Maximum 50 characters"] },
  { field: "Additional Phone Number 1", rules: ["Must be text"] },
  { field: "Additional Phone Number 2", rules: ["Must be text"] },
  { field: "Customer Support Phone", rules: ["Maximum 50 characters"] },
  {
    field: "Customer Support Email",
    rules: ["Must be a valid email address", "Maximum 255 characters"],
  },
  { field: "Customer Support URL", rules: ["Maximum 2048 characters"] },
  {
    field: "Reporting Person Emails",
    rules: ["Must be a list/array format", "Must be a valid email address", "Maximum 255 characters"],
  },
  { field: "Website URL", rules: ["Maximum 2048 characters"] },
  { field: "Menu URL", rules: ["Maximum 2048 characters"] },
  { field: "Order URL", rules: ["Maximum 2048 characters"] },
  { field: "Reservation URL", rules: ["Maximum 2048 characters"] },
  { field: "Facebook URL", rules: ["Maximum 2048 characters"] },
  { field: "X URL", rules: ["Maximum 2048 characters"] },
  { field: "LinkedIn URL", rules: ["Maximum 2048 characters"] },
  { field: "Instagram URL", rules: ["Maximum 2048 characters"] },
  { field: "Youtube URL", rules: ["Maximum 2048 characters"] },
  { field: "WhatsApp URL", rules: ["Maximum 2048 characters"] },
  { field: "Pinterest URL", rules: ["Maximum 2048 characters"] },
  { field: "Place an Order Link", rules: ["Maximum 2048 characters"] },
  { field: "Inventory Search URL", rules: ["Maximum 2048 characters"] },
  { field: "Texting Number URL", rules: ["Maximum 2048 characters"] },
  { field: "Business Hours", rules: ["Cannot be empty (Required)", "Must be a list/array format"] },
  { field: "Special Hours", rules: ["Must be a list/array format"] },
  { field: "Payments: Credit cards [Multiple]", rules: ["Must be a list/array format"] },
  { field: "System ID", rules: ["Must be a valid UUID"] },
];

const UNCLAIMED_VALIDATION_RULES: ValidationRule[] = [
  { field: "Status", rules: ["Cannot be empty (Required)"] },
  { field: "Remarks", rules: ["Maximum 500 characters"] },
  {
    field: "System ID",
    rules: ["Cannot be empty (Required)", "Must be a valid UUID"],
  },
];

const UNCLAIMED_DATA_EXAMPLES = [
  { label: "Title [Read Only]", readOnly: true, value: "Acme Store - Downtown" },
  { label: "Rating [Read Only]", readOnly: true, value: "4.2" },
  { label: "Total Ratings [Read Only]", readOnly: true, value: "128" },
  { label: "Address [Read Only]", readOnly: true, value: "123 Main St, Springfield" },
  { label: "Phone [Read Only]", readOnly: true, value: "+1 217-555-0100" },
  { label: "Map Link [Read Only]", readOnly: true, value: "https://www.google.com/maps?cid=12345" },
  { label: "Identified At [Read Only]", readOnly: true, value: "2025-01-10 09:30:00" },
  { label: "Last Action At [Read Only]", readOnly: true, value: "2025-03-01 14:00:00" },
  { label: "Status", readOnly: false, value: "claimed" },
  { label: "Remarks", readOnly: false, value: "Contacted the owner on 2025-01-15." },
  { label: "System ID [Read Only]", readOnly: true, value: "550e8400-e29b-41d4-a716-446655440000" },
];

interface LocationsFormatGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "master" | "unclaimed";
}

export function LocationsFormatGuideModal({
  open,
  onOpenChange,
  type = "master",
}: LocationsFormatGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "rules" | "example">("details");
  const [copied, setCopied] = useState(false);

  const activeGuidelines = type === "unclaimed" ? UNCLAIMED_FIELD_GUIDELINES : FIELD_GUIDELINES;
  const activeRules = type === "unclaimed" ? UNCLAIMED_VALIDATION_RULES : VALIDATION_RULES;

  // Generate CSV text
  const headers = activeGuidelines.map((f) => f.name);
  const fullCsvText =
    type === "unclaimed"
      ? "Title,Rating,Total Ratings,Address,Phone,Map Link,Identified At,Last Action At,Status,Remarks,System ID\n" +
        '"Acme Store - Downtown",4.2,128,"123 Main St, Springfield",+1 217-555-0100,https://www.google.com/maps?cid=12345,2025-01-10 09:30:00,2025-03-01 14:00:00,claimed,"Contacted the owner on 2025-01-15.",550e8400-e29b-41d4-a716-446655440000'
      : [
          headers.join(","),
          ...SAMPLE_CSV_DATA.map((row) =>
            headers
              .map((h) => {
                const val = (row as Record<string, string>)[h] ?? "";
                return val.includes(",") || val.includes('"') || val.includes("\n")
                  ? `"${val.replace(/"/g, '""')}"`
                  : val;
              })
              .join(",")
          ),
        ].join("\n");

  const handleDownloadTemplate = () => {
    const blob = new Blob([fullCsvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      type === "unclaimed"
        ? "unclaimed_profiles_import_template.csv"
        : "locations_import_template_full.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Import template CSV downloaded!");
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(fullCsvText);
    setCopied(true);
    toast.success("CSV example data copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[92vw] max-h-[90vh] bg-white dark:bg-[#141416] border-slate-200 dark:border-[#27272a] text-foreground p-6 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-200 dark:border-[#27272a] shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Import File Guidelines
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Learn about the expected file format and column structure.
            </p>
          </div>
        </DialogHeader>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 py-3 shrink-0 border-b border-slate-200 dark:border-[#27272a]">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "details"
                ? "bg-[#27272a] dark:bg-[#27272a] text-white shadow-xs font-bold border border-slate-700"
                : "bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-muted-foreground hover:text-foreground"
            }`}
          >
            Column Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "rules"
                ? "bg-[#27272a] dark:bg-[#27272a] text-white shadow-xs font-bold border border-slate-700"
                : "bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-muted-foreground hover:text-foreground"
            }`}
          >
            Validation Rules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("example")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "example"
                ? "bg-[#27272a] dark:bg-[#27272a] text-white shadow-xs font-bold border border-slate-700"
                : "bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] text-muted-foreground hover:text-foreground"
            }`}
          >
            Data Example
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 custom-scrollbar">
          {activeTab === "details" && (
            <div className="space-y-2">
              {activeGuidelines.map((field) => (
                <div
                  key={field.name}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <span className="font-bold text-foreground block min-w-[160px]">
                      {field.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        field.required
                          ? "bg-red-950/60 dark:bg-red-950/80 text-red-400 border border-red-800/80"
                          : "bg-slate-200 dark:bg-[#18181b] text-slate-400 border border-slate-300 dark:border-[#27272a]"
                      }`}
                    >
                      {field.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal flex-1">
                    {field.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-3">
              {activeRules.map((rule) => (
                <div
                  key={rule.field}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] space-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Info className="size-3.5 text-blue-500 shrink-0" />
                    <span>{rule.field}</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1 pl-5">
                    {rule.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === "example" && (
            <div>
              {type === "unclaimed" ? (
                <div className="space-y-2">
                  {UNCLAIMED_DATA_EXAMPLES.map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-foreground min-w-[200px]">
                        <span>{item.label}</span>
                        {item.readOnly && (
                          <Lock className="size-3 text-blue-500/80 shrink-0" />
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header Action Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-foreground text-xs">
                        Sample Location Import Data ({headers.length} Columns)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Scroll horizontally to inspect all column values or copy the raw CSV format below.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCsv}
                      className="h-7 text-xs px-2.5 gap-1 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] text-foreground hover:bg-slate-100 dark:hover:bg-[#27272a] cursor-pointer"
                    >
                      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{copied ? "Copied!" : "Copy CSV Data"}</span>
                    </Button>
                  </div>

                  {/* Data Table */}
                  <div className="rounded-lg border border-slate-200 dark:border-[#27272a] overflow-hidden bg-slate-50 dark:bg-[#09090b]">
                    <div className="overflow-x-auto max-h-[350px]">
                      <table className="w-full text-[11px] border-collapse min-w-[3500px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-[#18181b] border-b border-slate-200 dark:border-[#27272a]">
                            <th className="p-2 text-left font-bold text-muted-foreground border-r border-slate-200 dark:border-[#27272a] sticky left-0 bg-slate-100 dark:bg-[#18181b] z-10 w-10">
                              #
                            </th>
                            {headers.map((h) => {
                              const isReq = FIELD_GUIDELINES.find((f) => f.name === h)?.required;
                              return (
                                <th
                                  key={h}
                                  className="p-2 text-left font-bold text-foreground border-r border-slate-200 dark:border-[#27272a] whitespace-nowrap"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span>{h}</span>
                                    {isReq && (
                                      <span className="text-[9px] text-blue-500 font-normal">*</span>
                                    )}
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-[#27272a]">
                          {SAMPLE_CSV_DATA.map((row, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-100/50 dark:hover:bg-[#18181b]/50 transition-colors"
                            >
                              <td className="p-2 font-mono text-muted-foreground border-r border-slate-200 dark:border-[#27272a] sticky left-0 bg-slate-50 dark:bg-[#09090b]">
                                {idx + 1}
                              </td>
                              {headers.map((h) => {
                                const val = (row as Record<string, string>)[h] ?? "";
                                return (
                                  <td
                                    key={h}
                                    className="p-2 border-r border-slate-200 dark:border-[#27272a] max-w-[250px] truncate text-slate-700 dark:text-slate-300 font-mono text-[10px]"
                                    title={val}
                                  >
                                    {val || <span className="text-slate-400 dark:text-slate-600 italic">empty</span>}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Raw CSV Code Block */}
                  <div className="space-y-1.5">
                    <p className="font-bold text-foreground text-xs">Raw CSV Format:</p>
                    <pre className="font-mono text-[10px] bg-slate-900 text-blue-400 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-[200px] leading-relaxed custom-scrollbar">
                      {fullCsvText}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#27272a] shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs font-semibold px-4 cursor-pointer gap-1"
          >
            <X className="size-3.5" />
            <span>Close</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadTemplate}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-4 cursor-pointer gap-1.5 shadow-sm"
          >
            <Download className="size-3.5" />
            <span>Download Template</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

