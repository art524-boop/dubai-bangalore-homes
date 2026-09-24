export const SITE = {
  name: "Concrest",
  tagline: "Constructions and Land Developers · International Property",
  whatsappNumber: "919999999999",
  email: "hello@concrest.com",
  phoneIndia: "+91 99999 99999",
  phoneUae: "+971 4 000 0000",
  /** Set this to your Cal.com link (e.g. "https://cal.com/concrest/consult") to
   * show the self-scheduling widget instead of the request form. */
  calLink: "",
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const OFFICES = [
  {
    city: "Bangalore",
    country: "India",
    address: "Level 7, Prestige Atrium, Central Street, Bangalore 560001",
    hoursLocal: "Mon–Sat · 9:30 AM – 7:00 PM IST",
    hoursOther: "6:00 AM – 3:30 PM GST",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    city: "Dubai",
    country: "UAE",
    address: "Office 1204, Boulevard Plaza Tower 1, Downtown Dubai",
    hoursLocal: "Mon–Sat · 9:00 AM – 6:00 PM GST",
    hoursOther: "10:30 AM – 7:30 PM IST",
    lat: 25.1972,
    lng: 55.2744,
  },
];
