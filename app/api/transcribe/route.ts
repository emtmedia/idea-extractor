import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GLADIA_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Serviço de transcrição não configurado.' }, { status: 503 });
  }

  const formData = await req.formData();
  const audio = formData.get('audio') as File;
  if (!audio) {
    return Response.json({ error: 'Nenhum áudio recebido.' }, { status: 400 });
  }

  // Step 1: Upload audio to Gladia
  const uploadForm = new FormData();
  uploadForm.append('audio', audio);

  const uploadRes = await fetch('https://api.gladia.io/v2/upload', {
    method: 'POST',
    headers: { 'x-gladia-key': apiKey },
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return Response.json({ error: `Erro no upload: ${err}` }, { status: 500 });
  }

  const { audio_url } = await uploadRes.json();

  // Step 2: Request transcription (Portuguese)
  const txRes = await fetch('https://api.gladia.io/v2/transcription', {
    method: 'POST',
    headers: {
      'x-gladia-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio_url, language: 'pt' }),
  });

  if (!txRes.ok) {
    return Response.json({ error: 'Erro ao solicitar transcrição.' }, { status: 500 });
  }

  const { id } = await txRes.json();

  // Step 3: Poll for result (max ~50s)
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const pollRes = await fetch(`https://api.gladia.io/v2/transcription/${id}`, {
      headers: { 'x-gladia-key': apiKey },
    });
    const data = await pollRes.json();

    if (data.status === 'done') {
      const text = data.result?.transcription?.full_transcript || '';
      return Response.json({ text });
    }
    if (data.status === 'error') {
      return Response.json({ error: 'Falha na transcrição do áudio.' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Tempo esgotado. Tente com uma gravação mais curta.' }, { status: 504 });
}
