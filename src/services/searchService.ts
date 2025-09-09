export class SearchService {
  // Türkçe karakter düzeltmeleri
  private corrections: Record<string, string> = {
    // Yaygın yazım hataları
    'hos': 'hoş',
    'hosgeldin': 'hoşgeldin',
    'kina': 'kına',
    'dugun': 'düğün',
    'nisan': 'nişan',
    'sunnet': 'sünnet',
    'dogum': 'doğum',
    'gunu': 'günü',
    'cocuk': 'çocuk',
    'kiz': 'kız',
    'kadinlar': 'kadınlar',
    'anneler': 'anneler',
    'erkek': 'erkek',
    'diger': 'diğer',
    'mavi': 'mavi',
    'yesil': 'yeşil',
    'sari': 'sarı',
    'beyaz': 'beyaz',
    'siyah': 'siyah',
    'kirmizi': 'kırmızı',
    'pembe': 'pembe',
    'mor': 'mor',
    'turuncu': 'turuncu',
    'gri': 'gri',
    'kahverengi': 'kahverengi'
  };

  // Benzer kelimeler
  private synonyms: Record<string, string[]> = {
    'düğün': ['evlilik', 'nikah', 'gelin', 'damat'],
    'kına': ['kına gecesi', 'kına töreni'],
    'doğum günü': ['yaş günü', 'parti', 'kutlama'],
    'sünnet': ['sünnet töreni', 'erkek çocuk'],
    'anneler günü': ['anne', 'annelik'],
    'kadınlar günü': ['kadın', 'bayan'],
    'erkek çocuk': ['oğlan', 'erkek'],
    'kız çocuk': ['kız', 'bayan çocuk']
  };

  correctText(text: string): string {
    let corrected = text.toLowerCase().trim();
    
    // Yazım hatalarını düzelt
    Object.entries(this.corrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      corrected = corrected.replace(regex, correct);
    });

    return corrected;
  }

  expandSearchTerms(searchTerm: string): string[] {
    const corrected = this.correctText(searchTerm);
    const terms = [corrected];

    // Eş anlamlı kelimeleri ekle
    Object.entries(this.synonyms).forEach(([key, synonyms]) => {
      if (corrected.includes(key) || synonyms.some(syn => corrected.includes(syn))) {
        terms.push(key, ...synonyms);
      }
    });

    return [...new Set(terms)];
  }

  searchFiles(files: any[], searchTerm: string): any[] {
    if (!searchTerm.trim()) return files;

    const expandedTerms = this.expandSearchTerms(searchTerm);
    
    return files.filter(file => {
      const searchableText = [
        file.name,
        file.analysis?.description || '',
        ...(file.analysis?.objects || []),
        ...(file.analysis?.colors || []),
        file.analysis?.text || '',
        ...(file.analysis?.emotions || []),
        file.analysis?.style || '',
        file.analysis?.occasion || '',
        file.analysis?.ageGroup || '',
        file.analysis?.gender || ''
      ].join(' ').toLowerCase();

      return expandedTerms.some(term => 
        searchableText.includes(term.toLowerCase())
      );
    });
  }
}