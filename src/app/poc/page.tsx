import type { Metadata } from "next";
import Link from "next/link";
import { POC_SERVICES } from "@/features/poc/pages";

export const metadata: Metadata = { title: "PoC 페이지 목록" };

// 확인용 페이지라 앱 화면보다 한 단계 작은 글씨로, 칸을 넘치지 않게 둔다
const th = "border-b-2 border-border px-3 py-2.5 text-left text-sm font-bold text-muted-foreground whitespace-nowrap";
const td = "border-b border-border px-3 py-3 align-middle text-sm break-words";

export default function PocPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-2xl font-extrabold tracking-[-0.04em] md:text-3xl">페이지 목록</h1>

      {POC_SERVICES.map((service) => (
        <section key={service.name} className="mt-8">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">{service.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
          <div className="mt-3 rounded-2xl bg-surface p-2 md:p-3">
            {/* 두 서비스 표의 열이 같은 위치에 오도록 열 너비를 고정한다 */}
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className={`${th} w-[50%] md:w-[34%]`}>페이지</th>
                  <th className={`${th} w-[50%] md:w-[24%]`}>사용자</th>
                  <th className={`${th} hidden w-[12%] lg:table-cell`}>기기</th>
                  <th className={`${th} hidden md:table-cell`}>주소</th>
                </tr>
              </thead>
              <tbody>
                {service.pages.map((page) => (
                  <tr key={page.href} className="hover:bg-muted/60 [&:last-child>td]:border-b-0">
                    <td className={td}>
                      <Link
                        href={page.href}
                        className="text-base font-bold text-primary-strong underline-offset-4 hover:underline"
                      >
                        {/* "(보내기 전)" 같은 괄호 부분은 한 줄로 묶는다 */}
                        {page.title.split(" (").map((part, i) =>
                          i === 0 ? (
                            part
                          ) : (
                            <span key={part} className="whitespace-nowrap">
                              {" "}({part}
                            </span>
                          ),
                        )}
                      </Link>
                    </td>
                    <td className={td}>{page.user}</td>
                    <td className={`${td} hidden whitespace-nowrap text-muted-foreground lg:table-cell`}>
                      {page.device}
                    </td>
                    <td className={`${td} hidden md:table-cell`}>
                      {/* 주소는 "/"나 "?" 앞에서만 줄바꿈되도록 한다 */}
                      <code className="text-xs text-muted-foreground">
                        {page.href.split(/(?=[/?])/).map((part, i) => (
                          <span key={`${i}-${part}`}>
                            {i > 0 && <wbr />}
                            {part}
                          </span>
                        ))}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
