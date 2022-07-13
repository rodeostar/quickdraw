import type { APIHandler } from "@lib/types.ts";

const fn = [
  "Hazel",
  "Rose",
  "Malia",
  "Shayla",
  "Fiona",
  "Sylvia",
  "Clarissa",
  "Maritza",
  "Virginia",
  "Braelyn",
  "Jolie",
  "Jaidyn",
  "Kinsley",
  "Kirsten",
  "Laney",
  "Marilyn",
  "Whitney",
  "Janessa",
  "Raquel",
  "Anika",
  "Kamila",
  "Aria",
  "Rubi",
  "Adelyn",
  "Amara",
  "Ayanna",
  "Teresa",
  "Zariah",
  "Kaleigh",
];

const ln = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Wilson",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Hernandez",
  "Moore",
  "Martin",
  "Jackson",
  "Thompson",
  "White",
  "Lopez",
  "Lee",
  "Gonzalez",
  "Harris",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Perez",
  "Hall",
  "Young",
];

function pickRandom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

const handler: APIHandler = (_, response) => {
  response.headers.set("Content-Type", "application/json");
  response.body = {
    name: [pickRandom(fn), pickRandom(ln)].join(" "),
  };
};

export default handler;
