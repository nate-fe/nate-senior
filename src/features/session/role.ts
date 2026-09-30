"use client";

import { useSearchParams } from "next/navigation";

// 로그인 전 PoC 단계에서는 사용자 구분을 주소의 ?role= 로 한다.
//   /dashboard?role=caregiver      요양보호사 (기본값)
//   /dashboard?role=social_worker  사회복지사
//   /dashboard?role=admin          원장
// useSearchParams를 쓰므로 이 훅을 부르는 컴포넌트는 Suspense 안에 있어야 한다(staff 레이아웃에서 감싼다).

export const ROLES = {
  caregiver: { name: "김영숙", title: "요양보호사" },
  social_worker: { name: "박지영", title: "사회복지사" },
  admin: { name: "한경희", title: "원장" },
} as const;

export type Role = keyof typeof ROLES;

const DEFAULT_ROLE: Role = "caregiver";

export function parseRole(value: string | null): Role {
  return value && value in ROLES ? (value as Role) : DEFAULT_ROLE;
}

/** 기록 작성자·발송자로 남는 이름. 예) "김영숙 요양보호사" */
export function staffName(role: Role) {
  return `${ROLES[role].name} ${ROLES[role].title}`;
}

/** 앱 안에서 이동할 때 현재 사용자 구분을 유지한다. 기본값(요양보호사)은 주소에 붙이지 않는다. */
export function withRole(href: string, role: Role) {
  if (role === DEFAULT_ROLE) return href;
  return `${href}${href.includes("?") ? "&" : "?"}role=${role}`;
}

export function useRole() {
  const role = parseRole(useSearchParams().get("role"));
  return {
    role,
    staffName: staffName(role),
    isAdmin: role === "admin",
    href: (path: string) => withRole(path, role),
  };
}
