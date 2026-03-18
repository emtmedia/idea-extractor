'use client';

import { useRef, useState } from 'react';

type State = 'idle' | 'recording' | 'transcribing' | 'error';

export default function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeRef = useRef<string>('audio/webm');

  async function handleClick() {
    if (state === 'idle') await startRecording();
    else if (state === 'recording') stopRecording();
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mimeRef.current = mime;
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await transcribe();
      };

      recorderRef.current = recorder;
      recorder.start(250);
      setState('recording');
    } catch {
      setErrorMsg('Permissão de microfone negada.');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  function stopRecording() {
    setState('transcribing');
    recorderRef.current?.stop();
  }

  async function transcribe() {
    try {
      const blob = new Blob(chunksRef.current, { type: mimeRef.current });
      const ext = mimeRef.current.includes('mp4') ? 'recording.mp4' : 'recording.webm';
      const form = new FormData();
      form.append('audio', blob, ext);

      const res = await fetch('/api/transcribe', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || 'Erro na transcrição');

      onTranscript(data.text);
      setState('idle');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro na transcrição');
      setState('error');
      setTimeout(() => setState('idle'), 5000);
    }
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Clique para falar a resposta"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-colors"
      >
        🎙️ Falar resposta
      </button>
    );
  }

  if (state === 'recording') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Clique para parar a gravação"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-300 animate-pulse"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
        Gravando… clique para parar
      </button>
    );
  }

  if (state === 'transcribing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Transcrevendo…
      </span>
    );
  }

  // error
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
      ⚠️ {errorMsg}
    </span>
  );
}
