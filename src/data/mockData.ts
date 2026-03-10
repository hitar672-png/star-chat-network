export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  time: string;
  isOwn: boolean;
  level: number;
  country?: string;
  isTyping?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  onlineCount: number;
  isPinned?: boolean;
}

export interface OnlineUser {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  borderColor: string;
}

export const mockMessages: ChatMessage[] = [
  { id: "1", username: "أبو خالد", text: "مرحبا بالجميع في الغرفة العامة 🌍", time: "٢:٤٥", isOwn: false, level: 51, country: "🇸🇦" },
  { id: "2", username: "روتشان", text: "أهلاً وسهلاً، كيف حالكم؟", time: "٢:٤٦", isOwn: false, level: 45, country: "🇾🇪" },
  { id: "3", username: "أنت", text: "الحمد لله بخير، شخباركم؟", time: "٢:٤٧", isOwn: true, level: 7 },
  { id: "4", username: "سكون", text: "تمام الحمد لله", time: "٢:٤٨", isOwn: false, level: 4 },
  { id: "5", username: "نجمة الشرق", text: "مساء الخير على الجميع ✨", time: "٢:٤٩", isOwn: false, level: 38, country: "🇪🇬" },
  { id: "6", username: "أنت", text: "مساء النور يا نجمة", time: "٢:٥٠", isOwn: true, level: 7 },
  { id: "7", username: "عاشق الليل", text: "أحلى مسا على أحلى ناس 🌙", time: "٢:٥١", isOwn: false, level: 17, country: "🇮🇶" },
  { id: "8", username: "أبو خالد", text: "الله يسعدكم جميعاً", time: "٢:٥٢", isOwn: false, level: 51, country: "🇸🇦" },
];

export const mockRooms: Room[] = [
  { id: "1", name: "الغرفة العامة", description: "مكان يجمع الجميع من مختلف الدول، دردشة ممتعة وأجواء مميزة 😍🌍", image: "🌍", onlineCount: 1478, isPinned: true },
  { id: "2", name: "غرفة اليمن", description: "روم اليمن 🇾🇪 ملتقى أهل الأصل والكرم، هنا ينبض قلب العرب وروح اليمن الأصيل! ✨", image: "🇾🇪", onlineCount: 134 },
  { id: "3", name: "المغرب والجزائر", description: "نلتقي هنا على ود الأخوة وجمال الثقافة، نشارك ذكرياتنا وأحلى الأوقات! 🇲🇦🇩🇿", image: "🇲🇦", onlineCount: 94 },
  { id: "4", name: "أماسي صنعاء", description: "أماسي صنعاء تتغنى بجمالها التاريخي وسحرها العشقي", image: "🏰", onlineCount: 85 },
  { id: "5", name: "روم ملوك مصر", description: "روم أهل مصر مساحة دردشة تجمع المصريين للتعارف والحوار الودي في جو محترم وآمن.", image: "🇪🇬", onlineCount: 45 },
  { id: "6", name: "روم أهل سوريا", description: "أهل سوريا مكان يجمع السوريين للتواصل والتعارف في أجواء أخوية راقية.", image: "🇸🇾", onlineCount: 24 },
];

export const mockOnlineUsers: OnlineUser[] = [
  { id: "1", username: "أبو خالد", level: 51, borderColor: "border-primary" },
  { id: "2", username: "روتشان", level: 45, borderColor: "border-accent" },
  { id: "3", username: "سكون", level: 4, borderColor: "border-secondary" },
  { id: "4", username: "نجمة الشرق", level: 38, borderColor: "border-primary" },
  { id: "5", username: "عاشق الليل", level: 17, borderColor: "border-accent" },
  { id: "6", username: "أبو محمد", level: 69, borderColor: "border-primary" },
  { id: "7", username: "ليلى", level: 11, borderColor: "border-secondary" },
  { id: "8", username: "حمزة", level: 95, borderColor: "border-accent" },
];
