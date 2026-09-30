// PoC에서 구현된 화면 목록. 첫 화면(/)에서 서비스별 표로 보여 준다. 화면을 추가하면 여기에도 한 줄 추가한다.

export type PocPage = {
  title: string;
  href: string;
  user: string;
  device: "데스크톱" | "모바일";
};

export type PocService = { name: string; description: string; pages: PocPage[] };

export const POC_SERVICES: PocService[] = [
  {
    name: "시니어노트",
    description: "요양기관 기록 · 보호자 알림장 (사용자 구분은 ?role=, 없으면 요양보호사)",
    pages: [
      { title: "기관용 랜딩 (네이트 시니어)", href: "/seniornote", user: "기관 원장·관리자", device: "데스크톱" },
      { title: "대시보드", href: "/dashboard?role=caregiver", user: "김영숙 요양보호사", device: "모바일" },
      { title: "대시보드", href: "/dashboard?role=social_worker", user: "박지영 사회복지사", device: "데스크톱" },
      { title: "대시보드", href: "/dashboard?role=admin", user: "한경희 원장", device: "데스크톱" },
      { title: "기록 입력", href: "/records/new", user: "김영숙 요양보호사", device: "모바일" },
      { title: "문서 보내기 (보내기 전)", href: "/records/rec-2/review", user: "김영숙 요양보호사", device: "데스크톱" },
      { title: "문서 보내기 (보호자 확인)", href: "/records/rec-1/review", user: "김영숙 요양보호사", device: "데스크톱" },
      { title: "보호자 알림장", href: "/guardian", user: "김지현 보호자", device: "모바일" },
    ],
  },
  {
    name: "해봄",
    description: "경험 마켓플레이스 (시니어가 판매자, 누구나 구매자)",
    pages: [
      { title: "홈", href: "/haebom", user: "구매자", device: "모바일" },
      { title: "경험 둘러보기", href: "/haebom/experiences", user: "구매자", device: "모바일" },
      { title: "경험 상세", href: "/haebom/experiences/ex-1", user: "구매자", device: "모바일" },
      { title: "이용 후기 (전체)", href: "/haebom/experiences/ex-1/reviews", user: "구매자", device: "모바일" },
      { title: "경험 신청", href: "/haebom/experiences/ex-1/request", user: "구매자", device: "모바일" },
      { title: "판매자 신청함", href: "/haebom/seller", user: "김정비 판매자", device: "모바일" },
    ],
  },
];
