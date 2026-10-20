import { publicAsset } from "./publicAsset";

export type UserStatus =
  | "available"
  | "busy"
  | "away"
  | "invisible"
  | "offline";

export interface User {
  id: string;
  nickname: string;
  status: UserStatus;
  customStatus?: string;
  avatar: string;
  message?: string;
}

export interface ContactGroup {
  group: string;
  users: User[];
}

export interface ChatMessage {
  id: number;
  sender: string;
  senderName: string;
  text: string;
  time: string;
  isBuzz?: boolean;
}

export const currentUser: User = {
  id: "roy666",
  nickname: "羅伊 ฅ^•ﻌ•^ฅ",
  status: "available", // available, busy, away, invisible
  customStatus: "RO 中，勿擾 ⚔️ (ง •̀_•́)ง",
  avatar: publicAsset("avatars/cat_roy.svg"),
};

export const contacts: ContactGroup[] = [
  {
    group: "好友 (2/3)",
    users: [
      {
        id: "beibei",
        nickname: "貝貝 (・∀・)",
        status: "available",
        message: "下課有人要衝網咖嗎～ (*´∀`)~♥",
        avatar: publicAsset("avatars/cat_golden.svg"),
      },
      {
        id: "yingjun",
        nickname: "英菌 (´･ω･`)",
        status: "offline",
        message: "離線中，有事請留悄悄話 (´･ω･`)zzZ",
        avatar: publicAsset("avatars/cat_nine.svg"),
      },
      {
        id: "delicious_burger",
        nickname: "美味謝堡 (◕‿◕✿)",
        status: "busy",
        message: "♪ 寂寞邊界 - 張棟樑 ♪ (つД`)",
        avatar: publicAsset("avatars/cat_hsuan.svg"),
      },
    ],
  },
  {
    group: "同學 (2/3)",
    users: [
      {
        id: "tom",
        nickname: "Tom (ง •̀_•́)ง",
        status: "available",
        message: "今晚段考衝刺中！(ง •̀_•́)ง",
        avatar: publicAsset("avatars/cat_kai.svg"),
      },
      {
        id: "dongdong",
        nickname: "東東 (⁎⁍̴̛ᴗ⁍̴̛⁎)",
        status: "busy",
        message: '補習班上課中 勿敲 >"< (｡ŏ_ŏ)',
        avatar: publicAsset("avatars/cat_meatball.svg"),
      },
      {
        id: "xiaohua",
        nickname: "小華 (｡♥‿♥｡)",
        status: "offline",
        message: "放假想去淡水老街吃阿給 ٩(◕‿◕｡)۶",
        avatar: publicAsset("avatars/cat_candy.svg"),
      },
    ],
  },
  {
    group: "其他 (0/2)",
    users: [
      {
        id: "niuniu",
        nickname: "妞妞 (≧▽≦)",
        status: "offline",
        message: "等候對方接受邀請 (｡･ω･｡)",
        avatar: publicAsset("avatars/cat_ann.svg"),
      },
      {
        id: "zewan",
        nickname: "澤丸 (¬‿¬)",
        status: "offline",
        message: "等候對方接受邀請 (¬‿¬)",
        avatar: publicAsset("avatars/cat_patrick.svg"),
      },
    ],
  },
];

export const chatHistory: ChatMessage[] = [
  {
    id: 1,
    sender: "roy666",
    senderName: "羅伊 ฅ^•ﻌ•^ฅ",
    text: "叮咚！有人在家嗎～～～～",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "roy666",
    senderName: "羅伊 ฅ^•ﻌ•^ฅ",
    text: "安安 你好 幾歲 住哪 (*´∀`)",
    time: "10:01 AM",
  },
  {
    id: 3,
    sender: "beibei",
    senderName: "貝貝 (・∀・)",
    text: "哈哈白癡喔 要聊就直接說哇 (≧∇≦)",
    time: "10:05 AM",
  },
  {
    id: 4,
    sender: "beibei",
    senderName: "貝貝 (・∀・)",
    text: "(sweat) 剛剛在寫數學作業啦",
    time: "10:05 AM",
  },
  {
    id: 5,
    sender: "roy666",
    senderName: "羅伊 ฅ^•ﻌ•^ฅ",
    text: "欸今天補習班下課有看到你耶！",
    time: "10:06 AM",
  },
];
