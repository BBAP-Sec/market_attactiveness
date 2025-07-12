// Market attractiveness dataset
export const marketData = [
    {
      country: 'USA',
      gdp_growth: 2.5,
      per_capita_income: 70000,
      inflation_rate: 3.0,
      internet_penetration: 90,
      ecommerce_adoption: 85,
      '5g_coverage': 60,
      individualism: 91,
      uncertainty_avoidance: 46,
      export_volume: 2500,
      tariff_rate: 2.0,
      sme_industry: 'IT',
      market_attractiveness_score: 85
    },
    {
      country: 'Germany',
      gdp_growth: 1.8,
      per_capita_income: 50000,
      inflation_rate: 2.0,
      internet_penetration: 88,
      ecommerce_adoption: 80,
      '5g_coverage': 50,
      individualism: 67,
      uncertainty_avoidance: 65,
      export_volume: 1500,
      tariff_rate: 1.5,
      sme_industry: 'Manufacturing',
      market_attractiveness_score: 78
    },
    {
      country: 'China',
      gdp_growth: 6.0,
      per_capita_income: 12000,
      inflation_rate: 2.5,
      internet_penetration: 70,
      ecommerce_adoption: 60,
      '5g_coverage': 40,
      individualism: 20,
      uncertainty_avoidance: 30,
      export_volume: 3000,
      tariff_rate: 3.5,
      sme_industry: 'IT',
      market_attractiveness_score: 72
    },
    {
      country: 'Brazil',
      gdp_growth: 1.2,
      per_capita_income: 9000,
      inflation_rate: 8.0,
      internet_penetration: 65,
      ecommerce_adoption: 55,
      '5g_coverage': 20,
      individualism: 38,
      uncertainty_avoidance: 76,
      export_volume: 300,
      tariff_rate: 8.0,
      sme_industry: 'Agriculture',
      market_attractiveness_score: 65
    },
    {
      country: 'India',
      gdp_growth: 5.5,
      per_capita_income: 2500,
      inflation_rate: 4.5,
      internet_penetration: 50,
      ecommerce_adoption: 45,
      '5g_coverage': 15,
      individualism: 48,
      uncertainty_avoidance: 40,
      export_volume: 600,
      tariff_rate: 6.0,
      sme_industry: 'IT',
      market_attractiveness_score: 60
    },
    {
      country: 'Japan',
      gdp_growth: 1.0,
      per_capita_income: 40000,
      inflation_rate: 0.5,
      internet_penetration: 92,
      ecommerce_adoption: 78,
      '5g_coverage': 70,
      individualism: 46,
      uncertainty_avoidance: 92,
      export_volume: 800,
      tariff_rate: 2.5,
      sme_industry: 'Manufacturing',
      market_attractiveness_score: 80
    },
    {
      country: 'UK',
      gdp_growth: 2.0,
      per_capita_income: 45000,
      inflation_rate: 2.8,
      internet_penetration: 95,
      ecommerce_adoption: 82,
      '5g_coverage': 55,
      individualism: 89,
      uncertainty_avoidance: 35,
      export_volume: 700,
      tariff_rate: 1.8,
      sme_industry: 'IT',
      market_attractiveness_score: 82
    },
    {
      country: 'France',
      gdp_growth: 1.5,
      per_capita_income: 42000,
      inflation_rate: 2.2,
      internet_penetration: 90,
      ecommerce_adoption: 79,
      '5g_coverage': 45,
      individualism: 71,
      uncertainty_avoidance: 86,
      export_volume: 600,
      tariff_rate: 1.7,
      sme_industry: 'Manufacturing',
      market_attractiveness_score: 79
    },
    {
      country: 'Canada',
      gdp_growth: 2.8,
      per_capita_income: 48000,
      inflation_rate: 3.1,
      internet_penetration: 93,
      ecommerce_adoption: 87,
      '5g_coverage': 60,
      individualism: 80,
      uncertainty_avoidance: 48,
      export_volume: 500,
      tariff_rate: 2.2,
      sme_industry: 'IT',
      market_attractiveness_score: 83
    },
    {
      country: 'Australia',
      gdp_growth: 2.3,
      per_capita_income: 55000,
      inflation_rate: 2.7,
      internet_penetration: 89,
      ecommerce_adoption: 84,
      '5g_coverage': 65,
      individualism: 90,
      uncertainty_avoidance: 51,
      export_volume: 400,
      tariff_rate: 1.9,
      sme_industry: 'Agriculture',
      market_attractiveness_score: 81
    }
  ];
  
  // Calculate feature importance based on correlation with market score
  export const calculateFeatureImportance = (data: any[]) => {
    const features = [
      'gdp_growth',
      'per_capita_income',
      'inflation_rate',
      'internet_penetration',
      'ecommerce_adoption',
      '5g_coverage',
      'individualism',
      'uncertainty_avoidance',
      'export_volume',
      'tariff_rate'
    ];
  
    const importance = features.map(feature => {
      const values = data.map(d => d[feature]);
      const scores = data.map(d => d.market_attractiveness_score);
      
      // Calculate correlation
      const mean1 = values.reduce((a, b) => a + b, 0) / values.length;
      const mean2 = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      const numerator = values.reduce((sum, val, i) => 
        sum + (val - mean1) * (scores[i] - mean2), 0);
      
      const denominator = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
        scores.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
      );
      
      const correlation = denominator ? Math.abs(numerator / denominator) : 0;
      
      return {
        feature,
        importance: correlation
      };
    });
  
    return importance.sort((a, b) => b.importance - a.importance);
  };
  
  // Generate market rankings with confidence scores
  export const generateRankings = (data: any[]) => {
    return data
      .map(country => ({
        country: country.country,
        score: country.market_attractiveness_score,
        confidence: 0.7 + Math.random() * 0.3 // Simulated confidence
      }))
      .sort((a, b) => b.score - a.score);
  };
  
  // Analyze market data
  export const analyzeMarketData = (data: any[]) => {
    const rankings = generateRankings(data);
    const featureImportance = calculateFeatureImportance(data);
    
    // Simulated model metrics
    const modelMetrics = {
      trainR2: 0.912,
      testR2: 0.887,
      testMSE: 12.34
    };
  
    return {
      rankings,
      featureImportance,
      modelMetrics
    };
  };