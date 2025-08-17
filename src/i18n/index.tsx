"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Locale = "en" | "id" | "ms" | "th" | "vi" | "tl" | "my" | "km" | "lo";

export const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "th", label: "ไทย (Thai)" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tl", label: "Filipino" },
  { code: "my", label: "မြန်မာ (Burmese)" },
  { code: "km", label: "ភាសាខ្មែរ (Khmer)" },
  { code: "lo", label: "ລາວ (Lao)" },
  { code: "en", label: "English" },
];

type Dict = {
  [key: string]: string | Record<"Low" | "Medium" | "High", string> | undefined;
  riskLabels?: Record<"Low" | "Medium" | "High", string>;
};

const dict: Record<Locale, Dict> = {
  en: {
    title: "FinGuard SEA",
    subtitle:
      "Paste a suspicious message and get an instant risk check with plain-language tips.",
    scamChecker: "Scam checker",
    suspiciousMessage: "Suspicious message",
    pastePlaceholder: "Paste the SMS, WhatsApp, email, or social message here...",
    language: "Language",
    check: "Check Message",
    checking: "Checking…",
    risk: "Risk",
    whyScam: "Why this might be a scam",
    whatYouCanDo: "What you can do",
    translation: "Translation",
    reportHelp: "Report or get help",
    disclaimer:
      "Disclaimer: This tool provides guidance only and may not detect all scams.",
    chatOpen: "Chat",
    assistantTitle: "FinGuard Assistant",
    chatWelcome:
      "Hi! I’m FinGuard Assistant. Paste any suspicious message and I’ll check its risk and explain why.",
    chatError:
      "Sorry, I couldn’t analyze that just now. Please try again. If this is urgent, avoid clicking links and contact your local hotline.",
    thinking: "Thinking…",
    typeYourMessage: "Type your message",
    pasteSuspicious: "Paste the suspicious message…",
    send: "Send",
    close: "Close",
    closeChat: "Close chat",
    finguardChat: "FinGuard chat",
    tips: "Tips",
    contact: "Contact",
    skipToContent: "Skip to content",
  attachImage: "Attach image",
  remove: "Remove",
    errorEmpty: "Please paste or type a message to analyze.",
    errorRequest:
      "We couldn't analyze the message right now. Please try again in a moment.",
    riskLabels: { Low: "Low", Medium: "Medium", High: "High" },
  },
  id: {
    title: "FinGuard SEA",
    subtitle:
      "Tempel pesan mencurigakan dan dapatkan pemeriksaan risiko instan dengan tips bahasa sederhana.",
    scamChecker: "Pemeriksa penipuan",
    suspiciousMessage: "Pesan mencurigakan",
    pastePlaceholder:
      "Tempel SMS, WhatsApp, email, atau pesan media sosial di sini...",
    language: "Bahasa",
    check: "Periksa Pesan",
    checking: "Memeriksa…",
    risk: "Risiko",
    whyScam: "Mengapa ini mungkin penipuan",
    whatYouCanDo: "Apa yang bisa Anda lakukan",
    translation: "Terjemahan",
    reportHelp: "Laporkan atau minta bantuan",
    disclaimer:
      "Penafian: Alat ini hanya memberikan panduan dan mungkin tidak mendeteksi semua penipuan.",
    chatOpen: "Chat",
    assistantTitle: "Asisten FinGuard",
    chatWelcome:
      "Hai! Saya Asisten FinGuard. Tempel pesan mencurigakan apa pun dan saya akan memeriksa risikonya dan menjelaskan alasannya.",
    chatError:
      "Maaf, kami tidak dapat menganalisis sekarang. Coba lagi. Jika mendesak, hindari mengeklik tautan dan hubungi layanan bantuan setempat.",
    thinking: "Sedang berpikir…",
    typeYourMessage: "Ketik pesan Anda",
    pasteSuspicious: "Tempel pesan mencurigakan…",
    send: "Kirim",
    close: "Tutup",
    closeChat: "Tutup chat",
    finguardChat: "Chat FinGuard",
    tips: "Tips",
    contact: "Kontak",
    skipToContent: "Lewati ke konten",
  attachImage: "Lampirkan gambar",
  remove: "Hapus",
    errorEmpty: "Silakan tempel atau ketik pesan untuk dianalisis.",
    errorRequest:
      "Kami tidak dapat menganalisis pesan saat ini. Coba lagi sebentar lagi.",
    riskLabels: { Low: "Rendah", Medium: "Sedang", High: "Tinggi" },
  },
  ms: {
    title: "FinGuard SEA",
    subtitle:
      "Tampal mesej mencurigakan dan dapatkan semakan risiko segera dengan tip bahasa yang mudah.",
    scamChecker: "Pemeriksa penipuan",
    suspiciousMessage: "Mesej mencurigakan",
    pastePlaceholder:
      "Tampal SMS, WhatsApp, e-mel, atau mesej media sosial di sini...",
    language: "Bahasa",
    check: "Semak Mesej",
    checking: "Menyemak…",
    risk: "Risiko",
    whyScam: "Mengapa ini mungkin penipuan",
    whatYouCanDo: "Apa yang anda boleh lakukan",
    translation: "Terjemahan",
    reportHelp: "Lapor atau dapatkan bantuan",
    disclaimer:
      "Penafian: Alat ini hanya memberi panduan dan mungkin tidak mengesan semua penipuan.",
    chatOpen: "Sembang",
    assistantTitle: "Pembantu FinGuard",
    chatWelcome:
      "Hai! Saya Pembantu FinGuard. Tampal sebarang mesej mencurigakan dan saya akan menyemak risikonya dan menerangkan sebabnya.",
    chatError:
      "Maaf, kami tidak dapat menganalisis sekarang. Cuba lagi. Jika mendesak, elakkan mengklik pautan dan hubungi talian bantuan tempatan.",
    thinking: "Berfikir…",
    typeYourMessage: "Taip mesej anda",
    pasteSuspicious: "Tampal mesej mencurigakan…",
    send: "Hantar",
    close: "Tutup",
    closeChat: "Tutup sembang",
    finguardChat: "Sembang FinGuard",
    tips: "Tip",
    contact: "Hubungi",
    skipToContent: "Langkau ke kandungan",
  attachImage: "Lampirkan imej",
  remove: "Buang",
    errorEmpty: "Sila tampal atau taip mesej untuk dianalisis.",
    errorRequest:
      "Kami tidak dapat menganalisis mesej sekarang. Cuba lagi sebentar lagi.",
    riskLabels: { Low: "Rendah", Medium: "Sederhana", High: "Tinggi" },
  },
  th: {
    title: "FinGuard SEA",
    subtitle:
      "วางข้อความที่น่าสงสัยและรับการตรวจสอบความเสี่ยงทันทีพร้อมคำแนะนำที่เข้าใจง่าย",
    scamChecker: "ตัวตรวจสอบมิจฉาชีพ",
    suspiciousMessage: "ข้อความที่น่าสงสัย",
    pastePlaceholder:
      "วาง SMS, WhatsApp, อีเมล หรือข้อความโซเชียลที่นี่...",
    language: "ภาษา",
    check: "ตรวจสอบข้อความ",
    checking: "กำลังตรวจสอบ…",
    risk: "ความเสี่ยง",
    whyScam: "เหตุใดอาจเป็นการหลอกลวง",
    whatYouCanDo: "สิ่งที่คุณทำได้",
    translation: "คำแปล",
    reportHelp: "รายงานหรือขอความช่วยเหลือ",
    disclaimer:
      "ข้อกำหนด: เครื่องมือนี้เป็นเพียงคำแนะนำและอาจไม่ตรวจจับการหลอกลวงทั้งหมด",
    chatOpen: "แชท",
    assistantTitle: "ผู้ช่วย FinGuard",
    chatWelcome:
      "สวัสดี! ฉันคือผู้ช่วย FinGuard วางข้อความที่น่าสงสัยใดๆ แล้วฉันจะตรวจสอบความเสี่ยงและอธิบายเหตุผล",
    chatError:
      "ขออภัย ขณะนี้ไม่สามารถวิเคราะห์ได้ โปรดลองอีกครั้ง หากเร่งด่วน โปรดหลีกเลี่ยงการคลิกลิงก์และติดต่อสายด่วนในพื้นที่",
    thinking: "กำลังคิด…",
    typeYourMessage: "พิมพ์ข้อความของคุณ",
    pasteSuspicious: "วางข้อความที่น่าสงสัย…",
    send: "ส่ง",
    close: "ปิด",
    closeChat: "ปิดแชท",
    finguardChat: "แชท FinGuard",
    tips: "เคล็ดลับ",
    contact: "ติดต่อ",
    skipToContent: "ข้ามไปยังเนื้อหา",
  attachImage: "แนบรูปภาพ",
  remove: "ลบ",
    errorEmpty: "โปรดวางหรือพิมพ์ข้อความเพื่อวิเคราะห์",
    errorRequest: "ไม่สามารถวิเคราะห์ข้อความได้ในขณะนี้ โปรดลองอีกครั้งในภายหลัง",
    riskLabels: { Low: "ต่ำ", Medium: "ปานกลาง", High: "สูง" },
  },
  vi: {
    title: "FinGuard SEA",
    subtitle:
      "Dán tin nhắn đáng ngờ và nhận kiểm tra rủi ro tức thì kèm mẹo dễ hiểu.",
    scamChecker: "Trình kiểm tra lừa đảo",
    suspiciousMessage: "Tin nhắn đáng ngờ",
    pastePlaceholder:
      "Dán SMS, WhatsApp, email hoặc tin nhắn mạng xã hội vào đây...",
    language: "Ngôn ngữ",
    check: "Kiểm tra tin nhắn",
    checking: "Đang kiểm tra…",
    risk: "Rủi ro",
    whyScam: "Vì sao có thể là lừa đảo",
    whatYouCanDo: "Bạn có thể làm gì",
    translation: "Bản dịch",
    reportHelp: "Báo cáo hoặc nhận hỗ trợ",
    disclaimer:
      "Lưu ý: Công cụ này chỉ cung cấp hướng dẫn và có thể không phát hiện tất cả các vụ lừa đảo.",
    chatOpen: "Trò chuyện",
    assistantTitle: "Trợ lý FinGuard",
    chatWelcome:
      "Xin chào! Tôi là Trợ lý FinGuard. Dán bất kỳ tin nhắn đáng ngờ nào, tôi sẽ kiểm tra rủi ro và giải thích lý do.",
    chatError:
      "Xin lỗi, hiện chưa thể phân tích. Hãy thử lại. Nếu khẩn cấp, tránh nhấp vào liên kết và liên hệ đường dây nóng địa phương.",
    thinking: "Đang suy nghĩ…",
    typeYourMessage: "Nhập tin nhắn của bạn",
    pasteSuspicious: "Dán tin nhắn đáng ngờ…",
    send: "Gửi",
    close: "Đóng",
    closeChat: "Đóng trò chuyện",
    finguardChat: "Trò chuyện FinGuard",
    tips: "Mẹo",
    contact: "Liên hệ",
    skipToContent: "Bỏ qua để đến nội dung",
  attachImage: "Đính kèm ảnh",
  remove: "Xóa",
    errorEmpty: "Vui lòng dán hoặc nhập tin nhắn để phân tích.",
    errorRequest: "Hiện không thể phân tích tin nhắn. Vui lòng thử lại sau.",
    riskLabels: { Low: "Thấp", Medium: "Trung bình", High: "Cao" },
  },
  tl: {
    title: "FinGuard SEA",
    subtitle:
      "I-paste ang kahina-hinalang mensahe at makakuha ng agarang pagsusuri ng panganib na may simpleng payo.",
    scamChecker: "Pang-suri ng panloloko",
    suspiciousMessage: "Kahina-hinalang mensahe",
    pastePlaceholder:
      "I-paste ang SMS, WhatsApp, email, o mensahe sa social dito...",
    language: "Wika",
    check: "Suriin ang Mensahe",
    checking: "Sinusuri…",
    risk: "Panganib",
    whyScam: "Bakit posibleng scam ito",
    whatYouCanDo: "Ano ang maaari mong gawin",
    translation: "Salin",
    reportHelp: "I-report o humingi ng tulong",
    disclaimer:
      "Paalala: Nagbibigay lamang ng gabay ang tool na ito at maaaring hindi matukoy ang lahat ng scam.",
    chatOpen: "Chat",
    assistantTitle: "FinGuard Assistant",
    chatWelcome:
      "Hi! Ako ang FinGuard Assistant. I-paste ang anumang kahina-hinalang mensahe at susuriin ko ang panganib at ipapaliwanag kung bakit.",
    chatError:
      "Paumanhin, hindi ma-analyze ngayon. Subukang muli. Kung agarang pangangailangan, iwasang mag-click ng mga link at tumawag sa lokal na hotline.",
    thinking: "Nag-iisip…",
    typeYourMessage: "I-type ang iyong mensahe",
    pasteSuspicious: "I-paste ang kahina-hinalang mensahe…",
    send: "Ipadala",
    close: "Isara",
    closeChat: "Isara ang chat",
    finguardChat: "FinGuard chat",
    tips: "Mga tip",
    contact: "Kontak",
    skipToContent: "Laktawan sa nilalaman",
  attachImage: "Mag-attach ng larawan",
  remove: "Alisin",
    errorEmpty: "Mangyaring i-paste o i-type ang mensaheng susuriin.",
    errorRequest:
      "Hindi namin ma-analyze ang mensahe ngayon. Subukang muli mamaya.",
    riskLabels: { Low: "Mababa", Medium: "Katamtaman", High: "Mataas" },
  },
  my: {
    title: "FinGuard SEA",
    subtitle:
      "သံသယဖြစ်စရာမက်ဆေ့ချ်ကို ကိုးကားကူးထည့်ပြီး လောလောဆယ်အန္တရာယ်အဆင့်ကို လက်ငင်း စစ်ဆေးပြီး ရိုးရှင်းသော အကြံပြုချက်များရယူပါ။",
    scamChecker: "လိမ်လည်မှု စစ်ဆေးကိရိယာ",
    suspiciousMessage: "သံသယဖြစ်စရာမက်ဆေ့ချ်",
    pastePlaceholder:
      "SMS၊ WhatsApp၊ email သို့မဟုတ် လူမှုမီဒီယာမက်ဆေ့ချ်ကို ဒီမှာ ကူးထည့်ပါ...",
    language: "ဘာသာ",
    check: "မက်ဆေ့ချ် စစ်ဆေးရန်",
    checking: "စစ်ဆေးနေသည်…",
    risk: "အန္တရာယ်",
    whyScam: "လိမ်လည်မှု ဖြစ်နိုင်ခြေအတွက် အကြောင်းပြချက်",
    whatYouCanDo: "သင်ဘာများလုပ်နိုင်သလဲ",
    translation: "ဘာသာပြန်",
    reportHelp: "တိုင်ကြားရန် သို့မဟုတ် အကူအညီရယူရန်",
    disclaimer:
      "သတိပေးချက် - ဤကိရိယာသည် လမ်းညွှန်ချက်များကိုသာ ပေးသည်။ အလားအလာ လိမ်လည်မှုအားလုံးကို မဖြေရှင်းတတ်နိုင်ပါ။",
    chatOpen: "ချက်",
    assistantTitle: "FinGuard အကူအညီပေးကူညီသူ",
    chatWelcome:
      "ဟလို! ကျွန်ုပ်သည် FinGuard အကူအညီပေးကူညီသူဖြစ်သည်။ သံသယရှိသော မက်ဆေ့ချ်ကို ကူးထည့်ပါ၊ အန္တရာယ်အဆင့်ကို စစ်ဆေးပြီး အကြောင်းပြချက်ကိုရှင်းပြမည်။",
    chatError:
      "တောင်းပန်ပါသည်၊ ယခင်အချိန်တွင် မခွင့်ပြုနိုင်ပါ။ နာရီအနည်းငယ်အကြာ ပြန်လည်ကြိုးစားပါ။ အရေးပေါ်ဖြစ်ပါက လင့်ခ်များကို မနှိပ်ရန်နှင့် ဒေသဆိုင်ရာ ဟော့လိုင်းကို ဆက်သွယ်ပါ။",
    thinking: "စဉ်းစားနေသည်…",
    typeYourMessage: "သင့်မက်ဆေ့ချ်ကို ရိုက်ထည့်ပါ",
    pasteSuspicious: "သံသယရှိသော မက်ဆေ့ချ်ကို ကူးထည့်ပါ…",
    send: "ပို့ရန်",
    close: "ပိတ်ရန်",
    closeChat: "စကားပြောပိတ်ရန်",
    finguardChat: "FinGuard စကားပြော",
    tips: "အကြံပေးချက်များ",
    contact: "ဆက်သွယ်ရန်",
    skipToContent: "အကြောင်းအရာသို့ ကျော်ရန်",
  attachImage: "ရုပ်ပုံ ပူးတွဲထည့်ရန်",
  remove: "ဖယ်ရှားရန်",
    errorEmpty:
      "ခွဲချင်သော မက်ဆေ့ချ်ကို ကူးထည့်သို့မဟုတ် ရိုက်ထည့်ပါ။",
    errorRequest:
      "လက်ရှိတွင် မက်ဆေ့ချ်ကို မခွဲခြမ်းနိုင်ပါ။ ခဏအကြာတွင် ထပ်မံကြိုးစားပါ။",
    riskLabels: { Low: "နိမ့်", Medium: "အလယ်အလတ်", High: "မြင့်" },
  },
  km: {
    title: "FinGuard SEA",
    subtitle:
      "បិទភ្ជាប់សារ​ដែលគួរឱ្យសង្ស័យ ហើយទទួលបានការត្រួតពិនិត្យហានិភ័យភ្លាមៗជាមួយដំបូន្មានភាសាងាយស្រួល។",
    scamChecker: "ឧបករណ៍ពិនិត្យការលួចលាក់",
    suspiciousMessage: "សារគួរឱ្យសង្ស័យ",
    pastePlaceholder:
      "បិទភ្ជាប់ SMS, WhatsApp, អ៊ីមែល ឬសារសង្គម នៅទីនេះ...",
    language: "ភាសា",
    check: "ពិនិត្យសារ",
    checking: "កំពុងពិនិត្យ…",
    risk: "ហានិភ័យ",
    whyScam: "ហេតុអ្វីវាអាចជាការលួចលាក់",
    whatYouCanDo: "អ្វីដែលអ្នកអាចធ្វើបាន",
    translation: "ការបកប្រែ",
    reportHelp: "រាយការណ៍ ឬស្នើសុំជំនួយ",
    disclaimer:
      "សេចក្តីប្រកាសបដិសេធ: ឧបករណ៍នេះផ្តល់តែការណែនាំប៉ុណ្ណោះ និងអាចនឹងមិនរកឃើញការលួចលាក់ទាំងអស់ទេ។",
    chatOpen: "ជជែក",
    assistantTitle: "ជំនួយការ FinGuard",
    chatWelcome:
      "សួស្តី! ខ្ញុំគឺជា ជំនួយការ FinGuard។ បិទភ្ជាប់សារគួរឱ្យសង្ស័យណាមួយ ខ្ញុំនឹងពិនិត្យហានិភ័យ និងពន្យល់។",
    chatError:
      "សូមទោស យើងមិនអាចវិភាគឥឡូវនេះទេ សូមសាកល្បងម្ដងទៀត។ បើបន្ទាន់ សូមកុំចុចលីង ហើយទាក់ទងខ្សែទូរស័ព្ទជួយក្នុងតំបន់។",
    thinking: "កំពុងគិត…",
    typeYourMessage: "វាយសាររបស់អ្នក",
    pasteSuspicious: "បិទភ្ជាប់សារគួរឱ្យសង្ស័យ…",
    send: "ផ្ញើ",
    close: "បិទ",
    closeChat: "បិទការជជែក",
    finguardChat: "ជជែក FinGuard",
    tips: "គន្លឹះ",
    contact: "ទំនាក់ទំនង",
    skipToContent: "រំលងទៅមាតិកា",
  attachImage: "ភ្ជាប់រូបភាព",
  remove: "យកចេញ",
    errorEmpty: "សូមបិទភ្ជាប់ ឬវាយសារ ដើម្បីវិភាគ។",
    errorRequest:
      "យើងមិនអាចវិភាគសារបច្ចុប្បន្ននេះបានទេ សូមសាកល្បងម្ដងទៀត។",
    riskLabels: { Low: "ទាប", Medium: "មធ្យម", High: "ខ្ពស់" },
  },
  lo: {
    title: "FinGuard SEA",
    subtitle:
      "ວາງຂໍ້ຄວາມທີ່ນ່າສົງໄສ ແລະຮັບການກວດສອບຄວາມສ່ຽງທັນທີ ພ້ອມຄໍາແນະນໍາພາສາເຂົ້າໃຈງ່າຍ.",
    scamChecker: "ເຄື່ອງມືກວດຫຼອກລວງ",
    suspiciousMessage: "ຂໍ້ຄວາມນ່າສົງໄສ",
    pastePlaceholder:
      "ວາງ SMS, WhatsApp, email ຫຼື ຂໍ້ຄວາມໂຊເຊຽວມີເດຍ ທີ່ນີ້...",
    language: "ພາສາ",
    check: "ກວດສອບຂໍ້ຄວາມ",
    checking: "ກຳລັງກວດສອບ…",
    risk: "ຄວາມສ່ຽງ",
    whyScam: "ເປັນເພາະຫຍັງອາດຈະເປັນການຫຼອກລວງ",
    whatYouCanDo: "ສິ່ງທີ່ທ່ານສາມາດເຮັດໄດ້",
    translation: "ການແປ",
    reportHelp: "ແຈ້ງ ຫຼື ຂໍຄວາມຊ່ວຍເຫຼືອ",
    disclaimer:
      "ໝາຍເຫດ: ເຄື່ອງມືນີ້ໃຫ້ແຕ່ຄໍາແນະນໍາ ແລະອາດຈະບໍ່ພົບການຫຼອກລວງທັງໝົດ.",
    chatOpen: "ສົນທະນາ",
    assistantTitle: "ຜູ້ຊ່ວຍ FinGuard",
    chatWelcome:
      "ສະບາຍດີ! ຂ້ອຍແມ່ນຜູ້ຊ່ວຍ FinGuard. ວາງຂໍ້ຄວາມນ່າສົງໄສໃດໆ ຂ້ອຍຈະກວດສອບຄວາມສ່ຽງ ແລະອະທິບາຍເຫດຜົນ.",
    chatError:
      "ຂໍອະໄພ ບໍ່ສາມາດວິເຄາະຕອນນີ້. ລອງໃໝ່. ຖ້າດ່ວນ ຫ້າມກົດລິ້ງ ແລະ ໂທຫາສາຍດ່ວນທ້ອງຖິ່ນ.",
    thinking: "ກໍາລັງຄິດ…",
    typeYourMessage: "ພິມຂໍ້ຄວາມຂອງທ່ານ",
    pasteSuspicious: "ວາງຂໍ້ຄວາມນ່າສົງໄສ…",
    send: "ສົ່ງ",
    close: "ປິດ",
    closeChat: "ປິດສົນທະນາ",
    finguardChat: "ສົນທະນາ FinGuard",
    tips: "ເຄັດລັບ",
    contact: "ຕິດຕໍ່",
    skipToContent: "ຂ້າມໄປຫາເນື້ອຫາ",
  attachImage: "ແນບຮູບພາບ",
  remove: "ລຶບ",
    errorEmpty: "ກະລຸນາວາງ ຫຼື ພິມຂໍ້ຄວາມເພື່ອວິເຄາະ.",
    errorRequest:
      "ບໍ່ສາມາດວິເຄາະຂໍ້ຄວາມຕອນນີ້. ລອງໃໝ່ພາຍຫຼັງ.",
    riskLabels: { Low: "ຕ່ໍາ", Medium: "ປານກາງ", High: "ສູງ" },
  },
};

function detectInitialLocale(): Locale {
  if (typeof navigator !== "undefined") {
    const langs = navigator.languages ?? [navigator.language];
    const codes = langs
      .map((l) => l.toLowerCase().split("-")[0] as Locale)
      .filter(Boolean) as Locale[];
    for (const c of codes) {
      if ((dict as any)[c]) return c;
    }
  }
  return "en";
}

type Ctx = {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string) => string;
  languages: { code: Locale; label: string }[];
  riskLabel: (score: "Low" | "Medium" | "High") => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Locale>(detectInitialLocale());

  // Keep <html lang> in sync on the client when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<Ctx>(() => {
    const t = (key: string) => (dict[lang] as any)[key] ?? (dict.en as any)[key] ?? key;
    const riskLabel = (score: "Low" | "Medium" | "High") =>
      (dict[lang].riskLabels?.[score] ?? dict.en.riskLabels?.[score] ?? score);
    return { lang, setLang, t, languages: LANGUAGES, riskLabel };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
