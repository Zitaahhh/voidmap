export type Signal = {
  id: string;
  name: string;
  city: string;
  area: string;
  time: string;
  mood: string;
  emotionTags?: string[];
  story: string;
  lat: number;
  lng: number;
  mediaKind?: "photo" | "video";
  mediaUrl?: string;
  posterUrl?: string;
  altText?: string;
  mapsUrl?: string;
};

export type ExplorerProfile = {
  id: string;
  name: string;
  title: string;
  userColor: string;
  peopleCount: number;
  signalCount: number;
  cityCount: number;
  favoriteMood: string;
  lastSignalAt: string;
};

export const signals: Signal[] = [
  {
    id: "underpass",
    name: "高架桥下",
    city: "Tokyo",
    area: "Shibuya Backstreet",
    time: "02:17 AM",
    mood: "lonely / electric",
    lat: 35.6595,
    lng: 139.7005,
    mediaKind: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    altText: "Night street under an elevated bridge in Tokyo",
    mapsUrl: "https://maps.google.com/?q=35.6595,139.7005",
    story:
      "雨停之后，路灯下面只剩便利店的白光。你第一次觉得，这座城市也会呼吸。",
  },
  {
    id: "midnight-diner",
    name: "午夜食堂",
    city: "Tokyo",
    area: "Nakameguro",
    time: "01:04 AM",
    mood: "warm / hidden",
    lat: 35.6444,
    lng: 139.6992,
    mediaKind: "video",
    mediaUrl: "/IMG_3886.MOV",
    posterUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80",
    altText: "Warm night diner with steam on the glass",
    mapsUrl: "https://maps.google.com/?q=35.6444,139.6992",
    story:
      "玻璃窗后的蒸汽把街道变得模糊。你坐在角落，听见陌生人的笑声像远处的灯。",
  },
  {
    id: "old-cinema",
    name: "旧影院出口",
    city: "Shanghai",
    area: "Hengshan Road",
    time: "11:42 PM",
    mood: "nostalgic / blue",
    lat: 31.2046,
    lng: 121.4465,
    mediaKind: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1400&q=80",
    altText: "Old cinema exit at night",
    mapsUrl: "https://maps.google.com/?q=31.2046,121.4465",
    story:
      "散场之后，人群很快消失。只剩电影海报在风里轻轻响，好像还不愿结束。",
  },
  {
    id: "rooftop-17",
    name: "17号天台",
    city: "Seoul",
    area: "Euljiro",
    time: "00:36 AM",
    mood: "open / unreal",
    lat: 37.5665,
    lng: 126.991,
    mediaKind: "video",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1400&q=80",
    altText: "Rooftop city lights at night",
    mapsUrl: "https://maps.google.com/?q=37.5665,126.991",
    story:
      "你推开铁门，整座城市突然低了下去。风从广告牌后面穿过，带来一点金属味。",
  },
  {
    id: "blue-vending-machine",
    name: "蓝色自动贩卖机",
    city: "Hong Kong",
    area: "Mong Kok Backstreet",
    time: "02:43 AM",
    mood: "strange / neon",
    lat: 22.3193,
    lng: 114.1694,
    mediaKind: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80",
    altText: "Neon vending machine in a narrow street",
    mapsUrl: "https://maps.google.com/?q=22.3193,114.1694",
    story:
      "那台蓝色贩卖机亮得不合时宜。你买了一罐冰咖啡，然后在凌晨的街边站了很久。",
  },
];

export const explorerProfile: ExplorerProfile = {
  id: "zita-voidwalker",
  name: "Zita",
  title: "Night-city cartographer",
  userColor: "#d8dbe3",
  peopleCount: 128,
  signalCount: 27,
  cityCount: 6,
  favoriteMood: "lonely / electric",
  lastSignalAt: "02:43 AM",
};
