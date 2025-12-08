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
        "Explore essential details about countries, including culture, languages, currency, and must-visit destinations.",
    },
    [HomepageTabs.City]: {
      title: "Find the Best Cities to Visit with GeoGuide",
      description:
        "Browse top cities across different countries and uncover what makes each destination unique for travelers.",
    },
    [HomepageTabs.Travel]: {
      title: "Plan Your Next Adventure with GeoGuide",
      description:
        "Get helpful travel insights—visa info, weather, attractions, and more—to make your trip smooth and enjoyable.",
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
