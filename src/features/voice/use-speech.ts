"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// 브라우저 내장 음성 인식(Web Speech API). 크롬·사파리 등에서만 동작하며,
// 지원하지 않으면 supported=false로 알려 텍스트 입력만 쓰게 한다. 추후 서버 STT로 교체 가능.

type RecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noopSubscribe = () => () => {};

export function useSpeech(onFinal: (text: string) => void) {
  // 서버 렌더에서는 false, 브라우저에서는 실제 지원 여부
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => !!getCtor(),
    () => false,
  );
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => () => recRef.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "ko-KR";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let partial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) onFinalRef.current(r[0].transcript.trim());
        else partial += r[0].transcript;
      }
      setInterim(partial);
    };
    rec.onerror = (e) => setError(e.error === "not-allowed" ? "마이크 권한을 허용해 주세요" : "음성 인식에 실패했어요");
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    setError(null);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }, []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  return { supported, listening, interim, error, start, stop };
}
