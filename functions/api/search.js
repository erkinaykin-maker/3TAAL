export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = url.searchParams.get("q") || "";
  const mod = url.searchParams.get("mod") || "vl";

  if (!q.trim()) {
    return new Response(JSON.stringify({ error: "Boş arama yapılamaz" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Örnek olarak Google Translate ve temel çeviri akışı entegrasyonu
    const sl = mod === "en" ? "en" : "nl";
    const tl = mod === "en" ? "nl" : "tr";
    
    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(translateUrl);
    const data = await response.json();
    
    let translated = "";
    if (data && data[0]) {
      translated = data[0].map(item => item[0]).join("");
    }

    return new Response(JSON.stringify({
      query: q,
      translation: translated || "Anlam bulunamadı.",
      artikel: mod === "vl" ? "De/Het (Function hazırlandı)" : "-"
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}