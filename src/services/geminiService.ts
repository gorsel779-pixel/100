import { ImageAnalysis, Category } from '../types';

// Emergent API anahtarı
const GEMINI_API_KEY = 'AIzaSyDRWUqBFnoROB0aeX6JKs_ZNk_Wb94BkjI';

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string = GEMINI_API_KEY) {
    this.apiKey = apiKey;
  }

  async analyzeImage(imageFile: File): Promise<ImageAnalysis> {
    try {
      // Görüntüyü base64'e çevir
      const base64Image = await this.fileToBase64(imageFile);
      
      // Gemini API'ye istek gönder
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Bu görüntüyü çok detaylı analiz et ve şu bilgileri JSON formatında ver:
                - objects: görüntüdeki nesnelerin listesi
                - colors: dominant renklerin listesi
                - text: görüntüdeki yazılar (varsa)
                - description: görüntünün çok detaylı açıklaması
                - emotions: görüntüdeki duygusal ifadeler
                - style: görüntünün stili (modern, klasik, renkli, sade vb.)
                - occasion: hangi özel gün/etkinlik için uygun olabilir
                - ageGroup: hangi yaş grubu için uygun
                - gender: erkek/kadın/unisex
                - suggestedCategory: şu kategorilerden birini öner: erkek-cocuk, kiz-cocuk, dugun-kina-nisan, anneler-gunu, kadinlar-gunu, sunnet, dogum-gunu, diger
                
                Türkçe analiz yap ve sadece JSON formatında yanıt ver, başka açıklama ekleme.`
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API hatası');
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // JSON'u parse et
      const analysis = JSON.parse(analysisText.replace(/```json|```/g, ''));
      
      return {
        objects: analysis.objects || [],
        colors: analysis.colors || [],
        text: analysis.text || '',
        description: analysis.description || '',
        emotions: analysis.emotions || [],
        style: analysis.style || '',
        occasion: analysis.occasion || '',
        ageGroup: analysis.ageGroup || '',
        gender: analysis.gender || '',
        confidence: 0.95,
        suggestedCategory: analysis.suggestedCategory || 'diger'
      };
    } catch (error) {
      console.error('Görüntü analizi hatası:', error);
      
      // Hata durumunda varsayılan analiz döndür
      return {
        objects: ['bilinmeyen'],
        colors: ['çeşitli'],
        text: '',
        description: 'Analiz edilemedi',
        emotions: [],
        style: '',
        occasion: '',
        ageGroup: '',
        gender: '',
        confidence: 0,
        suggestedCategory: 'diger'
      };
    }
  }

  async analyzeImageRegion(imageFile: File, region: { x: number, y: number, width: number, height: number }): Promise<ImageAnalysis> {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Bu görüntünün belirtilen bölgesini (x:${region.x}, y:${region.y}, genişlik:${region.width}, yükseklik:${region.height}) analiz et ve JSON formatında detaylı bilgi ver:
                - objects: bu bölgedeki nesneler
                - colors: bu bölgedeki renkler
                - text: bu bölgedeki yazılar
                - description: bu bölgenin detaylı açıklaması
                - suggestedCategory: uygun kategori
                
                Sadece JSON formatında yanıt ver.`
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API hatası');
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      const analysis = JSON.parse(analysisText.replace(/```json|```/g, ''));
      
      return {
        objects: analysis.objects || [],
        colors: analysis.colors || [],
        text: analysis.text || '',
        description: analysis.description || '',
        emotions: [],
        style: '',
        occasion: '',
        ageGroup: '',
        gender: '',
        confidence: 0.90,
        suggestedCategory: analysis.suggestedCategory || 'diger'
      };
    } catch (error) {
      console.error('Bölge analizi hatası:', error);
      return {
        objects: ['bilinmeyen'],
        colors: ['çeşitli'],
        text: '',
        description: 'Bölge analizi edilemedi',
        emotions: [],
        style: '',
        occasion: '',
        ageGroup: '',
        gender: '',
        confidence: 0,
        suggestedCategory: 'diger'
      };
    }
  }
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
