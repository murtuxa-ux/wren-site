// Wren Hale — product + reel data. Edit this file to add a Reel or product.
// Prices: "as of" date is required by Amazon Associates when a price is shown.
window.WREN = {
  tag: "wrenhale-20",
  asOf: "25 Sep 2026",
  reels: [
    { id:"thu", day:"Thu", kind:"DIY",  hook:"No drill. No nails.",         title:"The $38 headboard wall",           room:"bedroom", video:"video/thu.mp4", poster:"video/thu.jpg", products:["panels","tape","level"] },
    { id:"fri", day:"Fri", kind:"Find", hook:"Nobody talks about this",     title:"Counter lights, no electrician",   room:"kitchen", video:"video/fri.mp4", poster:"video/fri.jpg", products:["puck","strip"] },
    { id:"sat", day:"Sat", kind:"DIY",  hook:"Ugliest thing. $12 fix.",     title:"Hide the closet door",             room:"entry",   video:"video/sat.mp4", poster:"video/sat.jpg", products:["rod","curtain"] },
    { id:"sun", day:"Sun", kind:"Dupe", hook:"Looked like $400",            title:"The fluted table dupe",            room:"living",  video:"video/sun.mp4", poster:"video/sun.jpg", products:["table","lamp"] },
    { id:"mon", day:"Mon", kind:"DIY",  hook:"Peel. Stick. Done.",          title:"Cabinet handles, zero holes",      room:"kitchen", video:"video/mon.mp4", poster:"video/mon.jpg", products:["handles","alcohol"] },
    { id:"tue", day:"Tue", kind:"Find", hook:"The $20 swap",                title:"Matte black faucet in 2 minutes",  room:"kitchen", video:"video/tue.mp4", poster:"video/tue.jpg", products:["sprayer"] },
    { id:"wed", day:"Wed", kind:"Dupe", hook:"Studio. Hotel energy.",       title:"The hotel bed formula",            room:"bedroom", video:"video/wed.mp4", poster:"video/wed.jpg", products:["duvet","pillows","throw"] }
  ],
  // room: bedroom | kitchen | living | bath | entry   kind: DIY | Find | Dupe
  products: [
    { id:"panels",  name:"Wood-look peel & stick wall panels", why:"Three across the bed reads as a headboard. Peel from the middle out.", price:38, room:"bedroom", kind:"DIY",  flag:"new", img:"img/thu.jpg", q:"wood peel and stick wall panels", dupe:"peel and stick wood wall planks" },
    { id:"tape",    name:"Painter's tape (for the centre line)", why:"One strip down the middle of the wall so the first panel goes on straight.", price:6, room:"bedroom", kind:"DIY", img:"img/thu.jpg", q:"painters tape 1 inch", dupe:null },
    { id:"level",   name:"Pocket spirit level", why:"Tiny, magnetic, lives in the kitchen drawer. Every DIY on this page uses it.", price:9, room:"bedroom", kind:"DIY", img:"img/thu.jpg", q:"small magnetic torpedo level", dupe:null },
    { id:"puck",    name:"Rechargeable under-cabinet puck lights", why:"Stick on, tap on. Charge every few weeks. The counter stops being a cave.", price:22, room:"kitchen", kind:"Find", flag:"new", img:"img/fri.jpg", q:"rechargeable puck lights under cabinet", dupe:"wireless under cabinet lights rechargeable" },
    { id:"strip",   name:"Motion-sensor LED strip (under the counter lip)", why:"Comes on when you walk in at 2 am. Adhesive back, USB charge.", price:18, room:"kitchen", kind:"Find", img:"img/fri.jpg", q:"motion sensor led strip light rechargeable", dupe:null },
    { id:"rod",     name:"Tension rod, 28–48 in", why:"Buy it 2 in wider than the frame. Twist until it holds. No screws.", price:12, room:"entry", kind:"DIY", flag:"new", img:"img/sat.jpg", q:"tension curtain rod 28 to 48 inch", dupe:"spring tension rod white" },
    { id:"curtain", name:"Linen-look curtain panel", why:"Let it pool half an inch on the floor. That is what makes it look intentional.", price:19, room:"entry", kind:"DIY", img:"img/sat.jpg", q:"linen look curtain panel 84 inch", dupe:"natural linen curtain panel" },
    { id:"table",   name:"Fluted round side table", why:"Same ribbed look as the $400 one. Holds a lamp and a coffee. Nobody has guessed.", price:38, room:"living", kind:"Dupe", flag:"new", img:"img/sun.jpg", q:"fluted round side table white", dupe:"ribbed round end table" },
    { id:"lamp",    name:"Rechargeable cordless table lamp", why:"No outlet needed, so the side table can go anywhere. Three brightness levels.", price:32, room:"living", kind:"Find", img:"img/sun.jpg", q:"cordless rechargeable table lamp", dupe:null },
    { id:"handles", name:"Peel & stick cabinet handles, matte black (10)", why:"Peel the red backing, press 30 seconds, leave overnight. Hairdryer to remove.", price:19, room:"kitchen", kind:"DIY", flag:"new", img:"img/mon.jpg", q:"adhesive cabinet handles matte black no drill", dupe:"self adhesive drawer pulls black" },
    { id:"alcohol", name:"Rubbing alcohol wipes", why:"Wipe the door first or the handle falls off in a week.", price:5, room:"kitchen", kind:"DIY", img:"img/mon.jpg", q:"isopropyl alcohol wipes", dupe:null },
    { id:"sprayer", name:"Matte black pull-down faucet sprayer attachment", why:"Screws onto any standard faucet by hand. Two minutes. Whole sink looks different.", price:20, room:"kitchen", kind:"Find", flag:"new", img:"img/tue.jpg", q:"faucet sprayer attachment matte black pull down", dupe:"kitchen faucet extender sprayer black" },
    { id:"duvet",   name:"Hotel-style white duvet set", why:"Crisp, a bit heavy, washes well. The base of the whole hotel look.", price:58, room:"bedroom", kind:"Dupe", flag:"new", img:"img/wed.jpg", q:"hotel style white duvet cover set queen", dupe:"white duvet cover set queen" },
    { id:"pillows", name:"Two extra sleeping pillows", why:"Four pillows against the wall is the hotel trick. Two is a bed, four is a room.", price:24, room:"bedroom", kind:"Dupe", img:"img/wed.jpg", q:"hotel pillows queen 2 pack", dupe:null },
    { id:"throw",   name:"Sage waffle throw", why:"Folded in thirds at the foot of the bed. One colour, never a pattern.", price:26, room:"bedroom", kind:"Dupe", img:"img/wed.jpg", q:"sage green waffle knit throw blanket", dupe:null },
    { id:"mirror",  name:"Arched leaner mirror, 64 in", why:"Leans, never hangs. Doubles the light in a studio.", price:89, room:"living", kind:"Dupe", flag:"restock", img:"img/sun.jpg", q:"arched full length leaner mirror gold", dupe:"arch floor mirror 64 inch" },
    { id:"hooks",   name:"Adhesive wall hooks, brass (6)", why:"Coats by the door without a single hole. Hold 5 lb each.", price:11, room:"entry", kind:"Find", img:"img/sat.jpg", q:"adhesive wall hooks brass heavy duty", dupe:null },
    { id:"shower",  name:"Peel & stick shower tile sheets", why:"Covers the beige 1994 tile. Waterproof, removable on move-out.", price:29, room:"bath", kind:"DIY", flag:"restock", img:"img/mon.jpg", q:"peel and stick shower wall tile waterproof", dupe:"peel and stick bathroom tile" },
    { id:"caddy",   name:"Rustproof hanging shower caddy", why:"Hangs over the head. Nothing suction-cupped falls at 3 am.", price:17, room:"bath", kind:"Find", img:"img/tue.jpg", q:"rustproof hanging shower caddy black", dupe:null }
  ]
};
