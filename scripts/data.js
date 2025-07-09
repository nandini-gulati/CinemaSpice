// Movie data
const moviesData = [
    {
        id: 1,
        title: "Alice in Wonderland",
        description: "Alice returns to the whimsical world and faces the Red Queen.",
        poster: "/images/aliceinwonderland.jpg",
        backdrop: "/images/aliceinwonderland.jpg",
        rating: 6.4,
        duration: "108 min",
        genre: ["Fantasy", "Adventure", "Family"],
        releaseDate: "2010-03-05",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=9POCgSRVvf0"
    },
    {
        id: 2,
        title: "Andhadhun",
        description: "A blind pianist becomes embroiled in a series of murders.",
        poster: "/images/andhadhun.jpg",
        backdrop: "/images/andhadhun.jpg",
        rating: 8.2,
        duration: "139 min",
        genre: ["Thriller", "Crime", "Drama","Hindi"],
        releaseDate: "2018-10-05",
        isKidsMovie: false,
        ageRating: "A",
        trailerUrl: "https://youtu.be/Yw7ue1e23jM?si=2qIzLqvTnnpWSBjP"
    },
    {
        id: 3,
        title: "A Silent Voice",
        description: "A former bully tries to make amends with a deaf girl he tormented in school.",
        poster: "/images/silentvoice.jpg",
        backdrop: "/images/silentvoice.jpg",
        rating: 8.1,
        duration: "130 min",
        genre: ["Animation", "Drama", "Anime"],
        releaseDate: "2016-09-17",
        isKidsMovie: true,
        ageRating: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=nfK6UgLra7g"
    },
    {
        id: 4,
        title: "Attack on Titan: Chronicle",
        description: "A recap of the first three seasons of the legendary anime, covering the battle for survival.",
        poster: "/images/aot-chronicle.jpg",
        backdrop: "/images/aot-chronicle.jpg",
        rating: 7.5,
        duration: "122 min",
        genre: ["Anime", "Action", "Mystery"],
        releaseDate: "2020-07-17",
        isKidsMovie: true,
        ageRating: "A",
        trailerUrl: "https://youtu.be/vAicREQ4uWM?si=CSxYEmxn6H77jfUE"
    },
    {
        id: 5,
        title: "Avengers: Endgame",
        description: "The Avengers unite for one last stand against Thanos to restore balance to the universe.",
        poster: "/images/endgame.jpg",
        backdrop: "/images/endgame.jpg",
        rating: 8.4,
        duration: "181 min",
        genre: ["Action", "Adventure", "Sci-Fi"],
        releaseDate: "2019-04-26",
        isKidsMovie: true,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
    },
    {
        id: 6,
        title: "Beauty and the Beast",
        description: "A cursed prince meets a brave girl who changes his fate with kindness and love.",
        poster: "/images/beautyandbeast.jpg",
        backdrop: "/images/beautyandbeast.jpg",
        rating: 7.1,
        duration: "129 min",
        genre: ["Fantasy", "Romance", "Musical"],
        releaseDate: "2017-03-17",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://youtu.be/pnkgw6pAKkM?si=_pCo7y6leQBkdHno"
    },
    {
        id: 8,
        title: "Bhool Bhulaiyaa",
        description: "An NRI and his wife decide to stay in his ancestral home, paying no heed to the warnings about ghosts.",
        poster: "/images/bhoolbhulaiyaa.jpg",
        backdrop: "/images/bhoolbhulaiyaa.jpg",
        rating: 7.3,
        duration: "151 min",
        genre: ["Comedy", "Horror","Hindi"],
        releaseDate: "2007-10-12",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/ss-7iGf1xE8?si=h25QHq3_ix_t_JOv"
    },
    {
        id: 9,
        title: "Chhota Bheem and the Throne of Bali",
        description: "Bheem travels to Bali to rescue a kidnapped princess and defeat an evil villain.",
        poster: "/images/chhotabheem.jpg",
        backdrop: "/images/chhotabheem.jpg",
        rating: 5.7,
        duration: "107 min",
        genre: ["Animation", "Adventure", "Fantasy"],
        releaseDate: "2013-05-03",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://youtu.be/H7Ht-m2QMDY?si=3Bn1ap01H8bB9puk"
    },
    {
        id: 10,
        title: "Cinderella",
        description: "A young woman, mistreated by her stepmother, gets a magical chance to change her fate.",
        poster: "/images/cinderella.jpg",
        backdrop: "/images/cinderella.jpg",
        rating: 6.9,
        duration: "105 min",
        genre: ["Fantasy", "Romance", "Family"],
        releaseDate: "2015-03-13",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://youtu.be/LfR8Su4ulX0?si=0c_fUdRVr8AGDMKo"
    },
    {
        id: 11,
        title: "Coco",
        description: "Aspiring musician Miguel enters the Land of the Dead to discover his family's history.",
        poster: "/images/coco.jpg",
        backdrop: "/images/coco.jpg",
        rating: 8.4,
        duration: "105 min",
        genre: ["Animation", "Adventure", "Family"],
        releaseDate: "2017-11-22",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=Ga6RYejo6Hk"
    },
    {
        id: 12,
        title: "Drishyam",
        description: "A man goes to great lengths to protect his family after they commit an unexpected crime.",
        poster: "/images/drishyam.jpg",
        backdrop: "/images/drishyam.jpg",
        rating: 8.2,
        duration: "163 min",
        genre: ["Crime", "Drama", "Thriller","Hindi"],
        releaseDate: "2015-07-31",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/64xJLmcA2K8?si=KevQ53l0Dr5Ewoya"
    },
    {
        id: 13,
        title: "Finding Nemo",
        description: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
        poster: "/images/findingnemo.jpg",
        backdrop: "/images/findingnemo.jpg",
        rating: 8.2,
        duration: "100 min",
        genre: ["Animation", "Adventure", "Family"],
        releaseDate: "2003-05-30",
        isKidsMovie: true,
        ageRating: "G",
        trailerUrl: "https://www.youtube.com/watch?v=wZdpNglLbt8"
    },
    {
        id: 14,
        title: "Frozen II",
        description: "Three years after her coronation when Elsa celebrates Autumn, she hears a mysterious voice. She follows that voice along with Anna and their friends as they are forced to uncover the truth.",
        poster: "/images/frozen2.jpg",
        backdrop: "/images/frozen2.jpg",
        rating: 8.2,
        duration: "103 min",
        genre: ["Animation", "Family", "Musical"],
        releaseDate: "2019-11-22",
        isKidsMovie: true,
        ageRating: "G",
        trailerUrl: "https://www.youtube.com/watch?v=Zi4LMpSDccc"
    },
    {
        id: 15,
        title: "Golmaal: Fun Unlimited",
        description: "Four friends get entangled in a situation involving a blind couple and mistaken identity.",
        poster: "/images/golmaal.jpg",
        backdrop: "/images/golmaal.jpg",
        rating: 7.4,
        duration: "140 min",
        genre: ["Comedy","Hindi"],
        releaseDate: "2006-07-14",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://youtu.be/3fO1f9TndAM?si=fwhsVjqyXHVUB9rM"
    },
    {
        id: 16,
        title: "Hera Pheri",
        description: "Three unemployed men find the answer to all their money problems when they receive a call from a kidnapper.",
        poster: "/images/herapheri.jpg",
        backdrop: "/images/herapheri.jpg",
        rating: 8.2,
        duration: "145 min",
        genre: ["Comedy","Hindi"],
        releaseDate: "2000-03-31",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/m1zMmVwWr-M?si=Tlr-GTnShYz7AdUh"
    },
    {
        id: 17,
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
        poster: "/images/inception.jpg",
        backdrop: "/images/inception.jpg",
        rating: 8.8,
        duration: "148 min",
        genre: ["Action", "Sci-Fi", "Thriller"],
        releaseDate: "2010-07-16",
        isKidsMovie: false,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
    },
    {
        id: 18,
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "/images/interstellar.jpg",
        backdrop: "/images/interstellar.jpg",
        rating: 8.6,
        duration: "169 min",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        releaseDate: "2014-11-07",
        isKidsMovie: false,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
    },
    {
        id: 19,
        title: "Jab We Met",
        description: "A heartbroken businessman meets a lively girl on a train journey that changes both their lives.",
        poster: "/images/jabwemet.jpg",
        backdrop: "/images/jabwemet.jpg",
        rating: 7.9,
        duration: "138 min",
        genre: ["Romance", "Comedy","Hindi"],
        releaseDate: "2007-10-26",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://youtu.be/d9QH-LXxSQ0?si=UHlJPI03JqN27VhG"
    },
    {
        id: 20,
        title: "La La Land",
        description: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
        poster: "/images/lalaland.jpg",
        backdrop: "/images/lalaland.jpg",
        rating: 8.0,
        duration: "128 min",
        genre: ["Romance", "Drama", "Musical"],
        releaseDate: "2016-12-09",
        isKidsMovie: true,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8"
    },
    {
        id: 21,
        title: "Maleficent",
        description: "A dark fairy curses a newborn princess, only to realize the girl might restore her heart.",
        poster: "/images/maleficent.jpg",
        backdrop: "/images/maleficent.jpg",
        rating: 7.0,
        duration: "97 min",
        genre: ["Fantasy", "Adventure", "Family"],
        releaseDate: "2014-05-30",
        isKidsMovie: true,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/IuY4-6qWm-8?si=gTAYr0IMZIq8Gty7"
    },
    {
        id: 22,
        title: "Minions: The Rise of Gru",
        description: "Young Gru teams up with mischievous Minions in his journey to become a supervillain.",
        poster: "/images/minions.jpg",
        backdrop: "/images/minions.jpg",
        rating: 6.6,
        duration: "87 min",
        genre: ["Animation", "Adventure", "Comedy"],
        releaseDate: "2022-07-01",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=6DxjJzmYsXo"
    },
    {
        id: 23,
        title: "Moana",
        description: "In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches an impetuous Chieftain's daughter's island, she answers the Ocean's call to seek out the Demigod to set things right.",
        poster: "/images/moana.jpg",
        backdrop: "/images/moana.jpg",
        rating: 8.6,
        duration: "107 min",
        genre: ["Animation", "Adventure", "Family"],
        releaseDate: "2016-11-23",
        isKidsMovie: true,
        ageRating: "PG",
        trailerUrl: "https://www.youtube.com/watch?v=LKFuXETZUsI"
    },
    {
        id: 24,
        title: "Munna Bhai M.B.B.S.",
        description: "A gangster sets out to fulfill his father's dream of becoming a doctor.",
        poster: "/images/munnabhai.jpg",
        backdrop: "/images/munnabhai.jpg",
        rating: 8.1,
        duration: "156 min",
        genre: ["Comedy", "Drama","Hindi"],
        releaseDate: "2003-12-19",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/6lCGvu-hwX4?si=MxqfKSBWbdo-ESRl"
    },
    {
        id: 25,
        title: "My Neighbor Totoro",
        description: "Two sisters move to the countryside and discover magical creatures, including the lovable Totoro.",
        poster: "/images/totoro.jpg",
        backdrop: "/images/totoro.jpg",
        rating: 8.2,
        duration: "86 min",
        genre: ["Anime", "Fantasy", "Family"],
        releaseDate: "1988-04-16",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=92a7Hj0ijLs"
    },
    {
        id: 26,
        title: "One Piece Film: Red",
        description: "Luffy and the Straw Hat Pirates attend a concert where secrets about Shanks are revealed.",
        poster: "/images/onepiece.jpg",
        backdrop: "/images/onepiece.jpg",
        rating: 7.1,
        duration: "115 min",
        genre: ["Anime", "Action", "Adventure"],
        releaseDate: "2022-08-06",
        isKidsMovie: true,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/eU0i7L3cakI?si=eSsbJ7IwuON9szI1"
      },
    {
        id: 27,
        title: "Phillauri",
        description: "A man meets a friendly ghost from the past just before his wedding.",
        poster: "/images/phillauri.jpg",
        backdrop: "/images/phillauri.jpg",
        rating: 6.0,
        duration: "138 min",
        genre: ["Fantasy", "Romance", "Comedy","Hindi"],
        releaseDate: "2017-03-24",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/uCTr7MGFK0U?si=mYMe3mLAWxqtsDut"
    },
    {
        id: 28,
        title: "PK",
        description: "An alien stranded on Earth questions religious dogma as he tries to get back home.",
        poster: "/images/pk.jpg",
        backdrop: "/images/pk.jpg",
        rating: 8.0,
        duration: "153 min",
        genre: ["Comedy", "Drama","Hindi"],
        releaseDate: "2014-12-19",
        isKidsMovie: false,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=SOXWc32k4zA"
    },
    {
        id: 29,
        title: "Phir Hera Pheri",
        description: "Babu Bhaiya, Shyam and Raju get duped by a con artist and try to recover their lost fortune.",
        poster: "/images/phirherapheri.jpg",
        backdrop: "/images/phirherapheri.jpg",
        rating: 7.3,
        duration: "153 min",
        genre: ["Comedy","Hindi"],
        releaseDate: "2006-06-09",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://youtu.be/Im_lCAsA27Q?si=Nj0_d2VktbbiLyFC"
    },
    {
        id: 30,
        title: "Ponyo",
        description: "A fish-girl escapes from the sea and befriends a human boy, disrupting nature’s balance.",
        poster: "/images/ponyo.jpg",
        backdrop: "/images/ponyo.jpg",
        rating: 7.6,
        duration: "101 min",
        genre: ["Anime", "Fantasy", "Adventure"],
        releaseDate: "2008-07-19",
        isKidsMovie: true,
        ageRating: "U",
        trailerUrl: "https://www.youtube.com/watch?v=CsR3KVgBzSM"
    },
    {
        id: 31,
        title: "Shaandaar",
        description: "A fairytale-like Indian destination wedding where love and chaos unfold.",
        poster: "/images/shaandaar.jpg",
        backdrop: "/images/shaandaar.jpg",
        rating: 3.6,
        duration: "144 min",
        genre: ["Fantasy", "Comedy", "Romance","Hindi"],
        releaseDate: "2015-10-22",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=k99-vMPh3-A"
    },
    {
        id: 32,
        title: "Shershaah",
        description: "Based on the life of Indian Army captain Vikram Batra, a hero of the Kargil War.",
        poster: "/images/shershaah.jpg",
        backdrop: "/images/shershaah.jpg",
        rating: 8.4,
        duration: "135 min",
        genre: ["Action", "Biography", "War","Romance","Hindi"],
        releaseDate: "2021-08-12",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=Q0FTXnefVBA"
    },
    {
        id: 35,
        title: "The Avengers",
        description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
        poster: "/images/avengers.jpg",
        backdrop: "/images/avengers.jpg",
        rating: 8.0,
        duration: "143 min",
        genre: ["Action", "Adventure", "Sci-Fi"],
        releaseDate: "2012-05-04",
        isKidsMovie: true,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8"
    },
    {
        id: 36,
        title: "The Conjuring",
        description: "Paranormal investigators help a family terrorized by a dark presence in their farmhouse.",
        poster: "/images/conjuring.jpg",
        backdrop: "/images/conjuring.jpg",
        rating: 7.5,
        duration: "112 min",
        genre: ["Horror", "Mystery", "Thriller"],
        releaseDate: "2013-07-19",
        isKidsMovie: false,
        ageRating: "A",
        trailerUrl: "https://www.youtube.com/watch?v=k10ETZ41q5o"
    },
    {
        id: 37,
        title: "The Dark Knight",
        description: "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.",
        poster: "/images/thedarkknight.jpg",
        backdrop: "/images/thedarkknight.jpg",
        rating: 9.0,
        duration: "152 min",
        genre: ["Action", "Crime", "Drama"],
        releaseDate: "2008-07-18",
        isKidsMovie: false,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
    },
    {
        id: 38,
        title: "The Lion King",
        description: "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
        poster: "/images/lionking.jpg",
        backdrop: "/images/lionking.jpg",
        rating: 8.5,
        duration: "118 min",
        genre: ["Animation", "Family", "Adventure"],
        releaseDate: "2019-07-19",
        isKidsMovie: true,
        ageRating: "G",
        trailerUrl: "https://www.youtube.com/watch?v=7TavVZMewpY"
    },
    {
        id: 39,
        title: "The Notebook",
        description: "A poor young man and a rich young woman fall in love but are separated by social differences and fate.",
        poster: "/images/thenotebook.jpg",
        backdrop: "/images/thenotebook.jpg",
        rating: 7.8,
        duration: "123 min",
        genre: ["Romance", "Drama"],
        releaseDate: "2004-06-25",
        isKidsMovie: false,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=FC6biTjEyZw"
    },
    {
        id: 40,
        title: "Titanic",
        description: "A young couple from different social classes fall in love aboard the ill-fated RMS Titanic.",
        poster: "/images/titanic.jpg",
        backdrop: "/images/titanic.jpg",
        rating: 7.9,
        duration: "195 min",
        genre: ["Romance", "Drama"],
        releaseDate: "1997-12-19",
        isKidsMovie: false,
        ageRating: "PG-13",
        trailerUrl: "https://www.youtube.com/watch?v=2e-eXJ6HgkQ"  
    },
    {
        id: 41,
        title: "Toy Story 4",
        description: "Woody attempts to make Forky, a toy, suffering from existential crisis, realise his importance in the life of Bonnie, their owner. However, things become difficult when Gabby Gabby enters their lives.",
        poster: "/images/toystory4.jpg",
        backdrop: "/images/toystory4.jpg",
        rating: 8.7,
        duration: "100 min",
        genre: ["Animation", "Family", "Comedy"],
        releaseDate: "2019-06-21",
        isKidsMovie: true,
        ageRating: "G",
        trailerUrl: "https://www.youtube.com/watch?v=wmiIUN-7qhE"
    },
    {
        id: 42,
        title: "Tumbbad",
        description: "A man's search for a hidden treasure in the village of Tumbbad leads him to a cursed secret.",
        poster: "/images/tumbbad.jpg",
        backdrop: "/images/tumbbad.jpg",
        rating: 8.2,
        duration: "104 min",
        genre: ["Horror", "Fantasy", "Thriller","Hindi"],
        releaseDate: "2018-10-12",
        isKidsMovie: false,
        ageRating: "A",
        trailerUrl: "https://youtu.be/YGIcZrUBY0k?si=FltPZ2VSIxHli71n"
    },
    {
        id: 43,
        title: "War",
        description: "An Indian soldier is assigned to eliminate his former mentor who has gone rogue.",
        poster: "/images/war.jpg",
        backdrop: "/images/war.jpg",
        rating: 6.5,
        duration: "154 min",
        genre: ["Action", "Thriller"],
        releaseDate: "2019-10-02",
        isKidsMovie: false,
        ageRating: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=tQ0mzXRk-oM"
    },
    {
        id: 45,
        title: "Zodiac",
        description: "A cartoonist becomes obsessed with the Zodiac killer, a serial killer in San Francisco.",
        poster: "/images/zodiac.jpg",
        backdrop: "/images/zodiac.jpg",
        rating: 7.7,
        duration: "157 min",
        genre: ["Crime", "Drama", "Mystery"],
        releaseDate: "2007-03-02",
        isKidsMovie: false,
        ageRating: "A",
        trailerUrl: "https://youtu.be/f9cDKbmCD0o?si=qjh-bkv_voELtJid"
    },
    {
        id: 46,
        title: "Zootopia",
        description: "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.",
        poster: "/images/zootopia.jpg",
        backdrop: "/images/zootopia.jpg",
        rating: 8.5,
        duration: "108 min",
        genre: ["Animation", "Adventure", "Comedy"],
        releaseDate: "2016-03-04",
        isKidsMovie: true,
        ageRating: "PG",
        trailerUrl: "https://www.youtube.com/watch?v=jWM0ct-OLsM"
    }
];

// User data (for demo purposes)
window.userData = {
    isLoggedIn: false,
    user: null,
    bookings: []
};

// Ensure userData is available globally
if (typeof window !== 'undefined') {
    window.userData = window.userData || {
        isLoggedIn: false,
        user: null,
        bookings: []
    };
}
// Show times data
// Indian cities data
const citiesData = [
    { id: 1, name: "Mumbai", state: "Maharashtra" },
    { id: 2, name: "Delhi", state: "Delhi" },
    { id: 3, name: "Bangalore", state: "Karnataka" },
    { id: 4, name: "Chennai", state: "Tamil Nadu" },
    { id: 5, name: "Hyderabad", state: "Telangana" },
    { id: 6, name: "Pune", state: "Maharashtra" },
    { id: 7, name: "Kolkata", state: "West Bengal" },
    { id: 8, name: "Ahmedabad", state: "Gujarat" },
    { id: 9, name: "Jaipur", state: "Rajasthan" },
    { id: 10, name: "Lucknow", state: "Uttar Pradesh" }
];

// Indian theatres data
const theatresData = [
    // Mumbai
    { 
        id: 1, 
        name: "PVR Phoenix Mills", 
        cityId: 1, 
        type: "Premium", 
        screens: 8,
        halls: [
            { id: 1, name: "Audi 1", type: "Premium", capacity: 180, features: ["Dolby Atmos", "Recliner Seats"] },
            { id: 2, name: "Audi 2", type: "Premium", capacity: 160, features: ["4DX", "Dolby Vision"] },
            { id: 3, name: "Audi 3", type: "Standard", capacity: 200, features: ["Digital Sound"] },
            { id: 4, name: "Audi 4", type: "IMAX", capacity: 300, features: ["IMAX", "Dolby Atmos"] }
        ]
    },
    { 
        id: 2, 
        name: "INOX R-City Mall", 
        cityId: 1, 
        type: "Multiplex", 
        screens: 6,
        halls: [
            { id: 5, name: "Screen 1", type: "Premium", capacity: 150, features: ["Dolby Atmos"] },
            { id: 6, name: "Screen 2", type: "Standard", capacity: 180, features: ["Digital Sound"] },
            { id: 7, name: "Screen 3", type: "Standard", capacity: 160, features: ["Digital Sound"] }
        ]
    },
    { 
        id: 3, 
        name: "Cinepolis Fun Republic", 
        cityId: 1, 
        type: "Premium", 
        screens: 10,
        halls: [
            { id: 8, name: "Hall A", type: "Premium", capacity: 200, features: ["Dolby Atmos", "Recliner"] },
            { id: 9, name: "Hall B", type: "Standard", capacity: 220, features: ["Digital Sound"] },
            { id: 10, name: "Hall C", type: "VIP", capacity: 100, features: ["VIP Lounge", "Premium Service"] }
        ]
    },
    
    // Delhi
    { 
        id: 4, 
        name: "PVR Select City Walk", 
        cityId: 2, 
        type: "Premium", 
        screens: 12,
        halls: [
            { id: 11, name: "Gold Class 1", type: "Premium", capacity: 120, features: ["Gold Class", "Recliner", "Food Service"] },
            { id: 12, name: "Director's Cut", type: "Premium", capacity: 80, features: ["Director's Cut", "Premium Dining"] },
            { id: 13, name: "Audi 3", type: "IMAX", capacity: 350, features: ["IMAX", "Dolby Atmos"] },
            { id: 14, name: "Audi 4", type: "Standard", capacity: 200, features: ["Digital Sound"] }
        ]
    },
    { 
        id: 5, 
        name: "INOX Nehru Place", 
        cityId: 2, 
        type: "Multiplex", 
        screens: 8,
        halls: [
            { id: 15, name: "Insignia 1", type: "Premium", capacity: 100, features: ["Insignia", "Luxury Seating"] },
            { id: 16, name: "Screen 2", type: "Standard", capacity: 180, features: ["Digital Sound"] },
            { id: 17, name: "Screen 3", type: "Standard", capacity: 160, features: ["Digital Sound"] }
        ]
    },
    
    // Bangalore
    { 
        id: 6, 
        name: "PVR Forum Mall", 
        cityId: 3, 
        type: "Premium", 
        screens: 9,
        halls: [
            { id: 18, name: "Gold Class", type: "Premium", capacity: 90, features: ["Gold Class", "Gourmet Menu"] },
            { id: 19, name: "Audi 2", type: "Standard", capacity: 170, features: ["Digital Sound"] },
            { id: 20, name: "Audi 3", type: "Premium", capacity: 140, features: ["Dolby Atmos"] }
        ]
    },
    { 
        id: 7, 
        name: "INOX Garuda Mall", 
        cityId: 3, 
        type: "Multiplex", 
        screens: 7,
        halls: [
            { id: 21, name: "Screen 1", type: "Premium", capacity: 160, features: ["Dolby Atmos"] },
            { id: 22, name: "Screen 2", type: "Standard", capacity: 190, features: ["Digital Sound"] }
        ]
    },
    
    // Chennai
    { 
        id: 8, 
        name: "PVR Ampa Skywalk", 
        cityId: 4, 
        type: "Premium", 
        screens: 6,
        halls: [
            { id: 23, name: "Gold Class", type: "Premium", capacity: 110, features: ["Gold Class", "Premium Dining"] },
            { id: 24, name: "Audi 2", type: "Standard", capacity: 180, features: ["Digital Sound"] },
            { id: 25, name: "Audi 3", type: "Premium", capacity: 150, features: ["Dolby Atmos"] }
        ]
    },
    { 
        id: 9, 
        name: "INOX Express Avenue", 
        cityId: 4, 
        type: "Multiplex", 
        screens: 8,
        halls: [
            { id: 26, name: "Screen 1", type: "Premium", capacity: 170, features: ["Dolby Atmos"] },
            { id: 27, name: "Screen 2", type: "Standard", capacity: 200, features: ["Digital Sound"] }
        ]
    },
    
    // Hyderabad
    { 
        id: 10, 
        name: "PVR Inorbit Mall", 
        cityId: 5, 
        type: "Premium", 
        screens: 10,
        halls: [
            { id: 28, name: "Gold Class", type: "Premium", capacity: 100, features: ["Gold Class", "Luxury Seating"] },
            { id: 29, name: "Audi 2", type: "Standard", capacity: 190, features: ["Digital Sound"] },
            { id: 30, name: "Audi 3", type: "Premium", capacity: 160, features: ["Dolby Atmos"] }
        ]
    },
    { 
        id: 11, 
        name: "Prasads IMAX", 
        cityId: 5, 
        type: "IMAX", 
        screens: 1,
        halls: [
            { id: 31, name: "IMAX Theatre", type: "IMAX", capacity: 600, features: ["IMAX", "70mm Film", "Dolby Atmos"] }
        ]
    },

    // Pune
    {
        id: 12,
        name: "PVR Phoenix Marketcity",
        cityId: 6,
        type: "Premium",
        screens: 6,
        halls: [
          { id: 32, name: "Gold Class", type: "Premium", capacity: 120, features: ["Gold Class", "Luxury Recliners"] },
          { id: 33, name: "Audi 2", type: "Standard", capacity: 180, features: ["Dolby Digital"] },
          { id: 34, name: "Audi 3", type: "Premium", capacity: 150, features: ["Dolby Atmos"] }
        ]
      },
      {
        id: 13,
        name: "INOX Bund Garden",
        cityId: 6,
        type: "Standard",
        screens: 4,
        halls: [
          { id: 35, name: "Audi 1", type: "Standard", capacity: 200, features: ["Digital Projection"] },
          { id: 36, name: "Audi 2", type: "Standard", capacity: 180, features: ["Dolby Sound"] }
        ]
      },

      // Kolkata
      {
        id: 22,
        name: "Carnival Cinemas Mani Square",
        cityId: 7, 
        type: "Standard",
        screens: 5,
        halls: [
          { id: 37, name: "Audi 1", type: "Standard", capacity: 170, features: ["Dolby Sound"] },
          { id: 38, name: "Audi 2", type: "Standard", capacity: 150, features: ["Digital Projection"] }
        ]
      },
      {
        id: 23,
        name: "PVR South City Mall",
        cityId: 7,
        type: "Premium",
        screens: 7,
        halls: [
          { id: 39, name: "Gold Lounge", type: "Premium", capacity: 110, features: ["Luxury Seating", "Gold Service"] },
          { id: 40, name: "Audi 3", type: "Standard", capacity: 160, features: ["Dolby Atmos"] }
        ]
      },

      // Ahmedabad
      {
        id: 24,
        name: "Cinepolis AlphaOne Mall",
        cityId: 8,
        type: "Premium",
        screens: 6,
        halls: [
          { id: 41, name: "VIP Lounge", type: "Premium", capacity: 100, features: ["Recliners", "Café Service"] },
          { id: 42, name: "Audi 2", type: "Standard", capacity: 190, features: ["Dolby Atmos"] }
        ]
      },
      {
        id: 25,
        name: "Miraj City Gold",
        cityId: 8,
        type: "Standard",
        screens: 4,
        halls: [
          { id: 43, name: "Audi 1", type: "Standard", capacity: 170, features: ["Digital Projection", "Comfort Seats"] }
        ]
      },

      // Jaipur
      {
        id: 26,
        name: "Raj Mandir Cinema",
        cityId: 9, 
        type: "Classic",
        screens: 1,
        halls: [
          { id: 44, name: "Main Hall", type: "Heritage", capacity: 1100, features: ["Vintage Design", "Single Screen Experience"] }
        ]
      },
      {
        id: 27,
        name: "INOX GT Central Mall",
        cityId: 9,
        type: "Standard",
        screens: 5,
        halls: [
          { id: 114, name: "Audi 1", type: "Standard", capacity: 180, features: ["Dolby Digital"] },
          { id: 115, name: "Audi 2", type: "Premium", capacity: 140, features: ["Dolby Atmos", "Recliners"] }
        ]
      },

      // Lucknow
      {
        id: 28,
        name: "Wave Cinemas Sahara Ganj",
        cityId: 10, 
        type: "Standard",
        screens: 6,
        halls: [
          { id: 116, name: "Audi 1", type: "Standard", capacity: 190, features: ["Dolby Digital"] },
          { id: 117, name: "Audi 2", type: "Standard", capacity: 170, features: ["Digital Projection"] }
        ]
      },
      {
        id: 29,
        name: "PVR Phoenix Palassio",
        cityId: 10,
        type: "Premium",
        screens: 8,
        halls: [
          { id: 118, name: "Gold Class", type: "Premium", capacity: 100, features: ["Gold Class", "Luxury Recliners"] },
          { id: 119, name: "Audi 3", type: "Standard", capacity: 160, features: ["Dolby Atmos"] }
        ]
      }
];

// Meal options data
const mealsData = [
    { id: 1, name: "Classic Popcorn", price: 150, category: "Snacks", image: "🍿" },
    { id: 2, name: "Cheese Popcorn", price: 180, category: "Snacks", image: "🧀" },
    { id: 3, name: "Caramel Popcorn", price: 200, category: "Snacks", image: "🍯" },
    { id: 4, name: "Nachos with Cheese", price: 220, category: "Snacks", image: "🧀" },
    { id: 5, name: "Samosa (2 pcs)", price: 80, category: "Indian Snacks", image: "🥟" },
    { id: 6, name: "Vada Pav", price: 60, category: "Indian Snacks", image: "🍔" },
    { id: 7, name: "Masala Chai", price: 40, category: "Beverages", image: "☕" },
    { id: 8, name: "Cold Coffee", price: 120, category: "Beverages", image: "🥤" },
    { id: 9, name: "Coca Cola", price: 80, category: "Beverages", image: "🥤" },
    { id: 10, name: "Fresh Lime Soda", price: 70, category: "Beverages", image: "🍋" },
    { id: 11, name: "Chicken Burger", price: 250, category: "Main Course", image: "🍔" },
    { id: 12, name: "Veg Burger", price: 200, category: "Main Course", image: "🍔" },
    { id: 13, name: "Pizza Slice", price: 180, category: "Main Course", image: "🍕" },
    { id: 14, name: "Hot Dog", price: 150, category: "Main Course", image: "🌭" },
    { id: 15, name: "Ice Cream Cup", price: 100, category: "Desserts", image: "🍨" },
    { id: 16, name: "Chocolate Brownie", price: 120, category: "Desserts", image: "🍫" }
];

// Show times data with Indian pricing
const showTimesData = generateShowTimes();

// Generate comprehensive showtimes for all cities and theatres
function generateShowTimes() {
    const showtimes = [];
    let showtimeId = 1;
    
    // Time slots
    const timeSlots = [
        { time: "09:30", priceMultiplier: 0.8 }, // Morning
        { time: "12:45", priceMultiplier: 0.9 }, // Afternoon
        { time: "16:00", priceMultiplier: 1.0 }, // Evening
        { time: "19:15", priceMultiplier: 1.2 }, // Prime
        { time: "22:30", priceMultiplier: 1.1 }  // Night
    ];
    
    // Dates for next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    // Generate showtimes for each theatre
    theatresData.forEach(theatre => {
        // Each theatre shows 3-4 different movies
        const movieIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
        const theatreMovies = movieIds.slice(0, Math.min(4, theatre.halls.length));
        
        theatreMovies.forEach((movieId, movieIndex) => {
            const hall = theatre.halls[movieIndex] || theatre.halls[0];
            
            dates.forEach(date => {
                // Each movie gets 2-3 showtimes per day
                const movieTimeSlots = timeSlots.slice(movieIndex, movieIndex + 3);
                
                movieTimeSlots.forEach(slot => {
                    const basePrice = getBasePriceForTheatre(theatre.type, hall.type);
                    const finalPrice = Math.round(basePrice * slot.priceMultiplier);
                    
                    showtimes.push({
                        id: showtimeId++,
                        movieId: movieId,
                        theatreId: theatre.id,
                        cityId: theatre.cityId,
                        hallId: hall.id,
                        hallName: hall.name,
                        hallType: hall.type,
                        hallFeatures: hall.features,
                        date: date,
                        time: slot.time,
                        price: finalPrice,
                        availableSeats: Math.floor(hall.capacity * 0.7), // 70% available
                        totalSeats: hall.capacity,
                        screen: hall.name
                    });
                });
            });
        });
    });
    
    return showtimes;
}

function getBasePriceForTheatre(theatreType, hallType) {
    const basePrices = {
        'Standard': { 'Standard': 200, 'Premium': 250, 'VIP': 300, 'IMAX': 400 },
        'Multiplex': { 'Standard': 220, 'Premium': 280, 'VIP': 350, 'IMAX': 450 },
        'Premium': { 'Standard': 250, 'Premium': 320, 'VIP': 400, 'IMAX': 500 },
        'IMAX': { 'Standard': 300, 'Premium': 400, 'VIP': 500, 'IMAX': 600 }
    };
    
    return basePrices[theatreType]?.[hallType] || 250;
}

// Payment gateway integration (demo)
function initiatePayment(bookingData) {
    return new Promise((resolve) => {
        // Simulate payment processing
        setTimeout(() => {
            const paymentId = 'PAY_' + Date.now();
            resolve({
                success: true,
                paymentId: paymentId,
                transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
        }, 2000);
    });
}

// YouTube trailer functions
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function playTrailer(movieId) {
    const movie = getMovieById(movieId);
    if (!movie || !movie.trailerUrl) {
        showToast('Trailer not available', 'warning');
        return;
    }
    
    const videoId = getYouTubeVideoId(movie.trailerUrl);
    if (!videoId) {
        showToast('Invalid trailer URL', 'error');
        return;
    }
    
    showTrailerModal(movie, videoId);
}

function showTrailerModal(movie, videoId) {
    const modal = document.createElement('div');
    modal.className = 'trailer-modal';
    modal.innerHTML = `
        <div class="trailer-modal-content">
            <div class="trailer-header">
                <h3>${movie.title} - Official Trailer</h3>
                <button class="close-trailer" onclick="closeTrailerModal()">&times;</button>
            </div>
            <div class="trailer-video">
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    // Add trailer modal styles
    const style = document.createElement('style');
    style.textContent = `
        .trailer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .trailer-modal-content {
            background: var(--bg-secondary);
            border-radius: 15px;
            overflow: hidden;
            width: 90%;
            max-width: 800px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }
        
        .trailer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: var(--accent-primary);
            color: white;
        }
        
        .trailer-header h3 {
            margin: 0;
            font-size: 1.2rem;
        }
        
        .close-trailer {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .close-trailer:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .trailer-video {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
        }
        
        .trailer-video iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        @media (max-width: 768px) {
            .trailer-modal-content {
                width: 95%;
                margin: 1rem;
            }
            
            .trailer-header h3 {
                font-size: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTrailerModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeTrailerModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function closeTrailerModal() {
    const modal = document.querySelector('.trailer-modal');
    if (modal) {
        modal.remove();
    }
    
    // Remove trailer styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
        if (style.textContent.includes('.trailer-modal')) {
            style.remove();
        }
    });
}

// Helper functions
function getMovieById(id) {
    return moviesData.find(movie => movie.id === parseInt(id));
}

function getKidsMovies() {
    return moviesData.filter(movie => movie.isKidsMovie);
}

function getAdultMovies() {
    return moviesData.filter(movie => !movie.isKidsMovie);
}

function getMoviesByGenre(genre) {
    if (genre === 'all') return moviesData;
    if (genre === 'kids') return getKidsMovies();
    return moviesData.filter(movie => 
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
}

function getShowTimesByMovieId(movieId) {
    return showTimesData.filter(showTime => showTime.movieId === parseInt(movieId));
}

function getCitiesList() {
    return citiesData;
}

function getTheatresByCity(cityId) {
    return theatresData.filter(theatre => theatre.cityId === parseInt(cityId));
}

function getShowTimesByTheatre(theatreId) {
    return showTimesData.filter(showTime => showTime.theatreId === parseInt(theatreId));
}

function getShowTimesByMovieAndCity(movieId, cityId) {
    return showTimesData.filter(showTime => 
        showTime.movieId === parseInt(movieId) && showTime.cityId === parseInt(cityId)
    );
}

function getCityById(cityId) {
    return citiesData.find(city => city.id === parseInt(cityId));
}

function getTheatreById(theatreId) {
    return theatresData.find(theatre => theatre.id === parseInt(theatreId));
}

function getHallById(hallId) {
    for (const theatre of theatresData) {
        const hall = theatre.halls.find(h => h.id === parseInt(hallId));
        if (hall) return hall;
    }
    return null;
}

function getShowTimesByHall(hallId) {
    return showTimesData.filter(showTime => showTime.hallId === parseInt(hallId));
}

function getMealsByCategory() {
    const categories = {};
    mealsData.forEach(meal => {
        if (!categories[meal.category]) {
            categories[meal.category] = [];
        }
        categories[meal.category].push(meal);
    });
    return categories;
}

function formatIndianPrice(price) {
    return `₹${price}`;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    
    if (hasHalfStar) {
        starsHTML += '☆';
    }
    
    return starsHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Export data for use in other scripts
window.moviesData = moviesData;
window.userData = userData;
window.showTimesData = showTimesData;
window.citiesData = citiesData;
window.theatresData = theatresData;
window.mealsData = mealsData;
window.getMovieById = getMovieById;
window.getKidsMovies = getKidsMovies;
window.getAdultMovies = getAdultMovies;
window.getMoviesByGenre = getMoviesByGenre;
window.getShowTimesByMovieId = getShowTimesByMovieId;
window.getCitiesList = getCitiesList;
window.getTheatresByCity = getTheatresByCity;
window.getShowTimesByTheatre = getShowTimesByTheatre;
window.getShowTimesByMovieAndCity = getShowTimesByMovieAndCity;
window.getCityById = getCityById;
window.getTheatreById = getTheatreById;
window.getMealsByCategory = getMealsByCategory;
window.formatIndianPrice = formatIndianPrice;
window.getHallById = getHallById;
window.getShowTimesByHall = getShowTimesByHall;
window.initiatePayment = initiatePayment;
window.playTrailer = playTrailer;
window.closeTrailerModal = closeTrailerModal;
window.generateStars = generateStars;
window.formatDate = formatDate;
window.showToast = showToast;