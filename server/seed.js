const names = ['Aarav','Ananya','Kabir','Diya','Rohan','Isha','Vihaan','Meera','Arjun','Saanvi','Kartik','Riya','Aditya','Naina','Dev','Pooja','Ishaan','Tanya','Yash','Kritika','Harsh','Simran','Manav','Aditi','Rahul','Sneha','Nikhil','Priya','Siddharth','Avni','Varun','Neha','Tushar','Kavya','Mohit','Shreya'];
const places = ['Dehradun','Graphic Era University','Delhi','IIT Roorkee','Mumbai','Christ University','Bengaluru','BITS Pilani','Pune','VIT Vellore','Jaipur','DU North Campus'];
const pool = ['Travel','Music','Coding','Cricket','Photography','Coffee','Movies','Gym','Reading','Cooking','Gaming','Trekking','Anime','Stand-up comedy'];
const bios = [
  'Chai over coffee, always. Looking for someone to share late-night maggi with.',
  'Weekend trekker, weekday coder. Ask me about my last trip.',
  'I make a mean playlist. Send me your favourite song.',
  'Cricket fanatic. Yes, I will talk about last night\'s match.',
  'Aspiring foodie who tries every street-food stall in town.',
  'Bookworm with a soft spot for old Bollywood movies.',
  'Gym in the morning, memes at night.',
  'Photographer chasing golden hours.',
  'Introvert until you mention anime or biryani.',
  'Part-time dreamer, full-time overthinker. Let\'s grab a coffee.',
  'Stand-up comedy fan. Make me laugh and you\'re halfway there.',
  'Gamer girl/guy, will beat you at FIFA. Probably.'
];

function makeProfiles() {
  return names.map((name, i) => ({
    id: i + 1,
    name,
    age: 19 + (i * 7) % 9,
    photo: `https://i.pravatar.cc/600?img=${(i * 2) % 70 + 1}`,
    bio: bios[i % bios.length],
    location: places[i % places.length],
    interests: [...new Set([pool[(i * 3) % 14], pool[(i * 5 + 1) % 14], pool[(i * 7 + 2) % 14]])],
    // SERVER-ONLY: every 3rd profile already liked the logged-in user (for demo matches)
    likedMe: (i + 1) % 3 === 0
  }));
}
module.exports = { makeProfiles };
