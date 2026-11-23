/** Read-aloud with the browser Web Speech API (en-US, a little slow for young readers). */
export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\p{Extended_Pictographic}/gu, '').replace(/\bati\b/gi, 'Ah-tee'));
  u.lang = 'en-US';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}
