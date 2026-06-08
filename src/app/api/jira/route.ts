import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.jiraHost || !data.email || !data.token || !data.issueKey) {
      return NextResponse.json({ error: "Dados incompletos no Proxy API." }, { status: 400 });
    }

    let jiraHost = data.jiraHost.trim().replace(/\/$/, '');
    if (!jiraHost.startsWith('http')) {
      jiraHost = 'https://' + jiraHost;
    }
    
    const url = `${jiraHost}/rest/api/3/issue/${data.issueKey}/worklog`;
    const auth = Buffer.from(`${data.email}:${data.token}`).toString('base64');

    const payload = {
      timeSpentSeconds: data.timeSpentSeconds,
      comment: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: data.comment || "Registro via SprintoLog" }
            ]
          }
        ]
      },
      started: data.started || undefined
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: `Erro Interno: ${error.message}` }, { status: 500 });
  }
}
