import { AiTwotoneAlert } from "react-icons/ai";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { TbHomeSearch } from "react-icons/tb";
import paris from "../../assets/places/paris.jpg";
import london from "../../assets/places/london.jpg";
import lagos from "../../assets/places/lagos.jpg";
import rome from "../../assets/places/rome.jpg";

export enum HomepageTabs {
  "Country" = "Country",
  "City" = "City",
  "Travel" = "Travel",
  "History" = "History",
  "Attractions" = "Attractions",
}

export const homepageTabs = [
  HomepageTabs.Country,
  HomepageTabs.City,
  HomepageTabs.Travel,
  HomepageTabs.History,
  HomepageTabs["Attractions"],
];

export const getHeroSectionContent = (activeTab: HomepageTabs) => {
  const contentMap = {
    [HomepageTabs.Country]: {
      title: "Discover Countries Around the World with GeoGuide",
      description:
        "Explore essential details about countries, including culture, languages, currency, and must visit destinations.",
    },
    [HomepageTabs.City]: {
      title: "Find the Best Cities to Visit with GeoGuide",
      description:
        "Browse top cities across different countries and uncover what makes each destination unique for travelers.",
    },
    [HomepageTabs.Travel]: {
      title: "Plan Your Next Adventure with GeoGuide",
      description:
        "Get helpful travel insights, visa info, weather, attractions, and more, to make your trip smooth and enjoyable.",
    },
    [HomepageTabs.History]: {
      title: "Learn the History of Any Country with GeoGuide",
      description:
        "Dive into the rich historical background of countries and understand the cultures that shaped them.",
    },
    [HomepageTabs.Attractions]: {
      title: "Explore Top Tourist Attractions with GeoGuide",
      description:
        "Discover famous landmarks, natural wonders, and exciting places you won’t want to miss on your travels.",
    },
  };
  return contentMap[activeTab];
};

export const discoverTravelFeaturesData = [
  {
    Icon: AiTwotoneAlert,
    title: "Country Alerts",
    description:
      "Get notified when new countries or travel insights are added, so you always stay updated.",
  },
  {
    Icon: LiaMoneyCheckAltSolid,
    title: "Travel Costs",
    description:
      "Explore estimated travel costs, currency details, and budget insights for each country.",
  },
  {
    Icon: TbHomeSearch,
    title: "Planning a Trip?",
    description:
      "Find essential information, visa requirements, climate, attractions, and more, to help plan your journey.",
  },
];

export const placesData = [
  {
    title: "Lagos, Nigeria",
    description:
      "A vibrant coastal city known for its lively markets, stunning beaches, dynamic nightlife, and rich cultural heritage. Lagos blends modern urban energy with traditional Nigerian charm, making it one of Africa’s most exciting destinations.",
    imageUrl: lagos,
  },
  {
    title: "Paris, France",
    description:
      "The romantic capital of France, famous for its iconic landmarks like the Eiffel Tower and Louvre Museum. Paris offers world-class cuisine, historic architecture, charming cafés, and timeless artistic influence, attracting millions of visitors every year.",
    imageUrl: paris,
  },
  {
    title: "London, United Kingdom",
    description:
      "A vibrant metropolis rich in history, culture, and modern innovation. London is home to Buckingham Palace, Big Ben, the British Museum, and diverse neighborhoods offering global cuisine, entertainment, and unforgettable experiences.",
    imageUrl: london,
  },
  {
    title: "Rome, Italy",
    description:
      "A captivating city where ancient history meets modern Italian lifestyle. Rome features iconic sites such as the Colosseum, the Roman Forum, and Vatican City, alongside charming streets, authentic cuisine, and a warm Mediterranean atmosphere.",
    imageUrl: rome,
  },
];